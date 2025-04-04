"use strict";

// Few constants regarding magnification and dimensions.
let MAGNIFICATION = 3;
const RESULT_CONTAINER_MARGIN = 10;
const RESULT_CONTAINER_MAX_WIDTH = 300;

console.log("Image Magnifier extension is running.");

// Create the div for magnifier box over the images.
const magnifier = document.createElement("div");
magnifier.classList.add("magnifier");
document.body.append(magnifier);

// Create the container and image to show the result of magnified image.
const magnifiedResult = document.createElement("div");
magnifiedResult.classList.add("magnified-result");
const magnifiedImg = document.createElement("img");
magnifiedResult.append(magnifiedImg);
document.body.append(magnifiedResult);

// Ensures smooth movement of the magnifier.
let isMoving = false;

// Move the magnifier box at specified position.
function moveMagnifier(x, y) {
    magnifier.style.left = `${x}px`;
    magnifier.style.top = `${y}px`;
    isMoving = false;
}

// Calculate position and size of Magnified result container to show it where there is space.
function positionMagnifiedResult(img) {
    // Get the position of original image.
    const { x, y, right, bottom } = img.getBoundingClientRect();

    // Check which side of original image has maximum amount of space.
    const magnifiedResultPosition = [y, window.innerHeight - bottom, x, window.innerWidth - right].reduce((acc, val, i, arr) => {
        if (val > arr[acc]) return i;
        else return acc;
    }, 0);

    let resultContainerX;
    let resultContainerY;
    let resultContainerSize;

    // Set the position and size of Magnified result container based on particular side of original image.
    switch (magnifiedResultPosition) {
        case 0:
            resultContainerSize = Math.min(y - 2 * RESULT_CONTAINER_MARGIN, RESULT_CONTAINER_MAX_WIDTH);
            resultContainerX = (window.innerWidth - resultContainerSize) / 2;
            resultContainerY = y - resultContainerSize - RESULT_CONTAINER_MARGIN;
            break;
        case 1:
            resultContainerSize = Math.min(window.innerHeight - bottom - 2 * RESULT_CONTAINER_MARGIN, RESULT_CONTAINER_MAX_WIDTH);
            resultContainerX = (window.innerWidth - resultContainerSize) / 2;
            resultContainerY = bottom + RESULT_CONTAINER_MARGIN;
            break;
        case 2:
            resultContainerSize = Math.min(x - 2 * RESULT_CONTAINER_MARGIN, RESULT_CONTAINER_MAX_WIDTH);
            resultContainerX = x - resultContainerSize - RESULT_CONTAINER_MARGIN;
            resultContainerY = (window.innerHeight - resultContainerSize) / 2;
            break;
        default:
            resultContainerSize = Math.min(window.innerWidth - right - 2 * RESULT_CONTAINER_MARGIN, RESULT_CONTAINER_MAX_WIDTH);
            resultContainerX = right + RESULT_CONTAINER_MARGIN;
            resultContainerY = (window.innerHeight - resultContainerSize) / 2;
    }

    // Update css to render it on page.
    magnifiedResult.style.left = `${resultContainerX}px`;
    magnifiedResult.style.top = `${resultContainerY}px`;
    magnifiedResult.style.width = `${resultContainerSize}px`;
    magnifiedResult.style.height = `${resultContainerSize}px`;
}

