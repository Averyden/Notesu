const notesContainer = document.getElementById("app")
const addButton = notesContainer.querySelector(".add-note")
const saveUpdateButton = document.querySelector(".save-update")
const selectedNoteText = document.querySelector(".sidebar li:first-child text")

const menuButton = document.querySelector(".hamburger")
const sidebar = document.querySelector(".sidebar")
const deleteButton = document.querySelector(".deletenotebutton")

let currentSelectedNote = null //Make function that gets the ID of the note that the user has clicked and then parse it through the <li><text>You have not selected a note to configure.</text></li> <!--Current selected note:--> element in the HTML document

//this instantly calls the getNotes function, so that the notes are loaded upon startup.
getNotes().forEach(note => {
    const noteElement = createNoteElement(note.id, note.content)
    notesContainer.insertBefore(noteElement, addButton)
});

addButton.addEventListener("click", () => addNote())
menuButton.addEventListener("click", toggleSidebar)
deleteButton.addEventListener("click", () => promptDelete(currentSelectedNote))

function promptDelete() {
    const selectedNote = getNotes().find((note) => note.id === currentSelectedNote);
  
    if (selectedNote) {
      const doDelete = confirm(`Are you sure you want to delete note: ${selectedNote.id} (${selectedNote.content})?`);
  
      if (doDelete) {
        deleteNote({
          id: selectedNote.id,
          noteElement: document.getElementById(selectedNote.id),
        });
        currentSelectedNote = null;
        updateSelectedNoteText();
      }
    }
}
  
  

function toggleSidebar() {
    menuButton.classList.toggle("is-active")
    sidebar.classList.toggle("is-open")
    notesContainer.classList.toggle("app--sidebar-open")
}

function getNotes() {
    console.log("Getting user notes..")
    return JSON.parse(localStorage.getItem("stickynotes-notes") || "[]");
}

function saveNotes(notes) {
    localStorage.setItem("stickynotes-notes", JSON.stringify(notes));

}

function createNoteElement(id, content) {
    const element = document.createElement("textarea");

    element.id = id;

    element.classList.add("note")
    element.value = content;
    element.placeholder = "Empty note"

    element.addEventListener("change", () => {
        updateNote(id, element.value)
    });

    element.addEventListener("click", () => {
        currentSelectedNote = id
        updateSelectedNoteText()
    })

    return element
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

function updateNote(id, newContent) {
    console.log("Updating note...")
    const currentNotes = getNotes()
    const selectedNote = currentNotes.filter(currentNotes => currentNotes.id == id)[0]

    selectedNote.content = newContent
    saveNotes(currentNotes)

    //dunno why the fuck js wants you to use backticks if you wanna format shit but.. if it works.. it works. 🤷‍♀️
    console.log(`Note ${selectedNote.id} has been updated`)
}

//this below is just for deletion of notes with no animation
// function deleteNote({ id, noteElement }) {
//     const currentNotes = getNotes().filter((note) => note.id !== id);
//     saveNotes(currentNotes);
  
//     console.log("gredty");
//     if (noteElement) {
//       console.log(`deleting note ${noteElement}`);
//       notesContainer.removeChild(noteElement);
//       console.log("deleted");
//     }
  
//     console.log("fcxvgbfbvdgfgbfg");
//     if (currentSelectedNote === id) {
//       currentSelectedNote = null;
//       updateSelectedNoteText();
//     }
//   }

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
            }, 300);
        
            noteElement.addEventListener('transitionend', handleTransitionEnd);
        
            function handleTransitionEnd() {
              console.log("hiiiii")
              noteElement.removeEventListener('transitionend', handleTransitionEnd);
              notesContainer.removeChild(noteElement);
              repositionNotes(noteIndex, gapWidth);
            }
            
            console.log("fhgnfhgd")
          }
        }
  

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
    const selectedNote = getNotes().find((note) => note.id === currentSelectedNote)

    if (selectedNote) {
        selectedNoteText.textContent = `Current selected note(${selectedNote.id}): ${selectedNote.content}`
    } else {
        selectedNoteText.textContent = "You have not selected a note to configure."
    }
}