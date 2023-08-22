import { NextFunction, Request, Response } from "express";
import { PostModel } from "../Model/Post_Model";
import unidecode from "unidecode";
import CategoriesModel from "../Model/Categories_Model";
import { v2 as cloudinary } from 'cloudinary';
import { uploadImageToCloudinary, randomStringPost, deleteImageFromCloudinary, convertToSlug } from "../Services/sp";
import fs from "fs";

//UPLOAD HÌNH ẢNH LÊN CLOUDINARY KHI CHỌN HÌNH ẢNH TẠO BÀI VIẾT
var publicId: any;
async function uploadImagesPost(req: Request, res: Response) {
    const file = req.file?.path;
    if (!file) {
        console.error('No file uploaded');
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        const result = await cloudinary.uploader.upload(file, { folder: 'Tinhocnhuy' });
        res.json({ location: result.secure_url });
        publicId = result.public_id
        //link anh
        // console.log({ location: result.secure_url})
        //id anh, bao gom fodel/id
        console.log({ publicId: result.public_id })
        // Sau khi tải lên thành công và trả về link ảnh, có thể xóa tệp tin tạm trên máy chủ
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

//GET THÊM BÀI VIẾT
async function post(req: Request, res: Response) {
    // res.render('createpost')
    res.render('createpostLocal')
}

//POST THÊM BÀI VIẾT
async function createPost(req: Request, res: Response) {
    let thumbnailUrl: string | null = null;
    try {
        const title = req.body.title;
        const description = req.body.description;
        const category = req.body.category;
        const content = req.body.content;
        const linkfile = req.file;

        if (title == '' || description == '' || category == '' || content == '') {
            deleteImageFromCloudinary(publicId)
            return res.json({ message: "Vui lòng điền đầy đủ thông tin" })
        }

        if (!linkfile) {
            return res.status(400).json({ error: 'No image provided.' });
        }

        // thumbnailUrl = await uploadImageToCloudinary(linkfile)

        const Cate = await CategoriesModel.findOne({ name: category })
        if (!Cate) {
            deleteImageFromCloudinary(publicId)
            return res.json({ message: "Không tìm thấy Danh mục" })
        }
        //mã hóa slug
        const slug = convertToSlug(title);

        const idPost = await PostModel.findOne({ id: slug })
        var newIdPost
        if (!idPost) {
            newIdPost = slug
        } else {
            newIdPost = slug + '-' + randomStringPost
        }
        thumbnailUrl = await uploadImageToCloudinary(linkfile)

        const newPost = await PostModel.create({
            id: newIdPost,//Id Post
            title: title,
            description: description,
            avatar: thumbnailUrl,
            content: content,
            // images: [publicId],
            // username: req.userId,
            username: "admindemo",
            categoryId: Cate.id,
        });

        fs.unlink(linkfile.path, (err) => {
            if (err) {
                console.error('Error deleting uploaded file:', err);
            } else {
                console.log('Uploaded file deleted:', linkfile.path);
            }
        });

        return res.json({ message: "Đã thêm bài viết" });
    } catch (err) {
        deleteImageFromCloudinary(publicId)
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

//CẬP NHẬT BÀI VIẾT
async function updatePost(req: Request, res: Response) {
    const id = req.params.id;
    const { title, description, content, category } = req.body;
    const linkfile = req.file;

    if (!linkfile) {
        return res.status(400).json({ error: 'No image provided.' });
    }

    const thumbnailUrl = await uploadImageToCloudinary(linkfile)

    const Cate = await CategoriesModel.findOne({ name: category })
    // if (title == '' || description == '' || category == '' || content == '' || linkfile == '') {
    //     deleteImageFromCloudinary(publicId)
    //     return res.json({ message: "Vui lòng điền đầy đủ thông tin" })
    // }
    if (!Cate) {
        deleteImageFromCloudinary(publicId)
        return res.json({ message: "Không tìm thấy Danh mục" })
    }
    try {
        await PostModel.findOneAndUpdate({ id: id }, {
            title: title,
            description: description,
            avatar: thumbnailUrl,
            content: content,
            categoryId: Cate.id
        })
        return res.json({ message: "Cập nhật thành công" })
    } catch (error) {
        deleteImageFromCloudinary(publicId)
        return res.status(500).json(error)
    }
}

//XÓA BÀI VIẾT
async function deletePost(req: Request, res: Response) {
    const id = req.params.id;
    try {
        const post = await PostModel.findOne({ id: id });
        const imageRegex = /src="([^"]+)"/g;
        const imageUrlMatches = post?.content.match(imageRegex);
        if (imageUrlMatches) {
            await Promise.all(imageUrlMatches.map(async (imageUrlMatch) => {
                const imageUrl = imageUrlMatch.match(/src="([^"]+)"/)?.[1];
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

        await PostModel.deleteOne({ id: id });
        return res.json({ message: "Đã xóa bài viết" });
    } catch (error) {
        res.status(500).json(error);
    }
}

//CHI TIẾT BÀI VIẾT
async function loadPost(req: Request, res: Response) {
    const postId = req.params.id;
    const post = await PostModel.findOne({ id: postId })
    if (!post) {
        res.status(505).json({ message: "Bài viết không tồn tại" });
    } else {
        // res.render('post', { post: post });
        res.json(post)
    }
}

//TÌM KIẾM BÀI VIẾT THEO USERNAME
async function loadPost_Username(req: Request, res: Response) {
    try {
        const post = await PostModel.find({
            username: req.userId
        })
        return res.json(post);
    } catch (error) {
        console.log(error)
    }
}

//DANH SÁCH BÀI VIẾT THEO LOẠI
async function loadPost_Categories(req: Request, res: Response) {
    const categorieId = req.params.id
    try {
        const post = await PostModel.find({ categoryId: categorieId })
        //        const category = await CategoriesModel.findOne({ id: categorieId })
        return res.json(post);
    } catch (error) {
        console.log(error)
    }
}

//HIỂN THỊ LƯỢT XEM
async function loadViews(req: Request, res: Response) {
    const postId = req.params.id;
    const post = await PostModel.findOne({ id: postId })
    if (!post) {
        return res.status(505).json("Bài viết không tồn tại");
    } else {
        return res.json(`Số lượt xem của bài đăng ${postId}: ${post.views}`);
    }
}

//ĐẾM LƯỢT XEM
const countViews = async (req: Request, res: Response) => {
    const postId = req.params.id;
    const post = await PostModel.findOne({ id: postId })
    if (!post) {
        return res.status(505).json("Bài viết không tồn tại");
    } else {
        await PostModel.findOneAndUpdate({ id: postId }, { $inc: { views: 1 } })
        return res.json(`Số lượt xem của bài đăng ${postId}: ${post.views}`);
    }
}

export const Post = {
    post,
    createPost,
    updatePost,
    deletePost,
    loadPost,
    loadPost_Username,
    loadPost_Categories,
    loadViews,
    countViews,
    uploadImagesPost
}