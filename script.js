async function startAudit() {
    const name = document.getElementById('storeName').value;
    const data = document.getElementById('storeData').value;
    const btn = document.getElementById('btnRun');

    if (!name || !data) return alert("Vui lòng nhập đủ thông tin!");

    btn.innerText = "HỆ THỐNG ĐANG ĐỐI SOÁT...";
    btn.disabled = true;

    // SỬA LỖI TẠI ĐÂY: Đảm bảo gọi đúng tên GEMINI_API_URL từ config.js
    const apiKey = CONFIG.GEMINI_API_KEY; 
    const apiUrl = CONFIG.GEMINI_API_URL; 

    const prompt = `Bạn là chuyên gia thẩm định Marketing tại Billig Global.
    Nhiệm vụ: Phân tích khách hàng [${name}] dựa trên dữ liệu: [${data}].
    QUY TẮC: Phải đối soát thực tế theo từng mục trong tiêu chí sau: ${JSON.stringify(AUDIT_CRITERIA)}

    YÊU CẦU TRẢ VỀ JSON DUY NHẤT:
    {
      "score": "Số %",
      "pass": "Số mục đạt",
      "fail": "Số mục lỗi",
      "details": [
        {"group": "Nhóm tiêu chí", "item": "Tên mục", "status": "ĐẠT/CHƯA ĐẠT/CẢNH BÁO", "note": "Nhận xét thực tế cụ thể"}
      ],
      "advice": "Lời khuyên hành động tổng quát"
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

        if (!response.ok) throw new Error("API Response Error");

        const result = await response.json();
        const content = JSON.parse(result.candidates[0].content.parts[0].text);
        
        updateUI(content, name);

    } catch (e) {
        console.error(e);
        alert("Lỗi kết nối Gemini API. Hãy đảm bảo API Key của bạn còn hoạt động và không bị chặn vùng địa lý!");
    } finally {
        btn.innerText = "PHÂN TÍCH HỆ THỐNG";
        btn.disabled = false;
    }
}
