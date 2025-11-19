'use client';

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  details: string;
  expanded: boolean;
  onToggle: () => void;
  gradient: string;
  featured?: boolean;
  clientType: string;
}

function ServiceCard({
  title,
  description,
  icon,
  features,
  details,
  expanded,
  onToggle,
  gradient,
  featured,
  clientType
}: ServiceCardProps) {
  return (
    <div className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${featured ? 'ring-2 ring-afya-primary' : ''}`}>
      {featured && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-afya-primary to-afya-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
          MOST POPULAR
        </div>
      )}
      
      <div className="p-8">
        {/* Icon */}
        <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-6 text-white shadow-lg`}>
          {icon}
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 mb-6">
          {description}
        </p>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* Expandable Details */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between text-afya-primary hover:text-afya-secondary transition-colors font-medium mb-4"
        >
          <span>{expanded ? 'Show Less' : 'Learn More'}</span>
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded Content */}
        <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
          <div className="p-4 bg-gradient-to-br from-afya-light to-white rounded-lg border border-gray-200">
            <p className="text-gray-700 text-sm leading-relaxed">
              {details}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Link href={`/intake?path=${clientType}`}>
          <Button
            variant={featured ? "primary" : "secondary"}
            fullWidth
            className="shadow-md hover:shadow-lg transition-all duration-200"
          >
            Choose This Path
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const toggleService = (serviceId: string) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };
  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#20B2AA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Our Services
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Comprehensive, personalized health and fitness packets designed to
              help you achieve your goals.
            </p>
          </div>
        </div>
      </section>

      {/* Packets Overview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Personalized Programs for Every Goal
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose your path and receive custom-generated guidance packets designed specifically for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {/* Nutrition Only */}
            <ServiceCard
              id="nutrition"
              title="Nutrition Only"
              description="Get personalized nutrition guidance tailored to your dietary needs and goals."
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
              features={["Calorie & macro targets", "Meal planning guidance", "Shopping lists", "Recipe suggestions"]}
              details="Your nutrition packet includes calculated daily calorie targets based on your goals, personalized macronutrient breakdowns, meal timing recommendations, and practical tips for sustainable eating habits. Perfect for those focused on optimizing their diet."
              expanded={expandedService === "nutrition"}
              onToggle={() => toggleService("nutrition")}
              gradient="from-afya-primary to-afya-secondary"
              clientType="NUTRITION_ONLY"
            />

            {/* Workout Only */}
            <ServiceCard
              id="workout"
              title="Workout Program"
              description="Receive a customized workout program based on your fitness level and goals."
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              features={["Progressive programming", "Exercise selection", "Training schedule", "Form guidance"]}
              details="Your workout packet provides a structured training program with exercise demonstrations, progressive overload strategies, and recovery guidance. Designed for your available equipment, schedule, and experience level."
              expanded={expandedService === "workout"}
              onToggle={() => toggleService("workout")}
              gradient="from-afya-secondary to-afya-primary"
              clientType="WORKOUT_ONLY"
            />

            {/* Full Program */}
            <ServiceCard
              id="full"
              title="Full Program"
              description="Complete nutrition and training guidance for comprehensive transformation."
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              features={["Complete nutrition plan", "Full workout program", "Integrated approach", "Lifestyle guidance"]}
              details="Combine both nutrition and workout packets for a holistic approach. Get synchronized meal and training plans that work together to maximize your results. Includes everything from both individual packets plus integration strategies."
              expanded={expandedService === "full"}
              onToggle={() => toggleService("full")}
              gradient="from-afya-primary via-afya-secondary to-afya-primary"
              featured
              clientType="FULL_PROGRAM"
            />

            {/* Athlete Performance */}
            <ServiceCard
              id="athlete"
              title="Athlete Performance"
              description="Sport-specific training based on NSCA-CSCS principles for competitive athletes."
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
              features={["Periodization planning", "Sport-specific training", "Performance metrics", "Competition prep"]}
              details="Advanced programming for competitive athletes including periodization cycles, power development, sport-specific conditioning, and recovery protocols. Aligned with NSCA-CSCS standards for optimal athletic performance."
              expanded={expandedService === "athlete"}
              onToggle={() => toggleService("athlete")}
              gradient="from-orange-500 to-red-500"
              clientType="ATHLETE_PERFORMANCE"
            />

            {/* Youth Program */}
            <ServiceCard
              id="youth"
              title="Youth Program"
              description="Age-appropriate fitness and nutrition guidance for young athletes and teens."
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
              features={["Age-appropriate exercises", "Safety-first approach", "Growth focus", "Parent guidance"]}
              details="Specially designed for youth with emphasis on proper movement patterns, injury prevention, and long-term athletic development. Includes parent/guardian guidance and focuses on building a healthy relationship with fitness."
              expanded={expandedService === "youth"}
              onToggle={() => toggleService("youth")}
              gradient="from-green-400 to-blue-500"
              clientType="YOUTH"
            />

            {/* General Wellness */}
            <ServiceCard
              id="wellness"
              title="General Wellness"
              description="Practical health and fitness advice for overall wellbeing and lifestyle improvement."
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
              features={["Lifestyle assessment", "Basic fitness guidance", "Healthy habits", "Sustainable approach"]}
              details="A holistic approach to wellness covering movement, nutrition, sleep, and stress management. Perfect for those starting their health journey or looking to build sustainable healthy habits without overwhelming complexity."
              expanded={expandedService === "wellness"}
              onToggle={() => toggleService("wellness")}
              gradient="from-purple-400 to-pink-500"
              clientType="GENERAL_WELLNESS"
            />

            {/* Special Situation */}
            <ServiceCard
              id="special"
              title="Special Situation"
              description="Modified guidance for injury recovery, chronic conditions, or specific limitations."
              icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              features={["Injury/condition assessment", "Safe movement patterns", "Progressive recovery", "Pain management"]}
              details="Specialized programming for those recovering from injury or managing chronic conditions. Includes safe exercise modifications, progressive return-to-activity protocols, and pain management strategies. Always coordinate with your healthcare provider."
              expanded={expandedService === "special"}
              onToggle={() => toggleService("special")}
              gradient="from-blue-500 to-indigo-600"
              clientType="SPECIAL_SITUATION"
            />
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-afya-primary/10 via-afya-secondary/10 to-afya-primary/10 rounded-2xl p-8 text-center border border-afya-primary/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Not Sure Which Path to Choose?
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              All programs are fully customized based on your unique intake responses. Start with any path and we'll tailor it specifically to your needs, goals, and preferences.
            </p>
            <Link href="/get-started">
              <Button 
                size="lg" 
                className="bg-afya-primary hover:bg-afya-primary-dark text-white shadow-lg font-semibold"
              >
                Start Your Free Assessment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-afya-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Submit Intake
              </h3>
              <p className="text-gray-600">
                Fill out our simple intake form with your goals and preferences.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-afya-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                We Generate
              </h3>
              <p className="text-gray-600">
                Our system creates your personalized packets based on your unique
                profile.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-afya-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Access Dashboard
              </h3>
              <p className="text-gray-600">
                Log in to view and download your completed packets when ready.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-afya-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Track Progress
              </h3>
              <p className="text-gray-600">
                Use weekly check-ins to monitor your journey and adjust as needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-afya-primary via-afya-secondary to-afya-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl text-white/90 mb-8 drop-shadow-md">
            Join thousands who have started their journey with AFYA. Get your personalized program in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/get-started">
              <Button
                size="lg"
                className="!bg-white !text-gray-900 hover:!bg-gray-50 hover:!text-afya-primary-dark shadow-2xl font-bold !border-2 !border-white transform hover:scale-105 transition-transform"
              >
                Start Free Assessment
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                className="!bg-transparent !border-2 !border-white/60 !text-white hover:!bg-white/10 hover:!border-white shadow-lg font-semibold"
              >
                Already Have an Account?
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-white/80 text-sm">
            ✓ No credit card required  ✓ Takes 8-15 minutes  ✓ Instant results
          </p>
        </div>
      </section>
    </div>
  );
}
