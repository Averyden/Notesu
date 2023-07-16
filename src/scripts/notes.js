//Handling all note functions in one document to make entire project cleaner :3
import introducePopup from "src/scripts/index.js"

const notesContainer = document.getElementById("app")
const addButton = notesContainer.querySelector(".add-note")

const selectedNoteText = document.getElementById("sidebar-text")


let currentSelectedNote = null 
let selectedNoteForConfig = null

//this instantly calls the getNotes function, so that the notes are loaded upon startup.
getNotes().forEach(note => {
    const noteElement = createNoteElement(note.id, note.content, note.deadline)
    notesContainer.insertBefore(noteElement, addButton)
});


//Prompting user to confirm note deletion when delete button is pressed.
export function promptDelete() {
  
    const selectedNote = getNotes().find((note) => note.id === currentSelectedNote);
    // we turn the message parameter into a variable, so that calling the function doesn't look as cluttered.
    const promptMessage = `Are you sure you want to delete note: ${selectedNote.id}; "${selectedNote.content}"?`
    introducePopup("delete-note-prompt", promptMessage) 
}


function getNotes() {
    console.log("Getting user notes..")
    return JSON.parse(localStorage.getItem("stickynotes-notes") || "[]");
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

function saveNotes(notes) {
    localStorage.setItem("stickynotes-notes", JSON.stringify(notes));

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

function createNoteElement(id, content, deadline) {
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
      }
    }

    return div
}

function addNote() {
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

//all this below is the function for the start of the desired animation, but because ive now spent 7 hours on this shit i cant be botherd to try and solve this fucking davinci code.
function deleteNote({ id, noteElement }) {
    const currentNotes = getNotes().filter((note) => note.id !== id);
        saveNotes(currentNotes);


        if (noteElement) {
            const noteIndex = Array.from(notesContainer.children).indexOf(noteElement);
            const noteWidth = noteElement.offsetWidth;
            const gapWidth = 16; // Set the value of your gap width here
        
            const notes = Array.from(notesContainer.children);

           
            noteElement.style.opacity = '0';
            
            
            setTimeout(() => {
              notes.forEach((note, index) => {
                if (index > noteIndex) {
                  note.style.transition = `transform 0.3s ease`;
                  note.style.transform = `translateX(-${noteWidth + gapWidth}px)`;
                }
              });
            }, 300); // Timeout is set to 300 to skip the faulty animation.. I guess we'll just roll with this for now ¯\_(ツ)_/¯
        
            noteElement.addEventListener('transitionend', handleTransitionEnd);
        
            function handleTransitionEnd() {
              noteElement.removeEventListener('transitionend', handleTransitionEnd);
              notesContainer.removeChild(noteElement);
              repositionNotes(noteIndex, gapWidth);
            }
            
            console.log("fhgnfhgd")
        }
}

//This function is the root cause of all my problems (no delete until fix)
function repositionNotes(startIndex, gapWidth) {
    const notes = Array.from(notesContainer.children);
    notes.forEach((note, index) => {
      if (index >= startIndex) {
        note.style.transition = '';
        note.style.transform = '';
      }
    });
}

  
function updateSelectedNoteText() {
    const selectedNote = getNotes().find((note) => note.id === selectedNoteForConfig)

    if (selectedNote) {
        selectedNoteText.textContent = `Current selected note(${selectedNote.id}): ${selectedNote.content}`
    } else {
        selectedNoteText.textContent = "You have not selected a note to configure."
    }
}
