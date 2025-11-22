import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { LevelProgress } from "@/components/LevelProgress";
import { BillCard } from "@/components/BillCard";
import { QuizSection } from "@/components/QuizSection";
import { mockBills } from "@/data/mockBills";
import { useToast } from "@/hooks/use-toast";
import { Share2 } from "lucide-react";
import heroImage from "@/assets/hero-civic.jpg";

const Index = () => {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentXP, setCurrentXP] = useState(0);
  const requiredXP = level * 200;
  const [selectedBill, setSelectedBill] = useState<string | null>(null);
  const { toast } = useToast();

  const handleVote = (billId: string, vote: 'yes' | 'no') => {
    const bill = mockBills.find(b => b.id === billId);
    if (!bill) return;

    const earnedPoints = bill.points;
    setPoints(prev => prev + earnedPoints);
    setCurrentXP(prev => {
      const newXP = prev + earnedPoints;
      if (newXP >= requiredXP) {
        setLevel(l => l + 1);
        toast({
          title: "🎉 Level Up!",
          description: `Você alcançou o nível ${level + 1}!`,
        });
        return newXP - requiredXP;
      }
      return newXP;
    });

    setSelectedBill(billId);
    
    toast({
      title: "Voto registrado!",
      description: `Você votou ${vote === 'yes' ? 'A FAVOR' : 'CONTRA'}. +${earnedPoints} pontos!`,
    });
  };

  const handleShare = (billId: string) => {
    const bill = mockBills.find(b => b.id === billId);
    if (!bill) return;

    const message = `🗳️ Acabei de votar no projeto "${bill.title}"!\n\nEntenda em linguagem simples: ${bill.simplifiedDescription}\n\nParticipe você também! 👇`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Compartilhar no WhatsApp",
      description: "Abrindo WhatsApp...",
    });
  };

  const handleViewDetails = (billId: string) => {
    toast({
      title: "Em breve!",
      description: "Página de detalhes será adicionada em breve.",
    });
  };

  const handleQuizComplete = (correct: boolean) => {
    if (correct) {
      const bonusPoints = 25;
      setPoints(prev => prev + bonusPoints);
      setCurrentXP(prev => prev + bonusPoints);
      toast({
        title: "✅ Resposta Correta!",
        description: `+${bonusPoints} pontos de bônus!`,
      });
    } else {
      toast({
        title: "❌ Resposta Incorreta",
        description: "Tente novamente em outro projeto!",
        variant: "destructive",
      });
    }
    setSelectedBill(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header points={points} level={level} />
      
      <main className="container px-4 py-8 space-y-8">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-hero text-white shadow-xl"
        >
          <div className="absolute inset-0 opacity-20">
            <img 
              src={heroImage} 
              alt="Cidadão Ativo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative p-8 md:p-12 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold" style={{ fontFamily: 'Poppins' }}>
              Sua Voz Importa! 🗳️
            </h2>
            <p className="text-lg md:text-xl opacity-95 max-w-2xl" style={{ fontFamily: 'Inter' }}>
              Entenda projetos de lei em linguagem simples, vote, aprenda e ganhe pontos por participar da democracia!
            </p>
            <div className="flex gap-4 pt-4">
              <div className="bg-white/20 backdrop-blur rounded-lg px-6 py-3">
                <p className="text-sm opacity-90">Projetos Ativos</p>
                <p className="text-2xl font-bold">{mockBills.length}</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg px-6 py-3">
                <p className="text-sm opacity-90">Seus Pontos</p>
                <p className="text-2xl font-bold">{points}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Progress Section */}
        <LevelProgress level={level} currentXP={currentXP} requiredXP={requiredXP} />

        {/* Quiz Section */}
        {selectedBill && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <QuizSection 
              quiz={mockBills.find(b => b.id === selectedBill)!.quiz}
              onComplete={handleQuizComplete}
            />
          </motion.div>
        )}

        {/* Bills Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold" style={{ fontFamily: 'Poppins' }}>
              Projetos em Votação
            </h3>
            <span className="text-sm text-muted-foreground" style={{ fontFamily: 'Inter' }}>
              Vote e ganhe pontos!
            </span>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockBills.map((bill, index) => (
              <motion.div
                key={bill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BillCard
                  bill={bill}
                  onVote={handleVote}
                  onShare={handleShare}
                  onViewDetails={handleViewDetails}
                />
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
