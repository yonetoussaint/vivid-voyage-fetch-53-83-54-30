// components/product/tabs/ReviewsGallery.tsx
import React from 'react';

interface ReviewsGalleryProps {
  product: any;
}

const ReviewsGallery: React.FC<ReviewsGalleryProps> = ({ product }) => {
  const reviewImages = [
    { id: 1, src: "/placeholder-review1.jpg", alt: "Review image 1" },
    { id: 2, src: "/placeholder-review2.jpg", alt: "Review image 2" },
    { id: 3, src: "/placeholder-review3.jpg", alt: "Review image 3" },
    { id: 4, src: "/placeholder-review4.jpg", alt: "Review image 4" },
    { id: 5, src: "/placeholder-review5.jpg", alt: "Review image 5" },
    { id: 6, src: "/placeholder-review6.jpg", alt: "Review image 6" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Reviews Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {reviewImages.map((image) => (
          <div key={image.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Review Image {image.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsGallery;