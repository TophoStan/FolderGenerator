// const fs = require('fs');
const fs = require('node:fs/promises');
const { getVideoDurationInSeconds } = require('get-video-duration')

let totalDuration = 0;
const mediaFolder = 'C:/dev/OwnProjects/FolderGenerator/demo_media';


getFilesFromFolder(mediaFolder);


async function getFilesFromFolder(sourcePath) {
    const readdirResult = await fs.readdir(sourcePath);

    readdirResult.forEach(async (file) => {
        //Exclude folders
        if ((await (fs.lstat(`${sourcePath}/${file}`))).isDirectory()) return;

        await getFileDataFromPath(`${sourcePath}/${file}`, file);
        // getTotalVideoMinutes(`${path}/${file}`);

    })
}

async function getFileDataFromPath(filePath, fileName) {
    const statResult = await fs.stat(filePath);

    const date = new Date(statResult.mtime).toLocaleString('nl-NL', {
        timeZone: 'Europe/Amsterdam',
        hour12: false
    }).split(',')[0];
    // date: 2-11-2024, 09:49:18

    await createFoldersOfDates(date);
    await copyFileToFolder(fileName, filePath, date);
}

async function createFoldersOfDates(date) {
    // Create folders based on the date
    // Example: 2024-11-27T19:45:36.000Z
    // Create folder: 27-11-2024
    try {
        await fs.mkdir(`FG_Folder/${date}`, { recursive: true })
        console.log(`createFoldersOfDates: ${date}`);

    } catch (error) {
        console.log(`createFoldersOfDatesError: ${date}`);
    }
}

async function copyFileToFolder(fileName, filePath, date) {
    try {
        await fs.copyFile(filePath, `FG_Folder/${date}/${fileName}`)
        console.log(`copyFileToFolder: ${fileName}`);
    } catch (error) {
        console.log(`copyFileToFolderError: ${fileName}`);
    }
}



function getTotalVideoMinutes(path) {
    // Get total minutes of all video files
    getVideoDurationInSeconds(path).then((duration) => {
        // FILENAME: is X hours, Y minutes, Z seconds
        // If the file is 0 hours, don't display it
        totalDuration += duration;
        logTotalDuration();
    });

}

function logTotalDuration() {
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    const seconds = Math.floor(totalDuration % 60);
    const formattedDuration = `${hours > 0 ? hours + ' hours, ' : ''}${minutes} minutes, ${seconds} seconds`;
    console.log(`${formattedDuration}`);
}