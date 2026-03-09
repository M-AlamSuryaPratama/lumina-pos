import { Category } from "@/types/pos";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "category-pill",
          selectedCategory === null && "category-pill-active"
        )}
      >
        Semua
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            "category-pill",
            selectedCategory === category.id && "category-pill-active"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
