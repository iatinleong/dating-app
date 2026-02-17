# API 使用指南

## 📚 概述

`src/lib/api.ts` 提供了完整的 API 函數，讓你可以輕鬆操作 Supabase 資料庫。

## 🔐 Profile APIs（用戶資料）

### 創建/更新個人資料
```typescript
import { upsertProfile } from '@/lib/api';

const handleSubmit = async () => {
  try {
    const profile = await upsertProfile({
      nickname: "小明",
      birthdate: "1995-03-15",
      gender: "male",
      height: 175,
      location: "台北市",
      occupation: "軟體工程師",
      bio: "喜歡爬山和攝影",
    });
    console.log("資料已儲存:", profile);
  } catch (error) {
    console.error("儲存失敗:", error);
  }
};
```

### 獲取當前用戶資料
```typescript
import { getCurrentProfile } from '@/lib/api';

const loadProfile = async () => {
  try {
    const profile = await getCurrentProfile();
    console.log("我的資料:", profile);
  } catch (error) {
    console.error("載入失敗:", error);
  }
};
```

### 查看其他用戶資料
```typescript
import { getUserProfile } from '@/lib/api';

const viewUser = async (userId: string) => {
  try {
    const user = await getUserProfile(userId);
    console.log("用戶資料:", user);
    console.log("用戶照片:", user.photos);
  } catch (error) {
    console.error("載入失敗:", error);
  }
};
```

## 📸 Photo APIs（照片管理）

### 上傳並添加照片
```typescript
import { uploadPhoto, addPhotoRecord, getCurrentProfile } from '@/lib/api';

const handlePhotoUpload = async (file: File) => {
  try {
    const profile = await getCurrentProfile();

    // 1. 上傳照片到 Storage
    const photoUrl = await uploadPhoto(file, profile.id);

    // 2. 添加照片記錄到資料庫
    const photo = await addPhotoRecord(photoUrl, 0);

    console.log("照片上傳成功:", photo);
  } catch (error) {
    console.error("上傳失敗:", error);
  }
};

// 在 React 組件中使用
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  }}
/>
```

### 獲取用戶照片
```typescript
import { getUserPhotos } from '@/lib/api';

const loadPhotos = async (userId: string) => {
  try {
    const photos = await getUserPhotos(userId);
    console.log("照片列表:", photos);
  } catch (error) {
    console.error("載入失敗:", error);
  }
};
```

## 🔍 Discovery APIs（探索頁面）

### 獲取推薦用戶
```typescript
import { getRecommendedUsers } from '@/lib/api';

const loadRecommendations = async () => {
  try {
    const users = await getRecommendedUsers({
      minAge: 25,
      maxAge: 35,
      gender: 'female',
      maxDistance: 10,
    }, 20); // 最多 20 個推薦

    console.log("推薦用戶:", users);
  } catch (error) {
    console.error("載入失敗:", error);
  }
};
```

### 在 Explore 頁面使用
```typescript
// src/pages/Explore.tsx
import { useEffect, useState } from 'react';
import { getRecommendedUsers } from '@/lib/api';

const Explore = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    minAge: 18,
    maxAge: 50,
    gender: 'all',
  });

  useEffect(() => {
    const loadUsers = async () => {
      const recommendations = await getRecommendedUsers(filters);
      setUsers(recommendations);
    };
    loadUsers();
  }, [filters]);

  // ... rest of component
};
```

## ❤️ Like APIs（喜歡功能）

### 喜歡用戶
```typescript
import { likeUser } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const handleLike = async (userId: string, isSuper: boolean = false) => {
  try {
    const { like, isMatch } = await likeUser(
      userId,
      isSuper ? 'super' : 'normal'
    );

    if (isMatch) {
      toast({
        title: "🎉 配對成功！",
        description: "你們互相喜歡，現在可以開始聊天了",
      });
    } else {
      toast({
        title: "❤️ 已喜歡",
        description: "如果對方也喜歡你，就會配對成功",
      });
    }
  } catch (error) {
    console.error("操作失敗:", error);
  }
};
```

### 略過用戶
```typescript
import { passUser } from '@/lib/api';

const handlePass = async (userId: string) => {
  try {
    await passUser(userId);
    console.log("已略過");
  } catch (error) {
    console.error("操作失敗:", error);
  }
};
```

### 查看誰喜歡我
```typescript
import { getUsersWhoLikedMe } from '@/lib/api';

const loadLikes = async () => {
  try {
    const likes = await getUsersWhoLikedMe();
    console.log("喜歡我的人:", likes);

    likes.forEach(like => {
      console.log("用戶:", like.liker);
      console.log("喜歡類型:", like.like_type); // 'normal' or 'super'
    });
  } catch (error) {
    console.error("載入失敗:", error);
  }
};
```

