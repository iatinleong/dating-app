/**
 * Supabase API Service Layer
 * 提供簡單易用的 API 函數來操作資料庫
 */

import { supabase } from "@/integrations/supabase/client";

// =============================================
// Profile APIs
// =============================================

export interface ProfileData {
  nickname: string;
  birthdate: string;
  gender: 'male' | 'female';
  height: number;
  location: string;
  occupation?: string;
  salary?: string;
  education?: string;
  school?: string;
  religion?: string;
  religiosity?: string;
  languages?: string[];
  exercise?: string;
  drinking?: string;
  smoking?: string;
  diet?: string;
  relationship_goal?: string;
  bio?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * 創建或更新用戶資料
 */
export async function upsertProfile(data: ProfileData) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('未登入');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: user.email!,
      ...data,
      profile_completed: true,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return profile;
}

/**
 * 獲取當前用戶資料
 */
export async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('未登入');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * 獲取其他用戶資料
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      photos (
        id,
        photo_url,
        photo_order
      )
    `)
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// =============================================
// Photo APIs
// =============================================

/**
 * 上傳照片到 Supabase Storage
 */
export async function uploadPhoto(file: File, userId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('profile-photos')
    .upload(fileName, file);

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(fileName);

  return publicUrl;
}

/**
 * 添加照片記錄到資料庫
 */
export async function addPhotoRecord(photoUrl: string, order: number = 0) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('未登入');
  }

  const { data, error } = await supabase
    .from('photos')
    .insert({
      user_id: user.id,
      photo_url: photoUrl,
      photo_order: order,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 獲取用戶的所有照片
 */
export async function getUserPhotos(userId: string) {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('user_id', userId)
    .order('photo_order', { ascending: true });

  if (error) throw error;
  return data;
}

// =============================================
// Discovery APIs (探索頁面)
// =============================================

export interface DiscoveryFilters {
  minAge?: number;
  maxAge?: number;
  gender?: 'male' | 'female' | 'all';
  maxDistance?: number; // in km
}

/**
 * 獲取推薦用戶列表（排除已互動過的）
 */
export async function getRecommendedUsers(filters: DiscoveryFilters = {}, limit: number = 10) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('未登入');
  }

  // Get users already interacted with
  const { data: likedUsers } = await supabase
    .from('likes')
    .select('liked_id')
    .eq('liker_id', user.id);

  const { data: passedUsers } = await supabase
    .from('passes')
    .select('passed_id')
    .eq('passer_id', user.id);

  const excludedIds = [
    user.id,
    ...(likedUsers?.map(l => l.liked_id) || []),
    ...(passedUsers?.map(p => p.passed_id) || []),
  ];

  // Build query
  let query = supabase
    .from('profiles')
    .select(`
      *,
      photos (
        id,
        photo_url,
        photo_order
      )
    `)
    .eq('is_active', true)
    .not('id', 'in', `(${excludedIds.join(',')})`)
    .limit(limit);

  // Apply filters
  if (filters.gender && filters.gender !== 'all') {
    query = query.eq('gender', filters.gender);
  }

  if (filters.minAge || filters.maxAge) {
    const today = new Date();
    if (filters.maxAge) {
      const minBirthdate = new Date(today.getFullYear() - filters.maxAge, today.getMonth(), today.getDate());
      query = query.gte('birthdate', minBirthdate.toISOString().split('T')[0]);
    }
    if (filters.minAge) {
      const maxBirthdate = new Date(today.getFullYear() - filters.minAge, today.getMonth(), today.getDate());
      query = query.lte('birthdate', maxBirthdate.toISOString().split('T')[0]);
    }
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

// =============================================
// Like APIs
// =============================================

/**
 * 喜歡一個用戶
 */
export async function likeUser(likedUserId: string, likeType: 'normal' | 'super' = 'normal') {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('未登入');
  }

  const { data, error } = await supabase
    .from('likes')
    .insert({
      liker_id: user.id,
      liked_id: likedUserId,
      like_type: likeType,
    })
    .select()
    .single();

  if (error) throw error;

  // Check if it's a match (the trigger will auto-create match)
  const { data: isMatch } = await supabase
    .from('matches')
    .select('id')
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .or(`user1_id.eq.${likedUserId},user2_id.eq.${likedUserId}`)
    .single();

  return { like: data, isMatch: !!isMatch };
}

/**
 * 略過一個用戶
 */
export async function passUser(passedUserId: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('未登入');
  }

  const { data, error } = await supabase
    .from('passes')
    .insert({
      passer_id: user.id,
      passed_id: passedUserId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 獲取喜歡我的用戶列表
 */
export async function getUsersWhoLikedMe() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('未登入');
  }

  const { data, error } = await supabase
    .from('likes')
    .select(`
      *,
      liker:profiles!liker_id (
        *,
        photos (
          id,
          photo_url,
          photo_order
        )
      )
    `)
    .eq('liked_id', user.id);

  if (error) throw error;
  return data;
}

// =============================================
// Match APIs
// =============================================

/**
 * 獲取配對列表
 */
export async function getMatches() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('未登入');
  }

  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      user1:profiles!user1_id (
        *,
        photos (
          id,
          photo_url,
          photo_order
        )
      ),
      user2:profiles!user2_id (
        *,
        photos (
          id,
          photo_url,
          photo_order
        )
      )
    `)
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .eq('is_active', true)
    .order('matched_at', { ascending: false });

  if (error) throw error;

  // Transform data to always have "other user" in a consistent field
  return data?.map(match => ({
    ...match,
    otherUser: match.user1_id === user.id ? match.user2 : match.user1,
  }));
}

// =============================================
// Message APIs
// =============================================

/**
 * 發送訊息
 */
export async function sendMessage(matchId: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('未登入');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      match_id: matchId,
      sender_id: user.id,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 獲取配對的聊天記錄
 */
export async function getMessages(matchId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!sender_id (
        id,
        nickname,
        photos (
          photo_url
        )
      )
    `)
    .eq('match_id', matchId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * 標記訊息為已讀
 */
export async function markMessageAsRead(messageId: string) {
  const { data, error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 訂閱即時訊息（Realtime）
 */
export function subscribeToMessages(matchId: string, callback: (message: any) => void) {
  return supabase
    .channel(`messages:${matchId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
}
