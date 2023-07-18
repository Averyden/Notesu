import { introducePopup, cancelPrompt } from "./popup.js"
import { promptDelete, addNote } from "./notes.js"

//get variables for sidebar buttons
const menuButton = document.querySelector(".hamburger")
const sidebar = document.querySelector(".sidebar")
const deleteButton = document.querySelector(".deletenotebutton")
const deadlineButton =  document.querySelector(".configuredeadlinebutton")


const popupContainer = document.getElementById("popupContainer")
//const popupTitle = document.getElementById("popupTitle");


//variables from other placed

//popup.js
const popupBtnCancel = document.querySelector(".btn-cancel")


//notes.js
const notesContainer = document.getElementById("app")
const addButton = notesContainer.querySelector(".add-note")



addButton.addEventListener("click", () => addNote())
deleteButton.addEventListener("click", () => promptDelete(currentSelectedNote))
deadlineButton.addEventListener("click", () => introducePopup("deadline-prompt", "Type deadline for note"));



/**
 * Hide the pop-up close animation on page load --
 * TODO: Please fix this shitty hack in the future :(
 * TODO: Fix stupid function!
 */

popupContainer.style.visibility = "hidden";

setTimeout(() => {
  popupContainer.style.visibility = "visible";
}, 300);


menuButton.addEventListener("click", () => toggleSidebar())
popupBtnCancel.addEventListener("click", () => cancelPrompt())
//popupContainer.addEventListener("click", () => cancelPrompt());

/**
 * TODO: Find a way to check if the deadline has been exceeded, and when it is, the prompt should not question the users decision.
 */

function toggleSidebar() {
    menuButton.classList.toggle("is-active")
    sidebar.classList.toggle("is-open")
    notesContainer.classList.toggle("app--sidebar-open")
}