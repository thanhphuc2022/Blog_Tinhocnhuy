import dotenv from 'dotenv';

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@demonodejs.r29hvtz.mongodb.net/Blog?retryWrites=true&w=majority`;

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1337;

const ACCESS = process.env.JWT_SECRET_ACCESS || '';
const REFRESH = process.env.JWT_SECRET_REFRESH || '';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const CONFIG = {
    //link database 
    mongo: {
        url: MONGO_URL
    },
    //cổng server
    Server: {
        port: SERVER_PORT
    },

    jwt: {
        access: ACCESS,
        refresh: REFRESH
    },
    cloudinary: {
        cloud_name: CLOUD_NAME,
        api_key: API_KEY,
        api_secret: API_SECRET
    }
};