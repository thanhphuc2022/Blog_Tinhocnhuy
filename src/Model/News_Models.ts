import mongoose, { Schema, Document } from "mongoose";

interface News extends Document {
    id: string,
    title: string,
    description: string,
    avatar: string,
    content: string,
    username: string,
    views: number,
    date: string
}

const newsSchema: Schema = new Schema<News>({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, },
    description: { type: String, required: false },
    avatar: { type: String, required: true, },
    content: { type: String, required: true, },
    username: { type: String, required: true, },
    views: { type: Number, default: 0, },
    date: { type: String, default: () => new Date().toLocaleDateString() },
}, { collection: 'News' })

const NewsModel = mongoose.model<News>('News', newsSchema);

export { News, NewsModel }