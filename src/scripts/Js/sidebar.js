//! This code purely now exists for archival reasons as I am refactoring to typescript.
//! I will be using this to compare how the code functioned up until now.
function toggleSidebar() {
    menuButton.classList.toggle("is-active")
    sidebar.classList.toggle("is-open")
    notesContainer.classList.toggle("app--sidebar-open")
}

//? Is there a reason i made this file just for it to only be this?
//? Like i feel like I couldve just kept it in index....