import express from "express";
import { News } from "../Controller/News";
import { middleware } from "../middleware/jwt"
import { midlleware_file } from "../Services/sp";

const news_Router = express();

news_Router.get('/createNews', News.get_CreateNews)

news_Router.post('/createNews', midlleware_file, News.post_CreateNews)

news_Router.post('/updateNews/:id', midlleware_file, News.updateNews)

news_Router.post('/deleteNews/:id', News.deleteNews)

news_Router.post('/News/:id', News.loadNews)

news_Router.post('/AllNews', News.loadAllNews)

export default news_Router;