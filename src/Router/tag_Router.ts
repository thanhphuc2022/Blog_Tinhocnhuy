import express from "express";
import { Tag } from "../Controller/Tag";

const tag_Router = express();

tag_Router.post('/api/createtag', Tag.createTag);

tag_Router.post('/api/deletetag', Tag.deleteTag);

tag_Router.get('/api/alltag', Tag.loadAllTag);

export default tag_Router