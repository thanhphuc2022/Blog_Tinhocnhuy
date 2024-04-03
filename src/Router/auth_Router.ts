import express from "express";
import { auth } from "../Controller/auth";
import { upload } from "../uploadfile";
import { middleware, requestRefreshToken } from "../middleware/jwt"
import { contact, contact2 } from "../Services/mailer";
const auth_Router = express();

auth_Router.post('/register', auth.get_Register);

auth_Router.post('/postregister', auth.post_Register);

// auth_Router.get('/login', auth.getLogin);

auth_Router.post('/login', auth.login);

auth_Router.get('/forgotpass', auth.get_ForgotPassword);

auth_Router.post('/forgotpassword', auth.post_ForgotPassword);

auth_Router.post('/changePass', middleware, auth.changePassword);

auth_Router.post('/putAccount', middleware, auth.putAccount);

auth_Router.post('/contact', contact2);

auth_Router.post('/refreshtoken', requestRefreshToken);

auth_Router.get('/upload', upload.get_Uploadfile);

auth_Router.post('/upload', upload.post_Uploadfile);

export default auth_Router;