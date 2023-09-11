// // //prevent popup from instantly showing

// popupContainer.style.visibility = "hidden";

// setTimeout(() => {
//   popupContainer.style.visibility = "visible";
// }, 300);


function showPopup(type) {
    
    const popupContainer = document.getElementById("popupContainer")
    const popupTitle = document.getElementById("popupTitle")
    const popupText = document.getElementById("popupText")
    const popupLoginForm = document.getElementById("popupLoginForm")
    const actionBTN = document.getElementById("popupConfirm")
    const emailForm = document.getElementById("popupEmail")
    const confirmPass = document.getElementById("repeat_password")

    popupContainer.classList.add("visible");

    if (type === "login") {
        actionBTN.innerHTML = "Login"
        popupTitle.textContent = "Sign in to an existing account"
        popupText.textContent = "" //clear any previous message / placeholder
        emailForm.style.display = "none"
        confirmPass.style.display = "none"

        emailForm.removeAttribute("required")
        confirmPass.removeAttribute("required")

        //popupContainer.style.display = "block"
        popupLoginForm.action = "login_user"
    } else if (type === "register") {
        actionBTN.innerHTML = "Register user"
        popupTitle.textContent = "Create account"
        popupText.textContent = "" //clear any previous message / placeholder
        //popupContainer.style.display = "block"
        emailForm.style.display = "block"
        confirmPass.style.display = "block"

        emailForm.setAttribute("required", "required")
        confirmPass.setAttribute("required", "required")


        popupLoginForm.action = "register_user"
    }
}

// document.addEventListener("DOMContentLoaded", function () {
    
//     //const popupLoginForm = document.getElementById("popupLoginForm")
//     const button = document.getElementById("loginBTN")
//     button.addEventListener("click", function (event) {
//         event.preventDefault();

//         const username = document.getElementById("popupUsername").value;
//         const password = document.getElementById("popupPassword").value;

//         fetch("/login_user", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({username, password})

//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 console.log(data)
//                 //login successfull, go away with the popup and continue forth
//                 hidePopup()
//                 //window.location.href = "/home"
//             } else {
//                 //login failed, display error
//                 const popupText = document.getElementById("popupText")
//                 popupText.innerHTML = "Login failed. Please try again.";
//             }
//         })
//         .catch(error => {
//             console.error("Error", error);
//         })
//     })
// })

function hidePopup() {
    const popupContainer = document.getElementById("popupContainer");
    popupContainer.classList.remove("visible")
}
