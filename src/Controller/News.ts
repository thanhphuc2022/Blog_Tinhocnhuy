import { Request, Response } from "express";
import { randomStringPost } from "../Services/sp";
import unidecode from "unidecode";
import { NewsModel } from "../Model/News_Models";
import Types_News_Model from "../Model/Types_News_Models"
import TagModel from "../Model/Tag_Models";
import { uploadImageToCloudinary, deleteImageFromCloudinary, convertToSlug } from "../Services/sp"
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
    let thumbnailUrl: string | null = null;
    try {
        const title = req.body.title;
        const description = req.body.description;
        const linkfile = req.file;
        const content = req.body.content;
        const nametypes = req.body.types;
        const tag = req.body.tag;

        if (title == '' || description == '' || content == '' || nametypes == '') {
            deleteImageFromCloudinary(publicId)
            return res.json({ message: "Vui lòng điền đầy đủ thông tin" })
        }

        if (!linkfile) {
            return res.status(400).json({ error: 'No image provided.' });
        }

        thumbnailUrl = await uploadImageToCloudinary(linkfile);

        const types = await Types_News_Model.findOne({ name: nametypes })
        if (!types) {
            deleteImageFromCloudinary(publicId)
            return res.json({ message: "Không tìm thấy danh mục bài viết" })
        }
        //mã hóa slug
        const slug = convertToSlug(title)

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
            avatar: thumbnailUrl,
            content: content,
            username: "admindemo",
            typesid: types.id,
            tag: tag
        });
        // return res.json(newPost);

        fs.unlink(linkfile.path, (err) => {
            if (err) {
                console.error('Error deleting uploaded file:', err);
            } else {
                console.log('Uploaded file deleted:', linkfile.path);
            }
        });

        return res.json({ message: "Thêm thành công" })
    } catch (error) {
        deleteImageFromCloudinary(publicId)
        console.log(error);
        return res.status(500).json({ message: 'Internal server error:' + error });
    }
}

//CẬP NHẬT TIN TỨC
async function updateNews(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const { title, description, content, nametypes, tag } = req.body;
        const linkfile = req.file;
        // if (title == '' || description == '' || content == '' || linkfile == '' || nametypes == '') {
        //     deleteImageFromCloudinary(publicId)
        //     return res.json({ message: "Vui lòng điền đầy đủ thông tin" })
        // }

        if (!linkfile) {
            return res.status(400).json({ error: 'No image provided.' });
        }

        const thumbnailUrl = await uploadImageToCloudinary(linkfile);

        const types = await Types_News_Model.findOne({ name: nametypes })
        if (!types) {
            deleteImageFromCloudinary(publicId)
            return res.json({ message: "Không tìm thấy Loại tin tức" })
        }
        const findtag = await TagModel.findOne({ name: tag })
        if (!findtag) {
            deleteImageFromCloudinary(publicId)
            return res.json({ message: "Không tìm thấy Tag" })
        }
        else {
            await NewsModel.findOneAndUpdate({ id: id }, {
                title: title,
                description: description,
                avatar: thumbnailUrl,
                content: content,
                typesid: types.id,
                tag: tag
            })
            return res.json({ message: "Cập nhật thành công" })
        }
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

        const idthumnail = post?.avatar
        if (idthumnail) {
            const urlObject = new URL(idthumnail);
            const path = urlObject.pathname;
            const idImage = path.substring(path.indexOf('Tinhocnhuy/'), path.lastIndexOf('.'));
            deleteImageFromCloudinary(idImage)
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
    //hiển thị tất cả bài viết
    // try {
    //     const allNews = await NewsModel.find().select('title description avatar');
    //     // return res.json(allNews)
    //     res.render('listnews', { news: allNews });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ error: 'Internal server error' });
    // }

    const page = parseInt(req.query.page as string) || 1;
    const limit = 9;
    const startIndex = (page - 1) * limit;
    try {
        const news = await NewsModel.find().select('id title description avatar date').skip(startIndex).limit(limit).exec();
        const totalNews = await NewsModel.countDocuments().exec();

        const paginationResult = {
            data: news,
            total: totalNews,
            pages: Math.ceil(totalNews / limit),
            currentPage: page,
            limit: limit,
        };

        // res.render('users', paginationResult);
        res.json(paginationResult)
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
}

//HIỂN THỊ NGẪU NHIÊN TIN TỨC
async function loadRandomNews(req: Request, res: Response) {
    try {
        const numberOfRecords = 5;
        const news = await NewsModel.aggregate([
            { $sample: { size: numberOfRecords } },
            { $limit: numberOfRecords },
            { $project: { _id: 0, title: 1, description: 1, avatar: 1 } }
        ])
        return res.json(news)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//DANH SÁCH BÀI VIẾT THEO DANH MỤC
async function loadNews_Types(req: Request, res: Response) {
    const typesid = req.params.id
    try {
        const news = await NewsModel.find({ typesid: typesid })
        return res.json(news);
    } catch (error) {
        console.log(error)
    }
}

//DANH SÁCH BÀI VIẾT THEO TAG
async function LoadNews_Tag(req: Request, res: Response) {
    const tagid = req.params.id
    try {
        const tag = await NewsModel.find({ tag: tagid })
        return res.json(tag)
    } catch (error) {
        console.log(error)
    }
}

//HIỂN THỊ 5 BÀI VIẾT CÓ NHIỀU LƯỢT XEM NHẤT TRONG NGÀY
async function LoadNews_Top5_ViewstoDay(req: Request, res: Response) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Lấy ngày hiện tại và đặt giờ về 00:00:00
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Ngày tiếp theo

        const topPosts = await NewsModel.find({ date: { $gte: today.toLocaleDateString(), $lt: tomorrow.toLocaleDateString() } })
            .sort({ views: -1 })
            .limit(5);
        return res.json(topPosts)
    } catch (error) {
        console.error(error);
    }
}

//HIỂN THỊ TOP 5 BÀI VIẾT MỚI NHẤT
async function top5LatestNews(req: Request, res: Response) {
    try {
        const top5LatestNews = await NewsModel.find()
            .sort({ date: -1 }) // Sắp xếp giảm dần theo trường "date"
            .limit(5) // Giới hạn chỉ lấy 5 bài viết
            .select('id title description avatar')
            .exec();
        res.json(top5LatestNews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

//HIỂN THỊ LƯỢT XEM
async function loadViews(req: Request, res: Response) {
    const newsId = req.params.id;
    const news = await NewsModel.findOne({ id: newsId })
    if (!news) {
        return res.status(505).json("Bài viết không tồn tại");
    } else {
        return res.json(`Số lượt xem của bài viết ${newsId}: ${news.views}`)
    }
}

//ĐẾM LƯỢT XEM
async function countViews(req: Request, res: Response) {
    const newsId = req.params.id;
    const news = await NewsModel.findOne({ id: newsId })
    if (!news) {
        return res.status(505).json("Bài viết không tồn tại");
    } else {
        await NewsModel.findOneAndUpdate({ id: newsId }, { $inc: { views: 1 } })
        return res.json(`Số lượt xem của bài viết ${newsId}: ${news.views}`)
    }
}

export const News = {
    get_CreateNews,
    post_CreateNews,
    updateNews,
    deleteNews,
    loadNews,
    loadAllNews,
    loadRandomNews,
    loadNews_Types,
    LoadNews_Tag,
    LoadNews_Top5_ViewstoDay,
    top5LatestNews,
    loadViews,
    countViews,
    uploadImagesNews
}