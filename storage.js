
import multer, { diskStorage } from "multer"
import path from "path"


const storage = diskStorage({
   destination : (req,file, cb)=>{
       cb(null, 'public/uploads')
   },
   filename : (req,file, cb) =>{
      const extension = path.extname(file.originalname)
      const newName = Date.now() + "-" + file.originalname
      cb(null, newName)
   }
})

const upload = multer({storage})

export default upload;


