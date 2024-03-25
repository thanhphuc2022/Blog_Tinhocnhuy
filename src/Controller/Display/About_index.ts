import { Request, Response } from "express";
import { About_Index_Model } from "../../Model/Display_Model/About_index_Model";

function createAbout_Index(req: Request, res: Response) {
    const content_about_index = req.body.content_about_index;
    try {
        About_Index_Model.create({
            id: 'About_Index',
            content: content_about_index
        })
        return res.json(content_about_index)
    } catch (error) {
        return res.status(500).json(error)
    }

}

async function updateAbout_Index(req: Request, res: Response) {
    const content_about_index = req.body.content_about_index;
    try {
        // await About_Index_Model.findOneAndUpdate({ id: 'About_Index' }, {
        //     content: content_about_index
        // })
        await About_Index_Model.updateOne({
            content: content_about_index
        })

        return res.json(content_about_index)
    } catch (error) {
        return res.status(500).json(error)
    }
}

async function deleteAbout_Index(req:Request, res:Response) {
    try {
        await About_Index_Model.deleteOne()
        return res.json({message: "Đã xoá"})
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const About_Index = {
    createAbout_Index,
    updateAbout_Index,
    deleteAbout_Index,
}