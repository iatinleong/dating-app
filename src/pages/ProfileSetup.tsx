import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Heart, Upload, ArrowLeft, X, Plus } from "lucide-react";
import { upsertProfile, uploadPhoto, addPhotoRecord } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  // Required
  nickname: string;
  birthdate: string;
  gender: string;
  height: string;
  location: string;
  photos: File[];
  
  // Optional Personal Info
  occupation?: string;
  salary?: string;
  education?: string;
  school?: string;
  religion?: string;
  religiosity?: string;
  languages?: string[];
  
  // Optional Lifestyle
  exercise?: string;
  drinking?: string;
  smoking?: string;
  diet?: string;
  
  // Relationship Goal
  relationshipGoal?: string;
  bio?: string;
}

const ProfileSetup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    nickname: "",
    birthdate: "",
    gender: "",
    height: "",
    location: "",
    photos: [],
  });

  const updateField = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const targetIndex = (e.target as any)._targetIndex;

    if (files && files.length > 0) {
      const file = files[0]; // Only take first file
      const newPhotos = [...profileData.photos];

      if (targetIndex !== undefined && targetIndex < newPhotos.length) {
        // Replace existing photo
        newPhotos[targetIndex] = file;
      } else {
        // Add new photo
        newPhotos.push(file);
      }

      setProfileData(prev => ({
        ...prev,
        photos: newPhotos
      }));

      toast({
        title: "照片已上傳",
        description: "照片已添加到你的個人資料",
      });
    }

    // Clear the target index
    delete (e.target as any)._targetIndex;
  };

  const triggerPhotoUpload = (index: number) => {
    // Store the target index for when file is selected
    (fileInputRef.current as any)._targetIndex = index;
    fileInputRef.current?.click();
  };

  const handlePhotoReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const newPhotos = [...profileData.photos];
    const [movedPhoto] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, movedPhoto);

    updateField("photos", newPhotos);
  };

  const removePhoto = (index: number) => {
    const newPhotos = profileData.photos.filter((_, i) => i !== index);
    updateField("photos", newPhotos);
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate required fields
      if (!profileData.nickname || !profileData.birthdate || !profileData.gender ||
          !profileData.height || !profileData.location) {
        toast({
          title: "請填寫所有必填欄位",
          description: "暱稱、生日、性別、身高和地點都是必填的",
          variant: "destructive",
        });
        return;
      }

      // Validate age (must be 18+)
      const birthDate = new Date(profileData.birthdate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

      if (actualAge < 18) {
        toast({
          title: "年齡限制",
          description: "必須年滿 18 歲才能使用此服務",
          variant: "destructive",
        });
        return;
      }

      // Validate height range
      const heightNum = parseInt(profileData.height);
      if (isNaN(heightNum) || heightNum < 140 || heightNum > 200) {
        toast({
          title: "身高範圍錯誤",
          description: "身高必須在 140-200 cm 之間",
          variant: "destructive",
        });
        return;
      }

      // Validate photos
      if (profileData.photos.length === 0) {
        toast({
          title: "請上傳至少一張照片",
          description: "照片是必填的",
          variant: "destructive",
        });
        return;
      }
    }

    if (step === 2) {
      // Validate languages (required)
      if (!profileData.languages || profileData.languages.length === 0) {
        toast({
          title: "請選擇語言",
          description: "至少需要選擇一種語言",
          variant: "destructive",
        });
        return;
      }
    }

    if (step === 3) {
      // Validate lifestyle habits (all required)
      if (!profileData.exercise || !profileData.drinking || !profileData.smoking || !profileData.diet) {
        toast({
          title: "請填寫所有生活習慣",
          description: "運動、飲酒、抽菸、飲食習慣都是必填的",
          variant: "destructive",
        });
        return;
      }
    }

    if (step === 4) {
      // Validate relationship goal (required)
      if (!profileData.relationshipGoal) {
        toast({
          title: "請選擇關係目標",
          description: "請告訴我們你在尋找什麼樣的關係",
          variant: "destructive",
        });
        return;
      }
    }

    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("未登入");
      }

      // Prepare profile data
      const profilePayload = {
        nickname: profileData.nickname,
        birthdate: profileData.birthdate,
        gender: profileData.gender as 'male' | 'female',
        height: parseInt(profileData.height),
        location: profileData.location,
        occupation: profileData.occupation,
        salary: profileData.salary,
        education: profileData.education,
        school: profileData.school,
        religion: profileData.religion,
        religiosity: profileData.religiosity,
        languages: profileData.languages,
        exercise: profileData.exercise,
        drinking: profileData.drinking,
        smoking: profileData.smoking,
        diet: profileData.diet,
        relationship_goal: profileData.relationshipGoal,
        bio: profileData.bio,
      };

      // Create profile FIRST (must exist before photos can reference it)
      await upsertProfile(profilePayload);

      // Upload photos AFTER profile exists
      const photoUrls: string[] = [];
      for (let i = 0; i < profileData.photos.length; i++) {
        const photoUrl = await uploadPhoto(profileData.photos[i], user.id);
        photoUrls.push(photoUrl);
        await addPhotoRecord(photoUrl, i);
      }

      toast({
        title: "個人資料已建立！",
        description: "歡迎來到你的浪漫旅程",
      });

      navigate("/explore");
    } catch (error: any) {
      console.error("Profile setup error:", error);
      toast({
        title: "建立資料失敗",
        description: error.message || "請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = (language: string) => {
    setProfileData(prev => {
      const currentLanguages = prev.languages || [];
      const hasLanguage = currentLanguages.includes(language);

      return {
        ...prev,
        languages: hasLanguage
          ? currentLanguages.filter(l => l !== language)
          : [...currentLanguages, language]
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-soft py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首頁
        </Button>

        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">步驟 {step} / 4</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">建立你的個人資料</h1>
          <p className="text-muted-foreground">讓我們更了解你，找到最適合的對象</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-romantic transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>
              {step === 1 && "基本資料"}
              {step === 2 && "個人資訊"}
              {step === 3 && "生活習慣"}
              {step === 4 && "關係目標"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "這些資訊將幫助我們為你找到最適合的配對"}
              {step === 2 && "語言是必填項目，其他資訊可以讓配對更精準"}
              {step === 3 && "所有生活習慣都是必填的"}
              {step === 4 && "關係目標是必填的，告訴我們你在尋找什麼"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nickname">暱稱 *</Label>
                  <Input
                    id="nickname"
                    placeholder="輸入你的暱稱"
                    value={profileData.nickname}
                    onChange={(e) => updateField("nickname", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthdate">生日 *</Label>
                  <Input
                    id="birthdate"
                    type="date"
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    value={profileData.birthdate}
                    onChange={(e) => updateField("birthdate", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">必須年滿 18 歲</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">性別 *</Label>
                  <Select value={profileData.gender} onValueChange={(value) => updateField("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇性別" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">男</SelectItem>
                      <SelectItem value="female">女</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">身高 (cm) *</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="例如：175"
                    min="140"
                    max="200"
                    value={profileData.height}
                    onChange={(e) => updateField("height", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">身高範圍：140-200 cm</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">地點 *</Label>
                  <Select value={profileData.location} onValueChange={(value) => updateField("location", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇縣市" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="台北市">台北市</SelectItem>
                      <SelectItem value="新北市">新北市</SelectItem>
                      <SelectItem value="桃園市">桃園市</SelectItem>
                      <SelectItem value="台中市">台中市</SelectItem>
                      <SelectItem value="台南市">台南市</SelectItem>
                      <SelectItem value="高雄市">高雄市</SelectItem>
                      <SelectItem value="基隆市">基隆市</SelectItem>
                      <SelectItem value="新竹市">新竹市</SelectItem>
                      <SelectItem value="嘉義市">嘉義市</SelectItem>
                      <SelectItem value="新竹縣">新竹縣</SelectItem>
                      <SelectItem value="苗栗縣">苗栗縣</SelectItem>
                      <SelectItem value="彰化縣">彰化縣</SelectItem>
                      <SelectItem value="南投縣">南投縣</SelectItem>
                      <SelectItem value="雲林縣">雲林縣</SelectItem>
                      <SelectItem value="嘉義縣">嘉義縣</SelectItem>
                      <SelectItem value="屏東縣">屏東縣</SelectItem>
                      <SelectItem value="宜蘭縣">宜蘭縣</SelectItem>
                      <SelectItem value="花蓮縣">花蓮縣</SelectItem>
                      <SelectItem value="台東縣">台東縣</SelectItem>
                      <SelectItem value="澎湖縣">澎湖縣</SelectItem>
                      <SelectItem value="金門縣">金門縣</SelectItem>
                      <SelectItem value="連江縣">連江縣</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photos">照片 * (最多 6 張)</Label>
                  <p className="text-sm text-muted-foreground mb-3">點擊格子上傳照片，拖動照片可調整順序</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => {
                      const photo = profileData.photos[index];
                      const photoUrl = photo ? URL.createObjectURL(photo) : null;

                      return (
                        <div
                          key={index}
                          className={`relative aspect-[3/4] border-2 border-dashed rounded-lg overflow-hidden transition-all ${
                            draggedIndex === index
                              ? "border-primary bg-primary/5 scale-95"
                              : "border-border hover:border-primary"
                          } ${photo ? "cursor-move" : "cursor-pointer"}`}
                          onClick={() => !photo && triggerPhotoUpload(index)}
                          draggable={!!photo}
                          onDragStart={() => setDraggedIndex(index)}
                          onDragEnd={() => setDraggedIndex(null)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add("border-primary", "bg-primary/5");
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove("border-primary", "bg-primary/5");
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove("border-primary", "bg-primary/5");
                            if (draggedIndex !== null && photo) {
                              handlePhotoReorder(draggedIndex, index);
                            }
                          }}
                        >
                          {photoUrl ? (
                            <>
                              <img
                                src={photoUrl}
                                alt={`照片 ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                {index + 1}
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removePhoto(index);
                                }}
                                className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                              <Plus className="w-8 h-8 mb-1" />
                              <span className="text-xs">添加照片</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <Input
                    ref={fileInputRef}
                    id="photos"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="occupation">職業</Label>
                  <Input
                    id="occupation"
                    placeholder="例如：軟體工程師"
                    value={profileData.occupation || ""}
                    onChange={(e) => updateField("occupation", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">薪水</Label>
                  <Select value={profileData.salary} onValueChange={(value) => updateField("salary", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇薪資範圍" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below-40k">40K 以下</SelectItem>
                      <SelectItem value="40k-60k">40K - 60K</SelectItem>
                      <SelectItem value="60k-80k">60K - 80K</SelectItem>
                      <SelectItem value="80k-100k">80K - 100K</SelectItem>
                      <SelectItem value="above-100k">100K 以上</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">教育程度</Label>
                  <Select value={profileData.education} onValueChange={(value) => updateField("education", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇教育程度" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">高中</SelectItem>
                      <SelectItem value="bachelor">大學</SelectItem>
                      <SelectItem value="master">碩士</SelectItem>
                      <SelectItem value="phd">博士</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">學校</Label>
                  <Input
                    id="school"
                    placeholder="例如：台灣大學"
                    value={profileData.school || ""}
                    onChange={(e) => updateField("school", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="religion">宗教信仰</Label>
                  <Select value={profileData.religion} onValueChange={(value) => updateField("religion", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇宗教信仰" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buddhism">佛教</SelectItem>
                      <SelectItem value="christianity">基督教</SelectItem>
                      <SelectItem value="islam">伊斯蘭教</SelectItem>
                      <SelectItem value="taoism">道教</SelectItem>
                      <SelectItem value="none">無宗教信仰</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {profileData.religion && profileData.religion !== "none" && (
                  <div className="space-y-2">
                    <Label htmlFor="religiosity">虔誠度</Label>
                    <Select value={profileData.religiosity} onValueChange={(value) => updateField("religiosity", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇虔誠度" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="very-religious">非常虔誠</SelectItem>
                        <SelectItem value="moderately-religious">中等虔誠</SelectItem>
                        <SelectItem value="slightly-religious">略微虔誠</SelectItem>
                        <SelectItem value="not-practicing">不太實踐</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>語言（可複選）*</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "中文", label: "中文" },
                      { value: "English", label: "English" },
                      { value: "台語", label: "台語" },
                      { value: "客家話", label: "客家話" },
                      { value: "日本語", label: "日本語" },
                      { value: "한국어", label: "한국어" },
                      { value: "Español", label: "Español" },
                      { value: "Français", label: "Français" },
                    ].map((lang) => (
                      <div key={lang.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lang-${lang.value}`}
                          checked={profileData.languages?.includes(lang.value) || false}
                          onCheckedChange={() => toggleLanguage(lang.value)}
                        />
                        <label
                          htmlFor={`lang-${lang.value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {lang.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="exercise">運動習慣 *</Label>
                  <Select value={profileData.exercise} onValueChange={(value) => updateField("exercise", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇運動習慣" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">每天</SelectItem>
                      <SelectItem value="several-times-week">一週數次</SelectItem>
                      <SelectItem value="sometimes">偶爾</SelectItem>
                      <SelectItem value="rarely">幾乎不</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drinking">飲酒習慣 *</Label>
                  <Select value={profileData.drinking} onValueChange={(value) => updateField("drinking", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇飲酒習慣" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social">社交場合喝</SelectItem>
                      <SelectItem value="often">經常喝</SelectItem>
                      <SelectItem value="sometimes">偶爾</SelectItem>
                      <SelectItem value="never">滴酒不沾</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smoking">抽菸習慣 *</Label>
                  <Select value={profileData.smoking} onValueChange={(value) => updateField("smoking", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇抽菸習慣" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social">社交場合抽</SelectItem>
                      <SelectItem value="often">經常抽</SelectItem>
                      <SelectItem value="sometimes">偶爾</SelectItem>
                      <SelectItem value="never">一根不抽</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diet">飲食習慣 *</Label>
                  <Select value={profileData.diet} onValueChange={(value) => updateField("diet", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇飲食習慣" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="omnivore">葷食</SelectItem>
                      <SelectItem value="vegetarian">素食</SelectItem>
                      <SelectItem value="vegan">純素</SelectItem>
                      <SelectItem value="pescatarian">海鮮素</SelectItem>
                      <SelectItem value="other">特殊飲食</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="relationshipGoal">你在尋找什麼樣的關係？*</Label>
                  <Select value={profileData.relationshipGoal} onValueChange={(value) => updateField("relationshipGoal", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇關係目標" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="long-term">長期穩定關係</SelectItem>
                      <SelectItem value="short-term-open">短期關係，順其自然</SelectItem>
                      <SelectItem value="short-term-fun">短暫快樂</SelectItem>
                      <SelectItem value="friends">新朋友</SelectItem>
                      <SelectItem value="figuring-out">還在探索</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">自我介紹</Label>
                  <Textarea
                    id="bio"
                    placeholder="分享一些關於你的故事，讓別人更了解你..."
                    value={profileData.bio || ""}
                    onChange={(e) => updateField("bio", e.target.value)}
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground">寫得越詳細，配對越精準！</p>
                </div>
              </>
            )}

            <div className="flex gap-4 pt-6">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  上一步
                </Button>
              )}
              <Button
                variant="gradient"
                onClick={handleNext}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "處理中..." : (step === 4 ? "完成" : "下一步")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
