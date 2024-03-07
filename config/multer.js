const multer = require('multer');

const storage = multer.diskStorage({

    destination: (req, file, cb)=> 
    {
        cb(null, 'uploads/');
    },

    filename: (req, file, cb) => 
    {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '_' + uniqueSuffix);
    }

});

module.exports = storage;