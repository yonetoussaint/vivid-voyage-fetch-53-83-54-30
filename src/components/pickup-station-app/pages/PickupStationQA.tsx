import React from 'react';
import ProductQA from '@/components/product/ProductQA';

const PickupStationQA = () => {
  const mockStationQAs = [
    {
      id: 1,
      user_name: "Jean Baptiste",
      question: "What are your operating hours?",
      answer: "We're open Monday to Saturday from 8 AM to 8 PM, and Sunday from 10 AM to 6 PM.",
      answer_author: "Station Manager",
      is_official: true,
      created_at: "2024-08-15T10:30:00Z",
      answered_at: "2024-08-15T14:30:00Z",
      helpful_count: 24,
      reply_count: 2,
      media: [],
      replies: [
        {
          id: 101,
          user_name: "Marie Claire",
          comment: "Perfect hours for my schedule!",
          created_at: "2024-08-16T09:15:00Z",
          is_seller: false
        },
        {
          id: 102,
          user_name: "Station Manager",
          comment: "We're here to serve you at convenient times!",
          created_at: "2024-08-17T14:30:00Z",
          is_seller: true
        }
      ]
    },
    {
      id: 2,
      user_name: "Pierre Louis",
      question: "How long can I leave my package at the station?",
      answer: "Packages can be stored for up to 7 days free of charge. After that, a small storage fee applies.",
      answer_author: "Customer Service",
      is_official: true,
      created_at: "2024-08-10T14:20:00Z",
      answered_at: "2024-08-10T16:45:00Z",
      helpful_count: 18,
      reply_count: 0,
      media: [],
      replies: []
    }
  ];

  return (
    <div className="w-full bg-white pb-20">
      <ProductQA 
        productId="pickup-station-1"
        questions={mockStationQAs}
      />
    </div>
  );
};

export default PickupStationQA;
