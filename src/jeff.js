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
//i fucking hate this stupid shit
function deleteNote({
    id,
    noteElement
  }) {
    const currentNotes = getNotes().filter((note) => note.id !== id);
    saveNotes(currentNotes);
  
    if (noteElement) {
      const noteIndex = Array.from(notesContainer.children).indexOf(noteElement);
  
      noteElement.style.transition = 'opacity 0.3s ease';
      noteElement.style.opacity = '0';
  
      setTimeout(() => {
        notesContainer.removeChild(noteElement);
        repositionNotes(noteIndex);
      }, 300);
    }
  
    // Update the text
    if (currentSelectedNote === id) {
      currentSelectedNote = null;
      updateSelectedNoteText();
    }
  }

  function repositionNotes(startIndex) {
    const noteElements = Array.from(notesContainer.children);
    const numNotes = noteElements.length;
    const gridColumns = Math.floor(notesContainer.offsetWidth / (noteElements[0].offsetWidth + 24));
    const numRows = Math.ceil(numNotes / gridColumns);
  
    for (let i = startIndex + 1; i < numNotes; i++) {
      const noteElement = noteElements[i];
      const currentRow = Math.floor(i / gridColumns);
      const currentColumn = i % gridColumns;
      const targetRow = Math.floor((i - 1) / gridColumns);
      const targetColumn = (i - 1) % gridColumns;
      const offsetX = (targetColumn - currentColumn) * (noteElement.offsetWidth + 24);
      const offsetY = (targetRow - currentRow) * (noteElement.offsetHeight + 24);
      noteElement.style.transition = 'transform 0.3s ease';
      noteElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
  
    setTimeout(() => {
      for (let i = startIndex + 1; i < numNotes; i++) {
        const noteElement = noteElements[i];
        noteElement.style.transition = '';
        noteElement.style.transform = '';
      }
    }, 300);
  }
  

function updateSelectedNoteText() {
    const selectedNote = getNotes().find((note) => note.id === currentSelectedNote)

    if (selectedNote) {
        selectedNoteText.textContent = `Current selected note(${selectedNote.id}): ${selectedNote.content}`
    } else {
        selectedNoteText.textContent = "You have not selected a note to configure."
    }
}