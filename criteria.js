const AUDIT_CRITERIA = {
    "1. Website": [
        {
            "item": "Giao diện website",
            "check": "Visual High-Quality: Sử dụng hình ảnh thực tế của quán (không dùng ảnh stock), ánh sáng tốt, kích thích vị giác."
        },
        {
            "item": "Thông tin cửa hàng & Google Map",
            "check": "Thông tin NAP: Tên, Địa chỉ, SĐT khớp 100% với Google Business. Tích hợp bản đồ trực quan cho phép khách bấm dẫn đường ngay."
        },
        {
            "item": "Chức năng đặt bàn",
            "check": "Quy trình tối giản: Khách có thể đặt chỗ trong vòng chưa đầy 1 phút (không bắt buộc đăng ký tài khoản)."
        },
        {
            "item": "Liên kết Đa kênh (Multi-channel)",
            "check": "Các nút liên kết Facebook, Instagram, TikTok rõ ràng. Tích hợp nút Chat (WhatsApp/Messenger) hỗ trợ khách nhanh."
        },
        {
            "item": "Tối ưu hóa Thực đơn (Digital Menu)",
            "check": "Có tích hợp menu quán với hình ảnh thực tế cho từng món ăn thay vì dùng ảnh mạng."
        },
        {
            "item": "Tracking & Analytics",
            "check": "Gắn mã theo dõi hành vi (Heatmap). Setup mục tiêu (Goal) cho các nút hành động như Đặt bàn/Gọi điện."
        },
        {
            "item": "Chính sách & Pháp lý (Legal)",
            "check": "Đầy đủ trang Impressum, Privacy Policy (đặc biệt quan trọng tại Đức/EU theo luật GDPR)."
        }
    ],
    "2. Google Business": [
        {
            "item": "Tối ưu hóa Thông tin (SEO Profile)",
            "check": "Tên hiển thị chứa [Tên quán] + [Từ khóa ngách/Địa điểm]. Danh mục chính xác. Mô tả chứa từ khóa món đặc trưng và khu vực."
        },
        {
            "item": "Local SEO & Uy tín (Social Proof)",
            "check": "Review trung bình > 4.3. Có đánh giá mới trong 30 ngày. Phản hồi chuyên nghiệp cho tất cả review. Khách nhắc đến từ khóa món ăn trong review."
        },
        {
            "item": "Hình ảnh & Video (Visual)",
            "check": "Số lượng: Ít nhất 20+ ảnh thực tế (Món ăn, Không gian, Menu, Mặt tiền). Cập nhật ảnh mới hàng tháng. Có video quay không gian/phục vụ."
        },
        {
            "item": "Điều hướng & Chuyển đổi (Conversion)",
            "check": "Các nút Đặt bàn, Website, Gọi điện hoạt động chính xác. Menu kỹ thuật số được nhập đầy đủ tên món và giá vào phần Menu của Google."
        }
    ],
    "3. Fanpage Facebook": [
        {
            "item": "Tối ưu hóa Profile (SEO Bio)",
            "check": "Tên trang chứa [Tên thương hiệu] + [Từ khóa chính]. Tiểu sử < 150 ký tự chứa từ khóa ngách. Username đồng nhất, dễ nhớ."
        },
        {
            "item": "Nội dung bài đăng",
            "check": "Duy trì tối thiểu 1-2 Reels/tuần. Cover có tiêu đề chữ to. Nội dung hấp dẫn trong 3s đầu. Bài đăng đủ tiêu đề, thông tin và hashtag."
        },
        {
            "item": "Điều hướng WhatsApp",
            "check": "Cài đặt nút 'Gửi tin nhắn WhatsApp' dưới Bio/Quảng cáo. Link wa.me trực tiếp. Mẫu tin nhắn chào mừng tự động."
        }
    ],
    "4. Instagram": [
        {
            "item": "Tối ưu hóa Profile (SEO Bio)",
            "check": "Sử dụng Location Tag cho từng bài đăng/Stories để tối ưu tìm kiếm địa phương."
        },
        {
            "item": "Reels & Video (Viral & Visual)",
            "check": "Thiết kế chữ tiêu đề to rõ trên Grid (Cover). Chất lượng video chuẩn 1080x1920 (9:16), ánh sáng tự nhiên, không mờ nhòe."
        },
        {
            "item": "Hình ảnh bài đăng",
            "check": "Hình ảnh nét, chuẩn tỷ lệ 1:1. Bài đăng đầy đủ tiêu đề, nội dung cửa hàng và hệ thống hashtag."
        }
    ]
};

// Xuất biến để sử dụng trong script.js (nếu dùng môi trường module)
// export default AUDIT_CRITERIA;
