import express from "express";
import { middleware } from "../middleware/jwt";
import { authorize } from "../middleware/authorize";
import { Auth } from "../Controller/Auth";

const Auth_Router = express();

Auth_Router.get('/allaccount', middleware, authorize, Auth.AllAccount);

Auth_Router.post('/updateauth/:username', middleware, authorize, Auth.updateRole);

export default Auth_Router;