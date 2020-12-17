// Controller for POST request to '/upload'

//required packages
const multer  = require('multer');
const { v4: uuid, validate } = require('uuid');

//storage location for uploaded pdf files
const uploadDir = "./server/data/upload/";

//max file size
const maxSize = 10 * 1000000; //10 megabytes

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(validate(req.cookies.uuid)) {
            return cb(null, uploadDir);
        } else {
            return cb(new Error('Invalid uuid on request header.'));
        }
    },
    filename: (req, file, cb) => {
        const newFilename = req.cookies.uuid + '.pdf';
        cb(null, newFilename);
    },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: (req, file, cb) => {
        if(file.mimetype == 'application/pdf') {
            return cb(null, true);
        }
        return cb(new Error('Unsupported file type.'));
    }
}).single('selectedFile');

const checkCookie = (req, res) => {
    if(req.cookies.uuid === undefined) {
        let value = uuid();
        req.cookies.uuid = value;
    }
    return;
}

exports.pdfPost = async (req, res) => {
    await checkCookie(req, res);
    await upload(req, res, (err) => {
        if(err) {
            console.error(err);
        }
    });
    let key = 'uuid';
    let value = req.cookies.uuid;
    let oneHour = 1000 * 60 * 60;
    res.cookie(key, value, {
        maxAge: oneHour,
        path: '/',
        sameSite: 'Lax',
    });
    res.send();
}
