# Spark Connect - Dating App

> 一個基於 React + TypeScript + Supabase 的現代化交友應用

## 📱 專案簡介

Spark Connect 是一個功能完整的交友配對應用，具備以下特點：
- ❤️ 智能配對系統（自動配對）
- 💬 即時聊天功能
- 📸 照片上傳與管理
- 🔍 個性化篩選推薦
- 🔒 企業級安全保護

## 🚀 技術棧

- **前端**: React 18 + TypeScript + Vite
- **UI 框架**: shadcn/ui + Tailwind CSS
- **後端**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **狀態管理**: React Query

## 🛠️ 開發環境設定

### 前置要求

- Node.js 18+
- npm 或 bun

### 安裝步驟

```bash
# 1. Clone 專案
git clone https://github.com/ianleong1234/dating-app.git
cd dating-app

# 2. 安裝依賴
npm install

# 3. 設定環境變數
cp .env.example .env
# 編輯 .env 填入你的 Supabase 憑證

# 4. 啟動開發伺服器
npm run dev
```

### Supabase 資料庫設定

1. 前往 [Supabase 控制台](https://app.supabase.com)
2. 選擇你的專案
3. 進入 **SQL Editor**
4. 執行 `supabase/schema.sql` 中的 SQL
5. 詳細步驟請參考 `supabase/SETUP.md`

## 📚 文檔

- [API 使用指南](src/lib/API_GUIDE.md) - 完整的 API 使用範例
- [資料庫設定](supabase/SETUP.md) - Supabase 資料庫設定步驟
- [程式碼審查報告](docs/CODE_REVIEW.md) - 程式碼品質分析

## 🎯 主要功能

### ✅ 已完成
- [x] 用戶註冊/登入（Supabase Auth）
- [x] 個人資料管理
- [x] 照片上傳與管理
- [x] 智能推薦系統（支援年齡、性別、距離篩選）
- [x] 喜歡/略過功能
- [x] 自動配對機制
- [x] 配對列表
- [x] 即時聊天（Supabase Realtime）
- [x] 訊息已讀狀態
- [x] 路由保護（需登入才能訪問）
- [x] Row Level Security (RLS)

### 🚧 待開發
- [ ] 照片上傳 UI 優化
- [ ] iOS 觸控手勢優化
- [ ] 推送通知
- [ ] AI 智能配對
- [ ] 個人資料完成度提示

## 📦 專案結構

```
dating-app/
├── src/
│   ├── components/        # React 組件
│   │   ├── ui/           # shadcn/ui 基礎組件
│   │   ├── BottomNav.tsx # 底部導航
│   │   ├── UserCard.tsx  # 用戶卡片
│   │   └── ProtectedRoute.tsx # 路由保護
│   ├── pages/            # 頁面組件
│   │   ├── Auth.tsx      # 登入/註冊
│   │   ├── Explore.tsx   # 探索頁面
│   │   ├── Matches.tsx   # 配對列表
│   │   ├── Messages.tsx  # 訊息列表
│   │   └── Chat.tsx      # 聊天頁面
│   ├── lib/              # 工具函數
│   │   ├── api.ts        # Supabase API 封裝
│   │   └── utils.ts      # 通用工具
│   └── integrations/     # 第三方整合
│       └── supabase/     # Supabase 配置
├── supabase/
│   ├── schema.sql        # 資料庫結構
│   └── SETUP.md          # 設定指南
└── public/               # 靜態資源
```

## 🔒 安全性

- ✅ API 密鑰已從版本控制中移除
- ✅ 啟用 Row Level Security (RLS)
- ✅ 路由保護（未登入無法訪問）
- ✅ iOS Safari 私密模式相容
- ✅ 環境變數驗證

## 📱 iOS 部署

### 使用 Capacitor 打包

```bash
# 1. 安裝 Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios

# 2. 初始化 Capacitor
npx cap init

# 3. 建置專案
npm run build

# 4. 添加 iOS 平台
npx cap add ios

# 5. 開啟 Xcode
npx cap open ios
```

詳細步驟請參考 [Capacitor iOS 文檔](https://capacitorjs.com/docs/ios)

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License

## 🙏 致謝

- UI 設計靈感來自 Tinder 和 Bumble
- 使用 [Lovable](https://lovable.dev) 進行快速開發
- Icons 來自 [Lucide](https://lucide.dev)
