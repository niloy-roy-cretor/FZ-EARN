// ===== ক্লাসিক স্পিন হুইল সেটিংস =====
const DAILY_SPIN_LIMIT = 1;              // প্রতিদিন ১টি ফ্রি স্পিন
const prizes = [5, 0, 10, 0, 20];        // ৫টি অপশন: ২টি খালি (0), একটি 5, একটি 10, একটি 20
const sliceColors = ["#065f46", "#111827", "#1e3a8a", "#111827", "#9a3412"];

let spinsLeft = getDaily("fz_spins", DAILY_SPIN_LIMIT);
document.getElementById("spinsLeft").innerText = spinsLeft;

const canvas = document.getElementById("wheelCanvas");
canvas.width = 340;
canvas.height = 340;
const ctx = canvas.getContext("2d");
const cx = 170, cy = 170, outerR = 166, wheelR = 148;

(function drawWheel() {
  const arc = (2 * Math.PI) / prizes.length;

  // ক্লাসিক মেটালিক গোল্ড রিম
  const rimGrad = ctx.createLinearGradient(0, 0, 340, 340);
  rimGrad.addColorStop(0, "#fef08a");
  rimGrad.addColorStop(0.5, "#d97706");
  rimGrad.addColorStop(1, "#78350f");
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, 2 * Math.PI);
  ctx.fillStyle = rimGrad;
  ctx.fill();

  // রিমের চারপাশে ১৫টি ক্লাসিক ডট
  for (let d = 0; d < 15; d++) {
    const ang = (d * 2 * Math.PI) / 15;
    const dx = cx + Math.cos(ang) * (outerR - 9);
    const dy = cy + Math.sin(ang) * (outerR - 9);
    ctx.beginPath();
    ctx.arc(dx, dy, 3.5, 0, 2 * Math.PI);
    ctx.fillStyle = d % 2 === 0 ? "#ffffff" : "#fef08a";
    ctx.fill();
  }

  // ৫টি ক্লাসিক স্লাইস ও গোল্ডেন বর্ডার
  for (let i = 0; i < prizes.length; i++) {
    const start = i * arc;
    const end = (i + 1) * arc;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, wheelR, start, end);
    ctx.closePath();
    ctx.fillStyle = sliceColors[i];
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#fbbf24";
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = "right";
    if (prizes[i] === 0) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 18px system-ui, sans-serif";
      ctx.fillText("খালি", wheelR - 22, 6);
    } else {
      ctx.fillStyle = prizes[i] === 20 ? "#fde047" : "#ffffff";
      ctx.font = "900 24px system-ui, sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 4;
      ctx.fillText("৳" + prizes[i], wheelR - 22, 8);
    }
    ctx.restore();
  }

  // মাঝখানের ক্লাসিক গোল্ড মেডালিয়ন হাব
  const hubGrad = ctx.createRadialGradient(cx - 6, cy - 6, 4, cx, cy, 32);
  hubGrad.addColorStop(0, "#fef08a");
  hubGrad.addColorStop(0.6, "#f59e0b");
  hubGrad.addColorStop(1, "#92400e");
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, 2 * Math.PI);
  ctx.fillStyle = hubGrad;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 24, 0, 2 * Math.PI);
  ctx.fillStyle = "#091526";
  ctx.fill();

  ctx.fillStyle = "#fbbf24";
  ctx.font = "900 15px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("FZ", cx, cy + 1);
})();

let currentRot = 0;
let spinning = false;

function startSpin() {
  if (spinning) return;
  if (spinsLeft <= 0) {
    return notify("⏳ আজকের ১টি স্পিন শেষ! আগামীকাল আবার ঘোরান।");
  }

  spinning = true;
  document.getElementById("spinBtn").disabled = true;

  const idx = Math.floor(Math.random() * prizes.length);
  const sliceDeg = 360 / prizes.length;
  const center = (idx + 0.5) * sliceDeg;
  const jitter = Math.floor(Math.random() * 36) - 18;
  const targetMod = (270 - (center + jitter) + 360) % 360;
  const delta = (targetMod - (currentRot % 360) + 360) % 360;
  currentRot += 2160 + delta;
  canvas.style.transform = "rotate(" + currentRot + "deg)";

  setTimeout(() => {
    spinsLeft -= 1;
    setDaily("fz_spins", spinsLeft);
    document.getElementById("spinsLeft").innerText = spinsLeft;
    const won = prizes[idx];
    spinning = false;
    document.getElementById("spinBtn").disabled = false;
    if (won === 0) {
      notify("😔 এবার খালি পড়েছে! আগামীকাল আবার চেষ্টা করুন।");
    } else {
      addBal(won);
      notify("🎡 অভিনন্দন! লাকি স্পিনে +৳" + won + " টাকা জিতেছেন!");
    }
  }, 4100);
}
