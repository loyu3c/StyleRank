
# 2026 礁溪老爺大酒店 - 最佳造型獎大PK

這是一個專為 100 人規模活動設計的即時投票與照片展示牆系統。

## 🚀 快速上手 (GitHub 佈署步驟)

1. **在 GitHub 建立新倉庫** (例如名稱叫 `hotel-awards`)。
2. **本地初始化 Git**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   ```
3. **連結遠端倉庫並推送**:
   ```bash
   git remote add origin https://github.com/您的帳號/hotel-awards.git
   git push -u origin main
   ```
4. **開啟 GitHub Pages**:
   - 前往 GitHub 倉庫設定 -> **Settings**。
   - 點選左側 **Pages**。
   - 在 "Build and deployment" 下的 **Source** 選擇 **GitHub Actions**。
5. **等待自動佈署**:
   - 點選上方 **Actions** 分頁可以看到進度。
   - 完成後，您的專頁將運行在 `https://您的帳號.github.io/hotel-awards/`。

## 🛠 本地開發

```bash
npm install
npm run dev
```

## ⚠️ 重要提醒：100 人實測建議
目前系統數據存放於 `localStorage`，僅供「單機展示」與「單人測試」。
**現場 100 人活動務必對接 Firebase**，否則每個人看到的是不同的資料。
如需對接 Firebase，請聯繫開發者更新 `App.tsx` 中的 Data Service 層。
