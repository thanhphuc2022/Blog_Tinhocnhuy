import mongoose, { Schema, Document } from "mongoose";

interface Post extends Document {
    id: string,
    title: string,
    description: string,
    avatar: string,
    content: string,
    username: string,
    views: number,
    date: string,
    categoryId: string,
}
const postSchema: Schema = new Schema<Post>({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    avatar: { type: String, required: true },
    content: { type: String, required: true },
    username: { type: String, required: true },
    views: { type: Number, default: 0 },
    date: { type: String, default: () => new Date().toLocaleDateString() },
    categoryId: { type: String, ref: 'Category', required: true },
}, {
    collection: 'Post',
    // timestamps: true //hỗ trợ định dạng ngày tạo, ngày cập nhật 
});

const PostModel = mongoose.model<Post>('Post', postSchema);

// export default PostModel; 
export { Post, PostModel }