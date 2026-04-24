async function startAudit() {
    const name = document.getElementById('storeName').value;
    const data = document.getElementById('storeData').value;
    const btn = document.getElementById('btnRun');

    if (!name || !data) return alert("Vui lòng nhập đầy đủ thông tin!");

    btn.innerText = "LOCAL AI ĐANG ĐỐI SOÁT...";
    btn.disabled = true;

    // Prompt chi tiết dựa trên tài liệu 3 ảnh của Billig Global
    const prompt = `Bạn là chuyên gia thẩm định Marketing cao cấp tại Billig Global. Hãy phân tích khách hàng: ${name} dựa trên dữ liệu: ${data}.
HÃY CHẤM ĐIỂM NGHIÊM KHẮC THEO CÁC TIÊU CHÍ CHI TIẾT SAU:

1. NHÓM WEBSITE (Tối ưu chuyển đổi & Pháp lý):
   - UI/UX: Hình ảnh thực tế (không dùng ảnh mạng), giao diện đồng nhất thương hiệu.
   - NAP: Tên, Địa chỉ, SĐT phải khớp 100% với Google Map.
   - Chuyển đổi: Nút đặt bàn nổi bật, đặt bàn xong trong < 1 phút. Nút WhatsApp nổi (Sticky).
   - Menu: Có Digital Menu (PDF hoặc Web), không phải ảnh chụp mờ.
   - Pháp lý (Đức): Bắt buộc có Impressum và Datenschutz (GDPR).
   - Kỹ thuật: Có cài Tracking (Google Analytics/Ads Goal), Heatmap.

2. NHÓM GOOGLE BUSINESS (SEO Local & Uy tín):
   - SEO Profile: Tên quán chuẩn (Tên + Từ khóa ngách), mô tả đầy đủ từ khóa.
   - Local SEO: Điểm đánh giá > 4.3, có phản hồi 100% các review mới.
   - Visual: Tối thiểu 20 ảnh thực tế (Món ăn, Không gian, Đội ngũ), có Video ngắn.
   - Tiện ích: Đã kích hoạt nút Đặt hẹn, Menu, và danh mục sản phẩm.

3. NHÓM SOCIAL (Facebook & Instagram):
   - Branding: Ảnh Bio/Profile chuyên nghiệp, có Linktree hoặc Link Website.
   - Content: Duy trì 1-2 Reels/tuần (Bắt buộc cho quán ăn). 
   - Kỹ thuật: Có nút gửi tin nhắn WhatsApp, có Location Tag trong bài viết.
   - Chất lượng: Ảnh bài đăng chuẩn 1080x1920 (Reels) hoặc 1080x1350 (Post).

YÊU CẦU TRẢ VỀ JSON DUY NHẤT:
{
  "score": "Điền %",
  "pass": "Số mục đạt",
  "fail": "Số mục lỗi",
  "details": [
    {"item": "Website: Pháp lý (Impressum/GDPR)", "status": "ĐẠT/KHÔNG ĐẠT", "note": "..."},
    {"item": "Website: Nút đặt bàn & WhatsApp", "status": "ĐẠT/KHÔNG ĐẠT", "note": "..."},
    {"item": "GMB: SEO Profile & Từ khóa", "status": "ĐẠT/KHÔNG ĐẠT", "note": "..."},
    {"item": "GMB: Chất lượng ảnh (>20 ảnh)", "status": "ĐẠT/KHÔNG ĐẠT", "note": "..."},
    {"item": "Social: Tần suất Reels (1-2/tuần)", "status": "ĐẠT/KHÔNG ĐẠT", "note": "..."},
    {"item": "Social: Điều hướng WhatsApp/Link", "status": "ĐẠT/KHÔNG ĐẠT", "note": "..."}
  ],
  "advice": "Lời khuyên chiến lược để khách hàng thấy cần phải thuê Billig Global ngay."
}`;

    try {
        const response = await fetch(CONFIG.LOCAL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: CONFIG.MODEL_NAME,
                messages: [{ "role": "user", "content": prompt }],
                temperature: 0.2
            })
        });

        const json = await response.json();
        const content = json.choices[0].message.content.replace(/```json|```/g, "").trim();
        const res = JSON.parse(content);

        // Hiển thị dữ liệu
        document.getElementById('resName').innerText = name;
        document.getElementById('resScore').innerText = res.score;
        document.getElementById('resPass').innerText = res.pass;
        document.getElementById('resFail').innerText = res.fail;
        document.getElementById('resAdvice').innerText = res.advice;
        
        document.getElementById('resBody').innerHTML = res.details.map(d => `
            <tr>
                <td>${d.item}</td>
                <td><span class="status-tag ${d.status.includes('ĐẠT') && !d.status.includes('KHÔNG') ? 'pass' : 'fail'}">${d.status}</span></td>
                <td>${d.note}</td>
            </tr>
        `).join('');

        document.getElementById('report-area').style.display = 'block';

    } catch (e) {
        console.error(e);
        alert("Lỗi kết nối LM Studio. Nhớ bật 'Enable CORS' trong Server Settings!");
    } finally {
        btn.innerText = "PHÂN TÍCH HỆ THỐNG";
        btn.disabled = false;
    }
}

function downloadPDF() {
    const element = document.getElementById('report-area');
    const opt = {
        margin: 10,
        filename: 'Audit-Marketing-BilligGlobal.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}
