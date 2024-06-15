import express from "express";
import {middleware} from  "../../middleware/jwt"
import { Contact } from "../Display_Controller/Contact";

const Contact_Router=express();

Contact_Router.get('/getcontact', Contact.getContact)

Contact_Router.post('/createcontact', middleware, Contact.createContact);

Contact_Router.post('/updatecontact', middleware, Contact.updateContact);

export default Contact_Router