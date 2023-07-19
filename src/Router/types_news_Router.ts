import express from "express"
import { Types_News } from "../Controller/Types_News"
import { middleware } from "../middleware/jwt";
const types_Router = express();

types_Router.post('/api/createtypes', Types_News.createTypes_News);

types_Router.post('/api/updatetypes/:id', Types_News.updateTypes_News);

types_Router.post('/api/deletetypes/:id', Types_News.deleteType_News);

types_Router.get('/api/loadtype', Types_News.loadTypes_News);

types_Router.get('/api/alltype', Types_News.loadAllType_News);

export default types_Router;