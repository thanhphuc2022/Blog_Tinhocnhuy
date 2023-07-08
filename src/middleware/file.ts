import multer from "multer";

// Cấu hình Multer để xử lý tải lên hình ảnh
const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "public/images");
    },
    //xử lý tên hình ảnh
    filename: (req, file, cb) => {
        //ĐỔI TÊN HÌNH ẢNH THEO NGÀY THÁNG NĂM
        // const currentDate = new Date();
        // const formattedTime = currentDate.toLocaleTimeString('en-US', { hour12: true }).replace(/:/g, '.').replace(/\s/g, '');
        // const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
        // const fileName = `${formattedTime}-${formattedDate}-${file.originalname}`;
        // cb(null, fileName);
        //GIỮ NGUYÊN TÊN HÌNH ẢNH
        cb(null, file.originalname)
    }
});

//midlleware xử lý lấy dữ liệu từ form 
export const midlleware_file = multer({ storage: diskStorage }).single("file");