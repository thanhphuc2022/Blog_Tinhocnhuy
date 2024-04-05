import express from "express";
import { middleware } from "../../middleware/jwt";
import { midlleware_file } from "../../middleware/file";
import { Content_Banner } from "../Display_Controller/Content_Banner";

const Content_Banner_Router=express();

Content_Banner_Router.post('/createcontentbanner', middleware, midlleware_file, Content_Banner.createContentBanner);

Content_Banner_Router.post('/updatecontentbanner/:id', middleware, midlleware_file, Content_Banner.updateContentBanner);

Content_Banner_Router.post('/deletecontentbanner/:id', middleware, midlleware_file, Content_Banner.deleteContent_Banner);

Content_Banner_Router.get('/allcontentbanner', middleware, Content_Banner.allContent_Banner);

export default Content_Banner_Router