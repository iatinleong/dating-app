import { useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Mock data
const mockLikes = [
  {
    id: "1",
    name: "小美",
    age: 26,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    location: "台北市",
    occupation: "設計師",
  },
  {
    id: "2",
    name: "小華",
    age: 28,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    location: "新北市",
    occupation: "工程師",
  },
];

const mockTopPicks = [
  {
    id: "3",
    name: "小芳",
    age: 25,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    location: "台北市",
    occupation: "行銷專員",
    matchScore: 95,
  },
  {
    id: "4",
    name: "小明",
    age: 29,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    location: "台北市",
    occupation: "創業家",
    matchScore: 92,
  },
];

const Like = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("likes");

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="p-4 bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto max-w-lg">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-romantic rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground fill-current" />
            </div>
            <h1 className="text-xl font-bold">喜歡</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-lg p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="likes">
              <Heart className="w-4 h-4 mr-2" />
              誰喜歡我
            </TabsTrigger>
            <TabsTrigger value="top-picks">
              <Sparkles className="w-4 h-4 mr-2" />
              Top Pick
            </TabsTrigger>
          </TabsList>

          <TabsContent value="likes" className="space-y-4">
            {mockLikes.length > 0 ? (
              mockLikes.map((user) => (
                <Card
                  key={user.id}
                  className="p-4 cursor-pointer hover:shadow-hover transition-shadow"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={user.photo} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {user.name}, {user.age}
                      </h3>
                      <p className="text-sm text-muted-foreground">{user.occupation}</p>
                      <p className="text-sm text-muted-foreground">{user.location}</p>
                    </div>
                    <Button variant="gradient" size="icon" className="rounded-full">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">還沒有人喜歡你</h3>
                <p className="text-muted-foreground">繼續探索，找到你的緣分！</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="top-picks" className="space-y-4">
            <div className="bg-accent/10 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">每日精選</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                根據你的喜好，我們為你精選了最匹配的對象
              </p>
            </div>

            {mockTopPicks.map((user) => (
              <Card
                key={user.id}
                className="overflow-hidden cursor-pointer hover:shadow-hover transition-shadow"
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                <div className="relative">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {user.matchScore}% 匹配
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">
                    {user.name}, {user.age}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.occupation}</p>
                  <p className="text-sm text-muted-foreground">{user.location}</p>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default Like;
