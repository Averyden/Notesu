//gotta figure out a way for the selectedNoteForConfig variable to be able to be deselected if the user clicks off the note but not on any of the config buttons in the sidebar.

const notesContainer = document.getElementById("app")
const addButton = notesContainer.querySelector(".add-note")
const saveUpdateButton = document.querySelector(".save-update")
const selectedNoteText = document.getElementById("sidebar-text")

const menuButton = document.querySelector(".hamburger")
const sidebar = document.querySelector(".sidebar")
const deleteButton = document.querySelector(".deletenotebutton")

const popupContainer = document.getElementById("popupContainer")
//const popupTitle = document.getElementById("popupTitle");

const popupBtnCancel = document.querySelector(".btn-cancel")
const popupBtnConfirm = document.querySelector(".btn-confirm")

let currentSelectedNote = null 
let selectedNoteForConfig = null  //Make second variable for selected note as a getaway from blur function killing itself. (dunno about the outline though)

//this instantly calls the getNotes function, so that the notes are loaded upon startup.
getNotes().forEach(note => {
    const noteElement = createNoteElement(note.id, note.content)
    notesContainer.insertBefore(noteElement, addButton)
});


addButton.addEventListener("click", () => addNote())
menuButton.addEventListener("click", toggleSidebar)
deleteButton.addEventListener("click", () => promptDelete(currentSelectedNote))
popupBtnCancel.addEventListener("click", () => cancelPrompt())


function promptDelete() {
  
    const selectedNote = getNotes().find((note) => note.id === currentSelectedNote);
    // we turn the message parameter into a variable, so that calling the function doesn't look as cluttered.
    const promptMessage = `Are you sure you want to delete note: ${selectedNote.id}; "${selectedNote.content}"?`
    introducePopup("delete-note-promptxxxxxxx", promptMessage) 

  /*  if (selectedNote) {
      const doDelete = confirm(`Are you sure you want to delete note: ${selectedNote.id} (${selectedNote.content})?`);
  
      if (doDelete) {
        deleteNote({
          id: selectedNote.id,
          noteElement: document.getElementById(selectedNote.id),
        });
        currentSelectedNote = null;
        updateSelectedNoteText(); 
      }
    }*/
}
  
function introducePopup(type, message) {
  const popupContent = document.getElementById("popupText");
  const popupTitle = document.getElementById("popupTitle")

  const promptVariants = {
    "delete-note-prompt": {
      title: "Delete note",
      confirmText: "Delete",
      onConfirm: function() {
        const selectedNote = getNotes().find((note) => note.id === selectedNoteForConfig);
        deleteNote({
          id: selectedNote.id,
          noteElement: document.getElementById(selectedNote.id),
        });
        selectedNoteForConfig = null;
        updateSelectedNoteText(); 
        cancelPrompt()
      }
    },
    "confirmation-prompt": {
      title: "Confirmation",
      confirmText: "Confirm",
      onConfirm: function() {
        cancelPrompt() // I actually have no idea what confirming should do yet.
        console.log(`User has confirmed (x) action (format string when needed:)`)
      }
    },
    
    "error": {
      title: "Error in code",
      confirmText: "OK",
      onConfirm: function() {
        cancelPrompt()
      }
    },
  
    //More variants might come later, idfk
  }

  //call error if incorrect type referenced.
  if (!promptVariants.hasOwnProperty(type)) {
    type = "error"
    const error = new Error()
    const stackLines = error.stack.split("\n")
    const callingLine = stackLines[3].trim()
    const callingCode = callingLine.substring(callingLine.indexOf("at ") + 2)
    console.log(callingCode)
    message = `Incorrect type referenced.\nCalled from: ${callingCode} \nPresumably there may have been a spelling mistake, or calling the type may have been forgotten?`
  }

  //call error if message === null (not called)
  if (message !== null) {
    popupContent.innerText = message
  } else {
    const error = new Error();
    const stackLines = error.stack.split("\n")
    const callingLine = stackLines[3].trim()
    const callingCode = callingLine.substring(callingLine.indexOf("at ") + 2)
    message = `Missing parameter: "Message" \nCalled from: ${callingCode} \nPresumably you may have forgotten to add a message to the parameters when calling the function?`
  }

  const {title, confirmText} = promptVariants[type]
  popupTitle.innerText = title
  popupBtnConfirm.innerHTML = confirmText

  if (type !== "error") {
    popupBtnCancel.style.display = "inline-block"
  } else {
    popupBtnCancel.style.display = "none"
  }

  popupBtnConfirm.addEventListener("click", function() {
    promptVariants[type].onConfirm()  //Calls the appropriate onConfirm function based on the type parameter.

    cancelPrompt() //Just incase it doesnt through calling the onConfirm function
  })

  // Add the 'show' class to trigger the animation
  popupContainer.classList.remove("hide")
  popupContainer.classList.add('show');
}

//beg tjaz for help (if the chance comes, for now ill just keep it as is)

function cancelPrompt() {
  if (popupContainer.classList.contains("show")) {
    popupContainer.classList.remove("show");
    popupContainer.classList.add("hide");
    setTimeout(() => {
      //popupContainer.style.display = "none";
      popupContainer.classList.remove("hide");
    }, 300); // Hide the popup after the animation duration (0.3s)
  } else {
    console.log("what");
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
    const div = document.createElement("div");
    const element = document.createElement("textarea");
    const deadline = document.createElement("span");

    div.appendChild(element)
    div.appendChild(deadline)
    deadline.innerText = "No deadline has been set."

    div.id = id;

    div.classList.add("note")
    element.classList.add("note-text")
    deadline.classList.add("note-deadline")
    element.value = content;
    element.placeholder = "Empty note"

    let blurTimeout;

    element.addEventListener("focus", () => {
      currentSelectedNote = id
      selectedNoteForConfig = id
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
            }, 300); // Timeout is set to 300 to skip the faulty animation.. I guess we'll just roll with this for now 🤷‍♀️🤷‍♀️🤷‍♀️
        
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
    const selectedNote = getNotes().find((note) => note.id === selectedNoteForConfig)

    if (selectedNote) {
        selectedNoteText.textContent = `Current selected note(${selectedNote.id}): ${selectedNote.content}`
    } else {
        selectedNoteText.textContent = "You have not selected a note to configure."
    }
}