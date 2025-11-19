const hamburger = document.getElementById("hamburger-js");
const closeNavBtn = document.getElementById("close-nav-btn-js");
const secondSection = document.getElementById("second-section-js");


hamburger.addEventListener("click", () => {
    secondSection.classList.remove("hide");
    hamburger.classList.add("hide");
    closeNavBtn.classList.remove("hide");
});

closeNavBtn.addEventListener("click", () => {
    secondSection.classList.add("hide");
    closeNavBtn.classList.add("hide");
    hamburger.classList.remove("hide");
});