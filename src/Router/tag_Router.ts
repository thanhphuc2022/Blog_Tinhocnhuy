import express from "express";
import { Tag } from "../Controller/Tag";

const tag_Router = express();

tag_Router.post('/createtag', Tag.createTag);

tag_Router.post('/deletetag', Tag.deleteTag);

tag_Router.get('/alltag', Tag.loadAllTag);

export default tag_Router