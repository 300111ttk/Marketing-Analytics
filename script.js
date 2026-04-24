async function startAudit() {
    const name = document.getElementById('storeName').value;
    const data = document.getElementById('storeData').value;
    const btn = document.getElementById('btnRun');
    const reportArea = document.getElementById('report-area');

    if (!name || !data) return alert("Vui lòng nhập đủ dữ liệu!");

    btn.innerText = "LOCAL AI ĐANG PHÂN TÍCH...";
    btn.disabled = true;

    // Cấu trúc chuẩn để gọi model từ LM Studio
    const payload = {
        messages: [
            { "role": "system", "content": "Bạn là chuyên gia Audit Marketing. Phân tích dữ liệu và trả về JSON duy nhất, không giải thích." },
            { "role": "user", "content": `Audit cho cửa hàng: ${name}. Dữ liệu: ${data}. Trả về JSON: {"score":"62%", "pass":7, "fail":5, "details":[{"item":"Website","status":"ĐẠT","note":"Tốt"}], "advice":"Lời khuyên"}` }
        ],
        temperature: 0.7,
        max_tokens: -1,
        stream: false
    };

    try {
        const response = await fetch(CONFIG.LOCAL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        const content = result.choices[0].message.content.replace(/```json|```/g, "").trim();
        const res = JSON.parse(content);

        // Hiển thị dữ liệu (Kiểm tra kỹ ID trước khi gán để tránh lỗi null)
        if (document.getElementById('resName')) document.getElementById('resName').innerText = name;
        if (document.getElementById('resScore')) document.getElementById('resScore').innerText = res.score;
        if (document.getElementById('resPass')) document.getElementById('resPass').innerText = res.pass;
        if (document.getElementById('resFail')) document.getElementById('resFail').innerText = res.fail;
        if (document.getElementById('resAdvice')) document.getElementById('resAdvice').innerText = "HÀNH ĐỘNG: " + res.advice;
        
        const tbody = document.getElementById('resBody');
        if (tbody) {
            tbody.innerHTML = res.details.map(d => `
                <tr>
                    <td>${d.item}</td>
                    <td class="${d.status.includes('ĐẠT') && !d.status.includes('CHƯA') ? 'status-pass' : 'status-fail'}">${d.status}</td>
                    <td>${d.note}</td>
                </tr>
            `).join('');
        }

        if (reportArea) reportArea.style.display = 'block';

    } catch (e) {
        console.error(e);
        alert("LỖI: Hãy chắc chắn LM Studio đang Start Server tại 127.0.0.1:1234");
    } finally {
        btn.innerText = "BẮT ĐẦU PHÂN TÍCH";
        btn.disabled = false;
    }
}
