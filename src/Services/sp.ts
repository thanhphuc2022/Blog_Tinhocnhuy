import multer from "multer";
//hàm tạo chuỗi ngẫu nhiên tù 1->10 kí tự
function generateRandomStringPost() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    const length = Math.floor(Math.random() * 10) + 1; // Độ dài chuỗi từ 1 đến 10 (có thể điều chỉnh)

    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }
    return result;
}

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
// Sử dụng hàm để tạo chuỗi ngẫu nhiên
export const randomStringPost = generateRandomStringPost();