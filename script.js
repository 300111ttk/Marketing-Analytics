async function startAudit() {
    const name = document.getElementById('storeName').value;
    const data = document.getElementById('storeData').value;
    const btn = document.getElementById('btnRun');

    if (!name || !data) return alert("Vui lòng nhập đầy đủ thông tin!");

    btn.innerText = "GEMINI ĐANG ĐỐI SOÁT DỮ LIỆU...";
    btn.disabled = true;

    // Chuẩn bị Prompt gửi cho Gemini
    const prompt = `Bạn là chuyên gia thẩm định Marketing tại Billig Global.
    Nhiệm vụ: Phân tích khách hàng [${name}] dựa trên dữ liệu thu thập: [${data}].
    
    BẠN PHẢI ĐỐI SOÁT THỰC TẾ DỰA TRÊN BỘ TIÊU CHÍ CỐ ĐỊNH SAU:
    ${JSON.stringify(AUDIT_CRITERIA)}

    YÊU CẦU TRẢ VỀ JSON DUY NHẤT:
    {
      "score": "Điền %",
      "pass": "Số mục đạt",
      "fail": "Số mục lỗi",
      "details": [
        {
          "group": "Tên nhóm (VD: 1. Website)",
          "item": "Tên tiêu chí",
          "status": "ĐẠT hoặc CHƯA ĐẠT hoặc CẢNH BÁO",
          "note": "Nhận xét cụ thể tại sao đạt hoặc lỗi dựa trên dữ liệu khách hàng"
        }
      ],
      "advice": "Hành động chiến lược tổng quát để chốt hợp đồng"
    }`;

    try {
        const response = await fetch(`${CONFIG.GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { 
                    responseMimeType: "application/json",
                    temperature: 0.2 // Giữ AI trả lời nghiêm túc, bám sát tiêu chí
                }
            })
        });

        const result = await response.json();
        const content = result.candidates[0].content.parts[0].text;
        const res = JSON.parse(content);

        updateUI(res, name);

    } catch (e) {
        console.error(e);
        alert("Lỗi kết nối Gemini API. Hãy kiểm tra API Key trong config.js!");
    } finally {
        btn.innerText = "PHÂN TÍCH HỆ THỐNG";
        btn.disabled = false;
    }
}

function updateUI(res, name) {
    document.getElementById('header-shop-name').innerText = name.toUpperCase();
    document.getElementById('resStoreName').innerText = name.toUpperCase();
    document.getElementById('resScore').innerText = res.score;
    document.getElementById('resPass').innerText = res.pass;
    document.getElementById('resFail').innerText = res.fail;
    document.getElementById('resAdvice').innerText = res.advice;

    const tbody = document.getElementById('resBody');
    tbody.innerHTML = "";

    let currentGroup = "";
    res.details.forEach(d => {
        // Tạo dòng tiêu đề Nhóm (Header xanh nhạt)
        if (d.group !== currentGroup) {
            currentGroup = d.group;
            tbody.innerHTML += `
                <tr>
                    <td colspan="3" style="background-color: #f4f7f6; font-weight: bold; color: #001f3f;">
                        ${d.group.toUpperCase()}
                    </td>
                </tr>`;
        }

        // Xác định class cho trạng thái
        let statusClass = "status-chua-dat";
        if (d.status.includes("ĐẠT") && !d.status.includes("CHƯA")) statusClass = "status-dat";
        if (d.status.includes("CẢNH BÁO")) statusClass = "status-canh-bao";

        tbody.innerHTML += `
            <tr>
                <td style="padding-left: 25px;">${d.item}</td>
                <td><span class="status-tag ${statusClass}">${d.status}</span></td>
                <td style="color: #666; line-height: 1.4;">${d.note}</td>
            </tr>`;
    });

    document.getElementById('pdf-content').style.display = 'block';
    document.getElementById('pdfBtnArea').style.display = 'block';
    window.scrollTo({ top: document.getElementById('pdf-content').offsetTop, behavior: 'smooth' });
}

function downloadPDF() {
    const element = document.getElementById('pdf-content');
    const storeName = document.getElementById('storeName').value || 'Audit_Report';
    const opt = {
        margin: 10,
        filename: `Audit_Marketing_${storeName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}
