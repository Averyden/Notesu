

//gotta figure out a way for the selectedNoteForConfig variable to be able to be deselected if the user clicks off the note but not on any of the config buttons in the sidebar.

const notesContainer = document.getElementById("app")
const addButton = notesContainer.querySelector(".add-note")
const saveUpdateButton = document.querySelector(".save-update")
const selectedNoteText = document.getElementById("sidebar-text")


//get variables for sidebar buttons
const menuButton = document.querySelector(".hamburger")
const sidebar = document.querySelector(".sidebar")
const deleteButton = document.getElementById("deletenotebutton")
const deadlineButton =  document.getElementById("configuredeadlinebutton")
const completeButton = document.getElementById("marknoteascompleted")


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
menuButton.addEventListener("click", () => toggleSidebar())
deleteButton.addEventListener("click", () => promptDelete(currentSelectedNote))
popupBtnCancel.addEventListener("click", () => cancelPrompt())
//popupContainer.addEventListener("click", () => cancelPrompt());
deadlineButton.addEventListener("click", () => introducePopup("deadline-prompt", "Type deadline for note"));
completeButton.addEventListener("click", () => promptComplete(currentSelectedNote))


//* We only use this function to fetch the details of the note so that it can be displayed on the popup.
function promptComplete() {
  const selectedNote = getNotes().find((note) => note.id === currentSelectedNote)
  const promptMessage = `Are you sure you want to mark note: <b>${selectedNote.id}; ${selectedNote.content}</b> as completed?`
  introducePopup("completion-prompt", promptMessage)
}

function promptDelete() {
  
  const selectedNote = getNotes().find((note) => note.id === currentSelectedNote);
  const selectedNoteElement = document.getElementById(selectedNote.id);
  if (selectedNoteElement.classList.contains("exceeded")) { // Check to see if the note has exceeded its deadline, if so, just delete lol.
    deleteNote({
      id: selectedNote.id,
      noteElement: document.getElementById(selectedNote.id),
    });
  } else { // If deadline has yet to be exceeded, make sure the user is sure they want to delete the selected.
    const promptMessage = `Are you sure you want to delete note: <b>${selectedNote.id}; "${selectedNote.content}"</b>?`
    introducePopup("delete-note-prompt", promptMessage) 
  }

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
// function deleteNote({ id, noteElement }) {
//     const currentNotes = getNotes().filter((note) => note.id !== id);
//         saveNotes(currentNotes);

//         if (noteElement) {
//             noteElement.style.opacity = '0';
//             noteElement.addEventListener('transitionend', handleTransitionEnd);

//             function handleTransitionEnd() {
               // this functions sole purpose is to prevent the note fading away from instantly deleting itself, which in that case would make the animation useless and wasted effort.
//               noteElement.removeEventListener('transitionend', handleTransitionEnd);
//               notesContainer.removeChild(noteElement);
//             }
            
//         }
// }
  