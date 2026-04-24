async function evaluateWithAI() {
    const name = document.getElementById('storeName').value;
    const info = document.getElementById('additionalInfo').value;
    const btn = document.querySelector('button[onclick="evaluateWithAI()"]') || document.getElementById('btnCheck');
    
    // Kiểm tra đầu vào
    if (!name || !info) {
        alert("Vui lòng nhập đầy đủ Tên cửa hàng và Dữ liệu đầu vào!");
        return;
    }

    // Kiểm tra API Key đã được load từ config.js chưa
    if (typeof CONFIG === 'undefined' || !CONFIG.GEMINI_API_KEY) {
        alert("Lỗi: Hệ thống chưa nạp được file config.js hoặc thiếu API Key!");
        return;
    }

    btn.innerText = "ĐANG ĐỐI SOÁT DỮ LIỆU...";
    btn.disabled = true;

    // Prompt nạp bộ tiêu chí từ ảnh Checklist của bạn
    const prompt = `Phân tích Marketing Audit cho ${name}. Dữ liệu: ${info}. 
    Dựa trên: 1.Website (UI, NAP, Đặt bàn, GDPR), 2.Google Business (SEO, Review, Ảnh), 3.Social (Reels, Fanpage, WhatsApp). 
    Trả về JSON duy nhất: {"score": "62%", "pass": 7, "fail": 5, "details": [{"criteria": "Tên tiêu chí", "status": "ĐẠT/KHÔNG ĐẠT", "comment": "Nhận xét"}], "advice": "Lời khuyên"}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
        const res = JSON.parse(text);

        // Hiển thị kết quả lên giao diện
        document.getElementById('score-val').innerText = res.score;
        document.getElementById('pass-count').innerText = res.pass;
        document.getElementById('fail-count').innerText = res.fail;
        
        let html = "";
        res.details.forEach(item => {
            const tag = item.status.includes("ĐẠT") && !item.status.includes("KHÔNG") ? "tag-pass" : "tag-fail";
            html += `<tr><td>${item.criteria}</td><td><span class="status-tag ${tag}">${item.status}</span></td><td>${item.comment}</td></tr>`;
        });
        document.getElementById('audit-body').innerHTML = html;
        document.getElementById('advice-text').innerText = "LỜI KHUYÊN: " + res.advice;
        
        // Hiện vùng báo cáo
        const report = document.getElementById('pdf-content');
        if(report) report.style.display = 'block';

    } catch (e) {
        console.error(e);
        alert("Lỗi kết nối: Hãy kiểm tra API Key hoặc định dạng dữ liệu đầu vào.");
    } finally {
        btn.innerText = "PHÂN TÍCH HỆ THỐNG";
        btn.disabled = false;
    }
}
