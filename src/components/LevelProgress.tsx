import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";

interface LevelProgressProps {
  level: number;
  currentXP: number;
  requiredXP: number;
}

export const LevelProgress = ({ level, currentXP, requiredXP }: LevelProgressProps) => {
  const progress = (currentXP / requiredXP) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-gradient-hero p-6 text-white shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium opacity-90" style={{ fontFamily: 'Inter' }}>
              Nível
            </p>
            <p className="text-2xl font-bold" style={{ fontFamily: 'Poppins' }}>
              {level}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90" style={{ fontFamily: 'Inter' }}>
            {currentXP} / {requiredXP} XP
          </p>
        </div>
      </div>
      <Progress value={progress} className="h-3 bg-white/20" />
    </motion.div>
  );
};
