import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import BottomNav from "@/components/BottomNav";

// Mock conversations
const mockConversations = [
  {
    id: "1",
    name: "小美",
    age: 26,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    lastMessage: "嗨！很高興認識你 😊",
    timestamp: "2 分鐘前",
    unread: 2,
  },
  {
    id: "2",
    name: "小華",
    age: 28,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    lastMessage: "週末有空嗎？想約你去看展覽",
    timestamp: "1 小時前",
    unread: 0,
  },
  {
    id: "3",
    name: "小芳",
    age: 25,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    lastMessage: "那間咖啡廳真的很不錯！",
    timestamp: "昨天",
    unread: 0,
  },
  {
    id: "4",
    name: "小明",
    age: 29,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    lastMessage: "謝謝你的推薦！下次一起去",
    timestamp: "2 天前",
    unread: 1,
  },
];

const Messages = () => {
  const navigate = useNavigate();
  const [conversations] = useState(mockConversations);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto max-w-lg px-4 py-4">
          <h1 className="text-2xl font-bold mb-4">訊息</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="搜尋對話..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      {/* Conversations List */}
      <div className="container mx-auto max-w-lg">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {searchQuery ? "找不到對話" : "還沒有訊息"}
            </h2>
            <p className="text-muted-foreground">
              {searchQuery
                ? "試試其他搜尋關鍵字"
                : "配對成功後就可以開始聊天了"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className="border-0 rounded-none cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/chat/${conversation.id}`)}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={conversation.photo}
                      alt={conversation.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {conversation.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">
                          {conversation.unread}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-semibold text-base">
                        {conversation.name}, {conversation.age}
                      </h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        conversation.unread > 0
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Messages;
