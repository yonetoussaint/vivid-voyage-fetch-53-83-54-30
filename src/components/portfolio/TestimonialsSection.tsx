import React from 'react';
import { Quote } from 'lucide-react';
import { testimonials } from './data';

interface TestimonialsSectionProps {
  testimonialsRef: React.RefObject<HTMLElement>;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonialsRef }) => {
  return (
    <section ref={testimonialsRef} id="testimonials" className="scroll-mt-20">
      <h2 className="text-2xl font-bold mb-4 px-2">What People Say</h2>
      <div className="space-y-4">
        {testimonials.map((testimonial, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-4 mb-3">
              <img 
                src={testimonial.image} 
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
              />
              <div className="flex-1">
                <h3 className="font-bold text-base mb-1">{testimonial.name}</h3>
                <p className="text-xs text-gray-600">{testimonial.role}</p>
              </div>
              <Quote className="w-8 h-8 text-blue-100 flex-shrink-0" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed italic">
              "{testimonial.text}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};