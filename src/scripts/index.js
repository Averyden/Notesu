//gotta figure out a way for the selectedNoteForConfig variable to be able to be deselected if the user clicks off the note but not on any of the config buttons in the sidebar.
/**
 * TODO: Seperate this script like legos, where note functions are in their own script, and so on and so forth.
 */
const notesContainer = document.getElementById("app")
const addButton = notesContainer.querySelector(".add-note")
const saveUpdateButton = document.querySelector(".save-update")
const selectedNoteText = document.getElementById("sidebar-text")


//get variables for sidebar buttons
const menuButton = document.querySelector(".hamburger")
const sidebar = document.querySelector(".sidebar")
const deleteButton = document.getElementById("deletenotebutton")
const deadlineButton =  document.getElementById("configuredeadlinebutton")


const popupContainer = document.getElementById("popupContainer")
//const popupTitle = document.getElementById("popupTitle");

const popupBtnCancel = document.getElementById("btn-cancel")
const popupBtnConfirm = document.getElementById("btn-confirm")
const popupTextArea = document.getElementById("popupTextArea")
popupTextArea.min = new Date().toLocaleDateString('en-us')

//const delNoteSound = "../"

let currentSelectedNote = null 
let selectedNoteForConfig = null

/**
 * Hide the pop-up close animation on page load --
 * TODO: Please fix this shitty hack in the future :(
 * TODO: Fix stupid function!
 */
popupContainer.style.visibility = "hidden";

setTimeout(() => {
  popupContainer.style.visibility = "visible";
}, 300);

//


//this instantly calls the getNotes function, so that the notes are loaded upon startup.
getNotes().forEach(note => {
    const noteElement = createNoteElement(note.id, note.content, note.deadline)
    notesContainer.insertBefore(noteElement, addButton)
});


addButton.addEventListener("click", () => addNote())
menuButton.addEventListener("click", toggleSidebar)
deleteButton.addEventListener("click", () => promptDelete(currentSelectedNote))
popupBtnCancel.addEventListener("click", () => cancelPrompt())
//popupContainer.addEventListener("click", () => cancelPrompt());
deadlineButton.addEventListener("click", () => introducePopup("deadline-prompt", "Type deadline for note"));

/**
 * TODO: Find a way to check if the deadline has been exceeded, and when it is, the prompt should not question the users decision.
 */

function promptDelete() {
  
    const selectedNote = getNotes().find((note) => note.id === currentSelectedNote);
    // we turn the message parameter into a variable, so that calling the function doesn't look as cluttered.
    const promptMessage = `Are you sure you want to delete note: ${selectedNote.id}; "${selectedNote.content}"?`
    introducePopup("delete-note-prompt", promptMessage) 

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
    
    "deadline-prompt": {
      title: "Change deadline for note",
      confirmText: "Set deadline",
      onConfirm: function() {
        const selectedNote = getNotes().find((note) => note.id === selectedNoteForConfig);
        configureNoteDeadline(selectedNote.id)
          //noteElement: document.getElementById(selectedNote.id),
        selectedNoteForConfig = null
        console.log("User configured note deadline.")
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

  if (type === "deadline-prompt") {
    popupTextArea.style.display = "inline-block"
  } else {
    popupTextArea.style.display = "none"
  }

  if (type !== "error") {
    popupBtnCancel.style.display = "inline-block"
  } else {
    popupBtnCancel.style.display = "none"
  }

  popupBtnConfirm.addEventListener("click", function() {
    promptVariants[type].onConfirm()  //Calls the appropriate onConfirm function based on the type parameter.

    cancelPrompt() //Just incase it doesnt through calling the onConfirm function
  })

  // Make the pop-up visible
  popupContainer.classList.add("visible");
}

function cancelPrompt() {
  popupContainer.classList.remove("visible");
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

function updateNote(id, newContent) {
    console.log("Updating note...")
    const currentNotes = getNotes()
    const selectedNote = currentNotes.filter(currentNotes => currentNotes.id == id)[0]

    selectedNote.content = newContent
    saveNotes(currentNotes)

    //dunno why the fuck js wants you to use backticks if you wanna format shit but.. if it works.. it works. 🤷‍♀️
    console.log(`Note ${selectedNote.id} has been updated`)
}

//all this below is the function for the start of the desired animation, but because ive now spent 7 hours on this shit i cant be botherd to try and solve this fucking davinci code.
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
