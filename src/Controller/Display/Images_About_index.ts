import { Request, Response } from "express";
import { v2 as cloudinary } from 'cloudinary';
import { uploadImageToCloudinary, deleteImageFromCloudinary, convertToSlug, convertToSlug2 } from "../../Services/sp"
import Images_About_Index_Model from "../../Model/Display_Model/Images_About_Index_Model";

interface TempMulterFile extends Express.Multer.File {
    buffer: Buffer;
}

async function createImageAboutIndex(req: Request, res: Response) {
    let images_about_index: string | null = null;
    const link_image_about = req.file as TempMulterFile;
    if (!link_image_about) {
        return res.status(400).json("No image provided.")
    } else {
        images_about_index = await uploadImageToCloudinary(link_image_about);
        //lấy public_id của hình ảnh-lưu vào cloud
        const parts =images_about_index.split('/');
        const id=parts[parts.length - 1];
        // const id = images_about_index.split('/').slice(-1)[0].split('.')[0];
        await Images_About_Index_Model.create({
            public_id: id,
            link_Images: images_about_index
        })
        return res.json({ message: "Thêm hình ảnh thành công" })
    }
}

async function deleteImageAboutIndex(req: Request, res: Response) {
    try {
        const idImage=req.params.id;
    await Images_About_Index_Model.deleteOne({public_id:idImage})
    await deleteImageFromCloudinary(idImage)
    return res.json("Đã xoá")
    } catch (error) {
        return res.status(400).json(error)
    }
}


export const Images_About_Index = {
    createImageAboutIndex,
    deleteImageAboutIndex,
}