import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "密碼不匹配",
        description: "請確認兩次輸入的密碼相同",
        variant: "destructive",
      });
      return;
    }

    // Basic password validation
    if (password.length < 6) {
      toast({
        title: "密碼太短",
        description: "密碼至少需要 6 個字元",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Login with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "登錄成功！",
          description: "歡迎回來",
        });

        // Check if user has completed profile setup
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user?.id)
          .single();

        if (!profile) {
          navigate("/profile-setup");
        } else {
          navigate("/explore");
        }
      } else {
        // Sign up with Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "註冊成功！",
          description: "請前往設定個人資料",
        });

        navigate("/profile-setup");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);

      // 特別處理 Email 未驗證錯誤
      if (error.message?.includes("Email not confirmed")) {
        toast({
          title: "📧 Email 尚未驗證",
          description: "請先到 Email 收件匣點擊驗證連結，或聯絡管理員手動驗證",
          variant: "destructive",
          duration: 8000,
        });
      } else if (error.message?.includes("Invalid login credentials")) {
        toast({
          title: "登入失敗",
          description: "帳號或密碼錯誤，請重新輸入",
          variant: "destructive",
        });
      } else if (error.message?.includes("User already registered")) {
        toast({
          title: "此 Email 已註冊",
          description: "請直接登入，或使用其他 Email",
          variant: "destructive",
        });
      } else {
        toast({
          title: "錯誤",
          description: error.message || "操作失敗，請重試",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-romantic rounded-full flex items-center justify-center shadow-hover">
            <Heart className="w-8 h-8 text-primary-foreground fill-current" />
          </div>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isLogin ? "登錄" : "註冊"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin ? "歡迎回到 Heart Match" : "開始你的浪漫旅程"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密碼</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">確認密碼</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "處理中..." : (isLogin ? "登錄" : "註冊")}
              </Button>

              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline"
                >
                  {isLogin ? "還沒有帳號？註冊" : "已有帳號？登錄"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
