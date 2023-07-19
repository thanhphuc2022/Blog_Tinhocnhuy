import express, { Request, Response } from "express";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";
import { CONFIG } from "./config/config";
import auth_Router from "./Router/auth_Router";
import post_Router from "./Router/post_Router";
import news_Router from "./Router/news_Router";
import types_Router from "./Router/types_news_Router";
import categories_Router from "./Router/categories_Router";
import tag_Router from "./Router/tag_Router";
import bodyParser from "body-parser";
import path from "path";
import { v2 as cloudinary } from 'cloudinary';
const date = new Date();

const formatted = date.toUTCString();
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
    cloud_name: CONFIG.cloudinary.cloud_name,
    api_key: CONFIG.cloudinary.api_key,
    api_secret: CONFIG.cloudinary.api_secret
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
app.get('/home', function (req: Request, res: Response) {
    res.json("Trang này của tao")
})
//auth
app.use('/', auth_Router);
//post
app.use('/', post_Router);
//news
app.use('/', news_Router);
//categories
app.use('/', categories_Router);
//types_news
app.use('/', types_Router);
//tag
app.use('/', tag_Router);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, '../public')));
// app.use(express.static('public'));

app.listen(CONFIG.Server.port, () => {
    console.log(`Example app listening at http://localhost:${CONFIG.Server.port} (${formatted})`)
})