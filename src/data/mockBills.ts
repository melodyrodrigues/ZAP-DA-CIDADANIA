import { Bill } from "@/types/bill";

export const mockBills: Bill[] = [
  {
    id: "1",
    title: "Lei de Incentivo à Energia Solar",
    originalText: "PL 1234/2024 - Dispõe sobre incentivos fiscais para instalação de painéis solares...",
    simplifiedDescription: "Este projeto quer dar desconto no imposto para quem instalar painéis solares em casa ou empresa. A ideia é tornar a energia limpa mais acessível e barata.",
    category: "meio ambiente",
    status: "em votação",
    votesYes: 234,
    votesNo: 89,
    points: 50,
    representatives: [
      {
        id: "r1",
        name: "Ana Silva",
        party: "PV",
        state: "SP",
        vote: "yes"
      },
      {
        id: "r2",
        name: "Carlos Santos",
        party: "PSDB",
        state: "RJ",
        vote: "yes"
      },
      {
        id: "r3",
        name: "Beatriz Lima",
        party: "PT",
        state: "MG",
        vote: "no"
      }
    ],
    quiz: {
      question: "Qual é o principal benefício deste projeto de lei?",
      options: [
        "Aumentar impostos sobre energia",
        "Tornar energia solar mais acessível através de incentivos fiscais",
        "Proibir o uso de outras fontes de energia",
        "Criar novas taxas para empresas"
      ],
      correctAnswer: 1,
      explanation: "O projeto oferece incentivos fiscais (descontos em impostos) para quem adotar energia solar, tornando-a mais acessível."
    }
  },
  {
    id: "2",
    title: "Programa de Saúde Mental nas Escolas",
    originalText: "PL 2345/2024 - Institui programa nacional de apoio psicológico em instituições de ensino...",
    simplifiedDescription: "Coloca psicólogos em todas as escolas públicas para ajudar estudantes com problemas emocionais e mentais. Cada escola terá pelo menos um profissional.",
    category: "saúde",
    status: "em votação",
    votesYes: 412,
    votesNo: 45,
    points: 75,
    representatives: [
      {
        id: "r4",
        name: "Pedro Costa",
        party: "PDT",
        state: "BA",
        vote: "yes"
      },
      {
        id: "r5",
        name: "Juliana Alves",
        party: "PSOL",
        state: "SP",
        vote: "yes"
      }
    ],
    quiz: {
      question: "O que este projeto propõe para as escolas públicas?",
      options: [
        "Aumentar o número de aulas",
        "Contratar psicólogos para apoiar os estudantes",
        "Reduzir férias escolares",
        "Criar mais provas"
      ],
      correctAnswer: 1,
      explanation: "O projeto institui psicólogos nas escolas para oferecer apoio emocional e mental aos estudantes."
    }
  },
  {
    id: "3",
    title: "Transparência em Gastos Públicos Online",
    originalText: "PL 3456/2024 - Determina a publicação em tempo real de todas as despesas governamentais...",
    simplifiedDescription: "Obriga o governo a mostrar online, em tempo real, todo o dinheiro que gasta. Qualquer cidadão poderá ver onde cada centavo está sendo usado.",
    category: "transparência",
    status: "em votação",
    votesYes: 389,
    votesNo: 112,
    points: 100,
    representatives: [
      {
        id: "r6",
        name: "Roberto Mendes",
        party: "NOVO",
        state: "RS",
        vote: "yes"
      },
      {
        id: "r7",
        name: "Mariana Rocha",
        party: "DEM",
        state: "PR",
        vote: "no"
      }
    ],
    quiz: {
      question: "Qual o objetivo principal da Lei de Transparência?",
      options: [
        "Esconder gastos do governo",
        "Permitir que cidadãos vejam em tempo real como o dinheiro público é gasto",
        "Aumentar impostos",
        "Diminuir salários de funcionários"
      ],
      correctAnswer: 1,
      explanation: "A lei visa dar total transparência aos gastos públicos, permitindo que qualquer pessoa acompanhe em tempo real."
    }
  }
];
