import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { Quiz } from "@/types/bill";

interface QuizSectionProps {
  quiz: Quiz;
  onComplete: (correct: boolean) => void;
}

export const QuizSection = ({ quiz, onComplete }: QuizSectionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    const isCorrect = index === quiz.correctAnswer;
    setTimeout(() => onComplete(isCorrect), 1500);
  };

  return (
    <Card className="shadow-lg border-2">
      <CardHeader>
        <CardTitle className="text-lg" style={{ fontFamily: 'Poppins' }}>
          🎯 Quiz do Projeto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-foreground font-medium" style={{ fontFamily: 'Inter' }}>
          {quiz.question}
        </p>
        
        <div className="space-y-2">
          <AnimatePresence>
            {quiz.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === quiz.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    onClick={() => !showResult && handleAnswer(index)}
                    disabled={showResult}
                    variant={showCorrect ? "default" : showWrong ? "destructive" : "outline"}
                    className="w-full justify-start text-left h-auto py-3 px-4"
                  >
                    <span className="flex-1" style={{ fontFamily: 'Inter' }}>
                      {option}
                    </span>
                    {showCorrect && <CheckCircle2 className="h-5 w-5 ml-2" />}
                    {showWrong && <XCircle className="h-5 w-5 ml-2" />}
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};
