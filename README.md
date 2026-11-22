# IBM Storage Virtualize V9.2.0 Quiz

依 IBM Storage Virtualize V9.2.0 Concept Guide 各章 (CH02–CH25) 與對應章節簡報出題的單選題網頁，每章 50 題。題目為英文，答案與說明為中文。

網站：https://moumouhsu.github.io/storage-virtualize-quiz/

## 結構
- `src/CHxx.json`：題庫原稿，每題 `[題目, [正確答案, 誘答1, 誘答2, 誘答3], 中文說明, 出處]`
- `build.py`：產生 `data/chxx.js` 與 `chxx.html`，並把正確答案平均分散到 A–D
- `assets/`：共用的作答程式與樣式

修改題目後執行 `python3 build.py` 再 Commit。
