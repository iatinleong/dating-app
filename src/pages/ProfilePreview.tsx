import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Briefcase, GraduationCap, Languages, Activity, Wine, Cigarette, UtensilsCrossed, ArrowLeft, Edit } from "lucide-react";

const ProfilePreview = () => {
  const navigate = useNavigate();

  // Mock data - in real app this would come from state/database
  const profile = {
    nickname: "小明",
    age: 28,
    gender: "男",
    height: "175 cm",
    location: "台北市",
    occupation: "軟體工程師",
    salary: "60K - 80K",
    education: "碩士",
    school: "台灣大學",
    religion: "佛教",
    religiosity: "中等虔誠",
    languages: ["中文", "英文", "日文"],
    exercise: "一週數次",
    drinking: "社交場合喝",
    smoking: "一根不抽",
    diet: "葷食",
    relationshipGoal: "長期穩定關係",
    bio: "喜歡旅行和攝影，熱愛探索新事物。工作之餘喜歡健身和閱讀。希望能找到一個志同道合的夥伴，一起經歷人生的美好時光。"
  };

  return (
    <div className="min-h-screen bg-gradient-soft py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首頁
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/profile-setup")}
          >
            <Edit className="w-4 h-4 mr-2" />
            編輯資料
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">個人資料預覽</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">這就是你的個人資料</h1>
          <p className="text-muted-foreground">看起來如何？可以隨時編輯修改</p>
        </div>

        {/* Profile Card */}
        <Card className="shadow-hover mb-6 overflow-hidden">
          <div className="h-80 bg-gradient-romantic flex items-center justify-center text-primary-foreground">
            <div className="text-center">
              <div className="w-32 h-32 bg-background/20 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl font-bold">
                {profile.nickname.charAt(0)}
              </div>
              <h2 className="text-4xl font-bold">{profile.nickname}, {profile.age}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold mb-3">基本資訊</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">{profile.gender}</Badge>
                  <span className="text-muted-foreground">性別</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">{profile.height}</Badge>
                  <span className="text-muted-foreground">身高</span>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            {(profile.occupation || profile.education) && (
              <div>
                <h3 className="text-lg font-semibold mb-3">個人背景</h3>
                <div className="space-y-3">
                  {profile.occupation && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{profile.occupation}</div>
                        {profile.salary && <div className="text-sm text-muted-foreground">{profile.salary}</div>}
                      </div>
                    </div>
                  )}
                  {profile.education && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{profile.education}</div>
                        {profile.school && <div className="text-sm text-muted-foreground">{profile.school}</div>}
                      </div>
                    </div>
                  )}
                  {profile.languages && profile.languages.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Languages className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.languages.map(lang => (
                          <Badge key={lang} variant="outline">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lifestyle */}
            {(profile.exercise || profile.drinking || profile.smoking || profile.diet) && (
              <div>
                <h3 className="text-lg font-semibold mb-3">生活習慣</h3>
                <div className="grid grid-cols-2 gap-4">
                  {profile.exercise && (
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">運動</div>
                        <div className="font-medium">{profile.exercise}</div>
                      </div>
                    </div>
                  )}
                  {profile.drinking && (
                    <div className="flex items-center gap-2">
                      <Wine className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">飲酒</div>
                        <div className="font-medium">{profile.drinking}</div>
                      </div>
                    </div>
                  )}
                  {profile.smoking && (
                    <div className="flex items-center gap-2">
                      <Cigarette className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">抽菸</div>
                        <div className="font-medium">{profile.smoking}</div>
                      </div>
                    </div>
                  )}
                  {profile.diet && (
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">飲食</div>
                        <div className="font-medium">{profile.diet}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Relationship Goal */}
            {profile.relationshipGoal && (
              <div>
                <h3 className="text-lg font-semibold mb-3">尋找的關係</h3>
                <Badge variant="default" className="text-base py-2 px-4">
                  {profile.relationshipGoal === "long-term" && "長期穩定關係"}
                  {profile.relationshipGoal === "short-term-open" && "短期關係，順其自然"}
                  {profile.relationshipGoal === "short-term-fun" && "短暫快樂"}
                  {profile.relationshipGoal === "friends" && "新朋友"}
                  {profile.relationshipGoal === "figuring-out" && "還在探索"}
                </Badge>
              </div>
            )}

            {/* Bio */}
            {profile.bio && (
              <div>
                <h3 className="text-lg font-semibold mb-3">自我介紹</h3>
                <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button 
            variant="gradient" 
            size="lg"
            onClick={() => navigate("/")}
          >
            <Heart className="w-5 h-5 mr-2" />
            開始尋找配對
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePreview;
