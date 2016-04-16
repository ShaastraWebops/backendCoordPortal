var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, 'server/api/img/uploads/' + req.params.departmentName);
  },

  changeDest: function(dest, req, res) {
    var newDestination = dest + req.params.departmentName;
    var stat = null;
    try {
        stat = fs.statSync(newDestination);
    } catch (err) {
        fs.mkdirSync(newDestination);
    }
    if (stat && !stat.isDirectory()) {
        throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
    }
    return newDestination
	},

  filename: function (req, file, cb) {
    var ext = file.mimetype.split('/')[1];
    return cb(null, file.originalname);
  }
})

exports.storage = storage;

