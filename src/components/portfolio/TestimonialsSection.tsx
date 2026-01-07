import React from 'react';
import { motion } from 'framer-motion';

const TestimonialsSection = ({ theme, t, testimonials, language }) => {
  return (
    <section id="testimonials" className="py-20 px-4 max-w-4xl mx-auto">
      <h2 
        className="text-[clamp(2rem,5vw,3rem)] mb-12 font-extrabold tracking-tight text-center px-2 py-2"
        dangerouslySetInnerHTML={{ __html: t.testimonials.title }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 py-2">
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-[#111]' : 'bg-white shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-gray-100'
              }`}>
                👤
              </div>
              <div>
                <h4 className="font-bold">{testimonial.name}</h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {testimonial.position}, {testimonial.company}
                </p>
              </div>
            </div>

            <p className={`mb-4 italic ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              "{testimonial.text}"
            </p>

            <div className="flex items-center justify-between">
              <div className="flex">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
              </div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                {new Date(testimonial.date).toLocaleDateString(language)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;