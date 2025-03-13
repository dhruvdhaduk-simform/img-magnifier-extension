"use strict";

const images = document.querySelectorAll("img");

function attachEventListeners(img) {
    img.addEventListener("mouseenter", function(e) {
        console.log("MOUSE ENTER");
        const { x, y, width, height } = img.getBoundingClientRect();
        console.log(x, y);
        console.log(width, height);
    });

    img.addEventListener("mousemove", function(e) {
        if (!e.ctrlKey) return;

        console.log(e.offsetX, e.offsetY);
    });

    img.addEventListener("mouseleave", function(e) {
        console.log("MOUSE LEAVE");
    });
}

images.forEach(attachEventListeners);