const express = require('express');
const router = express.Router();
const apiconfig = require('../apiconfig');
const multer = require('multer')
var fs = require("fs");
const sqlite3 = require('sqlite3').verbose();


const storage = multer.diskStorage({
    destination : function(req, file, cb) {
        var uploadpath = apiconfig.apppath + "/public/"
        cb(null, uploadpath )
    },
    filename : function(req, file, cb){
        var mfilenm = new Date().toISOString().replace( /:/g,'') 
        cb(null, mfilenm + "_" + file.originalname)
    }
})

const filefilter = (req, file ,cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/bmp' ) {
        cb(null,true)
    }else {
        cb(null,false)
    }
}

const upload = multer({ storage : storage , fileFilter : filefilter })


router.post('/proof', upload.single('photo'), function(req, res, next)  {
    res.send({
        success : true,
        message : "File uploaded successfully",
        filenm : req.file.path
    })
});

/*
router.post('/proof', function(req, res, next)  {
    const file = req.files.photo;
//    const proofType = req.data.proofType;
    var uploadpath = apiconfig.apppath + "/files/"


    const date = new Date()
//    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' }) 
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' }) 
    const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat .formatToParts(date ) 
    
    var fileNm = `${year}-${month}-${day }_` + file.name

    file.mv( uploadpath + fileNm, function(err, result){
        if(err){
            res.send({
                success : false,
                message : err
            })

        } else {
            res.send({
                success : true,
                message : "File uploaded successfully",
                filenm : uploadpath + fileNm
            })
        }
    })

});
*/

router.post('/sign', function(req, res, next)  {

    var dataURL = req.body.img;

    var matches = dataURL.match(/^data:.+\/(.+);base64,(.*)$/);
    var buffer = new Buffer.from(matches[2], 'base64');

//    var savePath = path.resolve(__dirname + '../../../tmp/'  + Math.floor(Math.random() * 1000000) + '.png');

    var uploadpath = apiconfig.apppath + "/public/"
    var mfilenm = new Date().toISOString().replace( /:/g,'')  + "sign.png"
    var mfullpath = uploadpath +  mfilenm

    fs.writeFileSync(mfullpath, buffer);
    
    res.send({
        success : true,
        message : "File uploaded successfully",
        filenm : mfullpath
    })
});


router.post('/delsign', function(req, res, next)  {
    var fileNm = ""
    var folderNm = ""
    
    var db = new sqlite3.Database( apiconfig.sysdb, sqlite3.OPEN_READWRITE, function(err)  {
        if (err) {
            res.json(err.message) ; 
          } 
               db.all("SELECT CO_ID , CO_NAME, COUNTRY, UPLOADFOLDER FROM COMPANY", [], function(err, rows)  {
                if (err) {
                    folderNm = "C:/guestcheckin/api"
                    fileNm = folderNm + '/' + req.body.filenm
                    db.close();
                } else {
                    folderNm = rows[0].uploadfolder

                    fileNm = folderNm + '/' + req.body.filenm
                    db.close();

                    if (fs.existsSync(fileNm)) {
                        fs.unlink(fileNm, (err) => {
                            if (err) {
                                res.send({ success : false, message : err, filenm : fileNm  }) 
                            } else  {
                                res.send({ success : true, message : 'File removed successfully', filenm : fileNm  }) 
                            }                  
                        })
                    }else {
                        res.send({ success : false, message : 'File not found', filenm : fileNm  }) 
                    }
                }
            });
        });

});





function done(req, res) {
    var uploadpath = apiconfig.apppath + "/public/"
    var mfilenm = new Date().toISOString().replace( /:/g,'')  + "sign.png"
    var mfullpath = uploadpath +  mfilenm
    console.log(mfullpath)

    fs.writeFile(mfullpath, req.rawBody, 'binary', function(err){
        if (err) throw err;

        // Save file to S3
    })   
}


function writeFileToSystem(buf)
{
    var uploadpath = apiconfig.apppath + "/public/"
    var mfilenm = new Date().toISOString().replace( /:/g,'')  + "sign.png"
    var mfullpath = uploadpath +  mfilenm
    fs.writeFile(mfullpath, buf, function(err) {
        console.log("The file was saved!");
    });
}


module.exports = router;
