import express, { NextFunction, Request, Response } from "express";
import path from "path";
import multer from "multer";
import * as http from 'http';
import formidable from "formidable";
import EditorUploadResponse from "@tinymce/tinymce-react";
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { CONFIG } from "./config/config";

const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "src/uploads");
    },
    filename: (req, file, callback) => {
        // let math = ["images/png", "images/jpeg"];
        // if (math.indexOf(file.mimetype) === -1) {
        //     let errorMess = new Error(`The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`);
        //     return callback(errorMess, " ");
        // }

        let fileName = `images/${file.originalname}`;
        callback(null, fileName);
    }
});

export let uploadFile = multer({ storage: diskStorage }).single("file");


// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     folder: 'uploads', // Tên thư mục lưu trữ hình ảnh
//     allowedFormats: ['jpg', 'png'], // Định dạng hình ảnh cho phép
//   });

cloudinary.config({
    cloud_name: CONFIG.cloudinary.cloud_name,
    api_key: CONFIG.cloudinary.api_key,
    api_secret: CONFIG.cloudinary.api_secret
})
// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//     { public_id: "olympic_flag" },
//     function (error, result) { console.log(result); });



async function get_Uploadfile(req: Request, res: Response) {
    res.render('demo.ejs')
    // res.render('createpost')
}
async function post_Uploadfile(req: Request, res: Response) {
    //đã cấu hình ở server.ts-đóng cmt
    uploadFile(req, res, (error) => {
        if (error) {
            return res.send(`Error when trying to upload: ${error}`);
        }
        res.sendFile(path.join(`${__dirname}/uploads/${req.file?.filename}`));
    })

    // const imagePath = path.join(`${__dirname}/uploads/images/${req.file?.filename}`)

    // const imageContent = fs.readFileSync(imagePath);
    // // Tên thư mục trên Cloudinary
    // const folderName = 'Tinhocnhuy';
    // // Tải lên hình ảnh lên Cloudinary
    // cloudinary.uploader.upload(imagePath, { folder: folderName }, (error, result) => {
    //     if (error) {
    //         console.error('Lỗi khi tải lên hình ảnh:', error);
    //     } else {
    //         console.log('Hình ảnh đã được tải lên thành công:', result);
    //     }
    // });

}

export const upload = {
    get_Uploadfile,
    post_Uploadfile
}