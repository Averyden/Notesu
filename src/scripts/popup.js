

/**
 * TODO: make a smaller popup, that comes from below and is stuck there, letting the user know when they have done something, for example like, completing a note.
 * Just in case they didnt realize what they did
 * 
 */

function introducePopup(type, message) {
  const popupContent = document.getElementById("popupText");
  const popupTitle = document.getElementById("popupTitle");

  const promptVariants = {
    "delete-note-prompt": {
      title: "Delete Note",
      confirmText: "Delete",
      onConfirm: deleteNoteConfirm
    },

    "confirmation-prompt": {
      title: "Confirmation",
      confirmText: "Confirm",
      onConfirm: colorNoteForward //! For now this is coded to test the color changing, I still need to figure out a way for the onConfirm option to be changed dynamically... IF that is even possible to begin with.
      //* Currently not coded in anything that needs to be confirmed.
      //? Maybe for a future account system to make the user confirm changing their user info? or maybe even just confirming they are still at their computer.
    },

    "deadline-prompt": {
      title: "Set deadline for note",
      confirmText: "Set deadline",
      onConfirm: deadlineConfirm
    },

    "completion-prompt": {
      title: "Mark note as completed",
      confirmText: "Complete",
      onConfirm: completeNote
    },

    //!Failsafe if something goes wrong.
    "error": {
      title: "Error in code",
      confirmText: "OK",
      onConfirm: cancelPrompt
    }
  }

  //* Check if variant exists, prompt error if not.
  if (!promptVariants.hasOwnProperty(type)) {
    type = "error"
    message = "Please ensure the referenced type is valid."
  }

  //Ensure message is -= null
  popupContent.innerHTML = message !== null ? message: "Missing message parameter.";

  const { title, confirmText, onConfirm } = promptVariants[type];
  popupTitle.innerText = title;
  popupBtnConfirm.innerHTML = confirmText;


  //* Configure type-specific elements on the popup per type.
  if (type === 'deadline-prompt') {
    popupTextArea.style.display = "inline-block"
  } else {
    popupTextArea.style.display = "none"
  }

  if (type !== "error") {
    popupBtnCancel.style.display = "inline-block"
  } else {
    popupBtnCancel.style.display = "none"
  }

  //remove previous event listener and reset it.
  popupBtnConfirm.replaceWith(popupBtnConfirm.cloneNode(true));
  const newPopupBtnConfirm = document.getElementById("btn-confirm")
  newPopupBtnConfirm.addEventListener("click", onConfirm)

  //Show popup
  popupContainer.classList.add("visible")
}
/**
 *!    Temporary note color function
 *!    Either delete or rewrite when finished.
*/

function colorNoteForward() {
  // Error finding and making sure note exists.
  console.log("AAAAAAAAAAAAa")
  const selectedNote = getNotes().find(note => note.id === selectedNoteForConfig)
  if (!selectedNote) {
    console.error("No note selected or note not found.")
    return;
  }

  colorNote(selectedNote.id)

}

function deleteNoteConfirm() {
  const selectedNote = getNotes().find(note => note.id === selectedNoteForConfig)
  if (!selectedNote) {
    console.error("No note selected or note not found.")
    return;
  }

  deleteNote({
    id: selectedNote.id,
    noteElement: document.getElementById(selectedNote.id)
  })

  selectedNoteForConfig = null
  updateSelectedNoteText()
  cancelPrompt() 
}

function completeNote() {
  const selectedNote = getNotes().find(note => note.id === selectedNoteForConfig)
  if (!selectedNote) {
    console.error("No note selected or note not found.")
    return;
  }
  markNoteCompleted(selectedNote.id)
  selectedNoteForConfig = null
  console.log(`User marked note ${selectedNote.id} for completion.`)
  cancelPrompt() 
}

