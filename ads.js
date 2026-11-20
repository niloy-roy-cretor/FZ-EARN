// ===== মূল সেটিংস (সহজেই পরিবর্তন করতে পারবেন) =====
const DAILY_BONUS_POINTS = 10;  // ডেইলি বোনাস পয়েন্ট
const MIN_WITHDRAW = 300;       // সর্বনিম্ন Withdraw পয়েন্ট
const MIN_REFER = 10;           // সর্বনিম্ন প্রয়োজনীয় রেফার

const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) { tg.ready(); tg.expand(); }

const q = new URLSearchParams(window.location.search);
if (q.get("uid")) localStorage.setItem("fz_uid", q.get("uid"));
const tgUser = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user : null;
const fallbackId = q.get("uid") || localStorage.getItem("fz_uid") || "Demo";
const user = tgUser ? tgUser : { first_name: "Member", id: fallbackId };
document.getElementById("userBadge").innerText = user.first_name + " (" + user.id + ")";

const wNameEl = document.getElementById("wUserName");
if (wNameEl) wNameEl.innerText = user.first_name;

function enterApp() {
  const ws = document.getElementById("welcomeScreen");
  if (ws) ws.classList.add("hide");
}

if (q.get("bot")) localStorage.setItem("fz_bot", q.get("bot"));
if (q.get("ref")) localStorage.setItem("fz_ref_" + user.id, q.get("ref"));
const botUsername = localStorage.getItem("fz_bot") || "FZ_EARN_bot";
const refCount = parseInt(localStorage.getItem("fz_ref_" + user.id) || "0");

let bal = parseInt(localStorage.getItem("fz_bal_" + user.id) || "0");
document.getElementById("bal").innerText = bal;
document.getElementById("refCountTxt").innerText = refCount;
document.getElementById("wdRefTxt").innerText = refCount;
const refLink = "https://t.me/" + botUsername + "?start=" + user.id;
document.getElementById("refLinkBox").value = refLink;

const today = new Date().toISOString().slice(0, 10);
function getDaily(key, def) {
  const saved = JSON.parse(localStorage.getItem(key + "_" + user.id) || "{}");
  return saved.date === today ? saved.count : def;
}
function setDaily(key, count) {
  localStorage.setItem(key + "_" + user.id, JSON.stringify({ date: today, count: count }));
}

let toastTimer;
function notify(msg) {
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.style.display = "none"; }, 3500);
}

function addBal(pts) {
  bal += pts;
  localStorage.setItem("fz_bal_" + user.id, bal);
  document.getElementById("bal").innerText = bal;
}

function openTab(name, el) {
  document.querySelectorAll(".tab-page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav button").forEach(b => b.classList.remove("active"));
  document.getElementById("tab-" + name).classList.add("active");
  el.classList.add("active");
}

function claimBonus() {
  const now = Date.now();
  const last = parseInt(localStorage.getItem("fz_last_" + user.id) || "0");
  if (now - last < 86400000) {
    return notify("⏳ আজকের বোনাস ইতিমধ্যে নিয়েছেন! ২৪ ঘণ্টা পর আবার চেষ্টা করুন।");
  }
  localStorage.setItem("fz_last_" + user.id, now);
  addBal(DAILY_BONUS_POINTS);
  notify("🎉 সফল! +" + DAILY_BONUS_POINTS + " পয়েন্ট Daily Bonus যোগ হয়েছে।");
}

function copyRef() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(refLink).then(() => {
      notify("✅ রেফার লিংক কপি হয়েছে!");
    }).catch(() => {
      const box = document.getElementById("refLinkBox");
      box.select();
      document.execCommand("copy");
      notify("✅ রেফার লিংক কপি হয়েছে!");
    });
  } else {
    const box = document.getElementById("refLinkBox");
    box.select();
    document.execCommand("copy");
    notify("✅ রেফার লিংক কপি হয়েছে!");
  }
}

function shareRef() {
  const url = "https://t.me/share/url?url=" + encodeURIComponent(refLink) + "&text=" + encodeURIComponent("⚡ FZ ERAN Mini App থেকে প্রতিদিন আয় করুন!");
  if (tg) tg.openTelegramLink(url); else window.open(url, "_blank");
}

let wdMethod = "bKash";
function setMethod(m) {
  wdMethod = m;
  document.getElementById("mBkash").classList.toggle("active", m === "bKash");
  document.getElementById("mNagad").classList.toggle("active", m === "Nagad");
}

function submitWithdraw() {
  const num = document.getElementById("wdNum").value.trim();
  if (bal < MIN_WITHDRAW) {
    return notify("❌ Withdraw করতে কমপক্ষে " + MIN_WITHDRAW + " পয়েন্ট প্রয়োজন।");
  }
  if (refCount < MIN_REFER) {
    return notify("❌ Withdraw করতে কমপক্ষে " + MIN_REFER + "টি রেফার প্রয়োজন (আছে " + refCount + " জন)।");
  }
  if (!/^01\d{9}$/.test(num)) {
    return notify("❌ সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)।");
  }
  bal -= MIN_WITHDRAW;
  localStorage.setItem("fz_bal_" + user.id, bal);
  document.getElementById("bal").innerText = bal;
  const payload = JSON.stringify({ method: wdMethod, number: num, amount: MIN_WITHDRAW });
  if (tg) tg.sendData(payload);
  notify("✅ Withdraw রিকোয়েস্ট পাঠানো হয়েছে!");
}
