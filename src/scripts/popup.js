export function introducePopup(type, message) {
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

export function cancelPrompt() {
    popupContainer.classList.remove("visible");
}

