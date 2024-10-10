import UploadOnSupabase from "../utils/supabase.js";

const uploadImage = async (req, res, next, bucketName) => {
    const imgfilePath =  req.file?.path;

    if (!imgfilePath) {
        console.log('Image not found');
        req.Posturl  = null; // Set Posturl  to null if image file path is missing
        return next(); // Call next middleware or route handler
    }

    

    try {
        const Posturl  = await UploadOnSupabase(imgfilePath, bucketName);

        if (!Posturl ) {
            console.log('Error occurred while uploading image');
            req.Posturl  = null; // Set Posturl  to null if upload fails
        } else {
            req.Posturl  = Posturl ; // Set the image link if upload succeeds
        }
    } catch (error) {
        console.error('Error during image upload:', error);
        req.Posturl  = null; // Set Posturl  to null in case of an error
    }

    next(); // Call next middleware or route handler
};



const uploadShortMiddleware  =  (bucketName) => {

    console.log(bucketName);

    return (req, res, next) => {
      uploadImage(req, res, next, bucketName);
    };
  };



export  {uploadImage,uploadShortMiddleware }