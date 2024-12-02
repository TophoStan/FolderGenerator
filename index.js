const fs = require('fs');
const { getVideoDurationInSeconds } = require('get-video-duration')

let totalDuration = 0;
const mediaFolder = 'C:/media/BackupCamcorder';


getFilesFromFolder(mediaFolder);


function getFilesFromFolder(path) {
    fs.readdir(path, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        files.forEach(file => {
            //Exclude folders
            if (fs.lstatSync(`${path}/${file}`).isDirectory()) return;

            getFileDataFromPath(`${path}/${file}`, file);
            // getTotalVideoMinutes(`${path}/${file}`);

        })
    });
}

function getFileDataFromPath(path, filename) {
    fs.stat(path, async (err, stats) => {
        if (err) {
            console.error(err);
            return;
        }
        // Example output: 2024-11-27T19:45:36.000Z
        // console.log(stats.mtime);
        // Convert the timestamp to a date of the format: Day-Month-Year in 24 hour format timezone Amsterdam
        const date = new Date(stats.mtime).toLocaleString('nl-NL', {
            timeZone: 'Europe/Amsterdam',
            hour12: false
        });
        console.log(`${filename} date: ${date}`);
        await createFoldersOfDates(date.split(',')[0]);
    });
}

async function createFoldersOfDates(date) {
    // Create folders based on the date
    // Example: 2024-11-27T19:45:36.000Z
    // Create folder: 27-11-2024

    fs.mkdir(date, { recursive: true }, async (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Folder ${date} created`);
    }, async (result) => {
        if (result) {
            console.error(result);
            return;
        }
    });
}

async function copyFileToFolder(path, filename) {

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