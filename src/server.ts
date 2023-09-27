import express, { Request, Response } from "express";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";
import { CONFIG } from "./config/config";
import token_Router from "./Router/token_Router";
import auth_Router from "./Router/auth_Router";
import post_Router from "./Router/post_Router";
import news_Router from "./Router/news_Router";
import types_Router from "./Router/types_news_Router";
import categories_Router from "./Router/categories_Router";
import tag_Router from "./Router/tag_Router";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import { midlleware_file } from "./middleware/file";
import { v2 as cloudinary } from 'cloudinary';

import dotenv from 'dotenv';
dotenv.config();

import { google } from "googleapis";

const date = new Date();

//npm start
//HIEN GIO KHI BUILD
const formatted = date.toTimeString();
//ket noi csdl mongoDB
mongoose
    .connect(CONFIG.mongo.url)
    .then(() => {
        console.log('Connect to MongoDB');
    })
    .catch((error) => {
        console.log(error);
    });

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//KET NOI cloudinary/
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//     { public_id: "olympic_flag" },
//     function (error, result) { console.log(result); });

// Sử dụng cookie-parser middleware
app.use(cookieParser());
// Xét session
app.use(
    session({
        secret: 'this-is-a-long-and-complex-secret-key',
        resave: false,
        saveUninitialized: true,
    })
);
// const oauth2Client = new google.auth.OAuth2(CONFIG.google_drive.client_id, CONFIG.google_drive.client_secret, CONFIG.google_drive.redirect_uri);
// const drive = google.drive({
//     version: 'v3',
//     auth: oauth2Client
// })
// // export const uploadgg = async () => {
// //     try {
// //         const createFile = await drive.files.create({
// //             requestBody: {
// //                 name: "demo.jpg",
// //                 mimeType: 'image/jpg'
// //             },
// //             media: {
// //                 mimeType: 'image/jpg',
// //                 body: fs.createReadStream(path.join(__dirname, '../public/images/f1.jpg'))
// //             }
// //         })
// //         console.log(createFile.data)
// //     } catch (error) {
// //         console.log(error)
// //     }
// // }

// export const uploadGoogle = async () => {
//     // try {
//     //     const credentials = path.join(__dirname, '../googleapi.json')
//     //     const auth = new google.auth.GoogleAuth({
//     //         keyFile: credentials,
//     //         scopes: ['https://www.googleapis.com/auth/drive']
//     //     })
//     //     const driveService = google.drive({
//     //         version: 'v3',
//     //         auth
//     //     })
//     //     const filedata = {
//     //         name: 'f1.jpg',
//     //         parents: [CONFIG.google_drive.folderid]
//     //     }
//     //     const media = {
//     //         MimeType: 'image/jpg',
//     //         body: fs.createReadStream(path.join(__dirname, '../public/images/f1.jpg'))
//     //     }
//     //     const response = await driveService.files.create({
//     //         requestBody: filedata,
//     //         media: media,
//     //         fields: 'id'

//     //     })
//     //     return response.data.id
//     // } catch (error) {
//     //     console.log(error)
//     // }
// }

// // Configure Google Drive API credentials
// const credentials = require(path.join(__dirname, '../googleapi.json'))
// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ['https://www.googleapis.com/auth/drive.file'],
// });

// export async function uploadgg() {
//     // const { file } = req;
//     const drive = google.drive({ version: 'v3', auth });
//     const folderId = '1vNO2Q4EcnzhqAkid3OQUcs28UseEaj-5';

//     try {
//         const response = await drive.files.create({
//             requestBody: {
//                 name: 'f1.jpg',
//                 mimeType: 'image/jpg',
//                 parents: [folderId],
//             },
//             media: {
//                 mimeType: 'image/jpg',
//                 body: fs.createReadStream(path.join(__dirname, '../public/images/f1.jpg'))
//             },
//         });
//         console.log({ fileId: response.data.id })
//         // res.status(200).json({ fileId: response.data.id });
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         //   res.status(500).json({ error: 'Failed to upload file' });
//     }
// };

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    res.setHeader('Access-Control-Allow-Origin', 'https://tinhocnhuy.com',);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', "true");

    // Pass to next layer of middleware
    next();
});


app.get('/', function (req: Request, res: Response) {
    // uploadgg()
    res.json("Trang này của tao")
})

//token
app.use('/api', token_Router);
//auth
app.use('/api', auth_Router);
//post
app.use('/api', post_Router);
//news
app.use('/api', news_Router);
//categories
app.use('/api', categories_Router);
//types_news
app.use('/api', types_Router);
//tag
app.use('/api', tag_Router);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, '../public')));
// app.use(express.static('public'));

app.listen(CONFIG.Server.port, () => {
    console.log(`Example app listening at http://localhost:${CONFIG.Server.port} (${formatted})`)
})