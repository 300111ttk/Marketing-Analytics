// BỘ TIÊU CHÍ CHUẨN CỦA BILLIG GLOBAL
const MASTER_CRITERIA = [
    { group: "1. WEBSITE", item: "Pháp lý (Impressum/GDPR)", detail: "Kiểm tra sự hiện diện của trang Impressum và Datenschutz theo luật Đức." },
    { group: "1. WEBSITE", item: "NAP & Google Maps API", detail: "Tên, địa chỉ, SĐT khớp 100% GMB và có nhúng bản đồ." },
    { group: "1. WEBSITE", item: "Chuyển đổi & WhatsApp", detail: "Nút đặt bàn < 1 phút, nút WhatsApp Sticky nổi bật." },
    { group: "1. WEBSITE", item: "Digital Menu & Hình ảnh", detail: "Thực đơn online có ảnh món ăn thực tế, không chỉ là PDF." },
    { group: "2. GOOGLE BUSINESS", item: "SEO Profile & Từ khóa", detail: "Tên quán chuẩn SEO [Tên + Từ khóa ngách], mô tả đầy đủ." },
    { group: "2. GOOGLE BUSINESS", item: "Uy tín & Review (>4.3)", detail: "Điểm đánh giá cao và có phản hồi 100% khách hàng." },
    { group: "2. GOOGLE BUSINESS", item: "Visual (Ảnh > 20 & Video)", detail: "Có trên 20 ảnh thực tế và video quy trình/không gian." },
    { group: "2. GOOGLE BUSINESS", item: "Tiện ích Conversion", detail: "Nút gọi, đặt chỗ, menu hoạt động chính xác." },
    { group: "3. FACEBOOK", item: "Thông tin & SEO Page", detail: "Đầy đủ thông tin NAP, giờ mở cửa và từ khóa trong Bio." },
    { group: "3. FACEBOOK", item: "Điều hướng WhatsApp", detail: "Có nút WhatsApp Business kết nối trực tiếp wa.me." },
    { group: "3. FACEBOOK", item: "Chất lượng Content", detail: "Hình ảnh bài đăng sắc nét, đúng tỷ lệ, cập nhật thường xuyên." },
    { group: "4. INSTAGRAM", item: "SEO Bio & Link điều hướng", detail: "Linktree/Website chuyên nghiệp, Bio chứa địa điểm." },
    { group: "4. INSTAGRAM", item: "Tần suất Reels (1-2/tuần)", detail: "Duy trì video ngắn 1080x1920 định kỳ hàng tuần." },
    { group: "4. INSTAGRAM", item: "Visual & Thẩm mỹ", detail: "Ảnh chuẩn 1:1/4:5, phong cách kích thích vị giác khách hàng." }
];

async function startAudit() {
    const name = document.getElementById('storeName').value;
    const data = document.getElementById('storeData').value;
    const btn = document.getElementById('btnRun');

    if (!name || !data) return alert("Vui lòng nhập đủ thông tin!");

    btn.innerText = "HỆ THỐNG ĐANG QUÉT TIÊU CHÍ CHUẨN...";
    btn.disabled = true;

    // Ép AI đối soát theo danh sách MASTER_CRITERIA
    const prompt = `Bạn là chuyên gia thẩm định Marketing tại Billig Global.
    Nhiệm vụ: Phân tích khách hàng [${name}] dựa trên dữ liệu: [${data}].
    
    BẠN PHẢI ĐÁNH GIÁ ĐÚNG VÀ ĐỦ CÁC TIÊU CHÍ SAU:
    ${JSON.stringify(MASTER_CRITERIA)}

    YÊU CẦU TRẢ VỀ JSON DUY NHẤT:
    {
      "score": "Điền %",
      "pass": "Số mục đạt",
      "fail": "Số mục lỗi",
      "details": [
        {
          "group": "Tên nhóm",
          "item": "Tên hạng mục",
          "status": "ĐẠT hoặc KHÔNG ĐẠT",
          "note": "Lý do dựa trên dữ liệu và hành động cần làm"
        }
      ],
      "advice": "Lời khuyên chiến lược để chốt hợp đồng."
    }`;

    try {
        const response = await fetch(CONFIG.LOCAL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: CONFIG.MODEL_NAME,
                messages: [{ "role": "user", "content": prompt }],
                temperature: 0.1 // Giữ AI luôn ổn định
            })
        });

        const result = await response.json();
        const content = result.choices[0].message.content.replace(/```json|```/g, "").trim();
        const res = JSON.parse(content);

        renderUI(res, name);

    } catch (e) {
        console.error(e);
        alert("Lỗi: Kiểm tra LM Studio (Enable CORS) hoặc cấu trúc dữ liệu!");
    } finally {
        btn.innerText = "BẮT ĐẦU PHÂN TÍCH";
        btn.disabled = false;
    }
}

function renderUI(res, name) {
    document.getElementById('resName').innerText = "AUDIT: " + name;
    document.getElementById('resScore').innerText = res.score;
    document.getElementById('resPass').innerText = res.pass;
    document.getElementById('resFail').innerText = res.fail;
    document.getElementById('resAdvice').innerText = res.advice;
    
    const tbody = document.getElementById('resBody');
    // Hiển thị đầy đủ các tiêu chí AI đã trả về
    tbody.innerHTML = res.details.map(d => `
        <tr>
            <td style="font-weight: bold; color: #1a73e8;">${d.group}</td>
            <td>${d.item}</td>
            <td>
                <span class="status-tag ${d.status.toUpperCase().includes('ĐẠT') && !d.status.toUpperCase().includes('KHÔNG') ? 'pass' : 'fail'}">
                    ${d.status}
                </span>
            </td>
            <td style="font-size: 13px;">${d.note}</td>
        </tr>
    `).join('');

    document.getElementById('report-area').style.display = 'block';
}

function downloadPDF() {
    const element = document.getElementById('report-area');
    html2pdf().from(element).save(`Audit_${document.getElementById('storeName').value}.pdf`);
}
