(function () {
  const tg = window.Telegram ? window.Telegram.WebApp : null;
  if (tg) { tg.ready(); tg.expand(); }

  const q = new URLSearchParams(window.location.search);
  const tgUser = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user : null;
  if (tgUser && tgUser.first_name) {
    localStorage.setItem("fz_uname", tgUser.first_name);
  }
  const userName = (tgUser && tgUser.first_name) || q.get("uname") || localStorage.getItem("fz_uname") || "Friend";

  const style = document.createElement("style");
  style.textContent = `
    .w-overlay { position: fixed; inset: 0; background-color: #050608; background-image: radial-gradient(circle at 50% 18%, rgba(212,175,55,0.16) 0%, rgba(12,14,20,0.92) 48%, #040507 100%), radial-gradient(rgba(212,175,55,0.09) 1px, transparent 1px); background-size: 100% 100%, 22px 22px; z-index: 999; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 24px 18px; text-align: center; overflow-y: auto; transition: opacity 0.45s ease, transform 0.45s ease, visibility 0.45s ease; }
    .w-overlay.hide { opacity: 0; transform: scale(1.03); visibility: hidden; pointer-events: none; }
    .w-frame { width: 100%; max-width: 350px; background: linear-gradient(165deg, rgba(26,24,22,0.94) 0%, rgba(10,11,15,0.98) 100%); border: 1px solid rgba(212,175,55,0.5); border-radius: 28px; padding: 36px 24px 28px; box-shadow: 0 28px 70px rgba(0,0,0,0.88), 0 0 42px rgba(212,175,55,0.1), inset 0 1px 0 rgba(252,246,186,0.28); position: relative; }
    .w-frame::before { content: ""; position: absolute; inset: 9px; border-radius: 20px; border: 1px solid rgba(212,175,55,0.18); pointer-events: none; }
    .w-crest { position: relative; display: inline-block; font-size: 10px; font-weight: 800; letter-spacing: 2.2px; color: #f3e5ab; border: 1px solid rgba(212,175,55,0.42); background: rgba(212,175,55,0.08); padding: 5px 14px; border-radius: 999px; margin-bottom: 22px; text-transform: uppercase; }
    .w-ring { position: relative; width: 108px; height: 108px; margin: 0 auto 20px; padding: 3px; border-radius: 50%; background: linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c); box-shadow: 0 0 34px rgba(212,175,55,0.32), 0 10px 24px rgba(0,0,0,0.6); }
    .w-logo { width: 100%; height: 100%; border-radius: 50%; background: radial-gradient(circle at 30% 30%, #1c1a17, #090a0f 75%); display: flex; align-items: center; justify-content: center; overflow: hidden; border: 3px solid #090b10; }
    .w-logo img { width: 100%; height: 100%; object-fit: cover; }
    .w-monogram { font-family: Georgia, "Times New Roman", serif; font-size: 34px; font-weight: 700; letter-spacing: 2px; background: linear-gradient(135deg, #bf953f, #fcf6ba, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.8)); }
    .w-brand { font-size: 29px; font-weight: 900; letter-spacing: 3px; background: linear-gradient(90deg, #bf953f, #fcf6ba, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px; }
    .w-divider { display: flex; align-items: center; justify-content: center; gap: 10px; margin: 6px auto 16px; width: 150px; }
    .w-divider span { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent); }
    .w-divider i { font-style: normal; font-size: 10px; color: #fcf6ba; }
    .w-hello { font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 8px; letter-spacing: 0.3px; }
    .w-hello span { color: #fef08a; }
    .w-sub { font-size: 13px; color: #a1a1aa; line-height: 1.6; margin-bottom: 26px; padding: 0 6px; }
    .w-btn { position: relative; overflow: hidden; width: 100%; border: none; border-radius: 14px; padding: 16px; font-size: 15px; font-weight: 800; letter-spacing: 0.6px; color: #090b10; background: linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #d4af37 100%); box-shadow: 0 10px 28px rgba(212,175,55,0.35), inset 0 1px 0 rgba(255,255,255,0.6); cursor: pointer; transition: transform 0.15s ease; }
    .w-btn:active { transform: scale(0.97); }
    .w-btn::after { content: ""; position: absolute; top: 0; left: -100%; width: 55%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); animation: wShine 2.8s infinite; }
    @keyframes wShine { 0% { left: -100%; } 55%, 100% { left: 155%; } }
    .w-foot { margin-top: 16px; font-size: 10.5px; color: #71717a; letter-spacing: 0.8px; text-transform: uppercase; }
  `;
  document.head.appendChild(style);

  const root = document.getElementById("welcomeRoot");
  if (!root) return;

  root.innerHTML = `
    <div class="w-overlay" id="welcomeScreen">
      <div class="w-frame">
        <div class="w-crest">✦ Official Member Portal ✦</div>
        <div class="w-ring">
          <div class="w-logo">
            <img src="logo.png" alt="FZ" onerror="this.style.display='none';document.getElementById('wFallbackSvg').style.display='flex';" />
            <div id="wFallbackSvg" class="w-monogram" style="display:none;">FZ</div>
          </div>
        </div>
        <div class="w-brand">FZ EARN</div>
        <div class="w-divider"><span></span><i>✦</i><span></span></div>
        <div class="w-hello">Welcome, <span id="wUserName"></span></div>
        <div class="w-sub">Your trusted and exclusive platform for seamless digital rewards.</div>
        <button class="w-btn" id="wEnterBtn">Enter Dashboard →</button>
        <div class="w-foot">Verified Telegram Mini App</div>
      </div>
    </div>
  `;

  document.getElementById("wUserName").innerText = userName;
  document.getElementById("wEnterBtn").addEventListener("click", function () {
    document.getElementById("welcomeScreen").classList.add("hide");
  });
})();
