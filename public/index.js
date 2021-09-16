const button = document.querySelector(".accordion-button")
const acc = document.querySelector(".accordion")


button.addEventListener('click', () => {
    acc.classList.add(".open")
})