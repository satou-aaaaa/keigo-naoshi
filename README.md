# 敬語なおし

場面の文の言葉を、場面に合う敬語に直す1日5問の学習ゲームです。「だれの行為か」を見て、尊敬語（いらっしゃる・おっしゃる）・謙譲語Ⅰ（伺う・申し上げる）・謙譲語Ⅱ（参る・申す）を選び分けます。まちがえると理由が出て、選び直せます。

- 遊ぶ: <https://satou-aaaaa.github.io/keigo-naoshi/>
- 時間制限なし。今日の5問（だれでも同じ）・上級・練習・とことん（何度でも）・敬語帳・実績・カレンダー。
- 出てくる人・場所はすべて作り話です。記録は遊ぶ人のブラウザ（localStorage）だけに置き、外へ送りません。

## 出典（正しい言い方・まちがいの理由のもと）

- 文化審議会答申「敬語の指針」（平成19年2月2日） <https://www.bunka.go.jp/seisaku/bunkashingikai/kokugo/hokoku/pdf/keigo_tosin.pdf>
- 文化庁「国語分科会 報告・答申・建議等」 <https://www.bunka.go.jp/seisaku/bunkashingikai/kokugo/hokoku/index.html>

問題は指針の第2章（敬語の種類と働き・敬語の形）に書かれている言い方と、適切でないとされる形（「お〜できる」「ご〜される」「お持ちしますか」、身内に尊敬語・謙譲語Ⅱを相手に使うなど）だけから作っています。

## 開発

```bash
bash scripts/setup.sh   # 最初に一度
node qa/run.mjs         # 検査（CI の QA と同じ）
```

決まりは [AGENTS.md](AGENTS.md)。
