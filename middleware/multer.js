import multer from "multer"
const storage = multer.memoryStorage()
// for single upload files 
export const singleUpload = multer({storage}).single("file")
// for multipal uploads atleast 5 files
export const multipalUploads = multer({storage}).array("files",5)