// ===== স্পিন হুইল সেটিংস (সহজেই পরিবর্তন করতে পারবেন) =====
const DAILY_SPIN_LIMIT = 5;              // দিনে কয়বার স্পিন করা যাবে
const prizes = [5, 10, 2, 15, 8, 20];    // চাকার ৬টি ঘরের পয়েন্ট
const colors = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#0891b2", "#db2777"];

let spinsLeft = getDaily("fz_spins", DAILY_SPIN_LIMIT);
document.getElementById("spinsLeft").innerText = spinsLeft;

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

(function drawWheel() {
  const arc = (2 * Math.PI) / prizes.length;
  for (let i = 0; i < prizes.length; i++) {
    ctx.beginPath();
    ctx.fillStyle = colors[i];
    ctx.moveTo(140, 140);
    ctx.arc(140, 140, 140, i * arc, (i + 1) * arc);
    ctx.fill();
    ctx.save();
    ctx.translate(140, 140);
    ctx.rotate(i * arc + arc / 2);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("+" + prizes[i], 70, 7);
    ctx.restore();
  }
})();

let currentRot = 0;
let spinning = false;

function startSpin() {
  if (spinning) return;
  if (spinsLeft <= 0) {
    return notify("⏳ আজকের " + DAILY_SPIN_LIMIT + "টি স্পিন শেষ! আগামীকাল আবার ঘোরান।");
  }

  spinning = true;
  document.getElementById("spinBtn").disabled = true;

  const idx = Math.floor(Math.random() * prizes.length);
  const sliceDeg = 360 / prizes.length;
  const center = (idx + 0.5) * sliceDeg;
  const jitter = Math.floor(Math.random() * 30) - 15;
  const targetMod = (270 - (center + jitter) + 360) % 360;
  const delta = (targetMod - (currentRot % 360) + 360) % 360;
  currentRot += 1800 + delta;
  canvas.style.transform = "rotate(" + currentRot + "deg)";

  setTimeout(() => {
    spinsLeft -= 1;
    setDaily("fz_spins", spinsLeft);
    document.getElementById("spinsLeft").innerText = spinsLeft;
    const won = prizes[idx];
    addBal(won);
    spinning = false;
    document.getElementById("spinBtn").disabled = false;
    notify("🎡 অভিনন্দন! চাকা ঘুরিয়ে +" + won + " পয়েন্ট জিতেছেন!");
  }, 4100);
}
