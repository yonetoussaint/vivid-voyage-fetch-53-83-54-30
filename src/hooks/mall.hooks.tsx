import { useMemo } from "react";
import { 
  ShoppingBag, DollarSign, Tag, Truck, 
  Trophy, Sparkles, Zap, Star, Crown
} from "lucide-react";

export const useMallData = () => {
  const mallChannels = useMemo(() => [
    {
      id: 'categories',
      name: 'Categories',
      icon: <ShoppingBag className="w-6 h-6" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'wallet',
      name: 'Wallet',
      icon: <DollarSign className="w-6 h-6" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 'choice',
      name: 'CHOICE',
      icon: <Crown className="w-6 h-6" />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      id: 'free-shipping',
      name: 'Free Shipping',
      icon: <Truck className="w-6 h-6" />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      id: 'bestsellers',
      name: 'Bestsellers',
      icon: <Trophy className="w-6 h-6" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      id: 'new-arrivals',
      name: 'New Arrivals',
      icon: <Sparkles className="w-6 h-6" />,
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    }
  ], []);

  return {
    mallChannels,
  };
};