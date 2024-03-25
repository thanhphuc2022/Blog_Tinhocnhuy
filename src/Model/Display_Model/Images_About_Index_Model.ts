import mongoose, { Schema, Document } from "mongoose";

interface Images_About_Index extends Document {
    public_id: string,
    link_Images: string,
}

const Images_About_IndexSchema: Schema = new Schema<Images_About_Index>({
    public_id:{type:String, required:true},
    link_Images: { type: String, required: true }
}, { collection: 'Images_About_Index' });
const Images_About_Index_Model = mongoose.model<Images_About_Index>('Images_About_Index', Images_About_IndexSchema);
export default Images_About_Index_Model;