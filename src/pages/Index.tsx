import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { LevelProgress } from "@/components/LevelProgress";
import { BillCard } from "@/components/BillCard";
import { QuizSection } from "@/components/QuizSection";
import { BillFilters } from "@/components/BillFilters";
import { useBills } from "@/hooks/useBills";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-civic.jpg";

const Index = () => {
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentXP, setCurrentXP] = useState(0);
  const requiredXP = level * 200;
  const [selectedBill, setSelectedBill] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: bills = [], isLoading, isError, refetch } = useBills(15);

  // Extract unique categories and statuses from bills
  const { categories, statuses } = useMemo(() => {
    const cats = [...new Set(bills.map(b => b.category))];
    const stats = [...new Set(bills.map(b => b.status))];
    return { categories: cats, statuses: stats };
  }, [bills]);

  // Filter bills based on selected filters
  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      const matchesCategory = selectedCategory === "all" || bill.category === selectedCategory;
      const matchesStatus = selectedStatus === "all" || bill.status === selectedStatus;
      return matchesCategory && matchesStatus;
    });
  }, [bills, selectedCategory, selectedStatus]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedStatus("all");
  };

  const handleVote = (billId: string, vote: 'yes' | 'no') => {
    const bill = bills.find(b => b.id === billId);
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
    const bill = bills.find(b => b.id === billId);
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
    navigate(`/projeto/${billId}`);
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
                <p className="text-2xl font-bold">{bills.length}</p>
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
              quiz={bills.find(b => b.id === selectedBill)!.quiz}
              onComplete={handleQuizComplete}
            />
          </motion.div>
        )}

        {/* Bills Grid */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-2xl font-bold" style={{ fontFamily: 'Poppins' }}>
              Projetos em Votação
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>

          {/* Filters */}
          <BillFilters
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            onCategoryChange={setSelectedCategory}
            onStatusChange={setSelectedStatus}
            onClearFilters={clearFilters}
            categories={categories}
            statuses={statuses}
          />
          
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Carregando proposições da Câmara...</span>
            </div>
          )}
          
          {isError && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Erro ao carregar proposições. Usando dados de demonstração.</p>
            </div>
          )}

          {!isLoading && filteredBills.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhum projeto encontrado com os filtros selecionados.</p>
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Limpar filtros
              </Button>
            </div>
          )}
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBills.map((bill, index) => (
              <motion.div
                key={bill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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
