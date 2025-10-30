export interface BannerType {
  id: string;
  image: string;
  alt: string;
  title?: string;
  subtitle?: string;
  type: 'image' | 'video' | 'color';
  duration?: number;
  position?: number;
  rowType?: 'product' | 'seller' | 'catalog'; // Add this
  product?: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  seller?: {
    id: string;
    name: string;
    image_url: string;
    verified: boolean;
    followers_count: number;
  };
  catalog?: {
    id: string;
    name: string;
    images: string[];
    product_count: number;
  };
}