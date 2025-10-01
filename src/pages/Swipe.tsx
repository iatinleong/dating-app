import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Heart, X, Star, Settings, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserCard from "@/components/UserCard";
import BottomNav from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockUsers = [
  {
    id: "1",
    name: "小美",
    age: 26,
    location: "台北市",
    distance: "3 km",
    photos: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1200&fit=crop"],
    occupation: "設計師",
    education: "碩士",
    bio: "熱愛旅行和攝影，喜歡探索新的咖啡廳。週末喜歡爬山和看展覽。",
  },
  {
    id: "2",
    name: "小華",
    age: 28,
    location: "新北市",
    distance: "5 km",
    photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop"],
    occupation: "工程師",
    education: "大學",
    bio: "熱愛運動和美食，喜歡嘗試新餐廳。工作之餘喜歡打籃球和健身。",
  },
  {
    id: "3",
    name: "小芳",
    age: 25,
    location: "台北市",
    distance: "2 km",
    photos: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1200&fit=crop"],
    occupation: "行銷專員",
    education: "大學",
    bio: "喜歡閱讀和寫作，對藝術和文化有濃厚興趣。尋找能一起成長的靈魂伴侶。",
  },
  {
    id: "4",
    name: "小明",
    age: 29,
    location: "台北市",
    distance: "4 km",
    photos: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1200&fit=crop"],
    occupation: "創業家",
    education: "碩士",
    bio: "充滿創意和熱情，喜歡挑戰新事物。希望找到志同道合的夥伴一起冒險。",
  },
];

const Swipe = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  const currentUser = users[currentIndex];

  const handleSwipe = (direction: "left" | "right" | "super") => {
    if (!currentUser) return;

    setSwipeDirection(direction === "left" ? "left" : "right");

    setTimeout(() => {
      if (direction === "right") {
        toast({
          title: "❤️ 你喜歡了 " + currentUser.name,
          description: "如果對方也喜歡你，就配對成功了！",
        });
      } else if (direction === "super") {
        toast({
          title: "⭐ 你超級喜歡了 " + currentUser.name,
          description: "對方會看到你的超級喜歡！",
        });
      }

      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
      setDragOffset({ x: 0, y: 0 });
    }, 300);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold) {
      handleSwipe(dragOffset.x > 0 ? "right" : "left");
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const getCardStyle = () => {
    const rotation = dragOffset.x / 20;
    const opacity = 1 - Math.abs(dragOffset.x) / 300;

    if (swipeDirection) {
      return {
        transform: `translateX(${swipeDirection === "right" ? "150%" : "-150%"}) rotate(${swipeDirection === "right" ? 30 : -30}deg)`,
        transition: "transform 0.3s ease-out",
        opacity: 0,
      };
    }

    return {
      transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
      transition: isDragging ? "none" : "transform 0.3s ease-out",
      opacity,
      cursor: isDragging ? "grabbing" : "grab",
    };
  };

  if (currentIndex >= users.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-romantic rounded-full flex items-center justify-center mx-auto shadow-hover">
            <Heart className="w-10 h-10 text-primary-foreground fill-current" />
          </div>
          <h2 className="text-3xl font-bold">沒有更多用戶了</h2>
          <p className="text-muted-foreground">稍後再回來查看新的配對對象</p>
          <Button variant="gradient" onClick={() => navigate("/")}>
            返回首頁
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col pb-20">
      {/* Header */}
      <header className="p-4 flex items-center justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/profile-preview")}
          className="rounded-full"
        >
          <Settings className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-romantic rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground fill-current" />
          </div>
          <span className="font-bold text-xl">Heart Match</span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/messages")}
          className="rounded-full"
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
      </header>

      {/* Card Stack */}
      <div className="flex-1 flex items-center justify-center p-4 pb-32 relative">
        <div 
          className="relative w-full max-w-md aspect-[3/4]"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Background cards for depth */}
          {users.slice(currentIndex + 1, currentIndex + 3).map((user, index) => (
            <div
              key={user.id}
              className="absolute w-full h-full rounded-3xl bg-card shadow-card"
              style={{
                transform: `scale(${1 - (index + 1) * 0.05}) translateY(${(index + 1) * 10}px)`,
                zIndex: -index - 1,
                opacity: 1 - (index + 1) * 0.3,
              }}
            />
          ))}

          {/* Current card */}
          <div
            ref={cardRef}
            onMouseDown={handleMouseDown}
            className="relative w-full h-full"
            style={{ zIndex: 10 }}
          >
            <UserCard user={currentUser} style={getCardStyle()} />
          </div>

          {/* Swipe indicators */}
          {dragOffset.x > 50 && (
            <div className="absolute top-1/4 right-8 transform rotate-12 z-20 pointer-events-none">
              <div className="px-6 py-3 border-4 border-green-500 rounded-xl">
                <span className="text-4xl font-bold text-green-500">LIKE</span>
              </div>
            </div>
          )}
          {dragOffset.x < -50 && (
            <div className="absolute top-1/4 left-8 transform -rotate-12 z-20 pointer-events-none">
              <div className="px-6 py-3 border-4 border-red-500 rounded-xl">
                <span className="text-4xl font-bold text-red-500">NOPE</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-4 px-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleSwipe("left")}
          className="w-16 h-16 rounded-full shadow-hover border-2 bg-background hover:bg-destructive/10 hover:border-destructive"
        >
          <X className="w-8 h-8 text-destructive" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handleSwipe("super")}
          className="w-14 h-14 rounded-full shadow-hover border-2 bg-background hover:bg-accent/10 hover:border-accent"
        >
          <Star className="w-7 h-7 text-accent" />
        </Button>

        <Button
          variant="gradient"
          size="icon"
          onClick={() => handleSwipe("right")}
          className="w-16 h-16 rounded-full shadow-hover"
        >
          <Heart className="w-8 h-8" />
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Swipe;
