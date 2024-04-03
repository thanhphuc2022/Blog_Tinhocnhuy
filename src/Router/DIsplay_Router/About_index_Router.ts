import express from "express";
import { middleware } from "../../middleware/jwt";
import { About_Index } from "../../Controller/Display/About_index";
import { midlleware_file } from "../../middleware/file";

const About_index_Router = express();

About_index_Router.post('/createaboutcontent', middleware, midlleware_file, About_Index.createAbout_Index);

About_index_Router.post('/updateaboutcontent', middleware, midlleware_file, About_Index.updateAbout_Index);

About_index_Router.post('/deleteaboutcontent', middleware, About_Index.deleteAbout_Index);

About_index_Router.get('/aboutcontent', middleware, About_Index.findAboutIndex);

export default About_index_Router