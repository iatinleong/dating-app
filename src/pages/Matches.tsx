import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Users } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";

// Mock matched users
const mockMatches = [
  {
    id: "1",
    name: "小美",
    age: 26,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    matchedAt: "2 小時前",
    lastMessage: "嗨！很高興認識你 😊",
    unread: true,
  },
  {
    id: "2",
    name: "小華",
    age: 28,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    matchedAt: "昨天",
    lastMessage: "週末有空嗎？",
    unread: false,
  },
  {
    id: "3",
    name: "小芳",
    age: 25,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    matchedAt: "3 天前",
    lastMessage: null,
    unread: false,
  },
  {
    id: "4",
    name: "小明",
    age: 29,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    matchedAt: "1 週前",
    lastMessage: "謝謝你的推薦！",
    unread: false,
  },
];

const Matches = () => {
  const navigate = useNavigate();
  const [matches] = useState(mockMatches);

  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto max-w-lg px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-romantic rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">配對</h1>
              <p className="text-sm text-muted-foreground">{matches.length} 個配對</p>
            </div>
          </div>
        </div>
      </header>

      {/* Matches Grid */}
      <div className="container mx-auto max-w-lg px-4 py-6">
        {matches.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">還沒有配對</h2>
            <p className="text-muted-foreground mb-6">
              繼續滑動來尋找你的理想對象
            </p>
            <Button variant="gradient" onClick={() => navigate("/swipe")}>
              開始探索
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {matches.map((match) => (
              <Card
                key={match.id}
                className="overflow-hidden cursor-pointer hover:shadow-hover transition-shadow"
                onClick={() => navigate(`/chat/${match.id}`)}
              >
                <div className="relative aspect-square">
                  <img
                    src={match.photo}
                    alt={match.name}
                    className="w-full h-full object-cover"
                  />
                  {match.unread && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary">新訊息</Badge>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-primary-foreground">
                    <h3 className="font-semibold text-lg">
                      {match.name}, {match.age}
                    </h3>
                    <p className="text-xs opacity-90">{match.matchedAt}</p>
                  </div>
                </div>
                {match.lastMessage && (
                  <div className="p-3 bg-muted/50 border-t border-border">
                    <p className="text-sm text-muted-foreground truncate flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 flex-shrink-0" />
                      {match.lastMessage}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Matches;
