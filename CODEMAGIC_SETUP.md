# Codemagic 設定指南

## 📋 概述

Codemagic 是一個 CI/CD 服務，可以在雲端的 Mac 上自動打包你的 iOS 和 Android app。

**優點：**
- ✅ 不需要擁有 Mac
- ✅ 每月有 500 分鐘免費額度
- ✅ 自動化打包流程
- ✅ 支援直接發佈到 App Store 和 Google Play

---

## 🚀 快速開始

### 步驟 1: 註冊 Codemagic

1. 前往：https://codemagic.io/signup
2. 使用 GitHub 帳號登入
3. 授權 Codemagic 訪問你的 GitHub

### 步驟 2: 連接 Repository

1. 登入後，點擊 **Add application**
2. 選擇 **GitHub**
3. 找到並選擇 `iatinleong/dating-app`
4. 點擊 **Finish: Add application**

### 步驟 3: 選擇專案類型

1. 選擇 **Capacitor**
2. Codemagic 會自動偵測 `codemagic.yaml`

---

## 🔐 設定環境變數

在開始 build 之前，需要設定環境變數：

### 1. 在 Codemagic 設定環境變數

1. 進入你的 app 設定
2. 點擊 **Environment variables**
3. 添加以下變數：

| Variable Name | Value | Secure |
|---------------|-------|--------|
| `VITE_SUPABASE_URL` | `https://ikwqsmclbxwymfqfxgec.supabase.co` | ✅ |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `你的 Supabase Key` | ✅ |
| `VITE_SUPABASE_PROJECT_ID` | `ikwqsmclbxwymfqfxgec` | ✅ |

⚠️ **記得勾選 "Secure"** 來加密這些變數！

---

## 📱 iOS 打包設定

### 前置準備

#### 1. Apple Developer 帳號
- 需要付費的 Apple Developer 帳號（$99/年）
- 註冊：https://developer.apple.com/programs/

#### 2. App Store Connect API Key

1. 前往：https://appstoreconnect.apple.com/access/api
2. 點擊 **+** 創建新的 API Key
3. 名稱：`Codemagic`
4. Access：選擇 **App Manager**
5. 點擊 **Generate**
6. **下載 .p8 檔案**（只能下載一次！）
7. 記錄以下資訊：
   - **Key ID**
   - **Issuer ID**

#### 3. 在 Codemagic 設定 API Key

1. 在 Codemagic，進入 **Teams > Integrations**
2. 點擊 **App Store Connect**
3. 上傳剛才下載的 .p8 檔案
4. 輸入 Key ID 和 Issuer ID
5. 點擊 **Save**

#### 4. 設定 Code Signing

Codemagic 提供兩種方式：

**方式 A: 自動管理（推薦）**
1. 在 Codemagic 設定中，選擇 **Automatic code signing**
2. Codemagic 會自動創建 certificates 和 provisioning profiles

**方式 B: 手動上傳**
1. 在 Xcode 中匯出 certificates (.p12)
2. 下載 provisioning profiles
3. 上傳到 Codemagic

---

## 🤖 Android 打包設定

### 前置準備

#### 1. 創建 Keystore

如果還沒有 keystore，需要創建一個：

