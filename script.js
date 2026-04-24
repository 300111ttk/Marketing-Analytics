async function evaluateWithAI() {
    const name = document.getElementById('storeName').value.trim();
    const info = document.getElementById('additionalInfo').value.trim();
    const btn = document.getElementById('btnStart');
    const pdfArea = document.getElementById('report-container');

    // Kiểm tra xem config đã load chưa
    if (typeof CONFIG === 'undefined' || !CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY.includes("AIza") === false) {
        alert("Lỗi: Không tìm thấy API Key trong file config.js hoặc mã không đúng!");
        return;
    }

    if (!name || !info) {
        alert("Vui lòng nhập tên cửa hàng và dữ liệu!");
        return;
    }

    btn.innerText = "Hệ thống đang đối soát...";
    btn.disabled = true;

    const prompt = `Bạn là chuyên gia Audit Marketing của Billig Global. Hãy thẩm định khách hàng: ${name}. Dữ liệu: ${info}.
    Trả về định dạng JSON (không giải thích): 
    {"score": "60%", "pass": 6, "fail": 6, "details": [{"item": "Tiêu chí", "status": "ĐẠT/KHÔNG ĐẠT", "note": "Nhận xét"}], "advice": "Lời khuyên"}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error.message);

        const cleanJson = data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
        const res = JSON.parse(cleanJson);

        document.getElementById('display-name').innerText = name;
        document.getElementById('score-val').innerText = res.score;
        document.getElementById('pass-count').innerText = res.pass;
        document.getElementById('fail-count').innerText = res.fail;
        
        let html = "";
        res.details.forEach(d => {
            const cls = d.status.includes("ĐẠT") && !d.status.includes("KHÔNG") ? "status-pass" : "status-fail";
            html += `<tr><td>${d.item}</td><td class="${cls}">${d.status}</td><td>${d.note}</td></tr>`;
        });
        document.getElementById('audit-body').innerHTML = html;
        document.getElementById('advice-text').innerText = res.advice;

        pdfArea.style.display = 'block';
        document.getElementById('btnPDF').style.display = 'block';
    } catch (e) {
        alert("LỖI KẾT NỐI: " + e.message);
    } finally {
        btn.innerText = "BẮT ĐẦU PHÂN TÍCH";
        btn.disabled = false;
    }
}

function downloadPDF() {
    const element = document.getElementById('report-container');
    const storeName = document.getElementById('storeName').value || 'Audit';
    html2pdf().from(element).set({ 
        margin: 10, 
        filename: `Audit-${storeName}.pdf`, 
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save();
}
