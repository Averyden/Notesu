function getNotes() {
    console.log("Getting user notes..")
    return JSON.parse(localStorage.getItem("stickynotes-saveData") || "[]");
}

function saveNotes(notes) {
    localStorage.setItem("stickynotes-saveData", JSON.stringify(notes));
}

function configureNoteDeadline(id) {
    const currentNotes = getNotes() 
    const selectedNote = currentNotes.filter(currentNotes => currentNotes.id == id)[0]
  
    
    const deadlineElement = document.getElementById(selectedNote.id).querySelector(".note-deadline");
    const deadlineInput = document.getElementById("popupTextArea")
    const deadlineValue = deadlineInput.value
    console.log(`Deadline of note ${selectedNote.id} has been set to ${deadlineValue}`)
  
    selectedNote.deadline = deadlineValue;
    deadlineElement.innerText = deadlineValue;
  
    // selectedNote.content = newContent
}

/*
TODO: make it so that its actually saved that the note is completed
TODO: also move it away from the whole container, and prompt the user that it has been moved 
! A CUSTOM BOTTOM PROMPT IS NEEDED TO BE MADE FOR THAT FIRST. THAT SHOULD BE A PRIORITY (I think. 💀)
*/


/*
TODO: Apply a check, so that the text color of the note is also changed if the note color gets a bittt too close to the text color
TODO: We don't want the text to be unreadable because of no color
TODO: Maybe make it apply an outline?
*/
function colorTheNoteBecauseThisFunctionNameMightBeTooToughForLittleBabyJSToHandle(id) {
  console.log(`Receive request to change the color of note: ${id}`)
  const currentNotes = getNotes()
  const selectedNote = currentNotes.find(currentNotes => currentNotes.id === id)
  const selectedNoteElement = document.getElementById(selectedNote.id)
  const colorValue = document.getElementById("popupColorSlct")

  selectedNote.color = colorValue.value
  
  
  selectedNoteElement.style["background-color"] = colorValue.value
  saveNotes(currentNotes)
}


//? Unsure if function is needed, but its here just in case.
function markNoteCompleted(id) {
  console.log(`Received note id: ${id}`);
  const currentNotes = getNotes();
  const selectedNote = currentNotes.find(note => note.id === id);
  const selectedNoteElement = document.getElementById(selectedNote.id);
  const completeDateElement = selectedNoteElement.querySelector(".note-completed-date");
  const deadlineElement = selectedNoteElement.querySelector(".note-deadline");
  const selectedNoteText = selectedNoteElement.querySelector(".note-text");

  selectedNote.completed = true;  // Mark note as completed
  selectedNoteElement.classList.add("completed");
  selectedNoteText.classList.add("completed");

  //* Fetching current date, so that the note has a "completion date"
  const currentDate = new Date()

  //* Since the Date() function fetches time as well, we collect only the year, month, and day.

  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth()+1).padStart(2,'0') //* We add one, for months are 0 indexed.
  const day = String(currentDate.getDate()).padStart(2, '0')

  const finalDate = `${day}/${month}/${year}`

  console.log(`Set completed date to: ${finalDate}..`);
  completeDateElement.innerText = `Completed: ${finalDate}`;
  completeDateElement.style.bottom = "0px";
  deadlineElement.style.bottom = "20px";

  if (!selectedNote.deadline) {
      deadlineElement.innerText = "No deadline was set.";
  } else {
      deadlineElement.innerText = `Deadline: ${selectedNote.deadline}`;
  }

  saveNotes(currentNotes)
  /**
  * TODO: make the note be locked
  * TODO: so that the user
  * TODO: cant edit the note once its completed.
  */
}

function createNoteElement(id, content, deadline, color, completed=false) {
    const div = document.createElement("div");
    const element = document.createElement("textarea");
    const deadlineElement = document.createElement("span");
    const completeDateElement = document.createElement("span") //! this will only be displayed once a note is completed.


    div.appendChild(element)
    div.style.backgroundColor = color
    div.appendChild(deadlineElement)
    div.appendChild(completeDateElement)
    deadlineElement.innerText = deadline || "No deadline has been set." 

    div.id = id;

    div.classList.add("note")
    // div.classList.add("color")
    element.classList.add("note-text")
    deadlineElement.classList.add("note-deadline")
    completeDateElement.classList.add("note-completed-date")
    element.value = content;
    element.placeholder = "Empty note"

    let blurTimeout;

    if (completed === true) { // Show it as completed if its found as true 
      //! Should later be changed to just moving it away to its seperate tab.
      div.classList.add("completed")
      element.classList.add("completed")
    }

    div.style["background-color"] = color //? Should maybe change to the saved color?

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


function addNote() {

  const currentNotes = getNotes()
  const noteObject = {
      id: Math.floor(Math.random() * 10000),
      content: "",
      completed: false, //* Set default values, to be configured later.
      color: "#fff" 
  };

  const noteElement = createNoteElement(noteObject.id, noteObject.content, noteObject.completed, noteObject.color)
  console.log(`COLAAAAA: ${noteObject.color}`)
  notesContainer.insertBefore(noteElement, addButton)

  currentNotes.push(noteObject)
  saveNotes(currentNotes)
}

function updateNote(id, newContent) {
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
function deleteNote({ id, noteElement }) {
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
  
function updateSelectedNoteText() {
    const selectedNote = getNotes().find((note) => note.id === currentSelectedNote)

    if (selectedNote) {
        selectedNoteText.textContent = `Current selected note(${selectedNote.id}): ${selectedNote.content}`
    } else {
        selectedNoteText.textContent = "You have not selected a note to configure."
    }
}
