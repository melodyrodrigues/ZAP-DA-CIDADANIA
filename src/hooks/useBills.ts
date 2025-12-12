import { useQuery } from "@tanstack/react-query";
import { fetchProposicoes } from "@/lib/api/camara";
import { mockBills } from "@/data/mockBills";
import { Bill } from "@/types/bill";

export function useBills(limit: number = 9) {
  return useQuery<Bill[]>({
    queryKey: ["bills", limit],
    queryFn: () => fetchProposicoes(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    // Fallback para mock se a API falhar
    placeholderData: mockBills,
  });
}
