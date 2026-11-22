# IBM Storage Virtualize V9.2.0 Quiz

依 IBM Storage Virtualize V9.2.0 Concept Guide 各章 (CH02–CH25) 與對應章節簡報出題的單選題網頁，每章 50 題。題目為英文，答案與說明為中文。

網站：https://moumouhsu.github.io/storage-virtualize-quiz/

## 結構
- `src/CHxx.json`：題庫原稿，每題 `[題目, [正確答案, 誘答1, 誘答2, 誘答3], 中文說明, 出處]`
- `build.py`：產生 `data/chxx.js` 與 `chxx.html`，並把正確答案平均分散到 A–D
- `assets/`：共用的作答程式與樣式

修改題目後執行 `python3 build.py` 再 Commit。

## 出題依據
- 各章：IBM Storage Virtualize V9.2.0 Concept Guide 對應章節 + 章節簡報 (AI Output/IBM - Storage Virtualize/V9.2.0)，部分章節含 Troubleshooting Guide 內容
- CH17 Cyber Resilience：Concept Guide 本章僅 1 頁，另取 Concept Guide 其他章節的 Safeguarded Snapshot、威脅偵測設定、TPI 等相關內容
- CH24 Ansible Collection：Concept Guide 本章僅數行，另取 RedBook「Automating IBM Storage FlashSystem Tasks with REST APIs, PowerShell, Scripting, and Ansible」第 5 章
- 每題說明皆附出處 (簡報頁碼或 Concept Guide 章節)
