import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";

interface BillFiltersProps {
  selectedCategory: string;
  selectedStatus: string;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  onClearFilters: () => void;
  categories: string[];
  statuses: string[];
}

const categoryLabels: Record<string, string> = {
  "saúde": "Saúde",
  "educação": "Educação",
  "economia": "Economia",
  "meio ambiente": "Meio Ambiente",
  "segurança": "Segurança",
  "trabalho": "Trabalho",
  "transparência": "Transparência",
  "geral": "Geral",
};

const statusLabels: Record<string, string> = {
  "em votação": "Em Votação",
  "aprovado": "Aprovado",
  "rejeitado": "Rejeitado",
};

const categoryColors: Record<string, string> = {
  "saúde": "bg-red-500/10 text-red-600 hover:bg-red-500/20",
  "educação": "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
  "economia": "bg-green-500/10 text-green-600 hover:bg-green-500/20",
  "meio ambiente": "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20",
  "segurança": "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20",
  "trabalho": "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
  "transparência": "bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20",
  "geral": "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20",
};

export function BillFilters({
  selectedCategory,
  selectedStatus,
  onCategoryChange,
  onStatusChange,
  onClearFilters,
  categories,
  statuses,
}: BillFiltersProps) {
  const hasFilters = selectedCategory !== "all" || selectedStatus !== "all";

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filtrar:</span>
        </div>

        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[160px] bg-background">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="all">Todas Categorias</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {categoryLabels[cat] || cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[160px] bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="all">Todos Status</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {statusLabels[status] || status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Active Filters as Badges */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory !== "all" && (
            <Badge
              variant="secondary"
              className={`${categoryColors[selectedCategory] || "bg-muted"} cursor-pointer`}
              onClick={() => onCategoryChange("all")}
            >
              {categoryLabels[selectedCategory] || selectedCategory}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {selectedStatus !== "all" && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
              onClick={() => onStatusChange("all")}
            >
              {statusLabels[selectedStatus] || selectedStatus}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
