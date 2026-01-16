// BỌC TOÀN BỘ CODE TRONG HÀM TỰ CHẠY ĐỂ TRÁNH LỖI CÚ PHÁP
(async function() {
    'use strict';

    // =========================================================================
    // 1. NHẬN TOKEN TỪ LOADER (QUAN TRỌNG NHẤT)
    const token = window.NAZ_TOKEN_INJECTED || ""; 
    
    // CÁC CẤU HÌNH KHÁC
    let channelIds = ["0"]; 
    let NOTIFY_CHANNEL_ID = "0"; 
    const MY_USER_ID = "712902823993409586"; // ID Của bạn
    // =========================================================================

    // --- CẤU HÌNH RANK & ID ---
    const RANK_DEFINITIONS = {
        "ADMIN": { text: "ADMIN 🛡️", color: "#ed4245", bg: "rgba(237, 66, 69, 0.2)", border: "#ed4245" },
        "VIP":   { text: "VIP 👑",   color: "#f1c40f", bg: "rgba(241, 196, 15, 0.2)", border: "#f1c40f" },
        "PREMIUM": { text: "PREMIUM 💠", color: "#eb459e", bg: "rgba(235, 69, 158, 0.2)", border: "#eb459e" },
        "MEMBER":  { text: "MEMBER",   color: "#99aab5", bg: "rgba(153, 170, 181, 0.2)", border: "#99aab5" }
    };

    const USER_RANKS = {
        "712902823993409586": "ADMIN", // ID Admin
        "999999999999999999": "VIP"    // ID VIP
    };

    // --- BIẾN HỆ THỐNG ---
    let isRunning = false;
    let startTime = null;
    let timerInterval = null, reportInterval = null, prayTimeout = null; 
    let scanInterval = null, isBreaking = false;
    let fpsLoop = null; 
    let currentZoom = 1.0; 
    let hCount = 0, bCount = 0, pCount = 0, gemCount = 0, cmdCount = 0;
    let myGlobalName = ""; 

    // --- CẤU HÌNH MẶC ĐỊNH ---
    const settings = { 
        obj: true,        
        daily: true,     
        autoGem: false, 
        useEventGem: false,
        gemList: "0,0,0",
        aiRate: 50,      
        gameRate: 30,     
        autoBuy: false,   
        buyId: "1",        
        buyQty: "1"        
    };

    const GEM_TYPES = {
        "51": 1, "54": 1, "57": 1, "60": 1, "63": 1, "66": 1, "69": 1, "72": 1, "75": 1, "78": 1, "81": 1, "84": 1,
        "52": 4, "55": 4, "58": 4, "61": 4, "64": 4, "67": 4, "70": 4, "73": 4, "76": 4, "79": 4, "82": 4, "85": 4,
        "53": 3, "56": 3, "59": 3, "62": 3, "65": 3, "68": 3, "71": 3, "74": 3, "77": 3, "80": 3, "83": 3, "86": 3
    };

    const huntPool = ["oh", "owoh", "ohunt", "owohunt"];
    const battlePool = ["ob", "owob", "obattle", "owobattle"];
    const prayPool = ["opray", "owopray"];
    const extraPool = ["ows", "owows", "osc all", "owosc all"]; 
    const miniGamePool = ["os", "ocf", "obj"]; 

    const aiMessages = ["Chắc hôm nay hên lắm luôn á", "Idol Hui PRO", "Đừng nói là vừa ngủ dậy nha", "Nhìn mặt là biết nhiều chuyện hay rồi", "Game ez ow tuổi cc", "Có gì share liền đi", "Nay định bung nóc luôn không", "Mà xuất hiện là auto bão like", "Nghe đồn hôm nay phá đảo thế giới ảo", "Là lý do hôm nay không chán", "Ủa trời đẹp vậy là hợp rồi", "Hình như đang lên mood kìa", "Nay định làm đại sự gì hả", "Nhìn mà thấy ngày nay có sức sống hẳn", "Đố ai cản nổi hôm nay", "Nghe đồn hôm nay phá đảo thế giới ảo", "Vào là phòng sáng hẳn luôn", "Chắc hôm nay sắp gây bão", "Trông hôm nay có vẻ nguy hiểm nha", "Ai cho dễ thương vậy trời", "Có chuyện vui gì kể đi", "Nhìn vui dữ ta", "Nay là ngày để thể hiện đây", "Nghe bảo nay bạn gặp quý nhân", "Có ai khen đẹp chưa để mình khen", "Bữa nay thần thái ghê", "Nghe bảo sắp win to", "Nay online sớm vậy", "Có ai thấy cực nổi bật không", "Trông có vẻ bí mật gì đó nha", "Là lý do hôm nay không buồn ngủ", "Bữa nay ăn gì ngon không", "Ai chứ là vui cả ngày", "Hình như đang có kế hoạch gì đó", "Nay sáng tạo dữ ta", "Chuẩn bị tạo trend chưa", "Nay đẹp dữ ta", "Định đi đâu đó vui hả", "Hình như vừa nhận được buff may mắn", "NAZ PRO","Nghe đồn nay chơi lớn lắm", "Đừng để chờ lâu bung nổ liền đi", "Có gì hot kể nghe đi", "Vô là có biến liền luôn", "Nghe đồn hôm nay làm chuyện bất ngờ", "Ai cho năng lượng dồi dào vậy", "Nay xứng đáng MVP đó nha", "Nhìn khác khác hen", "Có ai đoán được mood hôm nay không", "Thấy mà auto vui liền", "Nghe đồn định làm chuyện lớn", "Có vẻ đang có động lực ghê", "Sắp làm gì đó thú vị đúng không", "Trời đẹp thế này hợp cho lắm", "Ủa sao hôm nay xinh dữ vậy", "Có ai thấy cười chưa chói mắt ghê", "Nghe bảo hôm nay là ngày may mắn", "Hình như hôm nay đẹp trai hơn đó", "Xuất hiện auto vui liền", "Nhìn là thấy ngày nay ngon lành", "Thấy là thấy có biến hay ho rồi", "Ai cho tỏa sáng vậy trời", "Nay định gánh team hả", "Cảm giác hôm nay sẽ đặc biệt", "Sao nay ngầu dữ vậy", "Coi bộ hôm nay vui đây", "Đố biết hôm nay ai hot nhất", "Lâu lắm mới gặp bữa nay khỏe không", "Sao trông như boss vậy trời", "Idol Huy Ra Tay Chỉ Có Ez", "Chuẩn bị làm gì vui không", "Nghe đâu sắp được tặng quà đó", "Hôm nay có drama gì chưa", "Đoán xem ai vừa xuất hiện là đây", "Nghe bảo hôm nay bạn sẽ cực may mắn", "Đâu ra đây", "Có chuyện gì hay ho kể nghe đi", "Ngày hôm nay có màu gì vậy", "Nay vui không", "Tin nóng đã online", "Coi chừng vừa vào phòng kìa", "Nay có ý định làm gì bá đạo không", "Hình như vừa được buff may mắn", "Đã đến giờ tỏa sáng rồi", "Mạnh mẽ lên hôm nay sẽ chất lắm", "Nghe phong phanh sắp làm nên chuyện lớn", "Ai vừa mang năng lượng tích cực tới vậy"];

    // --- UTILS ---
    function humanRandom(min, max) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random(); 
        while (v === 0) v = Math.random();
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        num = num / 10.0 + 0.5; 
        if (num > 1 || num < 0) num = humanRandom(min, max); 
        return Math.floor(num * (max - min + 1) + min);
    }

    async function simulateTyping(text) {
        if (!isRunning) return;
        const typingDelay = (text.length * humanRandom(50, 90)) + humanRandom(300, 600);
        await new Promise(r => setTimeout(r, typingDelay));
    }

    // --- MONITORS ---
    function startSystemMonitors() {
        let frames = 0;
        let lastTime = performance.now();
        
        function loopFPS() {
            if (!isRunning) return;
            frames++;
            const now = performance.now();
            if (now - lastTime >= 1000) {
                const el = document.getElementById('w-fps');
                if(el) {
                    el.innerText = `FPS:${frames}`;
                    el.style.color = frames < 30 ? "#ed4245" : "#a855f7"; 
                }
                frames = 0;
                lastTime = now;
            }
            fpsLoop = requestAnimationFrame(loopFPS);
        }
        fpsLoop = requestAnimationFrame(loopFPS);

        setInterval(async () => {
            if(!isRunning) return;
            const start = Date.now();
            try {
                await fetch('https://discord.com/api/v9/gateway');
                const ping = Date.now() - start;
                const el = document.getElementById('w-ping');
                if(el) {
                    el.innerText = `MS:${ping}`;
                    el.style.color = ping < 150 ? "#3ba55c" : (ping < 300 ? "#efb02e" : "#ed4245");
                }
            } catch(e) {
                const el = document.getElementById('w-ping');
                if(el) { el.innerText = "MS:ERR"; el.style.color = "#ed4245"; }
            }
        }, 5000);
    }

    async function sendNotify(msg) {
        if (!token) return;
        try {
            await fetch(`https://discord.com/api/v9/channels/${NOTIFY_CHANNEL_ID}/messages`, {
                method: "POST", headers: { "Authorization": token, "Content-Type": "application/json" },
                body: JSON.stringify({ content: `🚨 **NAZ v0.0.1:** ${msg}` })
            });
        } catch (e) {}
    }

    async function sendPeriodicReport() {
        if (!isRunning) return;
        const uptime = document.getElementById('w-uptime').innerText;
        const reportMsg = `📊 **BÁO CÁO:**\n- Uptime: ${uptime}\n- Hunt: ${hCount} | Battle: ${bCount}\n- Gem used: ${gemCount}`;
        await sendNotify(reportMsg);
    }

    function getLongBreakTime() {
        if (!isRunning) return 0;
        const elapsedMin = (new Date() - startTime) / 60000;
        if (elapsedMin >= 180) return -1;
        if (elapsedMin >= 120) { if (Math.random() < 0.2) return humanRandom(300000, 480000); }
        else if (elapsedMin >= 60) { if (Math.random() < 0.1) return humanRandom(120000, 240000); }
        else if (elapsedMin >= 30) { if (Math.random() < 0.05) return humanRandom(60000, 120000); }
        return 0;
    }

    async function startSuperScan() {
        scanInterval = setInterval(async () => {
            if (!isRunning) return;
            if (!navigator.onLine) return; 
            for (let tid of channelIds.filter(id => id.length > 5)) {
                try {
                    const res = await fetch(`https://discord.com/api/v9/channels/${tid}/messages?limit=10`, {
                        headers: { "Authorization": token }
                    });
                    if (!res.ok) continue; 
                    const msgs = await res.json();
                    for (let m of msgs) {
                        const c = m.content.toLowerCase();
                        const danger = ["captcha", "verify", "check", "real", "human", "ban", "below", "sult"];
                        if (danger.some(k => c.includes(k))) {
                            addLog(`⚠️ PHÁT HIỆN: "${c.substring(0,20)}..."`, "#ed4245");
                            sendNotify(`PHÁT HIỆN TỪ KHÓA NGUY HIỂM TẠI <#${tid}>! DỪNG KHẨN CẤP.`);
                            stopBot();
                            alert("CẢNH BÁO KHẨN CẤP: PHÁT HIỆN TỪ KHÓA NHẠY CẢM!");
                            return;
                        }
                    }
                } catch (e) {}
            }
        }, 3000);
    }

    async function executePrayCycle() {
        if (!isRunning || isBreaking) return;
        if (!navigator.onLine) {
             prayTimeout = setTimeout(executePrayCycle, 10000);
             return;
        }
        const validChannels = channelIds.filter(id => id.length > 5);
        const target = validChannels[Math.floor(Math.random() * validChannels.length)];
        const cmd = prayPool[Math.floor(Math.random() * prayPool.length)];
        await simulateTyping(cmd); 
        try {
            await fetch(`https://discord.com/api/v9/channels/${target}/messages`, {
                method: "POST", headers: { "Authorization": token, "Content-Type": "application/json" },
                body: JSON.stringify({ content: cmd })
            });
            pCount++; addLog(`🙏 PRAY: ${cmd}`, "#efb02e");
        } catch(e) {}
        prayTimeout = setTimeout(executePrayCycle, humanRandom(300000, 310000));
    }

    async function smartRefillGems(targetChannel, activeFlags) {
        if (!isRunning || !settings.autoGem || isBreaking) return;
        const userGemIds = settings.gemList.split(',').map(s => s.trim()).filter(s => s.length > 0);
        if (userGemIds.length === 0) return;
        let queue = [];
        for (const id of userGemIds) {
            const type = GEM_TYPES[id];
            if (type) {
                if (type === 1 && !activeFlags.gem1) queue.push(id);
                else if (type === 3 && !activeFlags.gem3) queue.push(id);
                else if (type === 4 && !activeFlags.gem4) queue.push(id);
            } else {
                if (settings.useEventGem && !activeFlags.gem2) queue.push(id);
            }
        }
        if (queue.length > 0) {
            addLog(`💎 MISSING GEMS: ${queue.join(", ")}. Refilling...`, "#9c27b0");
            for (const id of queue) {
                if (!isRunning || isBreaking) break;
                const cmd = `ouse ${id}`;
                await simulateTyping(cmd);
                try {
                    await fetch(`https://discord.com/api/v9/channels/${targetChannel}/messages`, {
                        method: "POST", headers: { "Authorization": token, "Content-Type": "application/json" },
                        body: JSON.stringify({ content: cmd })
                    });
                    gemCount++;
                    addLog(`💎 USE: ${cmd}`, "#d062d6");
                } catch(e) {}
                await new Promise(r => setTimeout(r, humanRandom(3000, 5000)));
            }
        }
    }

    // --- STYLE & UI ---
    // Xóa style cũ nếu có để tránh trùng
    const oldStyle = document.getElementById("naz-v06-wind-ui-extended");
    if(oldStyle) oldStyle.remove();

    const style = document.createElement('style');
    style.id = "naz-v06-wind-ui-extended";
    style.innerHTML = `
        @keyframes naz-rb{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        .naz-vip{background:linear-gradient(270deg,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#8f00ff);background-size:400% 400%;animation:naz-rb 3s ease infinite;color:#fff!important;border:none!important;text-shadow:1px 1px 2px rgba(0,0,0,0.5)}
        @keyframes naz-ne{from{box-shadow:0 0 4px #ed4245,0 0 10px #ed4245}to{box-shadow:0 0 10px #ed4245,0 0 20px #ed4245}}
        .naz-ad{animation:naz-ne 0.8s ease-in-out infinite alternate;color:#fff!important;border:1px solid #ed4245!important;background:rgba(237,66,69,0.2)!important;text-shadow:0 0 5px #ed4245}
        
        .wind-rank { font-size: 10px; padding: 2px 8px; border-radius: 6px; margin-left: 8px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; display: inline-block; vertical-align: middle; box-shadow: 0 0 10px rgba(0,0,0,0.3); }
        .wind-wrapper { position: fixed; top: 50px; right: 20px; z-index: 1000000; width: 500px; height: 500px; background: #09090b; border-radius: 16px; display: flex; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 20px 60px rgba(0,0,0,0.8); font-family: system-ui, -apple-system, sans-serif; transition: transform 0.2s, opacity 0.4s; touch-action: none; transform-origin: top right; color: #a1a1aa; }
        .wind-side { width: 60px; background: #18181b; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; align-items: center; padding: 20px 0; gap: 8px; }
        .wind-av-container { margin-bottom: 20px; cursor: move; }
        .wind-av { width: 40px; height: 40px; border-radius: 12px; border: 2px solid #5865f2; transition: 0.3s; }
        .wind-tab { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 10px; cursor: pointer; transition: 0.2s; color: #71717a; }
        .wind-tab:hover { background: rgba(255,255,255,0.05); color: #e4e4e7; }
        .wind-tab.active { background: #5865f2; color: #fff; box-shadow: 0 4px 12px rgba(88, 101, 242, 0.4); }
        .wind-tab svg { width: 20px; height: 20px; }
        .wind-main { flex: 1; padding: 24px; display: flex; flex-direction: column; background: #09090b; }
        .wind-page { display: none; height: 100%; flex-direction: column; }
        .wind-page.active { display: flex; }
        .wind-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .wind-title { font-size: 20px; font-weight: 900; background: linear-gradient(135deg, #a855f7, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.5px; }
        .wind-status-bar { display: flex; gap: 8px; background: #18181b; padding: 6px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
        .wind-stat { font-family: Consolas, monospace; font-size: 10px; font-weight: 700; color: #71717a; display: flex; align-items: center; gap: 4px; }
        .wind-divider { width: 1px; height: 10px; background: rgba(255,255,255,0.1); }
        .wind-card { background: #121215; border-radius: 12px; padding: 16px; border: 1px solid rgba(255,255,255,0.05); flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
        .wind-console { font-size: 11px; color: #a1a1aa; font-family: Consolas, monospace; line-height: 1.6; flex: 1; overflow-y: auto; scroll-behavior: smooth; }
        .wind-console::-webkit-scrollbar { width: 4px; }
        .wind-console::-webkit-scrollbar-thumb { background: #27272a; border-radius: 2px; }
        .wind-btn { background: #27272a; color: #fff; border: none; padding: 12px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.2s; font-size: 12px; width: 100%; margin-top: 15px; }
        .wind-btn:hover { background: #3f3f46; }
        .wind-btn.active { background: #5865f2; }
        .setting-group { margin-bottom: 16px; }
        .setting-label { font-size: 11px; font-weight: 600; color: #d4d4d8; margin-bottom: 6px; display: block; }
        .wind-input { width: 100%; background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 10px; color: #fff; font-size: 11px; outline: none; transition: 0.2s; box-sizing: border-box; }
        .wind-input:focus { border-color: #5865f2; }
        .wind-range { width: 100%; -webkit-appearance: none; background: #27272a; height: 6px; border-radius: 5px; outline: none; margin-top: 5px; }
        .wind-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #5865f2; cursor: pointer; transition: .2s; }
        .wind-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
        .wind-trigger { position: fixed; top: 15px; right: 15px; z-index: 1000001; background: #09090b; border: 1px solid #27272a; padding: 8px 16px; border-radius: 50px; color: #fff; font-weight: 700; font-size: 11px; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); transition: 0.2s; }
        .wind-trigger:hover { border-color: #5865f2; }
        .wind-trigger span { width: 8px; height: 8px; border-radius: 50%; background: #5865f2; box-shadow: 0 0 10px #5865f2; }
        .wind-hidden { transform: translateY(-20px) scale(0.95); opacity: 0; pointer-events: none; }
        .switch { position: relative; display: inline-block; width: 32px; height: 18px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #27272a; transition: .4s; border-radius: 20px; }
        .slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 3px; bottom: 3px; background-color: #71717a; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #5865f2; }
        input:checked + .slider:before { transform: translateX(14px); background-color: #fff; }
        .flex-row { display: flex; justify-content: space-between; align-items: center; }
    `;
    document.head.appendChild(style);

    // Xóa UI cũ nếu có
    const oldWrapper = document.getElementById("wind-root");
    if(oldWrapper) oldWrapper.remove();
    const oldTrigger = document.getElementById("naz-trigger-btn");
    if(oldTrigger) oldTrigger.remove();

    const wrapper = document.createElement('div');
    wrapper.className = "wind-wrapper wind-hidden";
    wrapper.id = "wind-root";
    wrapper.innerHTML = `
        <div class="wind-side">
            <div class="wind-av-container" id="drag-handle">
                <img id="w-av" class="wind-av" src="https://cdn.discordapp.com/embed/avatars/0.png">
            </div>
            <div class="wind-tab active" data-target="page-home" title="Home">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div class="wind-tab" data-target="page-profile" title="Profile">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div class="wind-tab" data-target="page-settings" title="Settings">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <div class="wind-tab" data-target="page-misc" title="Tools">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <div class="wind-tab" data-target="page-about" title="About">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div style="margin-top:auto; color:#ef4444" class="wind-tab" id="w-kill" title="Kill UI">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
        </div>
        
        <div class="wind-main">
            <div id="page-home" class="wind-page active">
                <div class="wind-header">
                    <div class="wind-title">NAZ OWO</div>
                    <div class="wind-status-bar">
                        <div class="wind-stat" id="w-ping" style="color:#22c55e">MS:--</div>
                        <div class="wind-divider"></div>
                        <div class="wind-stat" id="w-fps">FPS:--</div>
                        <div class="wind-divider"></div>
                        <div class="wind-stat"><span id="w-uptime" style="color:#fff">00:00:00</span></div>
                    </div>
                </div>
                <div class="wind-card"><div class="wind-console" id="w-log"></div></div>
                <button class="wind-btn active" id="w-run">START TOOLS</button>
            </div>

            <div id="page-profile" class="wind-page">
                <div class="wind-header"><div class="wind-title">User Profile</div></div>
                
                <div class="wind-card" style="flex: 0 0 auto; margin-bottom: 10px; flex-direction: row; align-items: center; gap: 15px; padding: 15px;">
                    <img id="p-av-big" src="https://cdn.discordapp.com/embed/avatars/0.png" style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid #5865f2;">
                    <div style="flex: 1; overflow: hidden;">
                        <div style="display: flex; align-items: center;">
                            <div id="p-name" style="font-size: 16px; font-weight: bold; color: #fff; max-width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">LOADING...</div>
                            <div id="p-rank" class="wind-rank" style="display:none">MEMBER</div>
                        </div>
                        <div style="font-size: 10px; color: #71717a;">ID: <span id="p-id">---</span></div>
                    </div>
                    <button id="btn-scan-stats" class="wind-btn" style="width: auto; margin: 0; padding: 6px 12px; font-size: 10px;">🔄 SCAN</button>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; overflow-y: auto;">
                    <div class="wind-card" style="align-items: center; justify-content: center; padding: 15px;">
                        <div style="color: #eab308; font-size: 20px;">💰</div>
                        <div style="font-size: 9px; color: #71717a; margin-top: 4px;">COWONCY</div>
                        <div id="stat-cash" style="font-size: 14px; font-weight: bold; color: #fff;">---</div>
                    </div>
                    <div class="wind-card" style="align-items: center; justify-content: center; padding: 15px;">
                        <div style="color: #3b82f6; font-size: 20px;">💎</div>
                        <div style="font-size: 9px; color: #71717a; margin-top: 4px;">WEAPON SHARD</div>
                        <div id="stat-shard" style="font-size: 14px; font-weight: bold; color: #fff;">---</div>
                    </div>
                    <div class="wind-card" style="align-items: center; justify-content: center; padding: 15px;">
                        <div style="color: #22c55e; font-size: 20px;">🐾</div>
                        <div style="font-size: 9px; color: #71717a; margin-top: 4px;">ZOO POINTS</div>
                        <div id="stat-zoo" style="font-size: 14px; font-weight: bold; color: #fff;">---</div>
                    </div>
                     <div class="wind-card" style="align-items: center; justify-content: center; padding: 15px;">
                        <div style="color: #a855f7; font-size: 20px;">✨</div>
                        <div style="font-size: 9px; color: #71717a; margin-top: 4px;">ESSENCE</div>
                        <div id="stat-essence" style="font-size: 14px; font-weight: bold; color: #fff;">---</div>
                    </div>
                </div>
            </div>
            
            <div id="page-settings" class="wind-page">
                <div class="wind-header"><div class="wind-title">Settings</div></div>
                <div class="wind-card">
                    <div class="setting-group">
                        <span class="setting-label">ID Kênh 1</span>
                        <input type="text" id="chan-1" class="wind-input" value="${channelIds[0] || ''}">
                    </div>
                    <div class="setting-group">
                        <span class="setting-label">ID Kênh 2</span>
                        <input type="text" id="chan-2" class="wind-input" value="${channelIds[1] || ''}">
                    </div>
                    <div class="setting-group">
                        <span class="setting-label">ID Kênh 3</span>
                        <input type="text" id="chan-3" class="wind-input" value="${channelIds[2] || ''}">
                    </div>
                    <div class="setting-group" style="margin-top:auto; border-top:1px solid #27272a; padding-top:15px;">
                        <span class="setting-label" style="color:#a855f7">ID Thông Báo Webhook/Channel</span>
                        <input type="text" id="notify-id" class="wind-input" value="${NOTIFY_CHANNEL_ID}">
                    </div>
                    <div class="flex-row" style="margin-top:10px;">
                        <span class="setting-label">UI Scale</span>
                        <div>
                            <button class="wind-btn" style="width:30px; padding:4px;" id="btn-zoom-out">-</button>
                            <button class="wind-btn" style="width:30px; padding:4px;" id="btn-zoom-in">+</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="page-misc" class="wind-page">
                <div class="wind-header"><div class="wind-title">Misc</div></div>
                <div class="wind-card">
                    <div class="setting-group">
                        <span class="setting-label">Gem ID </span>
                        <input type="text" id="gem-list" class="wind-input" value="${settings.gemList}">
                    </div>
                    
                    <div class="flex-row" style="margin-top:10px; margin-bottom:10px;">
                        <div>
                            <span class="setting-label" style="margin:0">Sử Dụng Gem Event</span>
                            <div style="font-size:9px; color:#52525b">Chỉ nên bật khi có Event Pet</div>
                        </div>
                        <label class="switch"><input type="checkbox" id="set-event-gem" ${settings.useEventGem?'checked':''}> <span class="slider"></span></label>
                    </div>

                    <div class="setting-group">
                        <div class="flex-row">
                            <span class="setting-label" style="margin:0">Tỉ lệ Chat AI</span>
                            <span id="lbl-ai-rate" style="font-size:10px; color:#a1a1aa">${settings.aiRate}%</span>
                        </div>
                        <input type="range" id="set-ai-rate" class="wind-range" min="0" max="100" value="${settings.aiRate}">
                    </div>

                    <div class="setting-group">
                        <div class="flex-row">
                            <span class="setting-label" style="margin:0">Tỉ lệ Mini Game</span>
                            <span id="lbl-game-rate" style="font-size:10px; color:#a1a1aa">${settings.gameRate}%</span>
                        </div>
                        <input type="range" id="set-game-rate" class="wind-range" min="0" max="100" value="${settings.gameRate}">
                    </div>

                    <div class="setting-group" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; margin-top: 10px;">
                        <div class="flex-row" style="margin-bottom: 5px;">
                            <span class="setting-label" style="color:#eab308">Auto Buy Item</span>
                            <label class="switch"><input type="checkbox" id="set-auto-buy" ${settings.autoBuy?'checked':''}> <span class="slider"></span></label>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <div style="flex: 1;">
                                <span style="font-size:9px; color:#71717a">Item ID</span>
                                <input type="text" id="buy-id" class="wind-input" value="${settings.buyId}">
                            </div>
                            <div style="flex: 1;">
                                <span style="font-size:9px; color:#71717a">Quantity</span>
                                <input type="text" id="buy-qty" class="wind-input" value="${settings.buyQty}">
                            </div>
                        </div>
                    </div>

                    <div class="flex-row" style="margin-top:15px; background:#18181b; padding:10px; border-radius:8px;">
                        <div>
                            <span class="setting-label" style="margin:0">Auto Gem</span>
                            <div style="font-size:10px; color:#52525b">Auto sử dụng Gem BUFF </div>
                        </div>
                        <label class="switch"><input type="checkbox" id="set-gem" ${settings.autoGem?'checked':''}> <span class="slider"></span></label>
                    </div>
                </div>
            </div>
            
            <div id="page-about" class="wind-page">
                <div class="wind-header"><div class="wind-title">System Info</div></div>
                <div class="wind-card" style="justify-content:center; align-items:center; text-align:center;">
                    <div style="font-size:40px; margin-bottom:10px;">🛡️</div>
                    <h3 style="color:#fff; margin:0;">NAZ PROTOCOL</h3>
                    <p style="font-size:11px; color:#52525b; margin-top:5px;">Version 0.6.0 (Auto Buy)</p>
                    <div style="margin-top:20px; font-size:10px; color:#3f3f46;">
                        Developed by Huīhuáng Hg.<br>
                        Optimized for Security & Humanization
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(wrapper);

    const masterTrigger = document.createElement('div');
    masterTrigger.className = "wind-trigger";
    masterTrigger.id = "naz-trigger-btn";
    masterTrigger.innerHTML = `<span></span> NAZ`;
    document.body.appendChild(masterTrigger);

    function addLog(msg, color = "#71717a") {
        const time = new Date().toLocaleTimeString('vi-VN', {hour12:false});
        const div = document.createElement('div');
        div.innerHTML = `<span style="color:#3f3f46; margin-right:8px;">[${time}]</span><span style="color:${color}">${msg}</span>`;
        const logEl = document.getElementById('w-log');
        if(logEl) {
            logEl.appendChild(div); 
            logEl.scrollTop = logEl.scrollHeight; 
        }
    }

    const stopBot = () => {
        isRunning = false;
        clearInterval(timerInterval); clearInterval(reportInterval);
        clearInterval(scanInterval); clearTimeout(prayTimeout); 
        cancelAnimationFrame(fpsLoop);
        const rb = document.getElementById('w-run');
        if(rb) { rb.innerText = "START TOOLS"; rb.classList.add('active'); rb.style.background = ""; }
        masterTrigger.querySelector('span').style.background = "#5865f2";
    };

    const runBtn = document.getElementById('w-run');
    runBtn.onclick = async () => {
        if(!isRunning) {
            isRunning = true; 
            document.getElementById('w-log').innerHTML = "";
            
            addLog("Khởi Tạo NAZ OwO...", "#a855f7");
            addLog(`> Liên Kết Channels: ${channelIds.filter(id=>id.length>5).length}`, "#71717a");
            addLog(`> Auto Buy: ${settings.autoBuy ? "ON" : "OFF"} (ID:${settings.buyId} x${settings.buyQty})`, "#eab308");
            
            runBtn.style.background = "#eab308"; 
            runBtn.style.color = "#000";
            masterTrigger.querySelector('span').style.background = "#eab308";
            
            let countdown = 15;
            addLog("🛡️ Quét Bảo Mật OwO Bot...", "#eab308");
            startSuperScan(); 
            startSystemMonitors(); 

            for (let i = 0; i < 15; i++) {
                if (!isRunning) return; 
                runBtn.innerText = `Bảo Mật OwO Bot (${countdown}s)...`;
                countdown--;
                await new Promise(r => setTimeout(r, 1000));
            }

            if (isRunning) {
                startTime = new Date();
                timerInterval = setInterval(() => {
                    const diff = new Date() - startTime;
                    const h = Math.floor(diff/3600000).toString().padStart(2,'0');
                    const m = Math.floor((diff%3600000)/60000).toString().padStart(2,'0');
                    const s = Math.floor((diff%60000)/1000).toString().padStart(2,'0');
                    document.getElementById('w-uptime').innerText = `${h}:${m}:${s}`;
                }, 1000);
                reportInterval = setInterval(sendPeriodicReport, 1800000);
                executePrayCycle();
                
                runBtn.innerText = "OFF TOOLS"; 
                runBtn.style.background = "#ef4444";
                runBtn.style.color = "#fff";
                masterTrigger.querySelector('span').style.background = "#22c55e";
                addLog("✅ Quét Hoàn Tất (An Toàn). START TOOLS.", "#22c55e");
                mainLoop();
            }
        } else { stopBot(); addLog("🛑 Tools Đã Tắt.", "#ef4444"); }
    };

    async function mainLoop() {
        while (isRunning) {
            if (!navigator.onLine) {
                addLog("🔌 Mất Kết Nối Mạng. Dừng 30s...", "#ef4444");
                await new Promise(r => setTimeout(r, 30000)); 
                continue;
            }

            const breakTime = getLongBreakTime();
            if (breakTime === -1) {
                addLog("🏁 SESSION LIMIT REACHED (3H).", "#ef4444");
                sendNotify("Đã farm đủ 3 tiếng. Hệ thống tự tắt.");
                stopBot(); break;
            } else if (breakTime > 0) {
                isBreaking = true;
                addLog(`💤 Nghỉ Giải Lao: ${(breakTime/60000).toFixed(1)}m...`, "#eab308");
                await new Promise(r => setTimeout(r, breakTime));
                isBreaking = false; addLog("🌅 Tiếp Tục Tools.", "#22c55e");
            }

            const validChannels = channelIds.filter(id => id.length > 5);
            if (validChannels.length === 0) {
                addLog("❌ ERROR: Chưa Có Kênh Nào Được Sử Dụng ", "#ef4444");
                stopBot(); break;
            }
            const target = validChannels[Math.floor(Math.random() * validChannels.length)];

            if(settings.daily) {
                await fetch(`https://discord.com/api/v9/channels/${target}/messages`, {
                    method: "POST", headers: { "Authorization": token, "Content-Type": "application/json" },
                    body: JSON.stringify({ content: "odaily" })
                });
                settings.daily = false; await new Promise(r => setTimeout(r, 5000));
            }

            let cmds = [];
            let num = Math.floor(Math.random() * 3) + 1;
            for(let i=0; i<num; i++) {
                let roll = Math.random();
                if (roll < 0.45) cmds.push(huntPool[Math.floor(Math.random()*huntPool.length)]);
                else if (roll < 0.85) cmds.push(battlePool[Math.floor(Math.random()*battlePool.length)]);
                else cmds.push(extraPool[Math.floor(Math.random()*extraPool.length)]);
            }

            for (const cmd of cmds) {
                if (!isRunning || isBreaking) break;
                
                await simulateTyping(cmd); 
                
                try {
                    const res = await fetch(`https://discord.com/api/v9/channels/${target}/messages`, {
                        method: "POST", headers: { "Authorization": token, "Content-Type": "application/json" },
                        body: JSON.stringify({ content: cmd })
                    });

                    if (!res.ok) {
                        addLog(`⚠️ API ERR ${res.status}. Retrying...`, "#ef4444");
                        await new Promise(r => setTimeout(r, 10000));
                    }

                } catch (err) {
                    addLog("🔌 NETWORK ERR. Waiting...", "#ef4444");
                    await new Promise(r => setTimeout(r, 15000));
                    continue;
                }

                if(huntPool.includes(cmd)) {
                    hCount++;
                    if(settings.autoGem) {
                        setTimeout(async () => {
                            try {
                                const check = await fetch(`https://discord.com/api/v9/channels/${target}/messages?limit=8`, { headers: { Authorization: token } });
                                const msgs = await check.json();
                                const myHuntMsg = msgs.find(m => {
                                    const content = (m.content || "").toLowerCase();
                                    const embedDesc = (m.embeds && m.embeds[0] && m.embeds[0].description) ? m.embeds[0].description.toLowerCase() : "";
                                    const fullText = content + " " + embedDesc;
                                    
                                    return m.author.id === "408785106942164992" && 
                                           (fullText.includes(MY_USER_ID) || m.mentions.some(u => u.id === MY_USER_ID) || (myGlobalName && fullText.includes(myGlobalName.toLowerCase()))) &&
                                           (fullText.includes("found") || fullText.includes("gained") || fullText.includes("hunt is"));
                                });

                                if (myHuntMsg) {
                                    const content = (myHuntMsg.content || "") + (myHuntMsg.embeds[0] ? myHuntMsg.embeds[0].description : "");
                                    const activeFlags = {
                                        gem1: /:[a-z]*gem1:/.test(content),
                                        gem3: /:[a-z]*gem3:/.test(content), 
                                        gem4: /:[a-z]*gem4:/.test(content), 
                                        gem2: /:[a-z]*gem2:/.test(content)  
                                    };
                                    await smartRefillGems(target, activeFlags);
                                }
                            } catch(e) { console.error(e); }
                        }, 5000); 
                    }

                } else if(battlePool.includes(cmd)) bCount++;
                
                addLog(`> ${cmd}`, "#e4e4e7");
                
                const sleepTime = humanRandom(8000, 16000);
                await new Promise(r => setTimeout(r, sleepTime));
            }

            if (isRunning && !isBreaking && settings.autoBuy) {
                const buyCmd = `obuy ${settings.buyId} ${settings.buyQty}`;
                await simulateTyping(buyCmd);
                await fetch(`https://discord.com/api/v9/channels/${target}/messages`, {
                    method: "POST", headers: { "Authorization": token, "Content-Type": "application/json" },
                    body: JSON.stringify({ content: buyCmd })
                });
                addLog(`🛒 BUYING: ${buyCmd}`, "#fcd34d");
                await new Promise(r => setTimeout(r, humanRandom(3000, 5000)));
            }

            if (isRunning && !isBreaking && Math.random() < (settings.gameRate / 100)) {
                const game = miniGamePool[Math.floor(Math.random() * miniGamePool.length)];
                const bet = Math.floor(Math.random() * 10) + 1;
                const gameCmd = `${game} ${bet}`;
                await simulateTyping(gameCmd); 
                await fetch(`https://discord.com/api/v9/channels/${target}/messages`, {
                    method: "POST", headers: { "Authorization": token, "Content-Type": "application/json" },
                    body: JSON.stringify({ content: gameCmd })
                });
                addLog(`🎮 GAME: ${gameCmd}`, "#d8b4fe");
                await new Promise(r => setTimeout(r, humanRandom(6000, 9000)));
            }

            if (isRunning && settings.aiRate > 0 && Math.random() < (settings.aiRate / 100)) {
                const msg = aiMessages[Math.floor(Math.random()*aiMessages.length)];
                await simulateTyping(msg); 
                await fetch(`https://discord.com/api/v9/channels/${target}/messages`, {
                    method: "POST", headers: { "Authorization": token, "Content-Type": "application/json" },
                    body: JSON.stringify({ content: msg })
                });
                addLog(`💬 AI: ${msg}`, "#3b82f6");
                await new Promise(r => setTimeout(r, 5000));
            }

            if (!isRunning) break;
            await new Promise(r => setTimeout(r, humanRandom(7000, 15000)));
        }
    }

    document.querySelectorAll('.wind-tab[data-target]').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.wind-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.wind-page').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active');
        };
    });

    document.getElementById('btn-zoom-in').onclick = () => { currentZoom += 0.1; wrapper.style.transform = `scale(${currentZoom})`; };
    document.getElementById('btn-zoom-out').onclick = () => { if(currentZoom > 0.5) { currentZoom -= 0.1; wrapper.style.transform = `scale(${currentZoom})`; } };

    document.getElementById('chan-1').oninput = (e) => { channelIds[0] = e.target.value.trim(); };
    document.getElementById('chan-2').oninput = (e) => { channelIds[1] = e.target.value.trim(); };
    document.getElementById('chan-3').oninput = (e) => { channelIds[2] = e.target.value.trim(); };

    document.getElementById('notify-id').oninput = (e) => { NOTIFY_CHANNEL_ID = e.target.value.trim(); };

    document.getElementById('set-gem').onchange = (e) => settings.autoGem = e.target.checked;
    document.getElementById('gem-list').oninput = (e) => settings.gemList = e.target.value;

    document.getElementById('set-ai-rate').oninput = (e) => {
        settings.aiRate = parseInt(e.target.value);
        document.getElementById('lbl-ai-rate').innerText = `${settings.aiRate}%`;
    };
    document.getElementById('set-game-rate').oninput = (e) => {
        settings.gameRate = parseInt(e.target.value);
        document.getElementById('lbl-game-rate').innerText = `${settings.gameRate}%`;
    };
    document.getElementById('set-auto-buy').onchange = (e) => settings.autoBuy = e.target.checked;
    document.getElementById('buy-id').oninput = (e) => settings.buyId = e.target.value.trim();
    document.getElementById('buy-qty').oninput = (e) => settings.buyQty = e.target.value.trim();

    masterTrigger.onclick = () => wrapper.classList.toggle('wind-hidden');
    document.getElementById('w-kill').onclick = () => { stopBot(); wrapper.remove(); masterTrigger.remove(); style.remove(); };

    // --- LOGIC SCAN PROFILE ---
    async function scanProfileStats() {
        const target = channelIds.find(id => id.length > 5);
        if (!target) { alert("Chưa cấu hình Channel ID để quét!"); return; }
        
        const btn = document.getElementById('btn-scan-stats');
        if(btn) btn.innerText = "WAIT (20s)...";
        console.log("[NAZ] Bắt đầu chuỗi quét...");
        
        try {
            await simulateTyping("ocash");
            await fetch(`https://discord.com/api/v9/channels/${target}/messages`, {
                method: "POST", headers: { "Authorization": token, "Content-Type": "application/json" },
                body: JSON.stringify({ content: "ocash" })
            });
            await new Promise(r => setTimeout(r, 5000));
            let msgs = await (await fetch(`https://discord.com/api/v9/channels/${target}/messages?limit=10`, { headers: { "Authorization": token } })).json();
            let msg = msgs.find(m => m.author.id === "408785106942164992" && (m.content.includes("have") || m.content.includes("Cowoncy")));
            if (msg) {
                let match = msg.content.match(/have\s+([0-9,]+)/) || msg.content.match(/__([0-9,]+)__/) || msg.content.match(/\*\*([0-9,]+)\*\*/);
                if (match) document.getElementById('stat-cash').innerText = match[1];
            }
        } catch(e) {}

        try {
            await simulateTyping("ozoo");
            await fetch(`https://discord.com/api/v9/channels/${target}/messages`, {
                method: "POST", headers: { "Authorization": token, "Content-Type": "application/json" },
                body: JSON.stringify({ content: "ozoo" })
            });
            await new Promise(r => setTimeout(r, 5000));
            let msgs = await (await fetch(`https://discord.com/api/v9/channels/${target}/messages?limit=10`, { headers: { "Authorization": token } })).json();
            let msg = msgs.find(m => m.author.id === "408785106942164992" && (m.content.includes("Zoo Points") || (m.embeds[0] && m.embeds[0].description && m.embeds[0].description.includes("Zoo Points"))));
            if (msg) {
                let fullText = (msg.content || "") + " " + (msg.embeds[0] ? msg.embeds[0].description : "");
                let match = fullText.match(/Zoo Points:[^0-9]*([0-9,]+)/); 
                if (match) document.getElementById('stat-zoo').innerText = match[1];
            }
        } catch(e) {}

        try {
            await simulateTyping("ows");
            await fetch(`https://discord.com/api/v9/channels/${target}/messages`, {
                method: "POST", headers: { "Authorization": token, "Content-Type": "application/json" },
                body: JSON.stringify({ content: "ows" })
            });
            await new Promise(r => setTimeout(r, 5000));
            let msgs = await (await fetch(`https://discord.com/api/v9/channels/${target}/messages?limit=10`, { headers: { "Authorization": token } })).json();
            let msg = msgs.find(m => m.author.id === "408785106942164992" && m.content.includes("Weapon Shards"));
            if (msg) {
                let match = msg.content.match(/have\s+\*\*([0-9,]+)\*\*\s+Weapon/); 
                if (match) document.getElementById('stat-shard').innerText = match[1];
            }
        } catch(e) {}

        try {
            await simulateTyping("ohb");
            await fetch(`https://discord.com/api/v9/channels/${target}/messages`, {
                method: "POST", headers: { "Authorization": token, "Content-Type": "application/json" },
                body: JSON.stringify({ content: "ohb" })
            });
            await new Promise(r => setTimeout(r, 5000));
            let msgs = await (await fetch(`https://discord.com/api/v9/channels/${target}/messages?limit=10`, { headers: { "Authorization": token } })).json();
            let msg = msgs.find(m => m.author.id === "408785106942164992" && m.embeds && m.embeds.length > 0);
            if (msg) {
                const rawEmbed = JSON.stringify(msg.embeds);
                const match = rawEmbed.match(/Essence\s*-\s*([0-9,]+)/) || rawEmbed.match(/Essence.*?([0-9,]+)/);
                if (match) document.getElementById('stat-essence').innerText = match[1];
            }
        } catch(e) {}
        
        if(btn) btn.innerText = "🔄 SCAN";
    }

    document.getElementById('btn-scan-stats').onclick = scanProfileStats;
    document.getElementById('set-event-gem').onchange = (e) => settings.useEventGem = e.target.checked;

    // Đoạn lấy profile và SET RANK (CÓ CHECK CLASS MỚI)
    (async () => {
        try {
            const res = await fetch('https://discord.com/api/v9/users/@me', { headers: { Authorization: token } });
            const u = await res.json();
            
            // Load Avatar & Name
            if (u.id && u.avatar) document.getElementById('w-av').src = `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png`;
            if (u.id && u.avatar) document.getElementById('p-av-big').src = `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png`;
            
            const displayName = u.global_name || u.username;
            document.getElementById('p-name').innerText = displayName;
            document.getElementById('p-id').innerText = u.id;
            myGlobalName = displayName;

            // --- LOGIC RANK (CẬP NHẬT HIỆU ỨNG) ---
            const rankKey = USER_RANKS[u.id] || "MEMBER"; 
            const rankData = RANK_DEFINITIONS[rankKey];
            const rankEl = document.getElementById('p-rank');
            
            if (rankEl && rankData) {
                rankEl.innerText = rankData.text;
                rankEl.style.display = "inline-block"; 
                
                // KIỂM TRA ĐỂ GẮN HIỆU ỨNG VISUAL
                if(rankKey === "VIP") {
                    rankEl.className = "wind-rank naz-vip"; // Gắn class 7 màu
                } else if(rankKey === "ADMIN") {
                    rankEl.className = "wind-rank naz-ad";  // Gắn class Neon
                } else {
                    // Rank thường (Member, Premium) dùng style mặc định
                    rankEl.className = "wind-rank";
                    rankEl.style.color = rankData.color;
                    rankEl.style.background = rankData.bg;
                    rankEl.style.border = `1px solid ${rankData.border}`;
                }
            }
        } catch(e) { console.error(e); }
    })();

    console.log("NAZ V0.1 (VISUAL UPDATE) LOADED!");
})();
