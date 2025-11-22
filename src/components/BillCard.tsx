import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Share2, FileText } from "lucide-react";
import { Bill } from "@/types/bill";

interface BillCardProps {
  bill: Bill;
  onVote: (billId: string, vote: 'yes' | 'no') => void;
  onShare: (billId: string) => void;
  onViewDetails: (billId: string) => void;
}

export const BillCard = ({ bill, onVote, onShare, onViewDetails }: BillCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all border-2">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <Badge 
              variant={bill.category === 'saúde' ? 'default' : 'secondary'}
              className="font-medium"
            >
              {bill.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {bill.status}
            </Badge>
          </div>
          <CardTitle className="text-xl leading-tight" style={{ fontFamily: 'Poppins' }}>
            {bill.title}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed" style={{ fontFamily: 'Inter' }}>
            {bill.simplifiedDescription}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-success">
                <ThumbsUp className="h-4 w-4" />
                {bill.votesYes}
              </span>
              <span className="flex items-center gap-1 text-destructive">
                <ThumbsDown className="h-4 w-4" />
                {bill.votesNo}
              </span>
            </div>
            <span className="text-muted-foreground">+{bill.points} pts</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => onVote(bill.id, 'yes')}
              className="flex-1 bg-success hover:bg-success/90"
              size="sm"
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              A Favor
            </Button>
            <Button 
              onClick={() => onVote(bill.id, 'no')}
              variant="destructive"
              className="flex-1"
              size="sm"
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              Contra
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => onViewDetails(bill.id)}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Ver Detalhes
            </Button>
            <Button 
              onClick={() => onShare(bill.id)}
              variant="outline"
              size="sm"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
