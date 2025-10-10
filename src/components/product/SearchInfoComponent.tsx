import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useProduct } from '@/hooks/useProduct';
import SectionHeader from '@/components/home/SectionHeader';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface SearchInfoComponentProps {
  productId: string;
}

export default function SearchInfoComponent({ productId }: SearchInfoComponentProps) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const responseRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { data: product, isLoading: isProductLoading } = useProduct(productId);

  // Response cache to avoid duplicate API calls
  const [responseCache] = useState<Map<string, string>>(new Map());

  // Auto-scroll to latest response
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, streamingResponse]);

  // AI-generated suggestions based on product context
  const [suggestions, setSuggestions] = useState<string[]>([
    'Tell me about this product',
    'What are the key features?',
    'Is it worth the price?',
    'What do customers say about it?'
  ]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  // Generate AI suggestions when product loads
  useEffect(() => {
    const generateSuggestions = async () => {
      if (!product || isGeneratingSuggestions) return;

      setIsGeneratingSuggestions(true);

      try {
        const productContext = `Product Information:
- Name: ${product.name}
- Category: ${product.category || 'Not specified'}
- Price: $${product.price}
- Description: ${product.description || 'No description available'}
${product.specifications ? `- Specifications: ${JSON.stringify(product.specifications)}` : ''}

Based on this product, generate 6 specific, relevant questions that a customer might want to ask. Make them natural and conversational. Return ONLY a JSON array of strings, no other text.`;

        const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

        if (!apiKey) {
          console.error('OpenRouter API key is missing');
          throw new Error('API key not configured');
        }

        const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Product Search Assistant'
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-chat-v3.1:free",
            messages: [{
              role: "user",
              content: productContext
            }],
            stream: false
          })
        });

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          let errorData = {};
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData = { raw: errorText };
          }
          console.error('Suggestions API Error Details:', {
            status: apiResponse.status,
            statusText: apiResponse.statusText,
            headers: Object.fromEntries(apiResponse.headers.entries()),
            error: errorData
          });
          throw new Error(`API request failed: ${apiResponse.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await apiResponse.json();
        const responseText = data.choices[0]?.message?.content || '';

        // Extract JSON array from response
        const jsonMatch = responseText.match(/\[.*\]/s);
        if (jsonMatch) {
          const generatedSuggestions = JSON.parse(jsonMatch[0]);
          if (Array.isArray(generatedSuggestions) && generatedSuggestions.length > 0) {
            setSuggestions(generatedSuggestions.slice(0, 6));
          }
        }
      } catch (error) {
        console.error('Error generating suggestions:', error);
        // Keep default suggestions on error
      } finally {
        setIsGeneratingSuggestions(false);
      }
    };

    generateSuggestions();
  }, [product?.id]); // Only regenerate when product changes

  // Build conversation context for AI
  const buildContext = (questionText: string): string => {
    let context = '';

    // Add product information
    if (product) {
      context = `Product Information:
- Name: ${product.name}
- Price: $${product.price}${product.discount_price ? ` (was $${product.discount_price})` : ''}
- Description: ${product.description || 'No description available'}
- Category: ${product.category || 'No category specified'}
- Rating: ${product.rating || 'No rating'}/5
- Stock: ${product.inventory || 'Stock info not available'}
${product.specifications ? `- Specifications: ${JSON.stringify(product.specifications)}` : ''}

`;
    }

    // Add conversation history for context (last 3 exchanges)
    if (messages.length > 0) {
      context += 'Previous conversation:\n';
      const recentMessages = messages.slice(-6); // Last 3 Q&A pairs
      recentMessages.forEach(msg => {
        context += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      context += '\n';
    }

    context += `Current question: ${questionText}\n\n`;
    context += 'Please answer specifically about this product. Keep responses concise (2-3 sentences). If information is not available, say so clearly.';

    return context;
  };

  // Handle API call with streaming support
  const handleSubmit = async (questionText: string) => {
    if (!questionText.trim() || isLoading) return;

    const trimmedQuery = questionText.trim();

    // Check cache first
    if (responseCache.has(trimmedQuery)) {
      const cachedResponse = responseCache.get(trimmedQuery)!;
      setMessages(prev => [
        ...prev,
        { role: 'user', content: trimmedQuery, timestamp: Date.now() },
        { role: 'assistant', content: cachedResponse, timestamp: Date.now() }
      ]);
      setQuery('');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStreamingResponse('');

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: trimmedQuery, timestamp: Date.now() }]);
    setQuery('');

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      const context = buildContext(trimmedQuery);

      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

      if (!apiKey) {
        console.error('OpenRouter API key is missing');
        throw new Error('API key not configured');
      }

      const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Product Search Assistant'
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3.1:free",
          messages: [{ role: "user", content: context }],
          stream: false // Set to true if you want streaming
        }),
        signal: abortControllerRef.current.signal
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { raw: errorText };
        }
        console.error('API Error Details:', {
          status: apiResponse.status,
          statusText: apiResponse.statusText,
          headers: Object.fromEntries(apiResponse.headers.entries()),
          error: errorData
        });
        throw new Error(`API request failed: ${apiResponse.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await apiResponse.json();
      const answer = data.choices[0]?.message?.content || 'No response received';

      // Cache the response
      responseCache.set(trimmedQuery, answer);

      // Add assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: answer, timestamp: Date.now() }]);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled');
        return;
      }

      console.error('Error calling API:', error);
      const errorMessage = 'Sorry, there was an error getting an answer. Please try again.';
      setError(errorMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage, timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
      setStreamingResponse('');
      abortControllerRef.current = null;
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSubmit(suggestion);
  };

  const clearConversation = () => {
    setMessages([]);
    setError(null);
    setQuery('');
  };

  const SearchInfoIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full"></div>
    </div>
  );

  const charCount = query.length;
  const maxChars = 200;
  const isNearLimit = charCount > maxChars * 0.8;

  return (
    <div className="w-full bg-white">
      <SectionHeader
        title="Looking for Specific Info?"
        icon={SearchInfoIcon}
        titleTransform="uppercase"
      />

      <div className="w-full bg-white space-y-2">
        {/* Search Input */}
        <div className="px-2">
          <form onSubmit={handleInputSubmit} className="relative">
            <input
              type="text"
              placeholder={isProductLoading ? "Loading product info..." : "Ask anything about this product..."}
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, maxChars))}
              className="w-full px-3 py-2.5 pr-12 text-gray-600 bg-white border-2 border-blue-400 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              disabled={isLoading || isProductLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim() || isProductLoading}
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 rounded-full p-1.5 transition-colors"
              aria-label="Submit question"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
          </form>
          {isNearLimit && (
            <div className={`text-xs mt-1 ${charCount >= maxChars ? 'text-red-500' : 'text-gray-500'}`}>
              {charCount}/{maxChars} characters
            </div>
          )}
        </div>

        {/* Conversation History */}
        {messages.length > 0 && (
          <div className="px-2 space-y-2 max-h-96 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                ref={idx === messages.length - 1 ? responseRef : null}
                className={`p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-50 border border-blue-100 ml-8'
                    : 'bg-gray-50 border border-gray-200 mr-8'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'
                  }`}>
                    {msg.role === 'user' ? 'Q' : 'A'}
                  </div>
                  <div className="text-sm text-gray-800 whitespace-pre-wrap flex-1">{msg.content}</div>
                </div>
              </div>
            ))}

            {/* Streaming response indicator */}
            {streamingResponse && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mr-8">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-gray-400 text-white">
                    A
                  </div>
                  <div className="text-sm text-gray-800 whitespace-pre-wrap flex-1">
                    {streamingResponse}
                    <span className="inline-block w-1 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                  </div>
                </div>
              </div>
            )}

            {/* Clear conversation button */}
            <button
              onClick={clearConversation}
              className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Clear conversation
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && messages.length === 0 && (
          <div className="px-2">
            <div className="p-3 bg-gray-50 rounded-lg border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        )}

        {/* Suggestion Pills - AI Generated based on product */}
        <div className="w-full">
          <div className="px-2 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-1">
              {isGeneratingSuggestions ? (
                // Loading skeleton for suggestions
                Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 bg-blue-50 rounded-full h-8 w-32 animate-pulse flex-shrink-0"
                  />
                ))
              ) : (
                suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={isLoading || isProductLoading}
                    className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 disabled:bg-blue-50 disabled:text-blue-400 text-blue-800 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    {suggestion}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Help text for empty state */}
        {messages.length === 0 && !isLoading && (
          <div className="px-2 py-2">
            <p className="text-xs text-gray-500 text-center">
              Ask me anything about this product. Try the suggestions above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}