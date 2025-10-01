import { Button } from "@/components/ui/button";
import { Heart, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-dating.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">找到你的真命天子/天女</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                開啟你的
                <span className="bg-gradient-romantic bg-clip-text text-transparent"> 浪漫旅程</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
                不只是約會，更是尋找靈魂伴侶的旅程。透過智能配對，找到真正懂你的人。
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  variant="gradient" 
                  size="lg"
                  onClick={() => navigate("/profile-setup")}
                  className="group"
                >
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  開始配對
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/profile-setup")}
                >
                  了解更多
                </Button>
              </div>

              <div className="flex gap-8 justify-center lg:justify-start pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">活躍用戶</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">5K+</div>
                  <div className="text-sm text-muted-foreground">成功配對</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">滿意度</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-romantic opacity-20 blur-3xl rounded-full"></div>
              <img 
                src={heroImage} 
                alt="浪漫約會" 
                className="relative rounded-3xl shadow-hover w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">為什麼選擇我們？</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              我們致力於為每個人創造真誠、安全且有意義的連結
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-card hover:shadow-hover transition-all duration-300 border border-border">
              <div className="w-14 h-14 bg-gradient-romantic rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">智能配對</h3>
              <p className="text-muted-foreground">
                基於你的興趣、價值觀和生活方式，為你推薦最合適的對象
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-card hover:shadow-hover transition-all duration-300 border border-border">
              <div className="w-14 h-14 bg-gradient-romantic rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">真實用戶</h3>
              <p className="text-muted-foreground">
                嚴格的身份驗證機制，確保每個用戶都是真實可信的
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-card hover:shadow-hover transition-all duration-300 border border-border">
              <div className="w-14 h-14 bg-gradient-romantic rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">個性化體驗</h3>
              <p className="text-muted-foreground">
                詳細的個人資料設定，讓配對更精準，讓相遇更有意義
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-romantic rounded-3xl p-12 md:p-16 text-center shadow-hover">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
              準備好開始了嗎？
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              加入我們，開啟你的浪漫旅程。幸福，可能就在下一次滑動中。
            </p>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/profile-setup")}
              className="bg-background text-foreground hover:bg-background/90 border-0"
            >
              立即加入
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
