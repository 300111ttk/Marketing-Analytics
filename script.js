async function startAudit() {
    const name = document.getElementById('storeName').value;
    const data = document.getElementById('storeData').value;
    const btn = document.getElementById('btnRun');

    if (!name || !data) return alert("Vui lòng nhập đủ dữ liệu!");
    if (typeof CONFIG === 'undefined' || !CONFIG.GEMINI_API_KEY) return alert("Lỗi: Kiểm tra file config.js!");

    btn.innerText = "ĐANG PHÂN TÍCH..."; btn.disabled = true;

    const prompt = `Bạn là chuyên gia Audit của Billig Global. Phân tích cửa hàng: ${name} với dữ liệu: ${data}. 
    Chấm điểm dựa trên Website, GMB, Social. Trả về JSON: 
    {"score":"62%", "pass":7, "fail":5, "details":[{"item":"Website","status":"ĐẠT","note":"Tốt"}], "advice":"Lời khuyên"}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const json = await response.json();
        const text = json.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
        const res = JSON.parse(text);

        document.getElementById('resName').innerText = name;
        document.getElementById('resScore').innerText = res.score;
        document.getElementById('resPass').innerText = res.pass;
        document.getElementById('resFail').innerText = res.fail;
        document.getElementById('resAdvice').innerText = "LỜI KHUYÊN: " + res.advice;
        
        document.getElementById('resBody').innerHTML = res.details.map(d => `
            <tr>
                <td>${d.item}</td>
                <td class="${d.status.includes('ĐẠT') && !d.status.includes('CHƯA') ? 'status-pass' : 'status-fail'}">${d.status}</td>
                <td>${d.note}</td>
            </tr>
        `).join('');

        document.getElementById('report-area').style.display = 'block';
    } catch (e) {
        alert("Có lỗi xảy ra khi gọi AI. Hãy kiểm tra API Key.");
    } finally {
        btn.innerText = "BẮT ĐẦU PHÂN TÍCH"; btn.disabled = false;
    }
}

function downloadPDF() {
    const element = document.getElementById('report-area');
    html2pdf().from(element).save('Audit-Marketing-BilligGlobal.pdf');
}
