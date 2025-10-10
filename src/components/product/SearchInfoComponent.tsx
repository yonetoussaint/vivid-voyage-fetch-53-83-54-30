import React, { useState, useEffect } from 'react';
import { useProduct } from '@/hooks/useProduct';
import SectionHeader from '@/components/home/SectionHeader';

interface SearchInfoComponentProps {
  productId: string;
}

export default function SearchInfoComponent({ productId }: SearchInfoComponentProps) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const { data: product } = useProduct(productId);

  // Generate AI-powered suggestions when product data is available
  useEffect(() => {
    const generateSuggestions = async () => {
      if (!product || loadingSuggestions || suggestions.length > 0) return;

      setLoadingSuggestions(true);
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

      try {
        const productContext = `Product: ${product.name}
Category: ${product.category || 'General'}
Description: ${product.description || 'No description'}
Price: $${product.price}
${product.specifications ? `Specifications: ${JSON.stringify(product.specifications)}` : ''}

Generate exactly 4 short, relevant questions (max 6-8 words each) that customers would commonly ask about this specific product. Return ONLY the questions, one per line, without numbers or bullets.`;

        const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1-0528:free",
            messages: [
              {
                role: "user",
                content: productContext
              }
            ]
          })
        });

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          const generatedText = data.choices[0]?.message?.content || '';
          const questionsList = generatedText
            .split('\n')
            .map((q: string) => q.trim())
            .filter((q: string) => q.length > 0 && q.includes('?'))
            .slice(0, 4);

          if (questionsList.length > 0) {
            setSuggestions(questionsList);
          }
        }
      } catch (error) {
        console.error('Error generating suggestions:', error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    generateSuggestions();
  }, [product, loadingSuggestions, suggestions.length]);

  const handleSubmit = async (questionText: string) => {
    if (!questionText.trim()) return;

    setIsLoading(true);
    setResponse('');

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    console.log('API Key check:', apiKey ? 'API key is present' : 'API key is MISSING');

    try {
      // Create context about the product for the AI
      let productContext = '';
      if (product) {
        productContext = `Product Information:
- Name: ${product.name}
- Price: $${product.price}${product.discount_price ? ` (was $${product.discount_price})` : ''}
- Description: ${product.description || 'No description available'}
- Category: ${product.category || 'No category specified'}
- Rating: ${product.rating || 'No rating'}/5
- Stock: ${product.inventory || 'Stock info not available'}
${product.specifications ? `- Specifications: ${JSON.stringify(product.specifications)}` : ''}

User Question: ${questionText}

Please answer the user's question specifically about this product based on the information provided. If the information needed to answer the question is not available in the product details, please say so clearly.`;
      } else {
        productContext = `The user is asking: ${questionText}

Note: Product information is not currently available. Please let the user know that product details are loading and ask them to try again in a moment.`;
      }

      const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: [
            {
              role: "user",
              content: productContext
            }
          ]
        })
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('API Error Response:', apiResponse.status, errorText);
        throw new Error(`API request failed: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      const answer = data.choices[0]?.message?.content || 'No response received';
      setResponse(answer);
    } catch (error) {
      console.error('Error calling API:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      setResponse('Sorry, there was an error getting an answer. Please try again.');
    } finally {
      setIsLoading(false);
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

  // Updated custom icon component to match ReviewGallery sizing
  const SearchInfoIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <div className={`relative ${className}`}>
      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full"></div>
    </div>
  );

  return (
    <div className="w-full bg-white">
      {/* Header using SectionHeader with consistent spacing */}
      <SectionHeader
        title="Looking for Specific Info?"
        icon={SearchInfoIcon}
        titleTransform="uppercase"
        />

      {/* Search Input */}
      <div className="px-2 mb-2"> {/* Consistent 16px bottom margin */}
        <form onSubmit={handleInputSubmit} className="relative">
          <input
            type="text"
            placeholder="Ask Rufus or search reviews and Q&A"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2.5 pr-12 text-gray-600 bg-white border-2 border-blue-400 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 rounded-full p-1.5 transition-colors"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            )}
          </button>
        </form>
      </div>

      {/* Response Area */}
      {response && (
        <div className="px-2"> {/* Consistent 16px bottom margin and horizontal padding */}
          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="text-sm text-gray-800 whitespace-pre-wrap">{response}</div>
          </div>
        </div>
      )}

      {/* Suggestion Pills - Horizontally Scrollable */}
      <div className="w-full">
        <div className="overflow-x-auto scrollbar-hide px-2">
          <div className="flex gap-2 pb-1">
            {loadingSuggestions ? (
              // Loading skeleton for suggestions
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 bg-blue-50 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 animate-pulse"
                  >
                    <div className="h-4 w-32 bg-blue-200 rounded"></div>
                  </div>
                ))}
              </>
            ) : suggestions.length > 0 ? (
              // AI-generated suggestions
              suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 disabled:bg-blue-50 disabled:text-blue-400 text-blue-800 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
                >
                  {suggestion}
                </button>
              ))
            ) : (
              // Fallback suggestions if AI generation fails
              <>
                <button
                  onClick={() => handleSuggestionClick('What are the key features?')}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 disabled:bg-blue-50 disabled:text-blue-400 text-blue-800 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
                >
                  What are the key features?
                </button>
                <button
                  onClick={() => handleSuggestionClick('Is this good value?')}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 disabled:bg-blue-50 disabled:text-blue-400 text-blue-800 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
                >
                  Is this good value?
                </button>
                <button
                  onClick={() => handleSuggestionClick('What are the specifications?')}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 disabled:bg-blue-50 disabled:text-blue-400 text-blue-800 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
                >
                  What are the specifications?
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}