// Attach event handlers for a particular image.
function attachEventListeners(img) {

    img.addEventListener("click", function (e) {
        if (!e.ctrlKey) return;

        e.preventDefault();
        e.stopPropagation();

        if (e.shiftKey) {
            if (MAGNIFICATION > 1) {
                MAGNIFICATION--;
            }
        }
        else {
            if (MAGNIFICATION < 7) {
                MAGNIFICATION++;
            }
        }

        img.dispatchEvent(new MouseEvent("mousemove", {
            ctrlKey: true,
            clientX: e.clientX,
            clientY: e.clientY,
        }));

    });

    img.addEventListener("mousemove", function (e) {
        // Hide the magnifier and its result when the Ctrl key is not pressed
        if (!e.ctrlKey) {
            magnifier.style.display = "none";
            magnifiedResult.style.display = "none";
            return;
        }

        // Get the size and position of original image.
        const { x, y, width, height } = img.getBoundingClientRect();

        // Calculate the size of magnifier box.
        let magnifierSize = Math.min(width, height) / MAGNIFICATION;
        magnifier.style.width = `${magnifierSize}px`;
        magnifier.style.height = `${magnifierSize}px`;

        // Set the source of result image.
        magnifiedImg.src = img.src;

        // Show the magnifier box and the magnified image container.
        magnifier.style.display = "block";
        magnifiedResult.style.display = "block";

        // Calculate position and size of Magnified result container to show it where there is space.
        positionMagnifiedResult(img);

        const resultContainerWidth = magnifiedResult.offsetWidth;
        const resultContainerHeight = magnifiedResult.offsetHeight;

        // Calculate to position of cursor on image, including edge cases.
        let cursorX = e.offsetX - (magnifierSize / 2);
        let cursorY = e.offsetY - (magnifierSize / 2);
        cursorX = Math.min(Math.max(cursorX, 0), width - magnifierSize);
        cursorY = Math.min(Math.max(cursorY, 0), height - magnifierSize);

        // Calculate the position of magnifier box, with respect to window.
        const magnifierX = x + cursorX;
        const magnifierY = y + cursorY;

        // Calculate the size of magnified image.
        let magnifiedImgWidth = resultContainerWidth * width / magnifierSize;
        let magnifiedImgHeight = resultContainerHeight * height / magnifierSize;

        // Initial values of magnified image position.
        let clipX = magnifierX - x;
        let clipY = magnifierY - y;

        // Natural width & height of the original image (ignoring layout constraints).
        const imgNaturalWidth = img.naturalWidth;
        const imgNaturalHeight = img.naturalHeight;

        // Current & Natural aspect ratios of original image.
        const imgCurrentAspect = width / height;
        const imgNaturalAspect = imgNaturalWidth / imgNaturalHeight;

        // Adjust the magnified image position based on variations in aspect ratio.
        if (imgCurrentAspect > imgNaturalAspect) {
            // Consider the cropped part of original image along Y-axis.
            clipY += ((width / imgNaturalAspect) - height) / 2;
            magnifiedImgHeight = magnifiedImgWidth / imgNaturalAspect;
        }
        else {
            // Consider the cropped part of original image along X-axis.
            clipX += ((height * imgNaturalAspect) - width) / 2;
            magnifiedImgWidth = magnifiedImgHeight * imgNaturalAspect;
        }

        // Set the position and dimension of magnified image.
        magnifiedImg.style.width = `${magnifiedImgWidth}px`;
        magnifiedImg.style.height = `${magnifiedImgHeight}px`;
        magnifiedImg.style.left = `-${clipX * resultContainerWidth / magnifierSize}px`;
        magnifiedImg.style.top = `-${clipY * resultContainerHeight / magnifierSize}px`;

        // Update the position of magnifier box with smooth movement.
        if (!isMoving) {
            isMoving = true;
            requestAnimationFrame(() => moveMagnifier(magnifierX, magnifierY));
        }

    });

    // Hide the magnifier and magnified result container on "mouseleave" event.
    img.addEventListener("mouseleave", function () {
        magnifier.style.display = "none";
        magnifiedResult.style.display = "none";
    });
}

// Mutation Observer to attach event handlers when any new image is inserted.
const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
        if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === "img") {
                    attachEventListeners(node);
                }
                else if (node.querySelectorAll) {
                    node.querySelectorAll("img").forEach(attachEventListeners);
                }
            });
        }
    });
});

// Select all images on the page.
const images = document.querySelectorAll("img");

// Attach event handlers to all images on page.
images.forEach(attachEventListeners);

observer.observe(document.body, { childList: true, subtree: true });