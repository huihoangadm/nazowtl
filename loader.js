(async()=>{
  const BASE = "https://raw.githubusercontent.com/huihoangadm/nazowtl/refs/heads/main/core.js"; 
 
  const hash = (str) => {
      let h = 0xdeadbeef;
      for(let i=0;i<str.length;i++) h=Math.imul(h^str.charCodeAt(i), 2654435761);
      return ((h^h>>>16)>>>0).toString(16);
  };

  const ui=document.createElement("div");
  ui.innerHTML=`<style>.z{position:fixed;inset:0;background:#000e;z-index:99999;display:flex;justify-content:center;align-items:center;font-family:sans-serif}.b{background:#09090b;padding:25px;border:1px solid #333;border-radius:10px;width:280px;text-align:center}.i{width:100%;padding:10px;margin:5px 0;background:#18181b;border:1px solid #3f3f46;color:#fff;border-radius:5px;box-sizing:border-box}.btn{width:100%;padding:10px;margin-top:10px;background:#a855f7;color:#fff;border:none;border-radius:5px;cursor:pointer;font-weight:bold}.btn:hover{opacity:0.8}</style><div class=z><div class=b><h2 style="color:#fff;margin:0 0 15px">🔐 SECURE LOGIN</h2><input id=uid class=i placeholder="Discord ID"><input id=pass type=password class=i placeholder="Mật khẩu"><input id=token type=password class=i placeholder="Token Discord"><button id=go class=btn>LOGIN & START</button></div></div>`;
  document.body.appendChild(ui);

  document.getElementById("go").onclick=async()=>{
    const u=document.getElementById("uid").value.trim();
    const p_raw=document.getElementById("pass").value.trim(); 
    const t=document.getElementById("token").value.trim();
    const btn=document.getElementById("go");

    if(!u||!p_raw||!t) return alert("Vui lòng nhập đủ thông tin!");
    
    btn.innerText="CHECKING...";
    try {
      const db = await(await fetch(BASE+"database.json?t="+Date.now())).json();
       
      const p_hashed = hash(p_raw);

      if(db.users[u] === p_hashed) {
        btn.innerText = "SUCCESS! LOADING...";
        btn.style.background = "#22c55e";
        
        window.NAZ_SECRET_TOKEN = t;
        window.NAZ_ACCESS_KEY = "Naz_Pass";
        window.NAZ_CURRENT_USER_ID = u;
        window.NAZ_ONLINE_RANKS = db.ranks;

        const core = await(await fetch(BASE+"core.js?t="+Date.now())).text();
        ui.remove();
        const s=document.createElement("script"); s.textContent=core; document.body.appendChild(s);
      } else { alert("❌ Sai ID hoặc Mật khẩu!"); btn.innerText="TRY AGAIN"; }
    } catch(e) { alert("⚠️ Lỗi kết nối!"); btn.innerText="ERROR"; console.error(e);}
  }
})();
