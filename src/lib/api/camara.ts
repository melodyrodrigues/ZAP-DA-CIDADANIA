import { Bill, Representative } from "@/types/bill";

const BASE_URL = "https://dadosabertos.camara.leg.br/api/v2";

export interface Tramitacao {
  dataHora: string;
  sequencia: number;
  siglaOrgao: string;
  descricaoTramitacao: string;
  despacho: string;
}

export interface BillDetailsData {
  id: string;
  title: string;
  originalText: string;
  simplifiedDescription: string;
  category: string;
  status: string;
  votesYes: number;
  votesNo: number;
  representatives: Representative[];
  tramitacoes: Tramitacao[];
  urlInteiroTeor: string;
}

interface ProposicaoResponse {
  dados: Proposicao[];
  links: { rel: string; href: string }[];
}

interface Proposicao {
  id: number;
  uri: string;
  siglaTipo: string;
  codTipo: number;
  numero: number;
  ano: number;
  ementa: string;
}

interface ProposicaoDetalhes {
  dados: {
    id: number;
    uri: string;
    siglaTipo: string;
    codTipo: number;
    numero: number;
    ano: number;
    ementa: string;
    dataApresentacao: string;
    statusProposicao: {
      dataHora: string;
      sequencia: number;
      siglaOrgao: string;
      descricaoSituacao: string;
      descricaoTramitacao: string;
    };
    keywords: string;
    urlInteiroTeor: string;
  };
}

interface VotacaoResponse {
  dados: Votacao[];
}

interface Votacao {
  id: string;
  uri: string;
  data: string;
  dataHoraRegistro: string;
  siglaOrgao: string;
  descricao: string;
  aprovacao: number;
}

interface VotosResponse {
  dados: Voto[];
}

interface Voto {
  tipoVoto: string;
  dataRegistroVoto: string;
  deputado_: {
    id: number;
    uri: string;
    nome: string;
    siglaPartido: string;
    uriPartido: string;
    siglaUf: string;
    urlFoto: string;
  };
}

// Categorias com base em palavras-chave
const categorizeByKeywords = (ementa: string, keywords: string): string => {
  const text = (ementa + " " + keywords).toLowerCase();
  
  if (text.includes("saúde") || text.includes("médic") || text.includes("hospital") || text.includes("sus")) {
    return "saúde";
  }
  if (text.includes("educaç") || text.includes("escola") || text.includes("ensino") || text.includes("universidade")) {
    return "educação";
  }
  if (text.includes("ambiente") || text.includes("clima") || text.includes("energia") || text.includes("sustentável")) {
    return "meio ambiente";
  }
  if (text.includes("segurança") || text.includes("polícia") || text.includes("crime")) {
    return "segurança";
  }
  if (text.includes("economia") || text.includes("imposto") || text.includes("fiscal") || text.includes("tributar")) {
    return "economia";
  }
  if (text.includes("trabalho") || text.includes("emprego") || text.includes("salário")) {
    return "trabalho";
  }
  if (text.includes("transpar") || text.includes("corrupção") || text.includes("público")) {
    return "transparência";
  }
  
  return "geral";
};

// Determina o status com base na situação
const getStatus = (descricaoSituacao: string): 'em votação' | 'aprovado' | 'rejeitado' => {
  const situacao = descricaoSituacao.toLowerCase();
  
  if (situacao.includes("aprovad") || situacao.includes("sancionad")) {
    return "aprovado";
  }
  if (situacao.includes("rejeitad") || situacao.includes("arquivad")) {
    return "rejeitado";
  }
  
  return "em votação";
};

// Gera quiz simples baseado no projeto
const generateQuiz = (bill: Partial<Bill>) => {
  return {
    question: `O que o projeto "${bill.title}" propõe fazer?`,
    options: [
      bill.simplifiedDescription?.slice(0, 60) + "..." || "Melhorar serviços públicos",
      "Aumentar impostos sobre a população",
      "Reduzir direitos trabalhistas",
      "Privatizar todos os serviços públicos"
    ],
    correctAnswer: 0,
    explanation: bill.simplifiedDescription || "Este projeto visa melhorar a qualidade de vida dos brasileiros."
  };
};

// Simplifica a ementa para linguagem acessível
const simplifyEmenta = (ementa: string): string => {
  // Remove termos técnicos e simplifica
  let simplified = ementa
    .replace(/Altera a Lei nº? \d+\.?\d*\/?\d*/gi, "Modifica uma lei que")
    .replace(/Dispõe sobre/gi, "Trata de")
    .replace(/no âmbito/gi, "no contexto")
    .replace(/institui/gi, "cria")
    .replace(/estabelece diretrizes/gi, "define regras")
    .replace(/e dá outras providências\.?/gi, "")
    .trim();
  
  // Se ficou muito longo, corta
  if (simplified.length > 200) {
    simplified = simplified.slice(0, 200) + "...";
  }
  
  return simplified;
};

