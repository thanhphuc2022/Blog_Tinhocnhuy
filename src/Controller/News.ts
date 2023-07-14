import { Request, Response } from "express";
import { randomStringPost } from "../Services/sp";
import unidecode from "unidecode";
import { NewsModel } from "../Model/News_Models";
import { deleteImageFromCloudinary } from "../Controller/Post"
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

//UPLOAD HÌNH ẢNH LÊN CLOUDINARY KHI CHỌN HÌNH ẢNH TẠO BÀI VIẾT
var publicId: any;
async function uploadImagesNews(req: Request, res: Response) {
    const file = req.file?.path;
    if (!file) {
        console.error('No file uploaded');
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        const result = await cloudinary.uploader.upload(file, { folder: 'Tinhocnhuy' });
        res.json({ location: result.secure_url });
        publicId = result.public_id
        console.log({ publicId: result.public_id })
        fs.unlink(file, (err) => {
            if (err) {
                console.error('Error deleting uploaded file:', err);
            } else {
                console.log('Uploaded file deleted:', file);
            }
        });

    } catch (err) {
        res.status(500).json({ error: 'Upload failed:' + err });
    }
}

//THÊM TIN TỨC
async function get_CreateNews(req: Request, res: Response) {
    res.render('createNews.ejs')
}

async function post_CreateNews(req: Request, res: Response) {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const linkfile = req.file?.filename;
        const content = req.body.content;
        if (title == '' || description == '' || content == '' || linkfile == '') {
            deleteImageFromCloudinary(publicId)
            return res.json({ message: "Vui lòng điền đầy đủ thông tin" })
        }
        //mã hóa slug
        const titleNoAccent = unidecode(title);
        const encodedStr = encodeURIComponent(titleNoAccent).replace(/%20/g, '-');
        const slug = decodeURIComponent(encodedStr);

        const idNews = await NewsModel.findOne({ id: slug })
        var newIdNews
        if (!idNews) {
            newIdNews = slug
        } else {
            newIdNews = slug + '-' + randomStringPost
        }
        const newPost = await NewsModel.create({
            id: newIdNews,//Id Post
            title: title,
            description: description,
            avatar: linkfile,
            content: content,
            username: "admindemo",
        });
        // return res.json(newPost);
        return res.json({ message: "Thêm thành công" })
    } catch (error) {
        deleteImageFromCloudinary(publicId)
        console.log(error);
        return res.status(500).json({ message: 'Internal server error:' + error });
    }
}

//CẬP NHẬT TIN TỨC
async function updateNews(req: Request, res: Response) {
    const id = req.params.id;
    const { title, description, content } = req.body;
    const linkfile = req.file?.filename;
    if (title == '' || description == '' || content == '' || linkfile == '') {
        deleteImageFromCloudinary(publicId)
        return res.json({ message: "Vui lòng điền đầy đủ thông tin" })
    }
    try {
        await NewsModel.findOneAndUpdate({ id: id }, {
            title: title,
            description: description,
            avatar: linkfile,
            content: content
        })
        return res.json({ message: "Cập nhật thành công" })
    } catch (error) {
        deleteImageFromCloudinary(publicId)
        return res.status(500).json(error)
    }
}

//XÓA TIN TỨC
async function deleteNews(req: Request, res: Response) {
    const id = req.params.id;
    try {
        const post = await NewsModel.findOne({ id: id });
        const imageRegex = /<img src="([^"]+)"/g;
        const imageUrlMatches = post?.content.match(imageRegex);
        if (imageUrlMatches) {
            await Promise.all(imageUrlMatches.map(async (imageUrlMatch) => {
                const imageUrl = imageUrlMatch.match(/<img src="([^"]+)"/)?.[1];
                if (imageUrl) {
                    const urlObject = new URL(imageUrl);
                    const path = urlObject.pathname;
                    const idImage = path.substring(path.indexOf('Tinhocnhuy/'), path.lastIndexOf('.'));
                    console.log(idImage);
                    await deleteImageFromCloudinary(idImage);
                }
            }));
        }
        await NewsModel.deleteOne({ id: id });
        return res.json({ message: "Đã xóa bài viết" });
    } catch (error) {
        res.status(500).json(error);
    }
}

//HIỂN THỊ CHI TIẾT TIN TỨC
async function loadNews(req: Request, res: Response) {
    const newsId = req.params.id
    const news = await NewsModel.findOne({ id: newsId })
    if (!news) {
        res.status(505).json({ message: "Bài viết không tồn tại" });
    } else {
        // res.render('news.ejs', { news: news.content })
        res.json(news)
    }
}

//HIỂN THỊ TẤT CẢ TIN TỨC
async function loadAllNews(req: Request, res: Response) {
    try {
        const allNews = await NewsModel.find().select('title description avatar');
        return res.json(allNews)
        // res.render('listnews', { news: allNews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
//HIỂN THỊ NGẪU NHIÊN TIN TỨC
async function loadRandomNews(req: Request, res: Response) {
    const numberOfRecords = 5;
    await NewsModel.aggregate([
        { $sample: { size: numberOfRecords } },
        { $limit: numberOfRecords },
        { $project: { _id: 0, title: 1, description: 1, avatar: 1 } }
    ])
        .exec()
        .then(results => {
            res.json(results)
        })
        .catch(err => {
            console.log(err)
        });
}

export const News = {
    get_CreateNews,
    post_CreateNews,
    updateNews,
    deleteNews,
    loadNews,
    loadAllNews,
    loadRandomNews,
    uploadImagesNews
}