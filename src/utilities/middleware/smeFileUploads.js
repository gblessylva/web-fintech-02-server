const multer = require('multer');
const fs = require('fs')

const util = require('util')


const storage =  multer.diskStorage({
    destination: (req, file, cb) => {cb(null, 'uploads/smeVerify/')}

    ,
    filename: (req, file, cb) => {cb(null, new Date().toISOString().replace(/:/g, '-')+file.originalname)}

})

const fileFilter =(req, file, cb)=>{
    if(file.mimetype === "application/pdf" ){
        cb(null, true)
    }
    else{
        cb(new Error('Invalid file format. Only PDF is accepted formats'), false)
    }
}

const upload = multer({
    storage: storage, 
    fileFilter: fileFilter,
    limits: {
    fileSize: 1024 * 1024 * 1,
    }
})

const checkFiles =(req, res, next)=>{
    const files = req.files
    const converted = Object.values(files)
    if(converted.length < 3){
        converted.forEach(convert=>{
            convert.forEach(con=>{
                const path = con.path
                console.log(path)
                fs.unlink(path, (err)=>{
                    if(err){
                        throw err
                    }
                    console.log("deleted")
                })
                
                
            })
        })
        next()
    }else{
        console.log("files uploaded ")
        next()
    }

    
}

module.exports ={
    upload,
    checkFiles
}