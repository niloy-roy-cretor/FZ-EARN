(function () {
  const tg = window.Telegram ? window.Telegram.WebApp : null;
  if (tg) { tg.ready(); tg.expand(); }

  const q = new URLSearchParams(window.location.search);
  const tgUser = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user : null;
  if (tgUser && tgUser.first_name) {
    localStorage.setItem("fz_uname", tgUser.first_name);
  }
  const userName = (tgUser && tgUser.first_name) || q.get("uname") || localStorage.getItem("fz_uname") || "বন্ধু";

  const style = document.createElement("style");
  style.textContent = `
    .w-overlay { position: fixed; inset: 0; background: radial-gradient(circle at 50% 0%, #1c1917 0%, #090b10 55%, #040507 100%); z-index: 999; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px 16px; text-align: center; overflow-y: auto; transition: opacity 0.4s ease, transform 0.4s ease, visibility 0.4s ease; }
    .w-overlay.hide { opacity: 0; transform: scale(1.03); visibility: hidden; pointer-events: none; }
    .w-frame { width: 100%; max-width: 360px; background: linear-gradient(180deg, rgba(24,24,27,0.92), rgba(9,11,16,0.96)); border: 1px solid rgba(212,175,55,0.42); border-radius: 26px; padding: 24px 18px 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(252,246,186,0.2); position: relative; }
    .w-crest { display: inline-block; font-size: 10px; font-weight: 800; letter-spacing: 1.6px; color: #f3e5ab; border: 1px solid rgba(212,175,55,0.45); background: rgba(212,175,55,0.1); padding: 4px 14px; border-radius: 999px; margin-bottom: 14px; }
    .w-ring { width: 98px; height: 98px; margin: 0 auto 14px; padding: 3px; border-radius: 50%; background: linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #aa771c); box-shadow: 0 0 28px rgba(212,175,55,0.35); }
    .w-logo { width: 100%; height: 100%; border-radius: 50%; background: #0c0f16; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px solid #090b10; }
    .w-logo img { width: 100%; height: 100%; object-fit: cover; }
    .w-brand { font-size: 28px; font-weight: 900; letter-spacing: 2px; background: linear-gradient(90deg, #bf953f, #fcf6ba, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 4px; }
    .w-divider { font-size: 12px; color: #d4af37; letter-spacing: 4px; margin: 4px 0 10px; opacity: 0.85; }
    .w-hello { font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 4px; }
    .w-sub { font-size: 12.5px; color: #a1a1aa; margin-bottom: 18px; }
    .w-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
    .w-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(212,175,55,0.22); border-radius: 14px; padding: 12px 10px; text-align: center; }
    .w-box .ic { font-size: 20px; margin-bottom: 4px; }
    .w-box b { display: block; font-size: 12.5px; color: #fef3c7; margin-bottom: 2px; }
    .w-box span { font-size: 11.5px; color: #a1a1aa; }
    .w-btn { position: relative; overflow: hidden; width: 100%; border: none; border-radius: 14px; padding: 15px; font-size: 15px; font-weight: 800; color: #090b10; background: linear-gradient(135deg, #bf953f, #fcf6ba, #d4af37); box-shadow: 0 8px 24px rgba(212,175,55,0.35); cursor: pointer; transition: transform 0.15s ease; }
    .w-btn:active { transform: scale(0.97); }
    .w-btn::after { content: ""; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent); animation: wShine 2.6s infinite; }
    @keyframes wShine { 0% { left: -100%; } 60%, 100% { left: 150%; } }
  `;
  document.head.appendChild(style);

  const root = document.getElementById("welcomeRoot");
  if (!root) return;

  root.innerHTML = `
    <div class="w-overlay" id="welcomeScreen">
      <div class="w-frame">
        <div class="w-crest">✦ FZ ERAN ROYAL CLUB ✦</div>
        <div class="w-ring">
          <div class="w-logo">
            <img src="logo.png" alt="Logo" onerror="this.style.display='none';document.getElementById('wFallbackSvg').style.display='flex';" />
            <div id="wFallbackSvg" style="display:none;align-items:center;justify-content:center;font-weight:900;font-size:26px;color:#fcf6ba;letter-spacing:1px;">FZ</div>
          </div>
        </div>
        <div class="w-brand">FZ ERAN</div>
        <div class="w-divider">━━ ✦ ━━</div>
        <div class="w-hello">স্বাগতম, <span id="wUserName"></span></div>
        <div class="w-sub">নিরাপদে কাজ করে প্রতিদিন আয় করুন</div>
        <div class="w-grid">
          <div class="w-box"><div class="ic">🎁</div><b>ডেইলি বোনাস</b><span>+৳১০ টাকা</span></div>
          <div class="w-box"><div class="ic">🎡</div><b>লাকি স্পিন</b><span>+৳২০ পর্যন্ত</span></div>
          <div class="w-box"><div class="ic">📺</div><b>অ্যাডস আয়</b><span>+৳৫ টাকা</span></div>
          <div class="w-box"><div class="ic">💳</div><b>বিকাশ / নগদ</b><span>সর্বনিম্ন ৳৩০০</span></div>
        </div>
        <button class="w-btn" id="wEnterBtn">🚀 কাজ শুরু করুন →</button>
      </div>
    </div>
  `;

  document.getElementById("wUserName").innerText = userName;
  document.getElementById("wEnterBtn").addEventListener("click", function () {
    document.getElementById("welcomeScreen").classList.add("hide");
  });
})();
