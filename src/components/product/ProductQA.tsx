import React, { useState, useMemo, useEffect } from 'react';
import { 
  Heart,
  MessageCircle,
  Send,
  Play
} from 'lucide-react';
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';
import ProductFilterBar from '@/components/home/ProductFilterBar';
import { EngagementSection } from '@/components/shared/EngagementSection';
import { 
  formatDate, 
  formatDateForReply 
} from './DateUtils';
import VerificationBadge from '@/components/shared/VerificationBadge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded m-4">
          <h2 className="text-red-800 font-semibold">Something went wrong with the Q&A.</h2>
          <p className="text-red-600 text-sm mt-1">{this.state.error?.message}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded text-sm"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Mock Button component
const Button = ({ children, variant, className, onClick }) => (
  <button 
    className={`px-4 py-2 rounded border ${variant === 'outline' ? 'border-gray-300 bg-white hover:bg-gray-50' : 'bg-blue-600 text-white hover:bg-blue-700'} ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Skeleton Loader Component
const ProductQASkeleton = () => {
  return (
    <div className="w-full bg-white animate-pulse">
      {/* Seller Summary Header Skeleton */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Stats skeleton */}
            <div className="w-12 h-6 bg-gray-200 rounded"></div>
          </div>
          {/* Total questions skeleton */}
          <div className="w-16 h-6 bg-gray-200 rounded"></div>
        </div>

        {/* Stats distribution skeleton */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-24 h-8 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Questions List Skeleton */}
      <div className="py-4 space-y-6">
        {[...Array(3)].map((_, questionIndex) => (
          <div key={questionIndex} className="border-b border-gray-200 pb-6 px-4">
            {/* Question Header Skeleton */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {/* User avatar skeleton */}
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  {/* User name skeleton */}
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  {/* Date skeleton */}
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            {/* Question Text Skeleton */}
            <div className="space-y-2 mb-3">
              <div className="w-full h-3 bg-gray-200 rounded"></div>
              <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
            </div>

            {/* Engagement Section Skeleton */}
            <div className="flex items-center gap-6">
              {[...Array(2)].map((_, engagementIndex) => (
                <div key={engagementIndex} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-6 h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>

            {/* Answers Section Skeleton */}
            <div className="mt-4 ml-6 space-y-4">
              {[...Array(2)].map((_, answerIndex) => (
                <div key={answerIndex} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex items-start gap-2">
                    {/* Answer user avatar skeleton */}
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      {/* Answer user info skeleton */}
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-3 bg-gray-200 rounded"></div>
                        <div className="w-12 h-3 bg-gray-200 rounded"></div>
                      </div>
                      {/* Answer text skeleton */}
                      <div className="space-y-1">
                        <div className="w-full h-3 bg-gray-200 rounded"></div>
                        <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
                      </div>
                      {/* Media skeleton */}
                      <div className="flex gap-2">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                      {/* Answer engagement skeleton */}
                      <div className="flex items-center gap-4">
                        {[...Array(2)].map((_, actionIndex) => (
                          <div key={actionIndex} className="flex items-center gap-1">
                            <div className="w-4 h-3 bg-gray-200 rounded"></div>
                            <div className="w-6 h-3 bg-gray-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* View All Button Skeleton */}
      <div className="p-4">
        <div className="w-full h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

const truncateText = (text, maxLength = 120) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const ProductQA = ({ 
  productId = "123",
  user = null,
  questions = [],
  limit = null 
}) => {
  const [sortBy, setSortBy] = useState('recent');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [selectedFilters, setSelectedFilters] = useState({});
  const [localQuestions, setLocalQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: authUser } = useAuth();

  // Enhanced state for reply functionality
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [questionText, setQuestionText] = useState('');

  // Mock data for demonstration
  const mockQAs = [
    {
      id: 1,
      user_name: "John Smith",
      question: "What are the dimensions of this product?",
      answer: "The dimensions are 12\" x 8\" x 4\" (L x W x H). It's compact enough to fit on most desks while providing ample space for your needs.",
      answer_author: "Product Team",
      is_official: true,
      created_at: "2024-08-15T10:30:00Z",
      answered_at: "2024-08-15T14:30:00Z",
      helpful_count: 12,
      reply_count: 4,
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', alt: 'Product dimensions' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', alt: 'Product size comparison' }
      ],
      replies: [
        {
          id: 101,
          user_name: "Lisa Wong",
          comment: "Thanks for asking this! I was wondering the same thing.",
          created_at: "2024-08-16T09:15:00Z",
          is_seller: false,
          likeCount: 2,
          liked: false
        },
        {
          id: 102,
          user_name: "David Kim",
          comment: "Perfect size for my desk setup!",
          created_at: "2024-08-17T14:30:00Z",
          is_seller: false,
          likeCount: 1,
          liked: false
        }
      ]
    },
    {
      id: 2,
      user_name: "Sarah Johnson",
      question: "Is this product compatible with Mac computers?",
      answer: "Yes, it's fully compatible with Mac computers running macOS 10.14 or later. We also provide dedicated Mac drivers for optimal performance.",
      answer_author: "Tech Support",
      is_official: true,
      created_at: "2024-08-10T14:20:00Z",
      answered_at: "2024-08-10T16:45:00Z",
      helpful_count: 8,
      reply_count: 1,
      media: [
        { type: 'video', url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop', alt: 'Mac compatibility demo' }
      ],
      replies: [
        {
          id: 201,
          user_name: "Tech Support",
          comment: "If you need help with Mac setup, our support team is here to help!",
          created_at: "2024-08-11T10:45:00Z",
          is_seller: true,
          verified_seller: true,
          likeCount: 3,
          liked: false
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate data loading
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would fetch from Supabase
        // For now, use mock data
        setTimeout(() => {
          setLocalQuestions(mockQAs);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [productId]);

  const toggleReadMore = (questionId) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const toggleShowMoreReplies = (questionId) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedReplies(newExpanded);
  };

  const handleSubmitQuestion = () => {
    if (questionText.trim()) {
      // Here you would normally submit the question to Supabase
      alert(`Question submitted: "${questionText}"`);
      setQuestionText('');
    }
  };

  const handleLikeReply = async (questionId, replyId) => {
    // Implementation for liking replies
    console.log('Liking reply:', replyId, 'in question:', questionId);
  };

  const handleCommentClick = (questionId) => {
    const question = localQuestions.find(q => q.id === questionId);
    if (!question) return;

    setReplyingTo({
      type: 'question',
      questionId: questionId,
      userName: question.user_name || 'User',
      isSeller: false
    });
    setReplyText('');

    // Also expand replies for this question
    const newExpanded = new Set(expandedReplies);
    if (!newExpanded.has(questionId)) {
      newExpanded.add(questionId);
      setExpandedReplies(newExpanded);
    }
  };

  const handleReplyToReply = (questionId, replyId, userName, isSeller = false, verifiedSeller = false) => {
    setReplyingTo({
      type: 'reply',
      questionId: questionId,
      replyId: replyId,
      userName: userName || 'User',
      isSeller: isSeller,
      verifiedSeller: verifiedSeller
    });
    setReplyText('');
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !replyingTo) return;

    try {
      // Implementation for submitting reply to Supabase
      console.log(`Submitting reply to ${replyingTo.type}:`, replyText);
      
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to submit reply. Please try again.');
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  // Calculate Q&A statistics
  const qaStats = useMemo(() => {
    const count = localQuestions.length;
    const answeredCount = localQuestions.filter(q => q.answer).length;
    const helpfulCount = localQuestions.reduce((sum, q) => sum + (q.helpful_count || 0), 0);
    const responseRate = count > 0 ? Math.round((answeredCount / count) * 100) : 0;

    return { count, answeredCount, helpfulCount, responseRate };
  }, [localQuestions]);

  const filterCategories = React.useMemo(() => [
    {
      id: 'status',
      label: 'Status',
      options: ['All Status', 'Answered', 'Unanswered', 'Official Answers']
    },
    {
      id: 'sort',
      label: 'Sort By',
      options: ['All Sorts', 'Most Recent', 'Most Helpful', 'Most Answered']
    },
    {
      id: 'topic',
      label: 'Topic',
      options: ['All Topics', 'Product Features', 'Shipping', 'Returns', 'Technical']
    }
  ], []);

  // Initialize filters with "All" options on mount only
  React.useEffect(() => {
    const initialFilters = {};
    filterCategories.forEach((filter) => {
      initialFilters[filter.id] = filter.options[0];
    });
    setSelectedFilters(initialFilters);
  }, [filterCategories]);

  const handleFilterSelect = (filterId, option) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: option
    }));

    if (filterId === 'sort') {
      if (option.toLowerCase().startsWith('all')) {
        setSortBy('recent');
      } else {
        const sortMap = {
          'Most Recent': 'recent',
          'Most Helpful': 'helpful',
          'Most Answered': 'answered'
        };
        if (sortMap[option]) {
          setSortBy(sortMap[option]);
        }
      }
    } else if (filterId === 'status') {
      if (option.toLowerCase().startsWith('all')) {
        setFilterStatus('all');
      } else {
        const statusMap = {
          'Answered': 'answered',
          'Unanswered': 'unanswered',
          'Official Answers': 'official'
        };
        if (statusMap[option]) {
          setFilterStatus(statusMap[option]);
        }
      }
    }
  };

  const handleFilterClear = (filterId) => {
    setSelectedFilters(prev => {
      const defaultOption = filterCategories.find(cat => cat.id === filterId)?.options[0];
      if (defaultOption) {
        return {
          ...prev,
          [filterId]: defaultOption
        };
      }
      return prev;
    });

    // Also reset the corresponding state
    if (filterId === 'status') {
      setFilterStatus('all');
    } else if (filterId === 'sort') {
      setSortBy('recent');
    }
  };

  const handleClearAll = () => {
    const resetFilters = {};
    filterCategories.forEach(category => {
      resetFilters[category.id] = category.options[0];
    });
    setSelectedFilters(resetFilters);
    setSortBy('recent');
    setFilterStatus('all');
  };

  const handleFilterButtonClick = (filterId) => {
    console.log('Filter button clicked:', filterId);
  };

  // Filter and sort questions
  const finalQuestions = useMemo(() => {
    let filtered = localQuestions;

    // Apply status filter
    if (filterStatus !== 'all') {
      switch (filterStatus) {
        case 'answered':
          filtered = filtered.filter(q => q.answer);
          break;
        case 'unanswered':
          filtered = filtered.filter(q => !q.answer);
          break;
        case 'official':
          filtered = filtered.filter(q => q.answer && q.is_official);
          break;
      }
    }

    // Sort questions
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'helpful':
          return (b.helpful_count || 0) - (a.helpful_count || 0);
        case 'answered':
          if (a.answer && !b.answer) return -1;
          if (!a.answer && b.answer) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    // Apply limit if specified
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [localQuestions, sortBy, filterStatus, limit]);

  const summaryStats = [
    { value: qaStats.count, label: 'Questions', color: 'text-gray-900' },
    { value: qaStats.answeredCount, label: 'Answered', color: 'text-green-600' },
    { value: qaStats.count - qaStats.answeredCount, label: 'Pending', color: 'text-orange-600' },
    { value: `${qaStats.responseRate}%`, label: 'Response Rate', color: 'text-blue-600' }
  ];

  // Show skeleton loader while loading
  if (isLoading) {
    return <ProductQASkeleton />;
  }

  if (error) {
    return (
      <div className="w-full bg-white">
        <div className="text-center py-8">
          <p className="text-red-600">Error: {error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="w-full bg-white">
        <SellerSummaryHeader
          title="Questions & Answers"
          subtitle={`${qaStats.helpfulCount} helpful votes from the community`}
          stats={summaryStats}
          showStats={qaStats.count > 0}
        />

        <ProductFilterBar
          filterCategories={filterCategories}
          selectedFilters={selectedFilters}
          onFilterSelect={handleFilterSelect}
          onFilterClear={handleFilterClear}
          onClearAll={handleClearAll}
          onFilterButtonClick={handleFilterButtonClick}
        />

        <div className="py-4">
          {/* Questions List */}
          <div className="space-y-4">
            {finalQuestions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground" style={{color: '#666'}}>No questions yet.</p>
                <p className="text-sm text-muted-foreground mt-1" style={{color: '#666'}}>Be the first to ask a question!</p>
              </div>
            ) : (
              finalQuestions.map((question) => (
                <div key={question.id} className="border-b pb-4" style={{borderBottom: '1px solid #e5e5e5'}}>
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-2 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-semibold" style={{backgroundColor: 'rgba(0,0,0,0.1)'}}>
                        {question.user_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{question.user_name || 'Anonymous'}</span>
                        </div>
                        <div className="text-sm text-muted-foreground" style={{color: '#666'}}>
                          {formatDate(question.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="font-medium text-sm mb-3 px-2">
                    {question.question}
                  </div>

                  {/* Engagement Section */}
                  <EngagementSection
                    likeCount={question.helpful_count || 0}
                    commentCount={question.reply_count || 0}
                    shareCount={0}
                    onComment={() => handleCommentClick(question.id)}
                    onShare={() => {}}
                    customLabels={{
                      like: 'Helpful',
                      comment: 'Reply'
                    }}
                  />

                  {/* Answers and Replies Section */}
                  {(question.answer || (question.replies && question.replies.length > 0)) && (
                    <div className="mt-4 ml-6 space-y-3 px-2">
                      {/* Official Answer */}
                      {question.answer && (
                        <div className="border-l-2 border-blue-200 pl-4">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                              {question.answer_author?.charAt(0) || 'A'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{question.answer_author || 'Team'}</span>
                                {question.is_official && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Official
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground" style={{color: '#666'}}>
                                {formatDate(question.answered_at)}
                              </div>
                              <div className="text-sm text-foreground mt-1">
                                {expandedQuestions.has(question.id) ? question.answer : truncateText(question.answer)}
                                {question.answer.length > 120 && (
                                  <button
                                    onClick={() => toggleReadMore(question.id)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-1"
                                  >
                                    {expandedQuestions.has(question.id) ? 'Read less' : 'Read more'}
                                  </button>
                                )}
                              </div>

                              {/* Media Section for Official Answer */}
                              {question.media && question.media.length > 0 && (
                                <div className="mt-3">
                                  <div className="flex gap-2 overflow-x-auto pb-2">
                                    {question.media.map((item, index) => (
                                      <div key={index} className="flex-shrink-0 relative">
                                        {item.type === 'image' ? (
                                          <img
                                            src={item.url}
                                            alt={item.alt}
                                            className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => window.open(item.url, '_blank')}
                                          />
                                        ) : item.type === 'video' ? (
                                          <div
                                            className="w-24 h-24 relative cursor-pointer hover:opacity-90 transition-opacity rounded-lg overflow-hidden"
                                            onClick={() => window.open(item.url, '_blank')}
                                          >
                                            <img
                                              src={item.thumbnail}
                                              alt={item.alt}
                                              className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                              <Play className="w-6 h-6 text-white fill-white" />
                                            </div>
                                          </div>
                                        ) : null}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Regular Replies */}
                      {question.replies && question.replies.length > 0 && (
                        <>
                          {(expandedReplies.has(question.id) ? question.replies : question.replies.slice(0, 2)).map((reply) => (
                            <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
                              <div className="flex items-start gap-2">
                                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-semibold" style={{backgroundColor: reply.is_seller ? '#3b82f6' : 'rgba(0,0,0,0.1)', color: reply.is_seller ? 'white' : 'black'}}>
                                  {reply.user_name?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{reply.user_name || 'Anonymous'}</span>
                                    {reply.is_seller && (
                                      <div className="flex items-center gap-1">
                                        {reply.verified_seller && <VerificationBadge size="sm" />}
                                        <span className="text-xs text-gray-500">•</span>
                                        <span className="font-bold text-sm text-orange-500">Seller</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="text-sm text-foreground mt-1">
                                    {reply.comment}
                                  </div>

                                  {/* TikTok-style Like and Reply Buttons */}
                                  <div className="flex items-center gap-4 mt-2">
                                    <button
                                      onClick={() => handleLikeReply(question.id, reply.id)}
                                      className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 text-sm font-medium transition-colors"
                                      style={{ 
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        cursor: 'pointer',
                                        font: 'inherit',
                                        lineHeight: '1'
                                      }}
                                    >
                                      <Heart 
                                        className={`w-4 h-4 flex-shrink-0 ${reply.liked ? 'fill-red-600 text-red-600' : ''}`}
                                      />
                                      <span style={{ lineHeight: '1' }}>{reply.likeCount || 0}</span>
                                    </button>

                                    <button
                                      onClick={() => handleReplyToReply(
                                        question.id, 
                                        reply.id, 
                                        reply.user_name, 
                                        reply.is_seller, 
                                        reply.verified_seller
                                      )}
                                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                      style={{ 
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        cursor: 'pointer',
                                        font: 'inherit',
                                        lineHeight: '1'
                                      }}
                                    >
                                      Reply
                                    </button>

                                    <span 
                                      className="text-sm text-muted-foreground font-medium"
                                      style={{ 
                                        color: '#666',
                                        lineHeight: '1'
                                      }}
                                    >
                                      {formatDateForReply(reply.created_at)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          {question.replies.length > 2 && (
                            <button
                              onClick={() => toggleShowMoreReplies(question.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-4 transition-colors"
                            >
                              {expandedReplies.has(question.id) 
                                ? 'Show fewer replies' 
                                : `Show ${question.replies.length - 2} more replies`
                              }
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {limit && localQuestions.length > limit && (
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => window.location.href = `/product/${productId}/questions`}
          >
            View All {localQuestions.length} Questions
          </Button>
        )}

        {/* Sticky Question Input Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold">
              ?
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Ask a question about this product..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitQuestion()}
              />
              <button
                onClick={handleSubmitQuestion}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Conditional Reply Bar */}
        {replyingTo && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 shadow-lg z-40">
            <div className="max-w-4xl mx-auto">
              {/* User info header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Replying to</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-semibold" style={{backgroundColor: 'rgba(0,0,0,0.1)'}}>
                      {replyingTo.userName?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-medium">{replyingTo.userName || 'User'}</span>
                    {replyingTo.isSeller && (
                      <div className="flex items-center gap-1">
                        {replyingTo.verifiedSeller && <VerificationBadge size="sm" />}
                        <span className="text-xs text-gray-500">•</span>
                        <span className="font-bold text-sm text-orange-500">Seller</span>
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={handleCancelReply}
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                >
                  ×
                </button>
              </div>

              {/* Reply input */}
              <div className="relative">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitReply()}
                />
                <button 
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim()}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ProductQA;