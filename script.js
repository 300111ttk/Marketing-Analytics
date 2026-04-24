async function evaluateWithAI() {
    const name = document.getElementById('storeName').value;
    const info = document.getElementById('additionalInfo').value;
    const btn = document.getElementById('btnStart');

    btn.innerText = "Đang xử lý..."; btn.disabled = true;

    const payload = {
        contents: [{ parts: [{ text: `Audit Marketing cho ${name}: ${info}...` }] }]
    };

    try {
        // Gọi qua Proxy thay vì gọi trực tiếp
        const response = await fetch(CONFIG.PROXY_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        // Xử lý dữ liệu hiển thị giống như cũ...
        console.log(data);
        
    } catch (e) {
        alert("Lỗi: " + e.message);
    } finally {
        btn.innerText = "BẮT ĐẦU"; btn.disabled = false;
    }
}
