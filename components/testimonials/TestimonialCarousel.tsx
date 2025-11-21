'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "AFYA transformed my approach to fitness. The personalized program fit perfectly into my busy schedule, and I've never felt stronger.",
    author: "Sarah M.",
    role: "Training Program Client"
  },
  {
    id: 2,
    quote: "The nutrition guidance was exactly what I needed. Simple, sustainable, and it actually works. I've achieved goals I thought were impossible.",
    author: "Marcus J.",
    role: "Nutrition Program Client"
  },
  {
    id: 3,
    quote: "As a youth athlete, the program helped me improve my performance while staying healthy. The coaches really understand what young athletes need.",
    author: "Alex T.",
    role: "Youth Program Client"
  }
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 md:p-12 text-center">
        <svg 
          className="w-12 h-12 text-afya-primary mx-auto mb-6" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        
        <blockquote className="text-xl md:text-2xl text-gray-900 mb-6 leading-relaxed">
          "{currentTestimonial.quote}"
        </blockquote>
        
        <div className="text-gray-700">
          <div className="font-bold text-lg">{currentTestimonial.author}</div>
          <div className="text-sm text-gray-600">{currentTestimonial.role}</div>
        </div>
      </Card>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-afya-primary w-8' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
