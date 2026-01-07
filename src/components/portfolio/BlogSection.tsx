import React from 'react';
import { motion } from 'framer-motion';

const BlogSection = ({ theme, t, blogPosts, language }) => {
  return (
    <section id="blog" className="py-20 px-4 max-w-6xl mx-auto">
      <h2 
        className="text-[clamp(2rem,5vw,3rem)] mb-12 font-extrabold tracking-tight text-center px-2 py-2"
        dangerouslySetInnerHTML={{ __html: t.blog.title }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 py-2">
        {blogPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-6 rounded-xl border ${
              theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            <div className={`px-3 py-1 rounded-full text-xs font-medium inline-block mb-4 ${
              theme === 'dark' 
                ? 'bg-[#00ff88]/20 text-[#00ff88]' 
                : 'bg-green-100 text-green-800'
            }`}>
              {post.readTime} {t.blog.readTime}
            </div>

            <h3 className="text-lg font-bold mb-3">{post.title}</h3>
            <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {post.excerpt}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, i) => (
                <span key={i} className={`px-2 py-1 text-xs rounded ${
                  theme === 'dark' 
                    ? 'bg-[#2a2a2a] text-gray-300' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                {new Date(post.date).toLocaleDateString(language)}
              </span>
              <button className={`text-sm font-medium hover:underline ${
                theme === 'dark' ? 'text-[#00ff88]' : 'text-green-600'
              }`}>
                {t.blog.readMore} →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;