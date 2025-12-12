import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Loader2, ThumbsUp, ThumbsDown, Minus, Calendar, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchBillDetails, BillDetailsData } from "@/lib/api/camara";

const BillDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: bill, isLoading, error } = useQuery<BillDetailsData>({
    queryKey: ["billDetails", id],
    queryFn: () => fetchBillDetails(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 text-center text-muted-foreground">
            Não foi possível carregar os detalhes do projeto de lei.
          </CardContent>
        </Card>
      </div>
    );
  }

  const getVoteIcon = (vote: string) => {
    switch (vote) {
      case "yes":
        return <ThumbsUp className="h-4 w-4 text-success" />;
      case "no":
        return <ThumbsDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getVoteBadge = (vote: string) => {
    switch (vote) {
      case "yes":
        return <Badge className="bg-success">A Favor</Badge>;
      case "no":
        return <Badge variant="destructive">Contra</Badge>;
      default:
        return <Badge variant="secondary">Abstenção</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="default">{bill.category}</Badge>
                <Badge variant="outline">{bill.status}</Badge>
              </div>
              <CardTitle className="text-2xl" style={{ fontFamily: 'Poppins' }}>
                {bill.title}
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                {bill.simplifiedDescription}
              </p>
              {bill.urlInteiroTeor && (
                <Button variant="outline" size="sm" className="mt-4 w-fit" asChild>
                  <a href={bill.urlInteiroTeor} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Texto Original Completo
                  </a>
                </Button>
              )}
            </CardHeader>
          </Card>

          {/* Texto Original */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Texto Original (Ementa)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {bill.originalText}
              </p>
            </CardContent>
          </Card>

          {/* Tramitação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tramitação</CardTitle>
            </CardHeader>
            <CardContent>
              {bill.tramitacoes.length > 0 ? (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {bill.tramitacoes.map((tram, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative pl-6 pb-4 border-l-2 border-primary/20 last:border-transparent"
                      >
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(tram.dataHora).toLocaleDateString('pt-BR')}</span>
                            <Building2 className="h-3 w-3 ml-2" />
                            <span>{tram.siglaOrgao}</span>
                          </div>
                          <p className="text-sm font-medium">{tram.descricaoTramitacao}</p>
                          {tram.despacho && (
                            <p className="text-xs text-muted-foreground">{tram.despacho}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Nenhuma tramitação disponível ainda.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Votos dos Deputados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Votos dos Deputados</CardTitle>
              <div className="flex gap-4 text-sm mt-2">
                <span className="flex items-center gap-1 text-success">
                  <ThumbsUp className="h-4 w-4" />
                  {bill.votesYes} a favor
                </span>
                <span className="flex items-center gap-1 text-destructive">
                  <ThumbsDown className="h-4 w-4" />
                  {bill.votesNo} contra
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {bill.representatives.length > 0 && bill.representatives[0].name !== "Aguardando votação" ? (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid gap-3">
                    {bill.representatives.map((rep, index) => (
                      <motion.div
                        key={rep.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={rep.photo} alt={rep.name} />
                          <AvatarFallback>{rep.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{rep.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {rep.party} - {rep.state}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getVoteIcon(rep.vote)}
                          {getVoteBadge(rep.vote)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Este projeto ainda não foi votado ou os votos não estão disponíveis.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BillDetails;
