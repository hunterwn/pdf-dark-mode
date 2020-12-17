// Controller for GET request to '/pdf'

const fs = require('fs');
const outputDir = "./server/data/download/";

function checkDir(dir) {
  return new Promise(resolve => {
    fs.stat(dir, function (err) {
      if (err) {
        fs.mkdir(outputDir, (err) => {
          if (err) {
            console.error(err);
          }
        })
      }
      resolve();
    })
  })
}

exports.pdfGet = async (req, res) => {
  const uuid = req.cookies.uuid;
  await res.download(outputDir + uuid + '.pdf', (err) => {
    if (err) {
      console.error(err);
    }
  })
}