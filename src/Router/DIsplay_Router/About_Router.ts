import express from "express";
import { middleware } from "../../middleware/jwt";
import { About } from "../../Controller/Display/About";
import { midlleware_file } from "../../middleware/file";

const About_Router = express();

About_Router.post('/createabout', middleware, midlleware_file, About.createAbout);

About_Router.post('/updateabout/:id', middleware, midlleware_file, About.updateAbout);

About_Router.post('/deleteabout/:id', middleware, midlleware_file, About.deleteAbout);

About_Router.get('/allabout', middleware, About.allAbout)

export default About_Router