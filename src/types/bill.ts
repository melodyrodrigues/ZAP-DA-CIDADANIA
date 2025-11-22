export interface Bill {
  id: string;
  title: string;
  originalText: string;
  simplifiedDescription: string;
  category: string;
  status: 'em votação' | 'aprovado' | 'rejeitado';
  votesYes: number;
  votesNo: number;
  points: number;
  representatives: Representative[];
  quiz: Quiz;
}

export interface Representative {
  id: string;
  name: string;
  party: string;
  state: string;
  vote: 'yes' | 'no' | 'abstained';
  photo?: string;
}

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
