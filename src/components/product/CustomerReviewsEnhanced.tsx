import React, { useState, useMemo } from 'react';
import { Heart, MessageCircle, Send, ChevronDown } from 'lucide-react';
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';
import ProductFilterBar from '@/components/home/ProductFilterBar';
import SearchInfoComponent from './SearchInfoComponent';

// Mock data and utility functions
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
        is_seller: false
      },
      {
        id: 102,
        user_name: "David Kim",
        comment: "Perfect size for my desk setup!",
        created_at: "2024-08-17T14:30:00Z",
        is_seller: false
      },
      {
        id: 103,
        user_name: "Rachel Green",
        comment: "Exactly what I needed to know before purchasing.",
        created_at: "2024-08-18T11:20:00Z",
        is_seller: false
      },
      {
        id: 104,
        user_name: "Mike Johnson",
        comment: "Great question! This helped me decide.",
        created_at: "2024-08-19T16:45:00Z",
        is_seller: false
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
        is_seller: true
      }
    ]
  },
  {
    id: 3,
    user_name: "Mike Chen",
    question: "How long is the warranty period?",
    answer: "We offer a 2-year limited warranty covering manufacturing defects. Extended warranty options are available at checkout.",
    answer_author: "Customer Service",
    is_official: true,
    created_at: "2024-08-05T09:15:00Z",
    answered_at: "2024-08-05T11:30:00Z",
    helpful_count: 15,
    reply_count: 0,
    media: [],
    replies: []
  },
  {
    id: 4,
    user_name: "Emma Davis",
    question: "What's included in the box?",
    answer: "The box includes: the main unit, power adapter, USB cable, quick start guide, and a premium carrying case.",
    answer_author: "Product Team",
    is_official: true,
    created_at: "2024-08-01T16:45:00Z",
    answered_at: "2024-08-01T17:20:00Z",
    helpful_count: 22,
    reply_count: 1,
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop', alt: 'Box contents' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop', alt: 'Unboxing view' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop', alt: 'All accessories' }
    ],
    replies: [
      {
        id: 401,
        user_name: "Product Team",
        comment: "Everything you need to get started is included!",
        created_at: "2024-08-02T08:20:00Z",
        is_seller: true
      }
    ]
  },
  {
    id: 5,
    user_name: "Tom Wilson",
    question: "Does it work with wireless charging?",
    answer: "This model doesn't support wireless charging, but our Pro version does. You can upgrade during checkout for an additional $29.",
    answer_author: "Product Expert",
    is_official: true,
    created_at: "2024-07-28T11:30:00Z",
    answered_at: "2024-07-28T15:45:00Z",
    helpful_count: 5,
    reply_count: 1,
    media: [],
    replies: [
      {
        id: 501,
        user_name: "Product Expert",
        comment: "Feel free to reach out if you have questions about the Pro version features!",
        created_at: "2024-07-29T13:15:00Z",
        is_seller: true
      }
    ]
  }
];

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const ProductQA = ({
  productId = "123",
  questions = mockQAs,
  limit = null
}) => {
  const [sortBy, setSortBy] = useState('recent');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [questionText, setQuestionText] = useState('');

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
      alert(`Question submitted: "${questionText}"`);
      setQuestionText('');
    }
  };

  // Calculate Q&A statistics
  const qaStats = useMemo(() => {
    const count = questions.length;
    const answeredCount = questions.filter(q => q.answer).length;
    const helpfulCount = questions.reduce((sum, q) => sum + q.helpful_count, 0);

    return { count, answeredCount, helpfulCount };
  }, [questions]);

  // Filter and sort questions
  const finalQuestions = useMemo(() => {
    let filtered = [...questions];

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
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'helpful':
          return b.helpful_count - a.helpful_count;
        case 'answered':
          if (a.answer && !b.answer) return -1;
          if (!a.answer && b.answer) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'unanswered':
          if (!a.answer && b.answer) return -1;
          if (a.answer && !b.answer) return 1;
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
  }, [questions, sortBy, filterStatus, limit]);

  const summaryStats = [
    { value: qaStats.count, label: 'Questions', color: 'text-gray-900' },
    { value: qaStats.answeredCount, label: 'Answered', color: 'text-green-600' },
    { value: qaStats.count - qaStats.answeredCount, label: 'Pending', color: 'text-orange-600' },
    { value: `${Math.round(qaStats.count > 0 ? (qaStats.answeredCount / qaStats.count) * 100 : 0)}%`, label: 'Response Rate', color: 'text-blue-600' }
  ];

  const filterCategories = [
    {
      id: 'status',
      label: 'Status',
      options: ['All Status', 'Answered', 'Unanswered', 'Official Answers']
    },
    {
      id: 'sort',
      label: 'Sort By',
      options: ['Most Recent', 'Most Helpful', 'Most Answered', 'Unanswered First']
    }
  ];

  const [selectedFilters, setSelectedFilters] = useState({
    status: 'All Status',
    sort: 'Most Recent'
  });

  const handleFilterSelect = (filterId, option) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: option
    }));

    if (filterId === 'sort') {
      const sortMap = {
        'Most Recent': 'recent',
        'Most Helpful': 'helpful',
        'Most Answered': 'answered',
        'Unanswered First': 'unanswered',
      };
      setSortBy(sortMap[option] || 'recent');
    } else if (filterId === 'status') {
      const statusMap = {
        'All Status': 'all',
        'Answered': 'answered',
        'Unanswered': 'unanswered',
        'Official Answers': 'official',
      };
      setFilterStatus(statusMap[option] || 'all');
    }
  };

  const handleFilterClear = (filterId) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({
      status: 'All Status',
      sort: 'Most Recent'
    });
    setSortBy('recent');
    setFilterStatus('all');
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white">
      <SellerSummaryHeader
        title="Questions & Answers"
        subtitle={`${qaStats.helpfulCount} helpful votes from the community`}
        stats={summaryStats}
        showStats={qaStats.count > 0}
      />

      <div className="mb-6">
        <ProductFilterBar
          filterCategories={filterCategories}
          selectedFilters={selectedFilters}
          onFilterSelect={handleFilterSelect}
          onFilterClear={handleFilterClear}
          onClearAll={handleClearAll}
        />
      </div>

      <div className="space-y-6">
        {finalQuestions.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">No questions yet</p>
            <p className="text-gray-500 mt-1">Be the first to ask a question!</p>
          </div>
        ) : (
          finalQuestions.map((qa, index) => (
            <div key={qa.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              {/* Question Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                  {qa.user_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{qa.user_name}</span>
                    <span className="text-gray-500 text-sm">•</span>
                    <span className="text-gray-500 text-sm">{formatDate(qa.created_at)}</span>
                  </div>
                  <h3 className="text-gray-900 font-medium text-base leading-relaxed">
                    {qa.question}
                  </h3>
                </div>
              </div>

              {/* Question Actions */}
              <div className="flex items-center gap-4 mb-4">
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">{qa.helpful_count} helpful</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{qa.reply_count} replies</span>
                </button>
              </div>

              {/* Replies Section */}
              {(qa.answer || (qa.replies && qa.replies.length > 0)) && (
                <div className="ml-13 space-y-4">
                  {/* Official Answer */}
                  {qa.answer && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
                          {qa.answer_author.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-blue-900 text-sm">{qa.answer_author}</span>
                            {qa.is_official && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                Official
                              </span>
                            )}
                            <span className="text-gray-500 text-sm">•</span>
                            <span className="text-gray-500 text-sm">{formatDate(qa.answered_at)}</span>
                          </div>
                          <div className="text-gray-700 text-sm leading-relaxed">
                            {qa.answer}
                          </div>

                          {/* Media Section */}
                          {qa.media && qa.media.length > 0 && (
                            <div className="mt-3">
                              <div className="flex gap-2 overflow-x-auto">
                                {qa.media.map((item, index) => (
                                  <div key={index} className="flex-shrink-0">
                                    {item.type === 'image' ? (
                                      <img
                                        src={item.url}
                                        alt={item.alt}
                                        className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                      />
                                    ) : (
                                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-600 text-xs">Video</span>
                                      </div>
                                    )}
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
                  {qa.replies && qa.replies.length > 0 && (
                    <div className="space-y-3">
                      {(expandedReplies.has(qa.id) ? qa.replies : qa.replies.slice(0, 2)).map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3">
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                              reply.is_seller 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-300 text-gray-700'
                            }`}
                          >
                            {reply.user_name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900 text-sm">{reply.user_name}</span>
                              {reply.is_seller && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                  Seller
                                </span>
                              )}
                              <span className="text-gray-500 text-sm">•</span>
                              <span className="text-gray-500 text-sm">{formatDate(reply.created_at)}</span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {reply.comment}
                            </p>
                          </div>
                        </div>
                      ))}

                      {qa.replies.length > 2 && (
                        <button
                          onClick={() => toggleShowMoreReplies(qa.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors ml-11"
                        >
                          {expandedReplies.has(qa.id)
                            ? 'Show fewer replies'
                            : `Show ${qa.replies.length - 2} more replies`
                          }
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Insert SearchInfoComponent after the second question */}
              {index === 1 && (
                <div className="mt-6">
                  <SearchInfoComponent productId={productId} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {limit && questions.length > limit && (
        <div className="text-center mt-8">
          <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium">
            View All {questions.length} Questions
          </button>
        </div>
      )}

      {/* Sticky Question Input */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4 mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
              ?
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Ask a question about this product..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitQuestion()}
              />
              <button
                onClick={handleSubmitQuestion}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQA;