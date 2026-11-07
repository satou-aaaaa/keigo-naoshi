// SNS で貼られたときの絵（og.png 1200×630）を作る。今日の問題（答え）は入れず、遊び方の例だけ。
// 使い方: node tools/make-og.cjs（qa/ の playwright を使う）
const path = require("path");
const { chromium } = require(path.join(__dirname, "..", "qa", "node_modules", "playwright"));
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(`<body style="margin:0;font-family:'Noto Sans CJK JP','IPAPGothic',sans-serif">
  <div style="width:1200px;height:630px;box-sizing:border-box;padding:56px 64px;background:#f3eee4;color:#1f2a44;display:flex;gap:48px;align-items:center">
    <div style="flex:1">
      <div style="font-size:32px;color:#86291a;letter-spacing:.06em">その敬語、だれを立てている？</div>
      <div style="font-size:110px;font-weight:900;margin-top:8px;color:#142a52;line-height:1.1">敬語<span style="color:#b8402a">なおし</span></div>
      <div style="font-size:36px;margin-top:20px;line-height:1.5">場面に合う言い方に直す1日5問<br>尊敬語と謙譲語のちがいが身につく</div>
    </div>
    <div style="width:470px;display:flex;flex-direction:column;gap:16px">
      <div style="background:#fff;border:3px solid #1f2a4426;border-radius:24px;padding:26px 24px;font-size:34px;font-weight:700;text-align:center;box-shadow:0 10px 30px #1f2a4422">先生が資料を<span style="color:#86291a;border-bottom:5px solid #b8402a">見ます</span>。</div>
      <div style="background:#fffdf8;border:3px dashed #142a52;border-radius:18px;padding:14px 20px;font-size:30px;color:#4f566a;text-decoration:line-through">✕ 拝見します</div>
      <div style="background:#eef7f0;border:4px solid #25734a;border-radius:18px;padding:14px 20px;font-size:30px;font-weight:700;color:#174f31">✓ 御覧になります</div>
    </div>
  </div></body>`);
  await p.screenshot({ path: path.join(__dirname, "..", "og.png") });
  await b.close();
})();
