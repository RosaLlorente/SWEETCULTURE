import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {

    const extension = file.mimetype.split("/")[1].toLowerCase();

    let folder = "Otros";

    if (req.originalUrl.includes("addUser")) {
      folder = "ProfileUserImage";
    }

    if (req.originalUrl.includes("addProduct")) {
      folder = "ProductImage";
    }

    return {
      folder,
      resource_type: "image",
      format: extension,
      public_id: `${Date.now()}-${file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-")}`,
    };
  },
});

export const deleteImage = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    console.log('Imagen eliminada:', result);
    return result;
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    throw error;
  }
};

export const updateImage = (filePath, folder, oldPublicId, callback) => {
  // Solo eliminar imagen anterior si la carpeta es ProfileUserImage
  if (folder === "ProfileUserImage" && oldPublicId) {
    cloudinary.uploader.destroy(oldPublicId, function(errDestroy, resultDestroy) {
      console.log("Imagen antigua de usuario eliminada:", resultDestroy);

      cloudinary.uploader.upload(filePath, { folder, resource_type: "image" }, function(errUpload, resultUpload) {
        if (errUpload) {
          console.error("Error al subir nueva imagen:", errUpload);
          if (callback) callback(null); // enviar null para indicar error
        } else {
          console.log("Nueva imagen subida:", resultUpload);
          if (callback) callback(resultUpload); // enviar resultado
        }
      });
    });
  } else {
    // Subir nueva imagen sin eliminar nada
    cloudinary.uploader.upload(filePath, { folder, resource_type: "image" }, function(errUpload, resultUpload) {
      if (errUpload) {
        console.error("Error al subir nueva imagen:", errUpload);
        if (callback) callback(null); // enviar null
      } else {
        console.log("Nueva imagen subida:", resultUpload);
        if (callback) callback(resultUpload);
      }
    });
  }
};





export const upload = multer({ storage });
