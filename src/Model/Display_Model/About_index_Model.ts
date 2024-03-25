import mongoose, { Schema, Document } from "mongoose";

interface About_Index extends Document {
    // id: string,
    content: string
}

const about_indexSchema: Schema = new Schema<About_Index>({
    // id: { type: String, required: true },
    content: {type: String, required: true }
}, { collection: 'About_Index' })

const About_Index_Model=mongoose.model<About_Index>('About_index', about_indexSchema);

export{About_Index, About_Index_Model}