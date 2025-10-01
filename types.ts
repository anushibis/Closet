
export enum Category {
  Tops = 'tops',
  Bottoms = 'bottoms',
  Extra = 'extra',
  Outfits = 'outfits',
}

export interface ClothingItem {
  id: string;
  name: string;
  imageUrl: string;
  category: Category.Tops | Category.Bottoms | Category.Extra;
}

export interface Outfit {
  id: string;
  name:string;
  imageUrl: string;
  topId: string | null;
  bottomId: string | null;
  extraId: string | null;
  description: string; // For the AI
}
