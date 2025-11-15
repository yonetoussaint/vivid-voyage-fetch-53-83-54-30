import React from 'react';
import { useNavigate } from 'react-router-dom';
import VendorProductCarousel from '@/components/home/VendorProductCarousel';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSellerByUserId } from '@/hooks/useSellerByUserId';

interface Post {
  id: string;
  vendorData: {
    sellerId: string;
    profilePic: string;
    vendorName: string;
    verified: boolean;
    followers: string;
    publishedAt: string;
    isFollowing?: boolean;
  };
  title: string;
  postDescription: string;
  displayProducts: Array<{
    id: string;
    image: string;
    discount: string | null;
    currentPrice: string;
    originalPrice: string | null;
  }>;
  likeCount: number;
  commentCount: number;
  shareCount: number;
}

interface SellerPostsProps {
  posts?: Post[];
  isLoading?: boolean;
}

const SellerPosts: React.FC<SellerPostsProps> = ({
  posts,
  isLoading
}) => {
  const { user } = useAuth();
  const { data: sellerData } = useSellerByUserId(user?.id || '');
  const navigate = useNavigate();

  const handleCreatePost = () => {
    console.log("Create post clicked - navigating to post creation page");
    // Navigate to the post creation page
    navigate('/seller-dashboard/posts/create');
  };

  return (
    <div>
      <VendorProductCarousel 
        sellerId={sellerData?.id}
        onAddProduct={handleCreatePost}
        posts={posts}
        // You can add other props as needed for the VendorProductCarousel
        showSummary={true}
        showFilters={true}
        title="Your Posts"
      />
    </div>
  );
};

export default SellerPosts;