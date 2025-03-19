"use strict";

console.log("Image Magnifier extension is running.");

// Select all images on the page.
const images = document.querySelectorAll("img");

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
