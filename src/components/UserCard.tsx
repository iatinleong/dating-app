import { MapPin, Briefcase, GraduationCap, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    age: number;
    location: string;
    photos: string[];
    occupation?: string;
    education?: string;
    bio?: string;
    distance?: string;
  };
  style?: React.CSSProperties;
}

const UserCard = ({ user, style }: UserCardProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % user.photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + user.photos.length) % user.photos.length);
  };

  return (
    <div 
      className="absolute w-full h-full rounded-3xl overflow-hidden shadow-hover bg-card"
      style={style}
    >
      {/* Photo */}
      <div className="relative w-full h-full">
        <img 
          src={user.photos[currentPhotoIndex]} 
          alt={user.name}
          className="w-full h-full object-cover"
        />

        {/* Photo indicators */}
        {user.photos.length > 1 && (
          <div className="absolute top-4 left-4 right-4 flex gap-2">
            {user.photos.map((_, index) => (
              <div 
                key={index}
                className={`flex-1 h-1 rounded-full transition-all ${
                  index === currentPhotoIndex 
                    ? 'bg-primary-foreground' 
                    : 'bg-primary-foreground/30'
                }`}
              />
            ))}
          </div>
        )}

        {/* Photo navigation areas */}
        {user.photos.length > 1 && (
          <>
            <div 
              className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer"
              onClick={prevPhoto}
            />
            <div 
              className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer"
              onClick={nextPhoto}
            />
          </>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

        {/* User Info - Always visible */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
          <div className="flex items-end justify-between mb-2">
            <div>
              <h2 className="text-4xl font-bold mb-1">
                {user.name}, {user.age}
              </h2>
              <div className="flex items-center gap-2 text-sm mb-3">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
                {user.distance && <span>• {user.distance}</span>}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
              className="w-10 h-10 bg-primary-foreground/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          {/* Quick info badges */}
          <div className="flex gap-2 flex-wrap">
            {user.occupation && (
              <Badge variant="secondary" className="bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground border-0">
                <Briefcase className="w-3 h-3 mr-1" />
                {user.occupation}
              </Badge>
            )}
            {user.education && (
              <Badge variant="secondary" className="bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground border-0">
                <GraduationCap className="w-3 h-3 mr-1" />
                {user.education}
              </Badge>
            )}
          </div>

          {/* Detailed info - Expandable */}
          {showDetails && user.bio && (
            <div className="mt-4 p-4 bg-primary-foreground/20 backdrop-blur-sm rounded-2xl animate-fade-in">
              <p className="text-sm leading-relaxed">{user.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
