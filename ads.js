// ===== বিজ্ঞাপন সেটিংস (এখান থেকে সহজেই পরিবর্তন করতে পারবেন) =====
const DAILY_AD_LIMIT = 15;   // দিনে সর্বোচ্চ কতটি বিজ্ঞাপন দেখা যাবে
const AD_REWARD_POINTS = 5;  // প্রতি বিজ্ঞাপনে কত পয়েন্ট দেবে
const AD_WAIT_SECONDS = 3;   // বিজ্ঞাপন দেখার অপেক্ষার সময় (সেকেন্ড)

let adsLeft = getDaily("fz_ads", DAILY_AD_LIMIT);
document.getElementById("adsLeft").innerText = adsLeft;

function watchAd() {
  if (adsLeft <= 0) {
    return notify("⏳ আজকের " + DAILY_AD_LIMIT + "টি বিজ্ঞাপন শেষ! আগামীকাল আবার দেখুন।");
  }

  const btn = document.getElementById("adBtn");
  btn.disabled = true;
  btn.innerText = "বিজ্ঞাপন চলছে... (" + AD_WAIT_SECONDS + " সেকেন্ড)";

  // ভবিষ্যতে Adsgram বা Monetag কোড এখানে বসাবেন

  setTimeout(() => {
    adsLeft -= 1;
    setDaily("fz_ads", adsLeft);
    document.getElementById("adsLeft").innerText = adsLeft;
    addBal(AD_REWARD_POINTS);
    btn.disabled = false;
    btn.innerText = "বিজ্ঞাপন দেখুন (+" + AD_REWARD_POINTS + ")";
    notify("✅ বিজ্ঞাপন সফল! +" + AD_REWARD_POINTS + " পয়েন্ট যোগ হয়েছে।");
  }, AD_WAIT_SECONDS * 1000);
}
