const filterContainer = document.getElementsByClassName("filter-container")[0];
console.log(filterContainer);

// add an event on scroll

window.addEventListener("scroll", function () {
    if (window.scrollY < 350 && filterContainer.classList.contains("sticky")) {
        filterContainer.classList.remove("sticky");
    }

    if (window.scrollY > 280) {
        filterContainer.classList.add("sticky");
    }
});
