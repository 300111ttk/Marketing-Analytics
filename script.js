async function startAudit() {
    const name = document.getElementById('storeName').value;
    const data = document.getElementById('storeData').value;
    const btn = document.getElementById('btnRun');

    if (!name || !data) return alert("Vui lòng nhập đủ tên quán và dữ liệu!");

    // Trạng thái chờ
    btn.innerText = "LOCAL AI ĐANG PHÂN TÍCH...";
    btn.disabled = true;

    const payload = {
        model: CONFIG.MODEL_NAME,
        messages: [
            { 
                "role": "system", 
                "content": "Bạn là chuyên gia Marketing của Billig Global. Phân tích dữ liệu và chỉ trả về duy nhất định dạng JSON." 
            },
            { 
                "role": "user", 
                "content": `Audit Marketing cho cửa hàng: ${name}. Dữ liệu: ${data}. 
                Yêu cầu trả về JSON: {"score":"62%", "pass":7, "fail":5, "details":[{"item":"Website","status":"ĐẠT","note":"Nhận xét"}], "advice":"Lời khuyên"}` 
            }
        ],
        temperature: 0.7
    };

    try {
        const response = await fetch(CONFIG.LOCAL_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Không thể kết nối LM Studio. Hãy kiểm tra nút 'Start Server'.");

        const result = await response.json();
        const content = result.choices[0].message.content.replace(/```json|```/g, "").trim();
        const res = JSON.parse(content);

        // Đổ dữ liệu an toàn (Kiểm tra ID tồn tại trước khi gán)
        updateElement('resName', name);
        updateElement('resScore', res.score);
        updateElement('resPass', res.pass);
        updateElement('resFail', res.fail);
        updateElement('resAdvice', "HÀNH ĐỘNG: " + res.advice);
        
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

        document.getElementById('report-area').style.display = 'block';

    } catch (e) {
        console.error(e);
        alert("LỖI: " + e.message + "\nMẹo: Bật 'Enable CORS' trong LM Studio.");
    } finally {
        btn.innerText = "BẮT ĐẦU PHÂN TÍCH";
        btn.disabled = false;
    }
}

function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

function downloadPDF() {
    const element = document.getElementById('report-area');
    html2pdf().from(element).save('Audit-BilligGlobal.pdf');
}
