import multer from "multer";

//// Cấu hình Multer để xử lý tải lên hình ảnh dành cho lấy dữ liệu từ bộ nhớ đệm
const diskStorage = multer.memoryStorage();

//midlleware xử lý lấy dữ liệu từ form 
export const midlleware_file = multer({ storage: diskStorage }).single("file");