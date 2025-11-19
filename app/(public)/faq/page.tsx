"use client";

import { useState } from "react";
import { Card } from "@/components/ui";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Getting Started",
    question: "How do I get started with AFYA?",
    answer: "Getting started is easy! Click the 'Get Started' button and fill out our intake form. This helps us understand your goals, fitness level, and any health considerations. Once submitted, we'll create a personalized wellness packet tailored to your needs."
  },
  {
    category: "Getting Started",
    question: "What information do I need to provide?",
    answer: "We'll ask about your personal information, health goals, current fitness level, medical history, dietary preferences, and emergency contact. All information is kept confidential and secure in compliance with HIPAA regulations."
  },
  {
    category: "Getting Started",
    question: "How long does it take to receive my wellness packet?",
    answer: "Most wellness packets are completed within 3-5 business days. You'll receive an email notification when your packet is ready, and you can view it in your client dashboard."
  },
  {
    category: "Services",
    question: "What services does AFYA offer?",
    answer: "AFYA offers personalized wellness packets, nutrition coaching, personal training, group fitness classes, and online coaching. Each service is customized to help you achieve your specific health and fitness goals."
  },
  {
    category: "Services",
    question: "Do you offer virtual/online coaching?",
    answer: "Yes! We offer comprehensive online coaching including video consultations, custom workout plans, nutrition guidance, and ongoing support through our client portal."
  },
  {
    category: "Services",
    question: "Can I work with a specific coach?",
    answer: "Absolutely! Once you're a client, you can request to work with a specific coach based on their specialties and your preferences. We'll do our best to match you with the right coach for your goals."
  },
  {
    category: "Pricing",
    question: "How much do your services cost?",
    answer: "Pricing varies based on the service and level of support you need. Initial wellness packets start at $50, while ongoing coaching packages range from $79-$149 per month. Contact us for detailed pricing information."
  },
  {
    category: "Pricing",
    question: "Do you offer payment plans?",
    answer: "Yes, we offer flexible payment options including monthly subscriptions and multi-month packages with discounts. We want to make wellness accessible to everyone."
  },
  {
    category: "Pricing",
    question: "Is there a free trial?",
    answer: "We offer a free initial consultation to discuss your goals and determine if AFYA is the right fit for you. Contact us to schedule your free consultation."
  },
  {
    category: "Account & Technical",
    question: "How do I access my client dashboard?",
    answer: "Once you've submitted your intake form, you'll receive login credentials via email. You can then access your dashboard at any time to view your wellness packet, track progress, and communicate with your coach."
  },
  {
    category: "Account & Technical",
    question: "I forgot my password. What should I do?",
    answer: "Click the 'Forgot Password' link on the login page. Enter your email address, and we'll send you a secure link to reset your password. The link is valid for 1 hour."
  },
  {
    category: "Account & Technical",
    question: "Can I update my personal information?",
    answer: "Yes! Log into your dashboard and go to Profile Settings. You can update your name, password, and contact information at any time."
  },
  {
    category: "Health & Safety",
    question: "Is my health information secure?",
    answer: "Absolutely. We take your privacy seriously and comply with HIPAA regulations. All data is encrypted, and we maintain comprehensive audit logs. See our Privacy Policy for full details."
  },
  {
    category: "Health & Safety",
    question: "Do I need medical clearance to start?",
    answer: "If you have any pre-existing medical conditions or concerns, we recommend consulting with your healthcare provider before starting any new fitness program. We'll work with you to create a safe, appropriate plan."
  },
  {
    category: "Health & Safety",
    question: "What if I have dietary restrictions or allergies?",
    answer: "We accommodate all dietary restrictions, allergies, and preferences. Make sure to include this information in your intake form, and we'll create nutrition guidance that works for you."
  },
  {
    category: "Support",
    question: "How can I contact my coach?",
    answer: "You can message your coach through your client dashboard, or email us at afya@theafya.org. We typically respond within 24 hours on business days."
  },
  {
    category: "Support",
    question: "What if I'm not seeing results?",
    answer: "Progress takes time, but if you're not seeing the results you expected, reach out to your coach. We'll review your plan, make adjustments, and ensure you're on the right track. Your success is our priority."
  },
  {
    category: "Support",
    question: "Can I cancel or pause my subscription?",
    answer: "Yes, you can cancel or pause your subscription at any time. Contact us at least 7 days before your next billing cycle to make changes to your account."
  }
];

const categories = Array.from(new Set(faqs.map(faq => faq.category)));

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredFAQs = selectedCategory === "All" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-afya-light to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-afya-primary via-afya-secondary to-afya-secondary-light text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
            Frequently Asked Questions
          </h1>
          <p className="text-xl md:text-2xl text-white drop-shadow-md">
            Find answers to common questions about AFYA's services
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === "All"
                  ? "bg-afya-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-afya-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <Card key={index} variant="elevated" className="overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full text-left p-6 flex justify-between items-start hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <span className="text-xs font-semibold text-afya-secondary uppercase tracking-wide mb-2 block">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">
                      {faq.question}
                    </h3>
                  </div>
                  <svg
                    className={`w-6 h-6 text-afya-primary flex-shrink-0 transition-transform ${
                      openIndex === index ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 text-gray-700 animate-slideDown">
                    {faq.answer}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Still Have Questions */}
          <Card variant="elevated" className="mt-12 text-center bg-gradient-to-br from-afya-primary/10 to-afya-secondary/10">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-700 mb-6">
              Can't find what you're looking for? We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:afya@theafya.org"
                className="inline-flex items-center justify-center px-6 py-3 bg-afya-primary text-white rounded-lg hover:bg-afya-primary-dark transition-colors font-semibold"
              >
                Email Us
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-afya-primary border-2 border-afya-primary rounded-lg hover:bg-afya-primary hover:text-white transition-colors font-semibold"
              >
                Contact Form
              </a>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
