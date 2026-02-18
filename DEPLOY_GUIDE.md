# 🚀 Vercel 部署指南

## 📋 概述

將 Spark Connect PWA 部署到 Vercel，完全免費，5 分鐘內完成！

---

## ✅ 前置準備

- [x] GitHub repository 已創建並推送程式碼
- [x] PWA 配置已完成
- [x] Supabase 環境變數已準備好

---

## 🚀 部署步驟

### 步驟 1: 註冊 Vercel（2 分鐘）

1. 前往：**https://vercel.com/signup**
2. 點擊 **Continue with GitHub**
3. 授權 Vercel 訪問你的 GitHub
4. 完成註冊

### 步驟 2: 導入專案（1 分鐘）

1. 在 Vercel Dashboard，點擊 **Add New Project**
2. 選擇 **Import Git Repository**
3. 找到 `iatinleong/dating-app`
4. 點擊 **Import**

### 步驟 3: 配置專案（2 分鐘）

Vercel 會自動偵測到這是 Vite 專案。

**配置設定：**

#### Build Settings（保持預設）
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Environment Variables（重要！）

點擊 **Environment Variables**，添加以下變數：

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://ikwqsmclbxwymfqfxgec.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `[你的 Supabase Key]` |
| `VITE_SUPABASE_PROJECT_ID` | `ikwqsmclbxwymfqfxgec` |

**注意：** 這些環境變數需要與你的 `.env` 檔案一致！

### 步驟 4: 部署（1 分鐘）

1. 確認所有設定正確
2. 點擊 **Deploy**
3. 等待 2-3 分鐘 ☕
4. 部署完成！🎉

---

## 🌐 部署完成後

### 你會得到：

1. **Production URL**: `https://your-app.vercel.app`
2. **Preview URL**: 每次 git push 都會自動生成預覽連結
3. **自動 HTTPS**: 完全免費的 SSL 憑證
4. **全球 CDN**: 超快速度

### 測試 PWA 功能：

#### 在手機上測試：

1. 用手機瀏覽器打開 `https://your-app.vercel.app`
2. 等待頁面載入
3. 會看到「安裝」提示（或在瀏覽器選單找到「加到主畫面」）
4. 點擊「安裝」
5. 手機桌面出現 App 圖示！
6. 點擊圖示，享受像原生 App 的體驗 ✨

#### 在電腦上測試：

1. 打開 Chrome 瀏覽器
2. 訪問你的網址
3. 網址列右側會出現「安裝」圖示
4. 點擊安裝
5. App 會出現在應用程式列表中

---

## 🔄 自動部署

每次你推送程式碼到 GitHub，Vercel 會自動：

1. 檢測到新的 commit
2. 開始 build
3. 部署新版本
4. 發送通知

```bash
git add .
git commit -m "Update app"
git push origin main
# Vercel 自動開始部署！
```

---

## 🎨 自訂網域（可選）

### 如果你有自己的網域：

1. 在 Vercel Dashboard，進入專案設定
2. 點擊 **Domains**
3. 點擊 **Add Domain**
4. 輸入你的網域（例如：`sparkconnect.com`）
5. 按照指示設定 DNS
6. 完成！

**Vercel 會自動：**
- ✅ 設定 SSL
- ✅ 配置 CDN
- ✅ 處理重定向

---

## 📊 Vercel 免費方案

### 包含：

- ✅ **無限部署**
- ✅ **100 GB 頻寬/月**
- ✅ **自動 HTTPS**
- ✅ **全球 CDN**
- ✅ **自動部署**
- ✅ **Preview 部署**
- ✅ **Analytics（基礎）**

### 限制：

- 每次 build 最長 45 分鐘（完全夠用）
- 100 GB 頻寬/月（約 100 萬次訪問）

**對於個人專案和初創，完全夠用！**

---

## 🔧 進階設定

### 配置 vercel.json（可選）

創建 `vercel.json` 來自訂設定：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        }
      ]
    }
  ]
}
```

### 設定 Redirect

如果你想要所有路由都指向 index.html（SPA）：

Vercel 會自動處理，不需要額外設定！

---

## 📱 測試清單

部署完成後，請測試：

- [ ] 首頁可以正常顯示
- [ ] 登入/註冊功能正常
- [ ] Supabase 連線正常
- [ ] PWA 安裝提示出現
- [ ] 可以成功安裝到主畫面
- [ ] 安裝後的 App 可以正常運作
- [ ] 離線時仍可以打開（顯示快取內容）
- [ ] 圖片和資源正確載入

---

## 🆘 常見問題

### Q: 部署失敗怎麼辦？

**A:** 檢查：
1. Build log 的錯誤訊息
2. 環境變數是否正確設定
3. `package.json` 的 scripts 是否正確

### Q: PWA 安裝提示沒出現？

**A:** 確認：
1. 使用 HTTPS（Vercel 自動提供）
2. Service Worker 註冊成功（開發者工具 > Application）
3. Manifest 配置正確

### Q: Supabase 連線失敗？

**A:** 檢查：
1. 環境變數是否正確設定
2. Supabase URL 和 Key 是否正確
3. 在 Vercel 的 Environment Variables 中檢查

### Q: 修改程式碼後沒有更新？

**A:** 確認：
1. Git push 成功
2. Vercel 檢測到 commit
3. Build 成功完成
4. 清除瀏覽器快取

---

## 📊 監控和分析

### Vercel Analytics（免費）

1. 在專案設定中啟用 **Analytics**
2. 查看：
   - 訪問量
   - 效能指標
   - 使用者地理分布

### 連接 Google Analytics（可選）

在 `index.html` 中添加 GA 追蹤碼。

---

## 🎉 完成！

部署完成後，你的 Spark Connect PWA 就：

- ✅ 在全球都能快速訪問
- ✅ 可以安裝到手機主畫面
- ✅ 體驗像原生 App
- ✅ 自動 HTTPS
- ✅ 每次 push 自動更新

**分享你的 App 網址，讓更多人使用吧！** 🚀

---

## 📞 需要幫助？

- [Vercel 文檔](https://vercel.com/docs)
- [Vercel 社群](https://vercel.com/community)
- [PWA 指南](https://web.dev/progressive-web-apps/)
