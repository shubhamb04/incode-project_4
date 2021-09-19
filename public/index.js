const navLinks = document.querySelectorAll(".nav-link");

const scheduleCards = document.querySelectorAll(".schedule-cards");

const weekDay = document.querySelectorAll(".day strong")

navLinks.forEach(link => {
    link.addEventListener("click", () => {

        navLinks.forEach(navlink => {
            navlink.classList.remove("active")
        })
        link.classList.add("active")
        
        weekDay.forEach((day, index) => {
            if (link.innerHTML === "reset") {
                scheduleCards[index].classList.remove("hidden")
            } else if (day.innerHTML === link.innerHTML) {
                scheduleCards[index].className = "col-md-6 schedule-cards"
            } else {
                scheduleCards[index].className = "col-md-6 schedule-cards hidden"
            }
        })

    }) 
})