```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

記錄：
- Keystore 密碼
- Key 別名
- Key 密碼

#### 2. 在 Codemagic 上傳 Keystore

1. 進入 **Code signing identities**
2. 點擊 **Android keystores**
3. 上傳 `my-release-key.keystore`
4. 填寫密碼資訊
5. 給這個 keystore 一個參考名稱（例如：`keystore_reference`）

#### 3. Google Play 設定（可選）

如果要自動發佈到 Google Play：

1. 創建 Service Account：https://console.cloud.google.com
2. 下載 JSON 金鑰
3. 在 Codemagic 的 **Google Play** 整合中上傳 JSON

---

## 🏗️ 開始 Build

### 第一次 Build（測試）

1. 在 Codemagic Dashboard，選擇你的 app
2. 選擇 workflow（`ios-workflow` 或 `android-workflow`）
3. 點擊 **Start new build**
4. 等待 build 完成（約 10-20 分鐘）

### 自動 Build

只要推送程式碼到 GitHub，Codemagic 就會自動開始 build！

```bash
git add .
git commit -m "Update app"
git push origin main
```

---

## 📊 Build 狀態

### 查看 Build 進度

1. 在 Codemagic Dashboard
2. 點擊正在執行的 build
3. 可以即時查看 log

### Build 完成後

- ✅ 成功：會收到 email，並且 artifact 會被上傳
- ❌ 失敗：查看 log 找出問題

### 下載 Build 檔案

- **iOS**: 下載 `.ipa` 檔案
- **Android**: 下載 `.apk` 或 `.aab` 檔案

---

## 🎯 發佈到 App Store / Google Play

### iOS - 發佈到 TestFlight

如果在 `codemagic.yaml` 設定了 `submit_to_testflight: true`，build 成功後會自動上傳到 TestFlight。

1. 前往 App Store Connect
2. 在 TestFlight 中查看你的 build
3. 添加測試人員
4. 開始測試

### Android - 發佈到 Google Play

如果設定了 `google_play` publishing，會自動上傳到 internal track。

1. 前往 Google Play Console
2. 在 Internal testing 查看你的 build
3. 添加測試人員

---

## 💰 費用說明

### 免費方案
- ✅ 每月 500 分鐘
- ✅ 無限 build 次數
- ✅ 所有功能

### 一次 Build 大約耗時
- iOS: 15-25 分鐘
- Android: 10-15 分鐘

**所以免費額度大約可以：**
- iOS: 約 20-30 次 build
- Android: 約 30-50 次 build

### 付費方案（如果需要）
- **Hobby**: $49/月（無限 build）
- **Team**: $99/月（團隊功能）

---

## ⚠️ 常見問題

### Q: Build 失敗怎麼辦？

**A:** 檢查以下幾點：
1. 環境變數是否正確設定
2. Code signing 設定是否完整
3. 查看 build log 的錯誤訊息

### Q: iOS Build 需要多久？

**A:** 第一次約 20-25 分鐘，之後有快取會更快（10-15 分鐘）

### Q: 可以在本地測試嗎？

**A:** 可以！使用 Capacitor：

```bash
# iOS（需要 Mac）
npx cap add ios
npx cap open ios

# Android（Windows 可以）
npx cap add android
npx cap open android
```

### Q: 如何更新 app 版本號？

**A:** 編輯 `capacitor.config.ts`：

```typescript
const config: CapacitorConfig = {
  appId: 'com.iatinleong.sparkconnect',
  appName: 'Spark Connect',
  webDir: 'dist',
  // 添加版本號
  version: '1.0.1',
  buildNumber: 2
};
```

---

## 🎓 學習資源

- [Codemagic 官方文檔](https://docs.codemagic.io)
- [Capacitor iOS 指南](https://capacitorjs.com/docs/ios)
- [Capacitor Android 指南](https://capacitorjs.com/docs/android)
- [App Store Connect 指南](https://developer.apple.com/app-store-connect/)

---

## 🆘 需要幫助？

如果遇到問題：
1. 查看 build log
2. 參考 Codemagic 文檔
3. 在專案 GitHub Issues 提問
4. 聯絡 Codemagic 支援（很快回覆！）

---

## ✅ 完成後的檢查清單

- [ ] Codemagic 帳號已註冊
- [ ] Repository 已連接
- [ ] 環境變數已設定
- [ ] iOS: App Store Connect API Key 已設定
- [ ] iOS: Code signing 已設定
- [ ] Android: Keystore 已上傳（如果需要）
- [ ] 第一次 build 成功
- [ ] 可以在 TestFlight/Google Play 看到 app

完成以上步驟，你的 app 就可以自動打包和發佈了！🎉
