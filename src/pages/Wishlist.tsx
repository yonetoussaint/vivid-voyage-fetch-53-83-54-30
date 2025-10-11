
import React from 'react';
import BookGenreFlashDeals from '@/components/home/BookGenreFlashDeals';

export default function Wishlist() {
  return (
    <div className="w-full bg-gray-50">
      <BookGenreFlashDeals 
        title="My Wishlist"
        subtitle="Items you've saved for later"
        className="bg-gray-50"
      />
    </div>
  );
}
