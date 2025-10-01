import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-dating.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-romantic rounded-full flex items-center justify-center shadow-hover">
            <Heart className="w-10 h-10 text-primary-foreground fill-current" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">
            Heart Match
          </h1>
          <p className="text-xl text-muted-foreground">
            滑動開啟你的浪漫旅程
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4 pt-8">
          <Button 
            variant="gradient" 
            size="lg"
            onClick={() => navigate("/auth?mode=signup")}
            className="w-full text-lg h-14"
          >
            註冊
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/auth?mode=login")}
            className="w-full text-lg h-14"
          >
            登錄
          </Button>
        </div>

        {/* Footer */}
        <p className="text-sm text-muted-foreground pt-8">
          滑動尋找你的靈魂伴侶
        </p>
      </div>
    </div>
  );
};

export default Index;
