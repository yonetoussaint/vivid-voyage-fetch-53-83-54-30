// Popular Categories Component
const PopularCategories: React.FC = () => {
  const navigate = useNavigate();
  
  const handleMoreClick = () => {
    navigate('/categories');
  };

  const categories = [
    {
      id: 1,
      name: 'Mobiles',
      searches: '114K+ search',
      discount: 'HOT',
      image: '📱',
      bgColor: 'bg-orange-100',
      discountBg: 'bg-pink-600'
    },
    {
      id: 2,
      name: 'Cribs & Cots',
      searches: '205 search',
      discount: '-50%',
      image: '🛏️',
      bgColor: 'bg-blue-100',
      discountBg: 'bg-blue-600'
    },
    {
      id: 3,
      name: 'Portable Speakers',
      searches: '3K+ search',
      discount: '-33%',
      image: '🔊',
      bgColor: 'bg-gray-100',
      discountBg: 'bg-pink-600'
    },
    {
      id: 4,
      name: 'Electric Insect...',
      searches: '3K+ search',
      discount: '-59%',
      image: '⚡',
      bgColor: 'bg-gray-50',
      discountBg: 'bg-pink-600'
    },
    {
      id: 5,
      name: 'Smart Watches',
      searches: '89K+ search',
      discount: '-45%',
      image: '⌚',
      bgColor: 'bg-purple-100',
      discountBg: 'bg-purple-600'
    }
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-2 px-2 pt-2">
        <div className="flex-1 mr-2">
          <h2 className="text-lg font-bold text-gray-900">Popular Categories for you</h2>
          <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">Trending items based on your interests</p>
        </div>
        <button 
          onClick={handleMoreClick}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0 mt-1"
        >
          <span className="text-xs font-medium">More</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>

      {/* Categories Grid */}
      <div className="flex gap-2 overflow-x-auto pb-4 px-2 scrollbar-hide">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex-shrink-0 w-20 cursor-pointer group"
          >
            {/* Image Container */}
            <div className={`relative ${category.bgColor} rounded-lg overflow-hidden mb-2 aspect-square flex items-center justify-center transition-transform group-hover:scale-105`}>
              {/* Discount Badge */}
              <div className={`absolute top-1 left-1 ${category.discountBg} text-white px-1 py-0.5 text-[9px] font-bold rounded`}>
                {category.discount}
              </div>
              
              {/* Product Image Placeholder */}
              <div className="text-2xl">{category.image}</div>
            </div>

            {/* Category Info */}
            <div className="text-center">
              <h3 className="font-semibold text-[11px] text-gray-900 mb-0.5 truncate leading-tight">
                {category.name}
              </h3>
              <p className="text-[9px] text-gray-500">
                {category.searches}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};