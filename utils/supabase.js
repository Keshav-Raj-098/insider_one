import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';


const UploadOnSupabase = async (filePath,bucketName) => {
    dotenv.config();

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const fileName = path.basename(filePath);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream'; // Fallback MIME type
    const fileBuffer = fs.readFileSync(filePath);
    

    try {
        const { data, error } = await supabase.storage
            .from(`${bucketName}`) // Ensure this is your actual bucket name
            .upload(`public/${fileName}`, fileBuffer, {
                contentType: mimeType, // Specify MIME type
                upsert:true,
            });
            

        if (error) {
            console.error('Upload error:', error.message);
            return null;
        }

        // Generate public URL
        const link =  supabase.storage
            .from(`${bucketName}`)
            .getPublicUrl(`public/${fileName}`);

        if (!link) {
            console.error('Error generating public URL');
            return null;
        }
        // console.log(link.data.publicUrl);
        return link.data.publicUrl;

    } catch (error) {
        console.error('Unexpected error:', error.message);
        return null;
    } 
    finally {
        // Clean up the file regardless of success or failure
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};

export default UploadOnSupabase;
