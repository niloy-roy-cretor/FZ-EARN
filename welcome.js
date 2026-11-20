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
    .w-overlay { position: fixed; inset: 0; background: radial-gradient(circle at 50% -10%, #123154 0%, #060b17 65%, #04070f 100%); z-index: 999; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 22px 18px; text-align: center; overflow-y: auto; transition: opacity 0.35s ease, transform 0.35s ease, visibility 0.35s ease; }
    .w-overlay.hide { opacity: 0; transform: scale(1.03); visibility: hidden; pointer-events: none; }
    .w-glow-bg { position: fixed; top: -80px; left: 50%; transform: translateX(-50%); width: 280px; height: 280px; background: radial-gradient(circle, rgba(16,185,129,0.22), transparent 70%); pointer-events: none; }
    .w-ring { padding: 4px; border-radius: 30px; background: linear-gradient(135deg, #fbbf24, #10b981, #38bdf8); box-shadow: 0 0 36px rgba(251,191,36,0.3); margin-bottom: 14px; animation: wPulse 2.5s infinite alternate; position: relative; z-index: 1; }
    @keyframes wPulse { from { box-shadow: 0 0 22px rgba(251,191,36,0.25); } to { box-shadow: 0 0 42px rgba(16,185,129,0.45); } }
    .w-logo { width: 92px; height: 92px; border-radius: 26px; background: #091526; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .w-logo img { width: 100%; height: 100%; object-fit: cover; }
    .w-pill { font-size: 10px; font-weight: 800; color: #34d399; background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.35); padding: 4px 12px; border-radius: 999px; margin-bottom: 8px; letter-spacing: 0.8px; }
    .w-brand { font-size: 30px; font-weight: 900; background: linear-gradient(90deg, #fbbf24, #fef08a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 4px; }
    .w-hello { font-size: 19px; font-weight: 700; color: #ffffff; margin-bottom: 4px; }
    .w-sub { font-size: 13px; color: #94a3b8; margin-bottom: 18px; }
    .w-cards { width: 100%; max-width: 345px; display: grid; gap: 9px; margin-bottom: 20px; }
    .w-card { display: flex; align-items: center; gap: 12px; background: rgba(15,23,42,0.85); border: 1px solid #1e2d4d; border-radius: 14px; padding: 11px 14px; text-align: left; }
    .w-ic { width: 38px; height: 38px; border-radius: 11px; background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.25); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
    .w-card b { display: block; font-size: 13px; color: #f8fafc; margin-bottom: 1px; }
    .w-card span { font-size: 12px; color: #94a3b8; }
    .w-btn { width: 100%; max-width: 345px; border: none; border-radius: 15px; padding: 16px; font-size: 16px; font-weight: 800; color: #050914; background: linear-gradient(135deg, #f59e0b, #fbbf24); box-shadow: 0 8px 24px rgba(245,158,11,0.35); cursor: pointer; transition: transform 0.15s ease; }
    .w-btn:active { transform: scale(0.97); }
  `;
  document.head.appendChild(style);

  const root = document.getElementById("welcomeRoot");
  if (!root) return;

  root.innerHTML = `
    <div class="w-overlay" id="welcomeScreen">
      <div class="w-glow-bg"></div>
      <div class="w-ring">
        <div class="w-logo">
          <img src="logo.png" alt="Logo" onerror="this.style.display='none';document.getElementById('wFallbackSvg').style.display='block';" />
          <svg id="wFallbackSvg" style="display:none;" width="52" height="52" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4 14h7l-1 8 10-12h-7l0-8z" fill="#fbbf24" stroke="#fef3c7" stroke-width="1.2" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      <div class="w-pill">● OFFICIAL EARNING APP</div>
      <div class="w-brand">FZ ERAN</div>
      <div class="w-hello">স্বাগতম, <span id="wUserName"></span>! 👋</div>
      <div class="w-sub">সহজ কাজ করে প্রতিদিন টাকা আয় করুন</div>
      <div class="w-cards">
        <div class="w-card">
          <div class="w-ic">🎁</div>
          <div><b>ডেইলি ফ্রি বোনাস</b><span>প্রতি ২৪ ঘণ্টায় +১০ টাকা</span></div>
        </div>
        <div class="w-card">
          <div class="w-ic">🎡</div>
          <div><b>লাকি স্পিন হুইল</b><span>প্রতি স্পিনে +২০ টাকা পর্যন্ত</span></div>
        </div>
        <div class="w-card">
          <div class="w-ic">📺</div>
          <div><b>বিজ্ঞাপন দেখে আয়</b><span>প্রতি বিজ্ঞাপনে +৫ টাকা</span></div>
        </div>
        <div class="w-card">
          <div class="w-ic">💳</div>
          <div><b>বিকাশ ও নগদ পেমেন্ট</b><span>সর্বনিম্ন Withdraw: ৳৩০০ টাকা</span></div>
        </div>
      </div>
      <button class="w-btn" id="wEnterBtn">🚀 কাজ শুরু করুন →</button>
    </div>
  `;

  document.getElementById("wUserName").innerText = userName;
  document.getElementById("wEnterBtn").addEventListener("click", function () {
    document.getElementById("welcomeScreen").classList.add("hide");
  });
})();
