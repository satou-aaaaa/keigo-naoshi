// 敬語なおしの問題を作る（ブラウザと node の両方で使う）。
// 1問は「場面の文（【 】の言葉を直す）」と「4つ（か3つ）の言い方」。正しいのは必ず1つ。
// 言い方と理由は、文化審議会答申「敬語の指針」（平成19年2月2日）の本文（第2章）にあるものだけを使う。
// 人・場所・物の名前は作り話。乱数 R は呼ぶ回数が毎回同じになるように使う（sort の比較の中では引かない）。
// 同じ tag（"難しさ:種類|種"）なら、どの端末でも同じ問題になる。
(function (root) {
  "use strict";
  const LV = ["やさしい", "ふつう", "むずかしい"];
  const SRC = {
    t: "文化審議会答申「敬語の指針」（平成19年2月2日）",
    u: "https://www.bunka.go.jp/seisaku/bunkashingikai/kokugo/hokoku/pdf/keigo_tosin.pdf",
    top: "https://www.bunka.go.jp/seisaku/bunkashingikai/kokugo/hokoku/index.html",
  };
  // 敬語の種類（指針 第2章 第1。p は本文のページ）
  const TYPES = {
    son: { name: "尊敬語", p: "14〜15", def: "相手や話題の人の行為を、その人を立てて言う" },
    k1: { name: "謙譲語Ⅰ", p: "15〜18", def: "自分側から相手へ向かう行為を、向かう先の人を立てて言う" },
    k2: { name: "謙譲語Ⅱ（丁重語）", p: "18〜20", def: "自分側の行為を、話の相手に丁重に言う" },
    tei: { name: "丁寧語", p: "20", def: "です・ます。相手に丁寧に言うだけで、人を立てない" },
  };

  // ---- 作り話の人と物 ----
  const UP = ["先生", "校長先生", "部長", "課長", "お客様", "社長"]; // 立てる人（話の相手か、話題の人）
  const FAM = ["父", "母", "兄", "姉", "祖父", "祖母"]; // 身内（ほかの人に話すときは立てない）
  const PLACE = ["会場", "図書館", "駅前のホール", "本社", "京都", "大阪"];
  const THING = ["資料", "写真", "地図", "名簿", "企画書", "手紙"];
  const GIFT = ["本", "お菓子", "花", "手紙", "記念の写真"];
  const FOOD = ["お弁当", "ケーキ", "おすし", "果物"];
  const TASK = ["準備", "確認", "発表", "報告"];
  const QUOTE = ["また来週", "よくできました", "ありがとう", "がんばって"];
  const NAME = ["山田", "森", "川口", "青木", "中村", "石川"];
  const TOWN = ["ひばり野", "みなと台", "さくら坂", "あおぞら台"];
  const WHEN = ["明日", "来週", "あさって", "今度の月曜"];

  // ---- まちがいの理由（どれも指針の本文から。{x} はえらんだ言い方、{u} は立てる人、{f} は身内）----
  const WHY = {
    k1o: "「{x}」は謙譲語Ⅰ。自分側の行為に使い、{u}の行為には使わない。",
    k2o: "「{x}」は謙譲語Ⅱ。自分側の行為に使い、{u}には使わない（指針 p.19）。",
    so: "「{x}」は尊敬語。自分の行為に使うと、自分を立ててしまう。",
    sf: "「{x}」は尊敬語。ほかの人に身内の{f}を立ててしまう（指針 p.23）。",
    k1f: "「{x}」は謙譲語Ⅰ。向かう先の{f}（身内）を立ててしまう（指針 p.23）。",
    pl: "「{x}」は丁寧語だけ。{u}を立てていない。",
    osu: "「お（ご）〜する」は謙譲語Ⅰの形。{u}の行為には「お〜になる」（指針 p.26）。",
    dek: "「お（ご）〜できる」は謙譲語Ⅰの可能の形。{u}には「お〜になれる」（指針 p.26）。",
    gos: "「ご〜される」は、本来、尊敬語の適切な形ではないとされている（指針 p.26）。",
    kur: "「下さる」は、{u}が自分にくれるときの尊敬語。自分が{u}にあげるときは使わない。",
    sag: "「差し上げる」は、自分が{u}にあげるときの謙譲語Ⅰ。{u}がくれるときは使わない。",
    gor: "「御覧になる」は、{u}が見るときの尊敬語。自分が見せるときは使わない。",
  };

  // ---- 問題の種類。lv・type（正しい言い方の種類）・作り方 ----
  // 作り方 f(R) は { who, pre, word, post, ok, ng:[[言い方, 理由]], rule } を返す。who は場面の一言（だれが・だれに）
  const pick = (R, a) => a[Math.floor(R() * a.length)];
  const K = {};
  const def = (id, lv, type, f) => { K[id] = { id, lv, type, f }; };
  // やさしい：尊敬語の特定形（相手の行為）
  def("iku", 0, "son", (R) => { const u = pick(R, UP); return { who: `${u}の行為`, pre: `${u}は${pick(R, WHEN)}、${pick(R, PLACE)}へ`, word: "行きます", post: "。", ok: "いらっしゃいます", ng: [["参ります", "k2o"], ["伺います", "k1o"], ["行きます", "pl"]], u, rule: "行く → いらっしゃる（尊敬語）" }; });
  def("kuru", 0, "son", (R) => { const u = pick(R, UP); return { who: `${u}の行為`, pre: `${u}が${pick(R, WHEN)}、こちらに`, word: "来ます", post: "。", ok: "いらっしゃいます", ng: [["参ります", "k2o"], ["伺います", "k1o"], ["来ます", "pl"]], u, rule: "来る → いらっしゃる・見える（尊敬語）" }; });
  def("iru", 0, "son", (R) => { const u = pick(R, UP); return { who: `${u}のこと`, pre: `${u}は、いま${pick(R, PLACE)}に`, word: "います", post: "。", ok: "いらっしゃいます", ng: [["おります", "k2o"], ["います", "pl"]], u, rule: "いる → いらっしゃる（尊敬語）" }; });
  def("iu", 0, "son", (R) => { const u = pick(R, UP); return { who: `${u}の行為`, pre: `${u}が「${pick(R, QUOTE)}」と`, word: "言いました", post: "。", ok: "おっしゃいました", ng: [["申しました", "k2o"], ["申し上げました", "k1o"], ["言いました", "pl"]], u, rule: "言う → おっしゃる（尊敬語）" }; });
  def("suru", 0, "son", (R) => { const u = pick(R, UP); return { who: `${u}の行為`, pre: `${u}が会の${pick(R, TASK)}を`, word: "します", post: "。", ok: "なさいます", ng: [["いたします", "k2o"], ["します", "pl"]], u, rule: "する → なさる（尊敬語）" }; });
  def("taberu", 0, "son", (R) => { const u = pick(R, UP); return { who: `${u}の行為`, pre: `${u}が${pick(R, FOOD)}を`, word: "食べます", post: "。", ok: "召し上がります", ng: [["頂きます", "k1o"], ["食べます", "pl"]], u, rule: "食べる・飲む → 召し上がる（尊敬語）" }; });
  def("miru", 0, "son", (R) => { const u = pick(R, UP); return { who: `${u}の行為`, pre: `${u}が${pick(R, THING)}を`, word: "見ます", post: "。", ok: "御覧になります", ng: [["拝見します", "k1o"], ["見ます", "pl"]], u, rule: "見る → 御覧になる（尊敬語）" }; });
  def("kureru", 0, "son", (R) => { const u = pick(R, UP); return { who: `${u}が自分に`, pre: `${u}が${pick(R, GIFT)}を`, word: "くれました", post: "。", ok: "下さいました", ng: [["差し上げました", "sag"], ["くれました", "pl"]], u, rule: "くれる → 下さる（尊敬語）" }; });
  // やさしい：謙譲語Ⅰの特定形（自分から相手へ向かう行為）
  def("tazu", 0, "k1", (R) => { const u = pick(R, UP); return { who: `自分が${u}のところへ`, pre: `${pick(R, WHEN)}、${u}のお宅へ`, word: "行きます", post: "。", ok: "伺います", ng: [["いらっしゃいます", "so"], ["行かれます", "so"], ["行きます", "pl"]], u, rule: "訪ねる（相手のところへ行く）・聞く → 伺う（謙譲語Ⅰ）" }; });
  def("kiku", 0, "k1", (R) => { const u = pick(R, UP); return { who: `自分が${u}から`, pre: `${u}のお話を`, word: "聞きます", post: "。", ok: "伺います", ng: [["お聞きになります", "so"], ["聞かれます", "so"], ["聞きます", "pl"]], u, rule: "訪ねる・聞く → 伺う（謙譲語Ⅰ）" }; });
  def("iuk", 0, "k1", (R) => { const u = pick(R, UP); return { who: `自分が${u}に`, pre: `${u}にお礼を`, word: "言います", post: "。", ok: "申し上げます", ng: [["おっしゃいます", "so"], ["言われます", "so"], ["言います", "pl"]], u, rule: "言う → 申し上げる（謙譲語Ⅰ）" }; });
  def("haiken", 0, "k1", (R) => { const u = pick(R, UP); return { who: `自分が${u}の物を`, pre: `${u}の${pick(R, THING)}を`, word: "見ます", post: "。", ok: "拝見します", ng: [["御覧になります", "so"], ["見られます", "so"], ["見ます", "pl"]], u, rule: "見る → 拝見する（謙譲語Ⅰ）" }; });
  def("morau", 0, "k1", (R) => { const u = pick(R, UP); return { who: `自分が${u}から`, pre: `${u}から${pick(R, GIFT)}を`, word: "もらいました", post: "。", ok: "頂きました", ng: [["もらわれました", "so"], ["もらいました", "pl"]], u, rule: "もらう → 頂く（謙譲語Ⅰ）" }; });
  def("au", 0, "k1", (R) => { const u = pick(R, UP); return { who: `自分が${u}に`, pre: `${pick(R, WHEN)}、${u}に`, word: "会います", post: "。", ok: "お目に掛かります", ng: [["お会いになります", "so"], ["会われます", "so"], ["会います", "pl"]], u, rule: "会う → お目に掛かる（謙譲語Ⅰ）" }; });
  def("kari", 0, "k1", (R) => { const u = pick(R, UP); return { who: `自分が${u}から`, pre: `${u}の${pick(R, THING)}を`, word: "借ります", post: "。", ok: "拝借します", ng: [["お借りになります", "so"], ["借りられます", "so"], ["借ります", "pl"]], u, rule: "借りる → 拝借する（謙譲語Ⅰ）" }; });
  def("ageru", 0, "k1", (R) => { const u = pick(R, UP); return { who: `自分が${u}に`, pre: `${u}に${pick(R, GIFT)}を`, word: "あげます", post: "。", ok: "差し上げます", ng: [["下さいます", "kur"], ["あげます", "pl"]], u, rule: "あげる → 差し上げる（謙譲語Ⅰ）" }; });
  def("miseru", 0, "k1", (R) => { const u = pick(R, UP); return { who: `自分が${u}に`, pre: `${u}に${pick(R, THING)}を`, word: "見せます", post: "。", ok: "お目に掛けます", ng: [["御覧になります", "gor"], ["見せられます", "so"], ["見せます", "pl"]], u, rule: "見せる → お目に掛ける・御覧に入れる（謙譲語Ⅰ）" }; });
  // ふつう：謙譲語Ⅱ（自分側の行為を丁重に）と、身内のこと（指針 p.23）
  def("famgo", 1, "k2", (R) => { const u = pick(R, UP), f = pick(R, FAM); return { who: `${u}に、身内の${f}のことを話す`, pre: `${f}は${pick(R, WHEN)}、${pick(R, PLACE)}へ`, word: "行きます", post: "。", ok: "参ります", ng: [["いらっしゃいます", "sf"], ["行かれます", "sf"], ["おいでになります", "sf"]], u, f, rule: "身内の行為は立てない。丁重に言うなら 行く → 参る（謙譲語Ⅱ）" }; });
  def("famto", 1, "k2", (R) => { const u = pick(R, UP), f = pick(R, FAM); return { who: `${u}に、自分が身内の${f}のところへ行く話をする`, pre: `${pick(R, WHEN)}、${f}のところに`, word: "行きます", post: "。", ok: "参ります", ng: [["伺います", "k1f"], ["いらっしゃいます", "so"], ["行かれます", "so"]], u, f, rule: "身内のところへは「伺う」を使わない。丁重に言うなら 参る（謙譲語Ⅱ）" }; });
  def("mosu", 1, "k2", (R) => { const u = pick(R, ["お客様", "先生", "社長"]); return { who: `${u}に、自分の名前を言う`, pre: `担当の${pick(R, NAME)}と`, word: "言います", post: "。", ok: "申します", ng: [["おっしゃいます", "so"], ["言われます", "so"]], u, rule: "自分が言う → 申す（謙譲語Ⅱ）" }; });
  def("itasu", 1, "k2", (R) => { const u = pick(R, UP); return { who: `${u}に、自分のすることを言う`, pre: `その${pick(R, TASK)}は、わたしが`, word: "します", post: "。", ok: "いたします", ng: [["なさいます", "so"], ["されます", "so"]], u, rule: "自分がする → いたす（謙譲語Ⅱ）" }; });
  def("oru", 1, "k2", (R) => { const u = pick(R, UP); return { who: `${u}に、自分のことを言う`, pre: `${pick(R, WHEN)}は一日、${pick(R, ["家", "事務所", "会場", "受付"])}に`, word: "います", post: "。", ok: "おります", ng: [["いらっしゃいます", "so"], ["おいでになります", "so"]], u, rule: "自分がいる → おる（謙譲語Ⅱ）" }; });
  def("mairu", 1, "k2", (R) => { const u = pick(R, ["お客様", "先生", "社長"]); return { who: `${u}に、自分が来た所を言う`, pre: `わたしは${pick(R, TOWN)}から`, word: "来ました", post: "。", ok: "参りました", ng: [["いらっしゃいました", "so"], ["来られました", "so"], ["おいでになりました", "so"]], u, rule: "自分が来る → 参る（謙譲語Ⅱ）" }; });
  // ふつう：尊敬語の「お〜になる」と、謙譲語Ⅰの「お〜する」（一般形。指針 p.25・27）
  const OVERB = [["使い", "使います", "使"], ["待ち", "待ちます", "待"], ["読み", "読みます", "読"], ["書き", "書きます", "書"], ["選び", "選びます", "選"]];
  def("oni", 1, "son", (R) => { const u = pick(R, UP), [s, pl] = pick(R, OVERB), obj = s === "待ち" ? "ロビーで" : `${pick(R, THING)}を`; return { who: `${u}の行為`, pre: `${u}が${obj}`, word: pl, post: "。", ok: `お${s}になります`, ng: [[`お${s}します`, "osu"], [pl, "pl"]], u, rule: "相手の行為 → お〜になる（尊敬語の一般形）" }; });
  const KVERB = [["届け", "届けます", "資料を"], ["知らせ", "知らせます", "日にちを"], ["送り", "送ります", "写真を"], ["渡し", "渡します", "名簿を"]];
  def("osu", 1, "k1", (R) => { const u = pick(R, UP), [s, pl, obj] = pick(R, KVERB); return { who: `自分が${u}に`, pre: `${u}に${obj}`, word: pl, post: "。", ok: `お${s}します`, ng: [[`お${s}になります`, "so"], [pl, "pl"]], u, rule: "自分から相手への行為 → お〜する（謙譲語Ⅰの一般形）" }; });
  // むずかしい：まちがえやすい形（指針 p.19・26）
  const DVERB = [["答え", "答えられ", "全問正しく", "たら、賞品があります。", "お答えになれ"], ["使い", "使え", "この券はどなたでも", "ます。", "お使いになれ"], ["読み", "読め", "この本は館内で", "ます。", "お読みになれ"], ["利用し", "利用でき", "この部屋はどなたでも", "ます。", "御利用になれ"]];
  def("dekiru", 2, "son", (R) => { const u = pick(R, ["お客様", "皆様"]), [s, pl, pre, post, ok] = pick(R, DVERB), ngf = s === "利用し" ? "御利用でき" : `お${s}でき`; return { who: `${u}ができること`, pre: `（${u}に）${pre}`, word: pl, post, ok, ng: [[ngf, "dek"], [pl, "pl"]], u, rule: "相手ができること → まず尊敬語にしてから「〜になれる」（指針 p.26）" }; });
  const MVERB = [["持ち", "持っていきますか", "この資料を"], ["使い", "使いますか", "この部屋を"], ["待ち", "待ちますか", "こちらで"], ["帰り", "帰りますか", "もう"]];
  def("omochi", 2, "son", (R) => { const u = pick(R, UP), [s, pl, pre] = pick(R, MVERB); return { who: `${u}にたずねる`, pre: `（${u}に）${pre}`, word: pl, post: "？", ok: `お${s}になりますか`, ng: [[`お${s}しますか`, "osu"], [pl, "pl"]], u, rule: "相手の行為をたずねる → お〜になりますか（「お〜しますか」は謙譲語Ⅰ。指針 p.26）" }; });
  const GVERB = [["説明", "説明なさいます", "御説明されます"], ["利用", "御利用になります", "御利用されます"], ["出席", "出席なさいます", "御出席されます"], ["確認", "確認なさいます", "御確認されます"]];
  def("gosare", 2, "son", (R) => { const u = pick(R, UP), [n, ok, ng] = pick(R, GVERB); return { who: `${u}の行為`, pre: `${pick(R, WHEN)}、${u}が${n === "利用" ? "この部屋を" : n === "出席" ? "会に" : "内容を"}`, word: `${n}します`, post: "。", ok, ng: [[ng, "gos"], [`${n}いたします`, "k2o"], [`${n}します`, "pl"]], u, rule: "「ご〜される」でなく、〜なさる・ご〜になる（指針 p.25〜26）" }; });
  def("k2other", 2, "son", (R) => { const u = pick(R, ["お客様", "先生", "社長"]), q = R() < 0.5; return q ? { who: `${u}にたずねる`, pre: `（${u}に）どちらから`, word: "来ましたか", post: "？", ok: "いらっしゃいましたか", ng: [["参りましたか", "k2o"], ["伺いましたか", "k1o"], ["来ましたか", "pl"]], u, rule: "「参る」は自分側の行為だけ。相手には いらっしゃる（指針 p.19）" }
    : { who: `${u}のことをほかの人に話す`, pre: `${u}は${pick(R, WHEN)}、海外へ`, word: "行きます", post: "。", ok: "いらっしゃいます", ng: [["参ります", "k2o"], ["伺います", "k1o"], ["行きます", "pl"]], u, rule: "「参る」は自分側の行為だけ。相手には いらっしゃる（指針 p.19）" }; });
  def("famson", 2, "k2", (R) => { const u = pick(R, UP), f = pick(R, FAM); return { who: `${u}に、身内の${f}のことを話す`, pre: `${f}が「よろしく」と`, word: "言っていました", post: "。", ok: "申しておりました", ng: [["おっしゃっていました", "sf"], ["言われていました", "sf"]], u, f, rule: "身内の行為は立てない。丁重に言うなら 申す・おる（謙譲語Ⅱ）" }; });
  const KIND_IDS = Object.keys(K);

  function seedOf(str) { let h = 2166136261; for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const shuffle = (R, arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fill = (t, x, q) => t.replace(/\{x\}/g, x).replace(/\{u\}/g, q.u || "相手").replace(/\{f\}/g, q.f || "身内");

  // 1問を作る。tag は "難しさ:種類|種"（例 "0:iku|2026-11-07:d0"）
  function make(tag) {
    const m = /^([0-2]):([a-z0-9]+)\|(.+)$/.exec(String(tag));
    if (!m || !Object.prototype.hasOwnProperty.call(K, m[2]) || K[m[2]].lv !== +m[1]) return null;
    const k = K[m[2]], R = rng(seedOf(tag)), q = k.f(R);
    // 選ぶ言い方：正しい1つ＋まちがい（最大3つ）。並びは種で混ぜる
    const ng = q.ng.slice(0, 3).map(([t, w]) => ({ t, ok: false, why: fill(WHY[w], t, q), w }));
    const choices = shuffle(R, [{ t: q.ok, ok: true, why: "" }, ...ng]);
    const ty = TYPES[k.type];
    const key = [m[2], q.pre, q.word, q.post, choices.map((c) => c.t).join("/")].join("|");
    return { tag, lv: +m[1], kind: m[2], type: k.type, typeName: ty.name, who: q.who, pre: q.pre, word: q.word, post: q.post, ok: q.ok, choices, ans: choices.findIndex((c) => c.ok), rule: q.rule, p: ty.p, key };
  }
  const kindsOf = (lv) => KIND_IDS.filter((id) => K[id].lv === lv);
  const pickN = (R, arr, n) => shuffle(R, arr).slice(0, n);
  // 今日の5問（やさしい2・ふつう2・むずかしい1）。種類は重ねない。やさしいは尊敬語と謙譲語Ⅰを1つずつ
  function dailyTags(date) {
    const R = rng(seedOf("day:" + date));
    const e0 = pickN(R, kindsOf(0).filter((id) => K[id].type === "son"), 1), e1 = pickN(R, kindsOf(0).filter((id) => K[id].type === "k1"), 1);
    const n = pickN(R, kindsOf(1), 2), h = pickN(R, kindsOf(2), 1);
    return [...e0, ...e1, ...n, ...h].map((id, i) => `${K[id].lv}:${id}|${date}:d${i}`);
  }
  // 上級の3問（むずかしい3つ・今日のむずかしいと別の種類・ヒントなし）
  function hardTags(date) {
    const R = rng(seedOf("hard:" + date)), day = dailyTags(date)[4].split(/[:|]/)[1];
    return pickN(R, kindsOf(2).filter((id) => id !== day), 3).map((id, i) => `2:${id}|${date}:h${i}`);
  }
  // 敬語帳に載せる1つ（種類ごとのきまり）
  const ruleOf = (id) => { const R = rng(seedOf("rule:" + id)); return K[id].f(R).rule; };

  const KEIGO = { LV, SRC, TYPES, WHY, K, KIND_IDS, UP, FAM, seedOf, rng, make, kindsOf, dailyTags, hardTags, ruleOf, pickN, shuffle };
  if (typeof module !== "undefined" && module.exports) module.exports = KEIGO; else root.KEIGO = KEIGO;
})(typeof self !== "undefined" ? self : this);
