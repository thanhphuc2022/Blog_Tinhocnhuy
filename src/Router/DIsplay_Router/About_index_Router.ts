import  express  from "express";
import {middleware} from "../../middleware/jwt";
import { About_Index } from "../../Controller/Display/About_index";

const About_index_Router=express();

About_index_Router.post('/createaboutcontent', middleware, About_Index.createAbout_Index);

About_index_Router.post('/updateaboutcontent', middleware, About_Index.updateAbout_Index);

About_index_Router.post('/deleteaboutcontent', middleware, About_Index.deleteAbout_Index);

export default About_index_Router