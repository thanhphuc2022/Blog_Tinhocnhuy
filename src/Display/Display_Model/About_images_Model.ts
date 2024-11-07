import mongoose, { Schema, Document } from "mongoose";

interface About_images extends Document {
    link_Images: string,
    public_id: string,
}

const About_imagesSchema: Schema = new Schema<About_images>({
    link_Images: { type: String, required: true },
    public_id: { type: String, required: true },
}, { collection: 'About_images' });
const About_images_Model = mongoose.model<About_images>('About_images', About_imagesSchema);
export default About_images_Model