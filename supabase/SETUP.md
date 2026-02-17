# Supabase 資料庫設定指南

## 📋 概述

這個檔案包含設定 Spark Connect 資料庫的完整步驟。

## 🚀 快速開始

### 步驟 1: 執行 SQL Schema

1. 前往 Supabase 控制台：https://app.supabase.com
2. 選擇你的專案
3. 點擊左側選單的 **SQL Editor**
4. 點擊 **New Query**
5. 複製 `schema.sql` 的全部內容
6. 貼上到 SQL 編輯器
7. 點擊 **Run** 執行

### 步驟 2: 驗證資料庫結構

執行後，你應該會看到以下表格：

- ✅ `profiles` - 用戶資料
- ✅ `photos` - 用戶照片
- ✅ `likes` - 喜歡記錄
- ✅ `matches` - 配對記錄
- ✅ `messages` - 聊天訊息
- ✅ `passes` - 略過記錄

### 步驟 3: 設定 Storage（照片上傳）

1. 點擊左側選單的 **Storage**
2. 點擊 **Create a new bucket**
3. 名稱輸入：`profile-photos`
4. 選擇 **Public bucket**（讓照片可以公開訪問）
5. 點擊 **Create bucket**

#### 設定 Storage Policy

在 SQL Editor 執行以下 SQL：

```sql
-- Allow public read access to profile photos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profile-photos' );

-- Allow authenticated users to upload their own photos
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-photos'
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own photos
CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## 📊 資料庫結構說明

### Profiles Table（用戶資料）
- 儲存用戶的基本資料和偏好設定
- 自動與 `auth.users` 連動
- 包含位置、教育、生活習慣等資訊

### Photos Table（照片）
- 每個用戶可以有多張照片
- `photo_order` 決定顯示順序
- 照片 URL 指向 Supabase Storage

### Likes Table（喜歡）
- 記錄用戶的喜歡動作
- 支援 `normal` 和 `super` 兩種喜歡類型
- 防止重複喜歡和自己喜歡自己

### Matches Table（配對）
- 當兩個用戶互相喜歡時**自動創建**配對
- 使用 trigger 自動處理
- `is_active` 可以用來「取消配對」

### Messages Table（訊息）
- 只有配對的用戶才能互傳訊息
- 支援「已讀」狀態
- 支援軟刪除（`is_deleted`）

### Passes Table（略過）
- 記錄用戶略過的人
- 避免重複顯示

## 🔒 安全性（Row Level Security）

所有表格都啟用了 RLS，確保：
- ✅ 用戶只能修改自己的資料
- ✅ 用戶只能看到活躍的個人資料
- ✅ 用戶只能在配對後才能傳訊息
- ✅ 照片可以被所有人查看（但只能管理自己的）

## 🎯 自動化功能

### 1. 自動配對
當用戶 A 喜歡用戶 B，且用戶 B 也喜歡用戶 A 時，系統會**自動創建配對**。

### 2. 自動更新時間戳
`profiles` 表的 `updated_at` 會在每次更新時自動更新。

## 📝 常用 SQL 查詢範例

### 查詢用戶的配對列表
```sql
SELECT
  p.*
FROM profiles p
INNER JOIN matches m ON (
  (m.user1_id = p.id AND m.user2_id = 'YOUR_USER_ID')
  OR (m.user2_id = p.id AND m.user1_id = 'YOUR_USER_ID')
)
WHERE m.is_active = true;
```

### 查詢誰喜歡了我
```sql
SELECT
  p.*
FROM profiles p
INNER JOIN likes l ON l.liker_id = p.id
WHERE l.liked_id = 'YOUR_USER_ID';
```

### 查詢推薦用戶（排除已經互動過的）
```sql
SELECT *
FROM profiles
WHERE id != 'YOUR_USER_ID'
AND is_active = true
AND id NOT IN (
  -- 排除已經喜歡過的
  SELECT liked_id FROM likes WHERE liker_id = 'YOUR_USER_ID'
  UNION
  -- 排除已經略過的
  SELECT passed_id FROM passes WHERE passer_id = 'YOUR_USER_ID'
)
LIMIT 10;
```

## ⚠️ 注意事項

1. **首次註冊後**，用戶資料不會自動創建，需要在 ProfileSetup 頁面完成
2. **照片上傳**需要先設定 Storage bucket
3. **測試時**建議創建幾個測試帳號來測試配對功能
4. **生產環境**建議啟用 Supabase 的 Email 驗證

## 🔧 開發工具

### 安裝 Supabase CLI（可選）
```bash
npm install -g supabase
```

### 生成 TypeScript 類型（推薦）
```bash
supabase gen types typescript --project-id ikwqsmclbxwymfqfxgec > src/integrations/supabase/types.ts
```

## 🆘 常見問題

**Q: 執行 SQL 時出現權限錯誤？**
A: 確保你在 Supabase 控制台使用 SQL Editor，而不是用普通的資料庫連線。

**Q: 配對沒有自動創建？**
A: 檢查 trigger 是否正確創建，可以在 Database → Functions & Triggers 查看。

**Q: 無法上傳照片？**
A: 確認已經創建 `profile-photos` bucket 並設定正確的 policy。
