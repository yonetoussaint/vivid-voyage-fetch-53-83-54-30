// @ts-nocheck
import React from 'react';
import SectionHeader from '@/components/home/SectionHeader'; // Adjust the import path as needed
import { Star, Play } from 'lucide-react'; // Import icons from your icon library

export default function ScrollableCards() {
  const cards = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
      title: 'Mountain Vista',
      description: 'Breathtaking views of mountains'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop',
      title: 'Ocean Waves',
      description: 'Peaceful coastal ocean scenery'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=600&h=600&fit=crop',
      title: 'Desert Dunes',
      description: 'Endless golden desert sand dunes'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=600&fit=crop',
      title: 'Forest Path',
      description: 'Lush green wilderness forest path'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop',
      title: 'Lake Reflection',
      description: 'Serene water views and reflections'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=600&fit=crop',
      title: 'City Lights',
      description: 'Urban night scenes with bright lights'
    }
  ];

  // Define the props for SectionHeader
  const title = "Featured Destinations";
  const viewAllLink = "/all-destinations";
  const viewAllText = "View All";
  const showViewMore = true;
  const viewMoreText = "Explore More";

  // Handler functions
  const handleViewAllClick = () => {
    console.log('View all clicked');
    // Navigate to view all page or show more content
  };

  const onViewMoreClick = () => {
    console.log('View more clicked');
    // Handle view more action
  };

  const handleClearClick = () => {
    console.log('Clear clicked');
    // Clear filters or reset state
  };

  return (
    <div className="w-full">
      {/* Using SectionHeader component with all required props */}
      <SectionHeader
        title={title}
        icon={Star}
        viewAllLink={viewAllLink}
        viewAllText={viewAllText}
        showCustomButton={showViewMore}
        customButtonText={viewMoreText}
        customButtonIcon={Play}
        onCustomButtonClick={onViewMoreClick}
        titleTransform="uppercase"
      />

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-2 pb-4">
          {cards.map((card) => (
            <div 
              key={card.id} 
              className="flex-shrink-0"
              style={{ width: '70vw', maxWidth: '350px' }}
            >
              <div className="bg-white rounded-xl overflow-hidden border border-gray-200 duration-300">
                <div className="w-full aspect-square relative overflow-hidden">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-base">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}