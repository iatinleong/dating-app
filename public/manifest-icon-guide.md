# PWA 圖示生成指南

## 📱 需要的圖示

PWA 需要以下圖示：
- `pwa-192x192.png` - Android 主畫面圖示
- `pwa-512x512.png` - Android 啟動畫面
- `apple-touch-icon.png` (180x180) - iOS 主畫面圖示
- `favicon.ico` - 瀏覽器圖示

## 🎨 快速生成圖示

### 方法 1: 線上工具（推薦）

使用 **PWA Asset Generator**：

1. 前往：https://www.pwabuilder.com/imageGenerator
2. 上傳你的 Logo（建議 512x512 或更大）
3. 下載生成的圖示包
4. 解壓縮後放到 `public/` 資料夾

### 方法 2: 使用 Figma

1. 創建一個 512x512 的畫布
2. 設計你的 Logo
3. 匯出為 PNG
4. 使用線上工具調整尺寸

### 方法 3: 使用 AI 生成

可以使用：
- DALL-E
- Midjourney
- Stable Diffusion

提示詞範例：
```
"A modern, minimalist heart icon for a dating app,
pink gradient, clean design, app icon style"
```

## 🎯 目前使用的臨時圖示

目前專案使用純色心形圖示（粉紅色漸層）。

建議未來替換成：
- 品牌專屬的設計
- 更精緻的圖示
- 符合 App Store 規範的圖示

## 🔍 圖示規範

### Android
- 192x192: 主畫面圖示
- 512x512: 啟動畫面和 Play Store
- 建議使用圓角設計
- 背景不要透明（除非特殊設計）

### iOS
- 180x180: 主畫面圖示
- 必須填滿整個方形
- 系統會自動加圓角
- 不要在圖示內加圓角

## ✅ 檢查清單

- [ ] 圖示清晰，在小尺寸下仍可辨識
- [ ] 顏色對比度足夠
- [ ] 與品牌形象一致
- [ ] 在亮色和暗色主題下都好看
- [ ] 已測試在不同裝置上的顯示效果