function deadlineConfirm() {
  const selectedNote = getNotes().find(note => note.id === selectedNoteForConfig)
  if (!selectedNote) {
    console.error("No note selected or note not found.")
    return;
  }

  configureNoteDeadline(selectedNote.id)
  selectedNoteForConfig = null
  console.log("User configured note deadlne.")
  cancelPrompt()
}

function cancelPrompt() {
  document.getElementById("popupContainer").classList.remove("visible")
}

// function introducePopup(type, message) {
//     const popupContent = document.getElementById("popupText");
//     const popupTitle = document.getElementById("popupTitle")
  
//     const promptVariants = {
//       "delete-note-prompt": {
//         title: "Delete note",
//         confirmText: "Delete",
//         onConfirm: function() {
//           const selectedNote = getNotes().find((note) => note.id === selectedNoteForConfig);
//           deleteNote({
//             id: selectedNote.id,
//             noteElement: document.getElementById(selectedNote.id),
//           });
//           selectedNoteForConfig = null;
//           updateSelectedNoteText(); 
//           cancelPrompt()
//         }
//       },
  
//       "confirmation-prompt": {
//         title: "Confirmation",
//         confirmText: "Confirm",
//         onConfirm: function() {
//           cancelPrompt() // I actually have no idea what confirming should do yet.
//           console.log(`User has confirmed (x) action (format string when needed:)`)
//         }
//       },
      
//       "deadline-prompt": {
//         title: "Change deadline for note",
//         confirmText: "Set deadline",
//         onConfirm: function() {
//           const selectedNote = getNotes().find((note) => note.id === selectedNoteForConfig);
//           configureNoteDeadline(selectedNote.id)
//             //noteElement: document.getElementById(selectedNote.id),
//           selectedNoteForConfig = null
//           console.log("User configured note deadline.")
//         }
//       },
  
//       "error": {
//         title: "Error in code",
//         confirmText: "OK",
//         onConfirm: function() {
//           cancelPrompt()
//         }
//       },
    
//       //More variants might come later, idfk
//     }
  
//     //call error if incorrect type referenced.
//     if (!promptVariants.hasOwnProperty(type)) {
//       type = "error"
//       const error = new Error()
//       const stackLines = error.stack.split("\n")
//       const callingLine = stackLines[3].trim()
//       const callingCode = callingLine.substring(callingLine.indexOf("at ") + 2)
//       console.log(callingCode)
//       message = `Incorrect type referenced.\nCalled from: ${callingCode} \nPresumably there may have been a spelling mistake, or calling the type may have been forgotten?`
//     }
  
//     //call error if message === null (not called)
//     if (message !== null) {
//       popupContent.innerText = message
//     } else {
//       const error = new Error();
//       const stackLines = error.stack.split("\n")
//       const callingLine = stackLines[3].trim()
//       const callingCode = callingLine.substring(callingLine.indexOf("at ") + 2)
//       message = `Missing parameter: "Message" \nCalled from: ${callingCode} \nPresumably you may have forgotten to add a message to the parameters when calling the function?`
//     }
  
//     const {title, confirmText} = promptVariants[type]
//     popupTitle.innerText = title
//     popupBtnConfirm.innerHTML = confirmText
  
//     if (type === "deadline-prompt") {
//       popupTextArea.style.display = "inline-block"
//     } else {
//       popupTextArea.style.display = "none"
//     }
  
//     if (type !== "error") {
//       popupBtnCancel.style.display = "inline-block"
//     } else {
//       popupBtnCancel.style.display = "none"
//     }
  
//     // Remove any eventlisteners just in case, so the function isnt permanently frozen after the first.
//     popupBtnConfirm.removeEventListener("click", function() {})


//     popupBtnConfirm.addEventListener("click", function() {
//       promptVariants[type].onConfirm()  //Calls the appropriate onConfirm function based on the type parameter.
  
//       cancelPrompt() //Just incase it doesnt through calling the onConfirm function
//     })
  
//     // Make the pop-up visible
//     popupContainer.classList.add("visible");
// }

function cancelPrompt() {
    popupContainer.classList.remove("visible");
}