## 💕 Match APIs（配對管理）

### 獲取配對列表
```typescript
import { getMatches } from '@/lib/api';

const loadMatches = async () => {
  try {
    const matches = await getMatches();

    matches.forEach(match => {
      console.log("配對ID:", match.id);
      console.log("對方:", match.otherUser); // 總是對方的資料
      console.log("配對時間:", match.matched_at);
    });
  } catch (error) {
    console.error("載入失敗:", error);
  }
};
```

### 在 Matches 頁面使用
```typescript
// src/pages/Matches.tsx
import { useEffect, useState } from 'react';
import { getMatches } from '@/lib/api';

const Matches = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getMatches();
      setMatches(data);
    };
    loadData();
  }, []);

  return (
    <div>
      {matches.map(match => (
        <div key={match.id}>
          <img src={match.otherUser.photos[0]?.photo_url} alt="" />
          <h3>{match.otherUser.nickname}</h3>
        </div>
      ))}
    </div>
  );
};
```

## 💬 Message APIs（聊天功能）

### 發送訊息
```typescript
import { sendMessage } from '@/lib/api';

const handleSend = async (matchId: string, text: string) => {
  try {
    const message = await sendMessage(matchId, text);
    console.log("訊息已發送:", message);
  } catch (error) {
    console.error("發送失敗:", error);
  }
};
```

### 獲取聊天記錄
```typescript
import { getMessages } from '@/lib/api';

const loadChat = async (matchId: string) => {
  try {
    const messages = await getMessages(matchId);

    messages.forEach(msg => {
      console.log("發送者:", msg.sender.nickname);
      console.log("內容:", msg.content);
      console.log("時間:", msg.created_at);
      console.log("已讀:", msg.read_at ? "是" : "否");
    });
  } catch (error) {
    console.error("載入失敗:", error);
  }
};
```

### 即時聊天（Realtime）
```typescript
import { subscribeToMessages } from '@/lib/api';
import { useEffect } from 'react';

const Chat = ({ matchId }: { matchId: string }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // 訂閱即時訊息
    const subscription = subscribeToMessages(matchId, (newMessage) => {
      console.log("新訊息:", newMessage);
      setMessages(prev => [...prev, newMessage]);
    });

    // 清理訂閱
    return () => {
      subscription.unsubscribe();
    };
  }, [matchId]);

  // ... rest of component
};
```

### 完整的聊天組件範例
```typescript
// src/pages/Chat.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMessages, sendMessage, subscribeToMessages } from '@/lib/api';

const Chat = () => {
  const { matchId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // 載入歷史訊息
    const loadMessages = async () => {
      const data = await getMessages(matchId!);
      setMessages(data);
    };
    loadMessages();

    // 訂閱即時訊息
    const subscription = subscribeToMessages(matchId!, (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => subscription.unsubscribe();
  }, [matchId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    await sendMessage(matchId!, newMessage);
    setNewMessage("");
  };

  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id}>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend}>發送</button>
    </div>
  );
};
```

## 🎯 使用 React Query（推薦）

為了更好的狀態管理和快取，建議配合 React Query 使用：

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMatches, sendMessage } from '@/lib/api';

// 查詢配對列表
const useMatches = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: getMatches,
  });
};

// 發送訊息
const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ matchId, content }: { matchId: string; content: string }) =>
      sendMessage(matchId, content),
    onSuccess: () => {
      // 重新載入訊息列表
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

// 在組件中使用
const Matches = () => {
  const { data: matches, isLoading } = useMatches();

  if (isLoading) return <div>載入中...</div>;

  return (
    <div>
      {matches?.map(match => (
        <div key={match.id}>{match.otherUser.nickname}</div>
      ))}
    </div>
  );
};
```

## ⚠️ 錯誤處理

所有 API 函數都會在錯誤時 throw error，建議使用 try-catch：

```typescript
try {
  const result = await someApiFunction();
  // 成功處理
} catch (error: any) {
  console.error("錯誤:", error);
  toast({
    title: "操作失敗",
    description: error.message || "請稍後再試",
    variant: "destructive",
  });
}
```

## 🔒 權限說明

所有 API 都已經配置了 Row Level Security (RLS)：

- ✅ 用戶只能修改自己的資料
- ✅ 用戶只能在配對後傳訊息
- ✅ 用戶無法看到已略過/喜歡的記錄
- ✅ 照片可被所有人查看

如果遇到權限錯誤，請檢查：
1. 用戶是否已登入
2. 操作是否符合權限規則
3. Supabase RLS policies 是否正確設定
