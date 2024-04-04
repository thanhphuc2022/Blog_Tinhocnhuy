import { Request, Response } from "express";
// import { About_Index_Model } from "../../Model/Display_Model/About_index_Model";
import { About_Index_Model } from "../Display_Model/About_index_Model";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../../Services/sp";
import { content } from "googleapis/build/src/apis/content";

interface TempMulterFile extends Express.Multer.File {
    buffer: Buffer;
}

async function createAbout_Index(req: Request, res: Response) {
    let images: string | null = null;
    const content_about_index = req.body.content_about_index;
    const link_images = req.file as TempMulterFile;
    if (!link_images) {
        return res.status(400).json("No image provided.")
    } else {
        images = await uploadImageToCloudinary(link_images);
    }
    try {
        About_Index_Model.create({
            // id: 'About_Index',
            content: content_about_index,
            images: images
        })
        return res.json({ message: "Thêm thành công" })
    } catch (error) {
        return res.status(500).json(error)
    }

}

async function updateAbout_Index(req: Request, res: Response) {
    let images: string | null = null;
    const content_about_index = req.body.content_about_index;
    const linkimages = req.file as TempMulterFile;
    try {
        if (!linkimages) {
            await About_Index_Model.updateOne({
                content: content_about_index
            })
            return res.json({ message: "Cập nhật thành công" })
        } else {
            const old_about_index = await About_Index_Model.findOne({})
            const old_image = old_about_index?.images
            if (old_image) {
                const urlObject = new URL(old_image);
                const path = urlObject.pathname;
                const idImage = path.substring(path.indexOf('Tinhocnhuy/'), path.lastIndexOf('.'));
                await deleteImageFromCloudinary(idImage)
            }
            images=await uploadImageToCloudinary(linkimages);
            await About_Index_Model.updateOne({
                content:content_about_index,
                images:images
            })
            return res.json({ message: "Cập nhật thành công" })
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

async function deleteAbout_Index(req: Request, res: Response) {
    try {
        await About_Index_Model.deleteOne()
        return res.json({ message: "Đã xoá" })
    } catch (error) {
        return res.status(500).json(error)
    }
}

async function findAboutIndex(req: Request, res: Response) {
    const aboutindex = await About_Index_Model.find({})
    return res.json(aboutindex)
}

export const About_Index = {
    createAbout_Index,
    updateAbout_Index,
    deleteAbout_Index,
    findAboutIndex
}