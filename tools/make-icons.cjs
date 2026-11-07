// アプリのアイコン（icon-192.png・icon-512.png）を作る。生成りの地に便せん、朱の直しの線と藍の「敬」。
// 使い方: node tools/make-icons.cjs（qa/ の playwright を使う）
const path = require("path");
const { chromium } = require(path.join(__dirname, "..", "qa", "node_modules", "playwright"));
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  for (const s of [192, 512]) {
    const p = await b.newPage({ viewport: { width: s, height: s } });
    await p.setContent(`<body style="margin:0"><svg width="${s}" height="${s}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#f3eee4"/>
      <rect x="16" y="12" width="68" height="76" rx="8" fill="#fff" stroke="#1f2a44" stroke-width="3"/>
      <text x="50" y="58" font-size="40" font-weight="900" text-anchor="middle" fill="#142a52" font-family="Noto Sans CJK JP,IPAPGothic,sans-serif">敬</text>
      <line x1="26" y1="70" x2="74" y2="70" stroke="#b8402a" stroke-width="5" stroke-linecap="round"/>
      <path d="M60 78 l6 6 l12 -14" fill="none" stroke="#25734a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></body>`);
    await p.screenshot({ path: path.join(__dirname, "..", `icon-${s}.png`), clip: { x: 0, y: 0, width: s, height: s } });
  }
  await b.close();
})();
