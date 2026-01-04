import { Review } from './ReviewItem';

export const mockReviews: Review[] = [
  {
    id: '1',
    user_name: 'John Doe',
    rating: 5,
    comment: 'Excellent product! The quality is outstanding and it exceeded my expectations. I would definitely recommend this to anyone looking for a reliable solution. The customer service was also very helpful when I had questions about the features.',
    created_at: '2024-01-15T10:30:00Z',
    verified_purchase: true,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        alt: 'Product in use'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
        alt: 'Product close-up'
      }
    ],
    likeCount: 24,
    commentCount: 5
  },
  {
    id: '2',
    user_name: 'Sarah Johnson',
    rating: 4,
    comment: 'Good product overall. The build quality is solid and it works as advertised. The only drawback is the battery life, which could be better. Aside from that, I\'m satisfied with my purchase.',
    created_at: '2024-01-10T14:20:00Z',
    verified_purchase: true,
    media: [
      {
        type: 'video',
        url: 'https://example.com/video-review.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
        alt: 'Video review'
      }
    ],
    likeCount: 12,
    commentCount: 3
  },
  {
    id: '3',
    user_name: 'Michael Chen',
    rating: 3,
    comment: 'It\'s okay for the price. Does what it needs to do but nothing special. The instructions could be clearer for setup.',
    created_at: '2024-01-05T09:15:00Z',
    verified_purchase: false,
    likeCount: 5,
    commentCount: 1
  },
  {
    id: '4',
    user_name: 'Emma Wilson',
    rating: 5,
    comment: 'Absolutely love this! The design is beautiful and it\'s very easy to use. I\'ve been using it daily for a month now and it still works perfectly. The color options are also fantastic.',
    created_at: '2024-01-02T16:45:00Z',
    verified_purchase: true,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
        alt: 'Product setup'
      }
    ],
    likeCount: 42,
    commentCount: 8
  },
  {
    id: '5',
    user_name: 'Robert Davis',
    rating: 2,
    comment: 'Not what I expected. The product arrived with scratches and one feature doesn\'t work properly. Customer service was slow to respond. I would suggest looking at other options before buying this.',
    created_at: '2023-12-28T11:10:00Z',
    verified_purchase: true,
    likeCount: 8,
    commentCount: 12
  },
  {
    id: '6',
    user_name: 'Lisa Thompson',
    rating: 4,
    comment: 'Very good value for money. The product is durable and performs well. The only reason I\'m not giving 5 stars is because the shipping took longer than expected.',
    created_at: '2023-12-20T13:25:00Z',
    verified_purchase: true,
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e',
        alt: 'Product in natural light'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1559056199-5a0e5b21f5bc',
        alt: 'Packaging'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1559056199-5a0e5b21f5bd',
        alt: 'Accessories'
      }
    ],
    likeCount: 18,
    commentCount: 4
  }
];

// Mock comments data for each review
export interface Comment {
  id: string;
  reviewId: string;
  user_name: string;
  comment: string;
  created_at: string;
}

export const mockComments: Comment[] = [
  {
    id: 'c1',
    reviewId: '1',
    user_name: 'Support Team',
    comment: 'Thank you for your wonderful feedback! We\'re glad you\'re enjoying our product.',
    created_at: '2024-01-15T14:20:00Z'
  },
  {
    id: 'c2',
    reviewId: '1',
    user_name: 'Alex Morgan',
    comment: 'I had the same experience! This product is amazing.',
    created_at: '2024-01-16T09:15:00Z'
  },
  {
    id: 'c3',
    reviewId: '2',
    user_name: 'Tech Enthusiast',
    comment: 'Have you tried using the power saving mode? It might help with battery life.',
    created_at: '2024-01-11T10:30:00Z'
  },
  {
    id: 'c4',
    reviewId: '5',
    user_name: 'Customer Service',
    comment: 'We apologize for your experience. Please contact us at support@example.com so we can resolve this issue for you.',
    created_at: '2023-12-29T10:00:00Z'
  }
];