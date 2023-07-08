import { Request, Response } from "express";
import { randomStringPost } from "../Services/sp";
import unidecode from "unidecode";
import { NewsModel } from "../Model/News_Models";
import { deleteImageFromCloudinary } from "../Controller/Post"

var publicId: any;
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
        return res.json(newPost);
    } catch (error) {
        deleteImageFromCloudinary(publicId)
        console.log(error);
        return res.status(500).json({ message: 'Internal server error:' + error });
    }
}

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

async function deleteNews(req: Request, res: Response) {
    const id = req.params.Id
    try {
        await NewsModel.findOneAndDelete({ id: id })
        return res.json({ message: "Đã xóa bài viết" })
    } catch (error) {
        res.status(500).json(error)
    }
}

async function loadNews(req: Request, res: Response) {
    const newsId = req.params.id
    const news = await NewsModel.find({ id: newsId })
    if (!news) {
        res.status(505).json({ message: "Bài viết không tồn tại" });
    } else {
        res.json(news)
    }
}

async function loadAllNews(req: Request, res: Response) {
    const allnews = await NewsModel.find()
    res.json(allnews)
}

export const News = {
    get_CreateNews,
    post_CreateNews,
    updateNews,
    deleteNews,
    loadNews,
    loadAllNews
}