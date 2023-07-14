import express from "express";
import { Post } from "../Controller/Post";
import { middleware } from "../middleware/jwt"
import { midlleware_file } from "../middleware/file";

const post_Router = express();

post_Router.get('/createPost', Post.post);

post_Router.post('/createPost', midlleware_file, Post.createPost);

post_Router.post('/updatePost/:id', midlleware_file, Post.updatePost);

post_Router.post('/deletePost/:id', Post.deletePost);

post_Router.get('/loadPost', middleware, Post.loadPost_Username);

post_Router.get('/loadPostCategories', Post.loadPost_Categories);

post_Router.get('/bv/:id', Post.loadPost);

post_Router.get('/post/:id', Post.loadViews);

post_Router.get('/count/:id', Post.countViews);

//upload hình ảnh lên cloudinary , sử dụng cho Bài viết và Tin tức
post_Router.post('/uploadimagesPost', midlleware_file, Post.uploadImagesPost);

export default post_Router;