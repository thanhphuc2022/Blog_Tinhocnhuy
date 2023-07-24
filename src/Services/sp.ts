import { v2 as cloudinary } from 'cloudinary';
import unidecode from 'unidecode';
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
export const randomStringPost = generateRandomStringPost();

//HÀM XÓA HÌNH ẢNH ĐÃ UPLOAD LÊN COUDINARY
export async function deleteImageFromCloudinary(publicId: string) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Image deleted from Cloudinary:', result);
    } catch (err) {
        console.log('Error deleting image from Cloudinary:', err);
    }
}

//HÀM CHUYỂN CHUỔI TITLE CHO BÀI VIẾT
export function convertToSlug(title: string) {
    const titleNoAccent = unidecode(title);
    const encodedStr = titleNoAccent
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '') // Xóa các ký tự đặc biệt, chỉ giữ lại ký tự chữ cái, số, dấu gạch ngang và khoảng trắng.
        .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang.
        .replace(/-+/g, '-') // Nếu có nhiều hơn một dấu gạch ngang liền nhau thì thay thế bằng một dấu gạch ngang duy nhất.
        .replace(/^-|-$/g, ''); // Nếu đoạn kết quả bắt đầu hoặc kết thúc bằng dấu gạch ngang thì loại bỏ chúng.
    return encodedStr;
}