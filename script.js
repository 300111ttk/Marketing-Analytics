async function startAudit() {
    const name = document.getElementById('storeName').value;
    const data = document.getElementById('storeData').value;
    const btn = document.getElementById('btnRun');

    btn.innerText = "LOCAL AI ĐANG PHÂN TÍCH...";
    btn.disabled = true;

    // Cấu trúc dữ liệu theo chuẩn LM Studio / OpenAI
    const payload = {
        model: "litellm_proxy/local-model", // LM Studio sẽ tự nhận model đang load
        messages: [
            { "role": "system", "content": "Bạn là chuyên gia Audit Marketing của Billig Global." },
            { "role": "user", "content": `Phân tích cửa hàng: ${name}. Dữ liệu: ${data}. Trả về JSON: {"score":"62%", "details":[{"item":"Website","status":"ĐẠT","note":"Tốt"}]}` }
        ],
        temperature: 0.7
    };

    try {
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        // Lấy nội dung chữ từ LM Studio
        const text = result.choices[0].message.content.replace(/```json|```/g, "").trim();
        const res = JSON.parse(text);

        // Hiển thị kết quả (giữ nguyên logic hiển thị cũ của bạn)
        renderResult(res, name);

    } catch (e) {
        alert("Lỗi: Hãy đảm bảo bạn đã nhấn 'Start Server' trong LM Studio!");
        console.error(e);
    } finally {
        btn.innerText = "BẮT ĐẦU PHÂN TÍCH";
        btn.disabled = false;
    }
}
