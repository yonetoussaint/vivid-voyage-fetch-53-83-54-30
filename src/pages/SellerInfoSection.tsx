import React from 'react';
import { Star, Calendar, Users, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatNumber, formatDate } from '@/lib/utils';

interface SellerInfoSectionProps {
  seller: any;
  products: any[];
}

const SellerInfoSection: React.FC<SellerInfoSectionProps> = ({ seller, products }) => {
  return (
    <section className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        {/* Header Stack */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-foreground">{seller.name}</h1>
              {seller.verified && (
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs px-1.5 py-0">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {seller.description}
            </p>
          </div>
        </div>

        {/* Key Metrics Grid - Moved Up */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-foreground">{seller.rating?.toFixed(1) || '4.8'}</span>
            </div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="font-bold text-foreground mb-1">{formatNumber(seller.total_sales)}</div>
            <div className="text-xs text-muted-foreground">Sales</div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="font-bold text-foreground mb-1">{seller.trust_score}/100</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Trust
            </div>
          </div>
        </div>

        {/* Metadata & Category */}
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Joined {formatDate(seller.created_at || new Date().toISOString()).split(' ')[1]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{formatNumber(seller.followers_count || 0)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {seller.category && (
              <Badge variant="outline" className="text-sm py-1">{seller.category}</Badge>
            )}
            <div className="text-sm text-muted-foreground">
              {products.length} products
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerInfoSection;