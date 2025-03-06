"use strict";

import fs from "fs";
import archiver from "archiver";

// Remove the existing build files
fs.rmSync('./dist', {
    force: true,
    recursive: true,
});

// Create directory to store build artifects
fs.mkdirSync('./dist');

// Specity the output and initialize the archiver
const output = fs.createWriteStream("./dist/img-magnifier-extension.zip");
const archive = archiver("zip", {
    zlib: { level: 9 },
});

output.on("close", () => {
    console.log("ZIP file created");
});

archive.on("error", (err) => {
    console.error(err);
});

archive.pipe(output);
archive.directory('./extension', false);
archive.finalize();

