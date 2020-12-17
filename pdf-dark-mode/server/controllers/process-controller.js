// Controller for POST request to '/pdf'

const fs = require('fs');
const { execFile } = require('child_process');
const program = './server/cpp/' + 'pdf-dark-mode';
const inputDir = './server/data/upload/';
const outputDir = './server/data/download/';

function checkDir(dir) {
    return new Promise((resolve, reject) => {
        fs.stat(dir, function (err) {
            if (err) {
                fs.mkdir(dir, (err) => {
                    if (err) {
                        reject(err);
                    }
                })
            }
            resolve();
        })
    })
}

function getTime() {
    let date = new Date();
    let time = date.getDate() + "/"
                + (date.getMonth()+1)  + "/" 
                + date.getFullYear() + " @ "  
                + date.getHours() + ":"  
                + date.getMinutes() + ":" 
                + date.getSeconds();
    return time;
}

function runProgram(program, args, uuid) {
    return new Promise((resolve, reject) => {
      execFile(program, args, (err, stdout, stderr) => {
        if (stderr) {
          console.error(
              '----\nError: ID='+uuid+
              '\n'+getTime()+
              '\n'+stderr+'----');
        } else if (err) {
          reject(err);
        }
        resolve();
      })
    })
}

exports.pdfPost = async (req, res, next) => {
    const uuid = req.cookies.uuid;
    //check for option selected, default to 2
    let option = (req.cookies.option != null) ? req.cookies.option : 2;
    const args = [inputDir + uuid + '.pdf', outputDir + uuid + '.pdf', option];
    await checkDir (args[0])
    .then(() => runProgram(program, args, uuid))
    .catch((err) => {
        console.error(err);
        res.status(500).send('Conversion failed.');
    });

    res.send('Conversion complete.');
}