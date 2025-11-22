import { Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  points: number;
  level: number;
}

export const Header = ({ points, level }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Poppins' }}>
            Cidadão Ativo
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-accent px-4 py-2">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm" style={{ fontFamily: 'Inter' }}>
              {points} pts
            </span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
