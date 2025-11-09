import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import MobileOptimizedReels from '@/components/home/MobileOptimizedReels';
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';
import ProductFilterBar from '@/components/home/ProductFilterBar';

const SellerReels = () => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  // Define filter categories matching BookGenreFlashDeals structure
  const filterCategories = [
    {
      id: 'status',
      label: 'Status',
      options: ['All', 'Published', 'Draft', 'Scheduled']
    },
    {
      id: 'performance',
      label: 'Performance',
      options: ['All', 'High', 'Medium', 'Low']
    },
    {
      id: 'duration',
      label: 'Duration',
      options: ['All', 'Under 15s', '15-30s', '30-60s', 'Over 60s']
    },
    {
      id: 'date',
      label: 'Date',
      options: ['All', 'Today', 'This Week', 'This Month', 'Last 30 Days']
    }
  ];

  // Filter handler functions matching BookGenreFlashDeals
  const handleFilterSelect = (filterId: string, option: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: option
    }));
  };

  const handleFilterClear = (filterId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };

  const handleFilterButtonClick = (filterId: string) => {
    console.log('Filter button clicked:', filterId);
  };

  const stats = [
    {
      value: '12.5K',
      label: 'Total Views',
      color: 'text-blue-600'
    },
    {
      value: '2.6K',
      label: 'Engagements',
      color: 'text-green-600'
    },
    {
      value: '156',
      label: 'Comments',
      color: 'text-purple-600'
    },
    {
      value: '432',
      label: 'Shares',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="w-full bg-white">
      <SellerSummaryHeader
        title="Reels"
        subtitle="Create and manage video content"
        stats={stats}
        actionButton={{
          label: 'Create Reel',
          icon: Plus,
          onClick: () => console.log('Create reel clicked')
        }}
        showStats={true}
      />

      <div className="-mx-2">
        <ProductFilterBar
          filterCategories={filterCategories}
          selectedFilters={selectedFilters}
          onFilterSelect={handleFilterSelect}
          onFilterClear={handleFilterClear}
          onClearAll={handleClearAll}
          onFilterButtonClick={handleFilterButtonClick}
        />
      </div>

        <MobileOptimizedReels
          videoCount={12}
          layoutMode="grid"
          showSectionHeader={false}
        />
      
    </div>
  );
};

export default SellerReels;