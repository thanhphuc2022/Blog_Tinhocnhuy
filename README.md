# 🌐 Enterprise CMS Backend - Node.js + MongoDB + TinyMCE

Hệ thống quản lý nội dung (CMS) dành cho website doanh nghiệp, hỗ trợ quản trị tin tức, banner, logo, nội dung tùy chỉnh với trình soạn thảo WYSIWYG (TinyMCE). 
Hệ thống được bảo vệ bằng xác thực JWT và phân quyền người dùng. API được triển khai trên Vercel.

---

## 🚀 Tính năng nổi bật

- ✅ Quản lý tin tức: thêm / sửa / xoá / xem
- ✅ Quản lý nội dung trang: giới thiệu, liên hệ, chính sách...
- ✅ Quản lý banner, logo, ảnh tĩnh
- ✅ Trình soạn thảo **TinyMCE** WYSIWYG + upload hình ảnh
- ✅ **Xác thực JWT** cho quản trị viên
- ✅ **Phân quyền người dùng** (Admin / Editor)
- ✅ **Đăng nhập, quản lý tài khoản**
- ✅ Gửi **email khi có người liên hệ**
- ✅ RESTful API dễ tích hợp frontend (SPA hoặc SSR)
- ✅ Triển khai nhanh trên **Vercel**

---

## 🛠️ Công nghệ sử dụng

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **TinyMCE Cloud**
- **JWT** + **bcrypt** (xác thực người dùng)
- **Nodemailer** (gửi email liên hệ)
- **Multer** (upload ảnh)
- **Cloudinary / Local Storage**
- **Vercel** (triển khai backend serverless)

---

## 🔐 Hệ thống người dùng

| Role      | Quyền |
|-----------|-------|
| **Admin** | Toàn quyền (quản lý người dùng, nội dung, banner, v.v.) |
| **Editor** | Quản lý nội dung (tin tức, trang, hình ảnh) |

---
Tạo file .env:
# Cấu hình máy chủ
SERVER_PORT=

# JWT Token cho xác thực bảo mật
JWT_SECRET_REFRESH=
JWT_SECRET_ACCESS=

# Cấu hình Cloudinary để lưu trữ hình ảnh
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_SECRET=
CLOUDINARY_API_KEY=

# Tài khoản MongoDB
MONGO_USERNAME=
MONGO_PASSWORD=

# Thông tin email dùng để gửi liên hệ và thông báo
emailAddress=
emailPassword=

---

