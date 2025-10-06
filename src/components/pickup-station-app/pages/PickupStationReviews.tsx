import React from 'react';
import CustomerReviews from '@/components/product/CustomerReviewsEnhanced';

const PickupStationReviews = () => {
  const mockStationReviews = [
    {
      id: 1,
      user_name: "Claudette Joseph",
      rating: 5,
      title: "Excellent service!",
      comment: "Very fast and professional. The staff is always friendly and helpful. I never wait more than 5 minutes to pick up my packages.",
      created_at: "2024-08-15T10:30:00Z",
      verified_purchase: true,
      helpful_count: 15,
      reply_count: 1,
      media: [],
      replies: [
        {
          id: 101,
          user_name: "Station Manager",
          comment: "Thank you for your wonderful feedback! We're committed to providing fast, friendly service.",
          created_at: "2024-08-16T09:15:00Z",
          is_seller: true
        }
      ]
    },
    {
      id: 2,
      user_name: "Jacques Desir",
      rating: 5,
      title: "Very convenient location",
      comment: "Right in the heart of the city. Easy to access and plenty of parking nearby.",
      created_at: "2024-08-10T14:20:00Z",
      verified_purchase: true,
      helpful_count: 12,
      reply_count: 0,
      media: [],
      replies: []
    }
  ];

  return (
    <div className="w-full bg-white pb-20">
      <CustomerReviews 
        productId="pickup-station-1"
        reviews={mockStationReviews}
      />
    </div>
  );
};

export default PickupStationReviews;
