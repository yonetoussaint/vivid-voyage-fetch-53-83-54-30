// components/product/tabs/ProductQnA.tsx
import React, { useState } from 'react';

interface ProductQnAProps {
  product: any;
}

const ProductQnA: React.FC<ProductQnAProps> = ({ product }) => {
  const [newQuestion, setNewQuestion] = useState('');

  const questions = [
    {
      id: 1,
      question: "Is this product waterproof?",
      answer: "Yes, this product is IP68 rated waterproof.",
      askedBy: "User123",
      date: "2024-01-15",
      likes: 5
    },
    {
      id: 2,
      question: "What's the warranty period?",
      answer: "We offer a 1-year manufacturer warranty.",
      askedBy: "User456",
      date: "2024-01-10",
      likes: 3
    },
    {
      id: 3,
      question: "Does it come with a charger?",
      answer: null, // Not answered yet
      askedBy: "User789",
      date: "2024-01-08",
      likes: 1
    }
  ];

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      console.log('Submitting question:', newQuestion);
      setNewQuestion('');
      // Here you would typically send the question to your backend
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Questions & Answers</h2>
      
      {/* Ask Question Form */}
      <form onSubmit={handleSubmitQuestion} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask a question about this product..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ask
          </button>
        </div>
      </form>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg text-gray-900">Q: {q.question}</h3>
              <span className="text-sm text-gray-500">{q.likes} likes</span>
            </div>
            
            <div className="text-sm text-gray-600 mb-3">
              Asked by {q.askedBy} on {q.date}
            </div>

            {q.answer ? (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="font-semibold text-green-800 mb-1">Seller's Answer:</div>
                <p className="text-green-700">{q.answer}</p>
              </div>
            ) : (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-yellow-700 text-sm">Waiting for seller's response...</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No questions state */}
      {questions.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">?</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No questions yet</h3>
          <p className="text-gray-500">Be the first to ask a question about this product!</p>
        </div>
      )}
    </div>
  );
};

export default ProductQnA;