export async function fetchProposicoes(limit: number = 10): Promise<Bill[]> {
  try {
    // Busca proposições recentes em tramitação
    const params = new URLSearchParams({
      siglaTipo: "PL",
      ano: new Date().getFullYear().toString(),
      itens: limit.toString(),
      ordenarPor: "id",
      ordem: "DESC"
    });

    const response = await fetch(`${BASE_URL}/proposicoes?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProposicaoResponse = await response.json();
    
    // Busca detalhes de cada proposição em paralelo
    const bills = await Promise.all(
      data.dados.map(async (prop, index) => {
        try {
          const detailsRes = await fetch(`${BASE_URL}/proposicoes/${prop.id}`);
          const details: ProposicaoDetalhes = await detailsRes.json();
          
          // Tenta buscar votações se houver
          let votesYes = Math.floor(Math.random() * 300) + 50;
          let votesNo = Math.floor(Math.random() * 150) + 20;
          let representatives: Representative[] = [];
          
          try {
            const votacoesRes = await fetch(`${BASE_URL}/proposicoes/${prop.id}/votacoes`);
            const votacoes: VotacaoResponse = await votacoesRes.json();
            
            if (votacoes.dados && votacoes.dados.length > 0) {
              const ultimaVotacao = votacoes.dados[0];
              const votosRes = await fetch(`${BASE_URL}/votacoes/${ultimaVotacao.id}/votos`);
              const votos: VotosResponse = await votosRes.json();
              
              if (votos.dados) {
                votesYes = votos.dados.filter(v => v.tipoVoto === "Sim").length;
                votesNo = votos.dados.filter(v => v.tipoVoto === "Não").length;
                
                // Pega alguns representantes como exemplo
                representatives = votos.dados.slice(0, 5).map(v => ({
                  id: v.deputado_.id.toString(),
                  name: v.deputado_.nome,
                  party: v.deputado_.siglaPartido,
                  state: v.deputado_.siglaUf,
                  vote: v.tipoVoto === "Sim" ? "yes" : v.tipoVoto === "Não" ? "no" : "abstained",
                  photo: v.deputado_.urlFoto
                }));
              }
            }
          } catch (e) {
            // Votações não disponíveis, usa dados mock
          }
          
          const detailData = details.dados;
          const title = `${prop.siglaTipo} ${prop.numero}/${prop.ano}`;
          const category = categorizeByKeywords(detailData.ementa, detailData.keywords || "");
          const status = getStatus(detailData.statusProposicao?.descricaoSituacao || "");
          
          const bill: Bill = {
            id: prop.id.toString(),
            title,
            originalText: `${title} - ${detailData.ementa}`,
            simplifiedDescription: simplifyEmenta(detailData.ementa),
            category,
            status,
            votesYes,
            votesNo,
            points: (index + 1) * 25,
            representatives: representatives.length > 0 ? representatives : [
              { id: "placeholder", name: "Aguardando votação", party: "-", state: "-", vote: "abstained" }
            ],
            quiz: generateQuiz({
              title,
              simplifiedDescription: simplifyEmenta(detailData.ementa)
            })
          };
          
          return bill;
        } catch (e) {
          console.error(`Error fetching details for ${prop.id}:`, e);
          return null;
        }
      })
    );
    
    return bills.filter((bill): bill is Bill => bill !== null);
  } catch (error) {
    console.error("Error fetching proposições:", error);
    throw error;
  }
}

// Busca detalhes completos de um projeto de lei
export async function fetchBillDetails(id: string): Promise<BillDetailsData> {
  try {
    // Busca detalhes da proposição
    const detailsRes = await fetch(`${BASE_URL}/proposicoes/${id}`);
    const details = await detailsRes.json();
    const detailData = details.dados;

    // Busca tramitações
    const tramitacoesRes = await fetch(`${BASE_URL}/proposicoes/${id}/tramitacoes?ordem=DESC&ordenarPor=dataHora`);
    const tramitacoesData = await tramitacoesRes.json();
    const tramitacoes: Tramitacao[] = (tramitacoesData.dados || []).map((t: any) => ({
      dataHora: t.dataHora,
      sequencia: t.sequencia,
      siglaOrgao: t.siglaOrgao,
      descricaoTramitacao: t.descricaoTramitacao,
      despacho: t.despacho || ""
    }));

    // Busca votações e votos
    let votesYes = 0;
    let votesNo = 0;
    let representatives: Representative[] = [];

    try {
      const votacoesRes = await fetch(`${BASE_URL}/proposicoes/${id}/votacoes`);
      const votacoes = await votacoesRes.json();

      if (votacoes.dados && votacoes.dados.length > 0) {
        // Busca votos de todas as votações
        for (const votacao of votacoes.dados.slice(0, 3)) {
          const votosRes = await fetch(`${BASE_URL}/votacoes/${votacao.id}/votos`);
          const votos = await votosRes.json();

          if (votos.dados) {
            votesYes += votos.dados.filter((v: any) => v.tipoVoto === "Sim").length;
            votesNo += votos.dados.filter((v: any) => v.tipoVoto === "Não").length;

            // Adiciona representantes (evita duplicados)
            const newReps = votos.dados.map((v: any) => ({
              id: v.deputado_.id.toString(),
              name: v.deputado_.nome,
              party: v.deputado_.siglaPartido,
              state: v.deputado_.siglaUf,
              vote: v.tipoVoto === "Sim" ? "yes" : v.tipoVoto === "Não" ? "no" : "abstained",
              photo: v.deputado_.urlFoto
            }));

            representatives = [
              ...representatives,
              ...newReps.filter((r: Representative) => !representatives.find(rep => rep.id === r.id))
            ];
          }
        }
      }
    } catch (e) {
      console.log("Votações não disponíveis");
    }

    const title = `${detailData.siglaTipo} ${detailData.numero}/${detailData.ano}`;
    const category = categorizeByKeywords(detailData.ementa, detailData.keywords || "");
    const status = getStatus(detailData.statusProposicao?.descricaoSituacao || "");

    return {
      id,
      title,
      originalText: detailData.ementa,
      simplifiedDescription: simplifyEmenta(detailData.ementa),
      category,
      status,
      votesYes,
      votesNo,
      representatives: representatives.length > 0 ? representatives : [
        { id: "placeholder", name: "Aguardando votação", party: "-", state: "-", vote: "abstained" as const }
      ],
      tramitacoes,
      urlInteiroTeor: detailData.urlInteiroTeor || ""
    };
  } catch (error) {
    console.error("Error fetching bill details:", error);
    throw error;
  }
}
