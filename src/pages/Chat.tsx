import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, MoreVertical, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock user data
const mockUsers = {
  "1": {
    name: "小美",
    age: 26,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  "2": {
    name: "小華",
    age: 28,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  "3": {
    name: "小芳",
    age: 25,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
  "4": {
    name: "小明",
    age: 29,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
};

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: Date;
}

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const user = userId ? mockUsers[userId as keyof typeof mockUsers] : null;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "me",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessageText("");

    // Simulate response
    setTimeout(() => {
      const responses = [
        "聽起來很棒！",
        "真的嗎？告訴我更多！",
        "我也這麼覺得 😊",
        "週末有空嗎？",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          sender: "them",
          timestamp: new Date(),
        },
      ]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>找不到用戶</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/messages")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-3 flex-1">
          <img
            src={user.photo}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold">
              {user.name}, {user.age}
            </h2>
            <p className="text-xs text-muted-foreground">線上</p>
          </div>
        </div>

        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Heart className="w-16 h-16 text-primary/20 mb-4" />
            <h3 className="text-lg font-semibold mb-2">開始對話</h3>
            <p className="text-muted-foreground text-sm">
              和 {user.name} 打個招呼吧！
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    message.sender === "me"
                      ? "bg-gradient-romantic text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "me"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="輸入訊息..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button
            variant="gradient"
            size="icon"
            onClick={handleSend}
            disabled={!messageText.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
