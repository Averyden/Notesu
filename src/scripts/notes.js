export function getNotes() {
    console.log("Getting user notes..")
    return JSON.parse(localStorage.getItem("stickynotes-saveData") || "[]");
}

export function saveNotes(notes) {
    localStorage.setItem("stickynotes-saveData", JSON.stringify(notes));
}

export function configureNoteDeadline(id) {
    const currentNotes = getNotes() 
    const selectedNote = currentNotes.filter(currentNotes => currentNotes.id == id)[0]
  
    
    const deadlineElement = document.getElementById(selectedNote.id).querySelector(".note-deadline");
    const deadlineInput = document.getElementById("popupTextArea")
    const deadlineValue = deadlineInput.value
    console.log(`Deadline of note ${selectedNote.id} has been set to ${deadlineValue}`)
  
    selectedNote.deadline = deadlineValue;
    deadlineElement.innerText = deadlineValue;
  
    // selectedNote.content = newContent
    saveNotes(currentNotes)
}

export function createNoteElement(id, content, deadline) {
    const div = document.createElement("div");
    const element = document.createElement("textarea");
    const deadlineElement = document.createElement("span");

    div.appendChild(element)
    div.appendChild(deadlineElement)
    deadlineElement.innerText = deadline || "No deadline has been set." 

    div.id = id;

    div.classList.add("note")
    element.classList.add("note-text")
    deadlineElement.classList.add("note-deadline")
    element.value = content;
    element.placeholder = "Empty note"

    let blurTimeout;

    element.addEventListener("focus", () => {
      currentSelectedNote = id
      selectedNoteForConfig = id
      console.log(`currently selected note: ${currentSelectedNote}, meanwhile selected note for config = ${selectedNoteForConfig}`)
      div.classList.add("note-focused")
      updateSelectedNoteText()
    });

    element.addEventListener("blur", () => {
      blurTimeout = setTimeout(() => {
        currentSelectedNote = null
        div.classList.remove("note-focused")
        updateSelectedNoteText()
      }, 200);
    });

    element.addEventListener("change", () => {
        updateNote(id, element.value)
    });

    div.addEventListener("mousedown", () => {
      clearTimeout(blurTimeout);
    })

    //check if deadline has been exceeded, and if it is, then add the "exceeded" class which makes the text red.
    if (deadline) {
      const currentDate = new Date()
      const deadlineDate = new Date(deadline);

      if (deadlineDate < currentDate) {
        deadlineElement.classList.add("exceeded")
        element.classList.add("exceeded")
        // eughhh this is gonna be so ugly bloated :(
        div.classList.add("exceeded") // We also add it to the div itself, so that we can insta delete the note, as its exceed its deadline.
      }
    }

    return div
}


export function addNote() {
    const currentNotes = getNotes()
    const noteObject = {
        id: Math.floor(Math.random() * 10000),
        content: ""
    };

    const noteElement = createNoteElement(noteObject.id, noteObject.content)
    notesContainer.insertBefore(noteElement, addButton)

    currentNotes.push(noteObject)
    saveNotes(currentNotes)
}

export function updateNote(id, newContent) {
    console.log("Updating note...")
    const currentNotes = getNotes()
    const selectedNote = currentNotes.filter(currentNotes => currentNotes.id == id)[0]

    selectedNote.content = newContent
    saveNotes(currentNotes)

    //dunno why the fuck js wants you to use backticks if you wanna format shit but.. if it works.. it works. 🤷‍♀️
    console.log(`Note ${selectedNote.id} has been updated`)
}

/**
*! REMINDER
*! This is the function that should still hve the rest of the desired implementation of the deletion animation
*? you know... the one that swwops the note up too.
*/
export function deleteNote({ id, noteElement }) {
    const currentNotes = getNotes().filter((note) => note.id !== id);
        saveNotes(currentNotes);

        if (noteElement) {
            noteElement.style.opacity = '0';
            noteElement.addEventListener('transitionend', handleTransitionEnd);

            function handleTransitionEnd() {
              // this functions sole purpose is to prevent the note fading away from instantly deleting itself, which in that case would make the animation useless and wasted effort.
              noteElement.removeEventListener('transitionend', handleTransitionEnd);
              notesContainer.removeChild(noteElement);
            }
            
        }
}
  
export function updateSelectedNoteText() {
    const selectedNote = getNotes().find((note) => note.id === currentSelectedNote)

    if (selectedNote) {
        selectedNoteText.textContent = `Current selected note(${selectedNote.id}): ${selectedNote.content}`
    } else {
        selectedNoteText.textContent = "You have not selected a note to configure."
    }
}
