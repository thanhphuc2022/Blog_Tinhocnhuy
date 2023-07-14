import express from "express";
import { News } from "../Controller/News";
import { middleware } from "../middleware/jwt"
import { midlleware_file } from "../middleware/file";

const news_Router = express();

news_Router.get('/createNews', News.get_CreateNews)

news_Router.post('/createNews', midlleware_file, News.post_CreateNews)

news_Router.post('/updateNews/:id', midlleware_file, News.updateNews)

news_Router.post('/deleteNews/:id', News.deleteNews)

news_Router.get('/News/:id', News.loadNews)

news_Router.get('/AllNews', News.loadAllNews)

news_Router.get('/api/randomNews', News.loadRandomNews)

news_Router.post('/api/uploadimagesNews', midlleware_file, News.uploadImagesNews)

export default news_Router;