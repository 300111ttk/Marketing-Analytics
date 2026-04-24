// BỘ TIÊU CHÍ CHUẨN CỦA BILLIG GLOBAL
const MASTER_CRITERIA = [
    { group: "1. WEBSITE", item: "Pháp lý (Impressum/GDPR)", detail: "Kiểm tra trang Impressum và Datenschutz theo luật Đức." },
    { group: "1. WEBSITE", item: "NAP & Google Maps API", detail: "Tên, địa chỉ, SĐT khớp 100% GMB và có nhúng bản đồ." },
    { group: "1. WEBSITE", item: "Chuyển đổi & WhatsApp", detail: "Nút đặt bàn < 1 phút, nút WhatsApp Sticky nổi bật." },
    { group: "1. WEBSITE", item: "Digital Menu & Hình ảnh", detail: "Thực đơn online có ảnh món ăn thực tế." },
    { group: "1. WEBSITE", item: "Kỹ thuật Tracking", detail: "Cài đặt Goal tracking cho nút đặt bàn/gọi điện." },
    { group: "2. GOOGLE BUSINESS", item: "SEO Profile & Từ khóa", detail: "Tên quán chuẩn SEO [Tên + Từ khóa ngách]." },
    { group: "2. GOOGLE BUSINESS", item: "Uy tín & Review (>4.3)", detail: "Điểm đánh giá và phản hồi khách hàng 100%." },
    { group: "2. GOOGLE BUSINESS", item: "Visual (>20 ảnh & Video)", detail: "Có trên 20 ảnh thực tế và video không gian." },
    { group: "2. GOOGLE BUSINESS", item: "Tiện ích Conversion", detail: "Nút gọi, đặt chỗ hoạt động chính xác." },
    { group: "3. FACEBOOK", item: "Thông tin & SEO Page", detail: "Đầy đủ thông tin NAP và từ khóa trong Bio." },
    { group: "3. FACEBOOK", item: "Điều hướng WhatsApp", detail: "Có nút WhatsApp Business kết nối trực tiếp." },
    { group: "4. INSTAGRAM", item: "SEO Bio & Link điều hướng", detail: "Linktree/Website chuyên nghiệp trong Bio." },
    { group: "4. INSTAGRAM", item: "Tần suất Reels (1-2/tuần)", detail: "Duy trì video ngắn định kỳ hàng tuần." },
    { group: "4. INSTAGRAM", item: "Visual & Thẩm mỹ", detail: "Ảnh chuẩn 1:1/4:5, kích thích vị giác." }
];

async function startAudit() {
    const name = document.getElementById('storeName').value;
    const data = document.getElementById('storeData').value;
    const btn = document.getElementById('btnRun');

    if (!name || !data) return alert("Vui lòng nhập đủ thông tin!");

    btn.innerText = "GEMINI AI ĐANG PHÂN TÍCH...";
    btn.disabled = true;

    const prompt = `Bạn là chuyên gia thẩm định Marketing tại Billig Global.
    Phân tích khách hàng [${name}] dựa trên dữ liệu: [${data}].
    
    BẠN PHẢI ĐÁNH GIÁ ĐỦ CÁC TIÊU CHÍ SAU:
    ${JSON.stringify(MASTER_CRITERIA)}

    YÊU CẦU TRẢ VỀ JSON DUY NHẤT:
    {
      "score": "...", "pass": ..., "fail": ...,
      "details": [
        {"group": "...", "item": "...", "status": "ĐẠT hoặc KHÔNG ĐẠT", "note": "..."}
      ],
      "advice": "..."
    }`;

    try {
        const response = await fetch(`${CONFIG.GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            })
        });

        const result = await response.json();
        const content = result.candidates[0].content.parts[0].text;
        const res = JSON.parse(content);

        renderUI(res, name);

    } catch (e) {
        console.error(e);
        alert("Lỗi kết nối Gemini API. Hãy kiểm tra lại API Key!");
    } finally {
        btn.innerText = "PHÂN TÍCH HỆ THỐNG";
        btn.disabled = false;
    }
}

function renderUI(res, name) {
    document.getElementById('resName').innerText = "AUDIT BÁO CÁO: " + name.toUpperCase();
    document.getElementById('resScore').innerText = res.score;
    document.getElementById('resPass').innerText = res.pass;
    document.getElementById('resFail').innerText = res.fail;
    document.getElementById('resAdvice').innerText = res.advice;
    
    const tbody = document.getElementById('resBody');
    tbody.innerHTML = res.details.map(d => `
        <tr>
            <td style="font-weight: bold; color: #1a73e8;">${d.group}</td>
            <td>${d.item}</td>
            <td>
                <span class="status-tag ${d.status.includes('ĐẠT') && !d.status.includes('KHÔNG') ? 'pass' : 'fail'}">
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
    html2pdf().from(element).save(`Audit_BilligGlobal_${document.getElementById('storeName').value}.pdf`);
}
