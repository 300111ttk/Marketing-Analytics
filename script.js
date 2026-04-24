async function evaluateWithAI() {
    const name = document.getElementById('storeName').value;
    const info = document.getElementById('additionalInfo').value;
    const btn = document.getElementById('btnCheck');
    const loading = document.getElementById('loading');
    const pdfArea = document.getElementById('pdf-content');

    if(!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY.includes("AIza") === false) {
        alert("Lỗi: Bạn chưa dán đúng API Key vào file config.js"); return;
    }

    btn.disabled = true; loading.style.display = 'block'; pdfArea.style.display = 'none';

    const prompt = `Bạn là chuyên gia Marketing Audit của Billig Global. Hãy phân tích cửa hàng ${name} với dữ liệu sau: ${info}. 
    Sử dụng bộ tiêu chí: Website (UI, GDPR, NAP), Google Maps (Review, Ảnh), Social (Reels, WhatsApp). 
    Trả về định dạng JSON: {"score": "số %", "pass_count": "số", "fail_count": "số", "details": [{"criteria": "Tên tiêu chí", "status": "ĐẠT/KHÔNG ĐẠT", "comment": "Nhận xét"}], "advice": "Lời khuyên"}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        const result = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json|```/g, ""));

        document.getElementById('display-name').innerText = name;
        document.getElementById('score-val').innerText = result.score;
        document.getElementById('pass-count').innerText = result.pass_count;
        document.getElementById('fail-count').innerText = result.fail_count;
        document.getElementById('advice-text').innerHTML = "<strong>LỜI KHUYÊN:</strong> " + result.advice;

        const tbody = document.getElementById('audit-body');
        tbody.innerHTML = "";
        result.details.forEach(item => {
            const tag = item.status.includes("ĐẠT") && !item.status.includes("KHÔNG") ? "tag-pass" : "tag-fail";
            tbody.innerHTML += `<tr><td>${item.criteria}</td><td><span class="status-tag ${tag}">${item.status}</span></td><td>${item.comment}</td></tr>`;
        });

        pdfArea.style.display = 'block';
        document.getElementById('btnDownload').style.display = 'block';
    } catch (e) {
        alert("Lỗi: Hệ thống không phản hồi. Hãy kiểm tra API Key.");
    } finally {
        btn.disabled = false; loading.style.display = 'none';
    }
}

function downloadPDF() {
    const element = document.getElementById('pdf-content');
    const storeName = document.getElementById('storeName').value || 'Report';
    html2pdf().set({ margin: 10, filename: `Audit-${storeName}.pdf`, html2canvas: { scale: 2 } }).from(element).save();
}
