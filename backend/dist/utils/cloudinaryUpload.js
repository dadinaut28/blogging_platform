import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
export const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "blog_posts_covers" }, (error, result) => {
            if (error)
                return reject(error);
            if (!result)
                return reject("Upload failed");
            resolve(result.secure_url);
        });
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};
//# sourceMappingURL=cloudinaryUpload.js.map