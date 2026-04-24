const AUDIT_CRITERIA = {
    "1. Website": [
        { "item": "Giao diện website", "check": "Visual High-Quality: Sử dụng hình ảnh thực tế của quán (không dùng ảnh stock), ánh sáng tốt, kích thích vị giác." },
        { "item": "Thông tin cửa hàng, google map", "check": "Thông tin NAP (Name, Address, Phone) khớp 100% với Google Business. Tích hợp Google Maps API để dẫn đường ngay. Hiển thị trạng thái Đóng/Mở cửa thời gian thực." },
        { "item": "Chức năng đặt bàn", "check": "Quy trình tối giản: Khách có thể đặt chỗ trong vòng chưa đầy 1 phút (không bắt buộc đăng ký tài khoản)." },
        { "item": "Liên kết Đa kênh (Multi-channel)", "check": "Các nút liên kết đến Facebook, Instagram, TikTok rõ ràng. Tích hợp nút Chat (WhatsApp/Messenger) để hỗ trợ khách nhanh." },
        { "item": "Tối ưu hóa Thực đơn (Digital Menu)", "check": "Có tích hợp menu quán. Hình ảnh thực tế cho từng món ăn thay vì dùng ảnh mạng." },
        { "item": "Tracking & Analytics", "check": "Gắn mã theo dõi hành vi (Heatmap). Setup mục tiêu (Goal) cho nút Đặt bàn/Gọi điện." },
        { "item": "Chính sách & Pháp lý (Legal)", "check": "Đầy đủ trang Impressum, Privacy Policy (đặc biệt quan trọng tại Đức/EU theo luật GDPR)." }
    ],
    "2. Google Business": [
        { "item": "Tối ưu hóa Thông tin (SEO Profile)", "check": "Tên hiển thị: Chứa [Tên quán] + [Từ khóa ngách/Địa điểm]. Danh mục chính xác (Ví dụ: Nhà hàng Việt Nam). Mô tả (Bio) chứa từ khóa món đặc trưng và khu vực." },
        { "item": "Local SEO & Uy tín (Social Proof)", "check": "Review trung bình > 4.3. Có đánh giá mới trong vòng 30 ngày. Phản hồi chuyên nghiệp cho tất cả review. Khách nhắc đến tên món ăn trong bài đánh giá." },
        { "item": "Hình ảnh & Video (Visual)", "check": "Số lượng: Có ít nhất 20+ ảnh thực tế (Món ăn, Không gian, Menu, Mặt tiền). Có ảnh mới trong 1 tháng qua. Có video ngắn quay không gian hoặc quy trình phục vụ." },
        { "item": "Điều hướng & Chuyển đổi (Conversion)", "check": "Nút 'Đặt bàn', 'Website', 'Gọi điện' hoạt động chính xác. Menu kỹ thuật số được nhập đầy đủ món và giá vào phần Menu của Google." }
    ],
    "3. Fanpage": [
        { "item": "Tối ưu hóa Profile (SEO Bio)", "check": "Tên trang chứa [Tên thương hiệu] + [Từ khóa chính]. Tiểu sử < 150 ký tự chứa từ khóa ngách, địa điểm. Username đồng nhất, dễ nhớ." },
        { "item": "Nội dung bài đăng", "check": "Duy trì 1-2 Reels/tuần. Cover có tiêu đề chữ to. 3 giây đầu video gây chú ý. Bài đăng đủ tiêu đề, nội dung, hashtag." },
        { "item": "Điều hướng WhatsApp", "check": "Nút 'Gửi tin nhắn WhatsApp' dưới Bio. Link wa.me tại phần website. Có mẫu tin nhắn trả lời tự động." }
    ],
    "4. Instagram": [
        { "item": "Tối ưu hóa Profile (SEO Bio)", "check": "Sử dụng thẻ địa lý (Location Tag) chính xác cho từng bài đăng/Stories." },
        { "item": "Reels & Video (Viral & Visual)", "check": "Cover thiết kế chữ tiêu đề to trên Grid. Chất lượng video chuẩn 1080x1920 (9:16), ánh sáng tự nhiên, không mờ nhòe." },
        { "item": "Hình ảnh bài đăng", "check": "Hình ảnh nét rõ ràng, chuẩn tỷ lệ 1:1. Bài đăng đầy đủ tiêu đề, thông tin và hashtag." }
    ]
};
