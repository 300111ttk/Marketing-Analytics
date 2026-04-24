async function startAudit() {
    const name = document.getElementById('storeName').value;
    const data = document.getElementById('storeData').value;
    const btn = document.getElementById('btnRun');

    if (!name || !data) return alert("Vui lòng nhập đủ thông tin!");

    btn.innerText = "HỆ THỐNG ĐANG PHÂN TÍCH...";
    btn.disabled = true;

    // Chú ý: CONFIG.GEMINI_API_KEY phải khớp với file config.js của bạn
    const apiKey = CONFIG.GEMINI_API_KEY; 
    const apiUrl = CONFIG.GEMINI_URL;

    const prompt = `Bạn là chuyên gia Marketing tại Billig Global.
    Hãy đối soát khách hàng [${name}] dựa trên dữ liệu này: [${data}].
    
    Yêu cầu: Phân tích dựa trên các tiêu chí cố định: ${JSON.stringify(AUDIT_CRITERIA)}

    Kết quả trả về định dạng JSON:
    {
      "score": "Số %",
      "pass": "Số mục đạt",
      "fail": "Số mục lỗi",
      "details": [
        {"group": "Nhóm tiêu chí", "item": "Tên mục", "status": "ĐẠT/CHƯA ĐẠT/CẢNH BÁO", "note": "Nhận xét thực tế"}
      ],
      "advice": "Lời khuyên hành động"
    }`;

    try {
        const response = await fetch(`${apiUrl}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
            })
        });

        if (!response.ok) throw new Error("API Response not OK");

        const result = await response.json();
        const content = JSON.parse(result.candidates[0].content.parts[0].text);
        
        updateUI(content, name); // Hàm hiển thị ra màn hình

    } catch (e) {
        console.error("Lỗi:", e);
        alert("Lỗi kết nối Gemini API. Hãy kiểm tra lại API Key hoặc kết nối mạng!");
    } finally {
        btn.innerText = "PHÂN TÍCH HỆ THỐNG";
        btn.disabled = false;
    }
}
