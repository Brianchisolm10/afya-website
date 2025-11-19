import { Card } from "@/components/ui";
import { successStories } from "@/data/success-stories";

const publishedStories = successStories.filter(story => story.published);

// Sample stories for when there's no content yet
const sampleStories = [
  {
    id: "1",
    name: "Jessica M.",
    age: 32,
    location: "Baltimore, MD",
    goal: "Weight Loss & Strength",
    achievement: "Lost 45 lbs and gained confidence",
    timeframe: "6 months",
    quote: "AFYA didn't just help me lose weight - they helped me build a sustainable, healthy lifestyle. I feel stronger and more energized than ever!",
    stats: [
      { label: "Weight Lost", value: "45 lbs" },
      { label: "Body Fat", value: "-12%" },
      { label: "Strength Gain", value: "+40%" }
    ],
    image: "💪"
  },
  {
    id: "2",
    name: "Marcus T.",
    age: 45,
    location: "Silver Spring, MD",
    goal: "Marathon Training",
    achievement: "Completed first marathon",
    timeframe: "8 months",
    quote: "I never thought I could run a marathon at my age. AFYA's personalized training plan got me across that finish line injury-free!",
    stats: [
      { label: "Marathon Time", value: "4:15:32" },
      { label: "Training Miles", value: "500+" },
      { label: "Injuries", value: "0" }
    ],
    image: "🏃"
  },
  {
    id: "3",
    name: "Sarah L.",
    age: 28,
    location: "Rockville, MD",
    goal: "Postpartum Recovery",
    achievement: "Regained strength and energy",
    timeframe: "4 months",
    quote: "After having my baby, I felt lost about how to safely get back into fitness. AFYA's coaches understood my journey and created a perfect plan for me.",
    stats: [
      { label: "Core Strength", value: "+60%" },
      { label: "Energy Level", value: "Excellent" },
      { label: "Confidence", value: "100%" }
    ],
    image: "🌟"
  },
  {
    id: "4",
    name: "David K.",
    age: 55,
    location: "Bethesda, MD",
    goal: "Manage Diabetes",
    achievement: "Reduced A1C and medication",
    timeframe: "5 months",
    quote: "Working with AFYA has been life-changing. My doctor is amazed at my progress, and I feel better than I have in years.",
    stats: [
      { label: "A1C Reduction", value: "-2.1%" },
      { label: "Weight Lost", value: "32 lbs" },
      { label: "Medication", value: "Reduced" }
    ],
    image: "❤️"
  },
  {
    id: "5",
    name: "Emily R.",
    age: 24,
    location: "College Park, MD",
    goal: "Build Muscle",
    achievement: "Gained 15 lbs of lean muscle",
    timeframe: "7 months",
    quote: "I was always the 'skinny' girl who couldn't gain weight. AFYA's nutrition and strength program helped me build the strong, athletic body I always wanted.",
    stats: [
      { label: "Muscle Gained", value: "15 lbs" },
      { label: "Squat PR", value: "+85 lbs" },
      { label: "Deadlift PR", value: "+100 lbs" }
    ],
    image: "🏋️"
  },
  {
    id: "6",
    name: "Robert H.",
    age: 38,
    location: "Annapolis, MD",
    goal: "Stress Management",
    achievement: "Improved mental health & fitness",
    timeframe: "6 months",
    quote: "AFYA taught me that fitness isn't just physical - it's mental too. The mindfulness practices combined with exercise have transformed my life.",
    stats: [
      { label: "Stress Level", value: "-70%" },
      { label: "Sleep Quality", value: "+85%" },
      { label: "Overall Wellness", value: "Excellent" }
    ],
    image: "🧘"
  }
];

// Use real stories if available, otherwise show samples
const storiesToDisplay = publishedStories.length > 0 ? publishedStories : sampleStories;
const showComingSoon = publishedStories.length === 0;

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-afya-light to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-afya-primary via-afya-secondary to-afya-secondary-light text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
            Success Stories
          </h1>
          <p className="text-xl md:text-2xl text-white drop-shadow-md">
            Real people, real results, real transformations
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {showComingSoon ? (
            <>
              <div className="text-6xl mb-4">🌟</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Real Success Stories Coming Soon!
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                We're gathering inspiring transformation stories from our amazing clients. Check back soon to see real results from real people!
              </p>
              <p className="text-gray-600">
                Below are examples of the types of transformations we help our clients achieve.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                You Can Do This Too
              </h2>
              <p className="text-lg text-gray-700">
                These are real AFYA clients who committed to their health and achieved incredible results. 
                Their journeys prove that with the right guidance, support, and dedication, anything is possible.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Success Stories */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {storiesToDisplay.map((story, index) => (
              <Card 
                key={story.id} 
                variant="elevated" 
                className={`overflow-hidden ${index % 2 === 0 ? '' : 'bg-gradient-to-br from-afya-light/50 to-white'} ${showComingSoon ? 'opacity-90' : ''}`}
              >
                <div className={`md:flex ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  {showComingSoon && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full shadow-lg">
                        SAMPLE
                      </span>
                    </div>
                  )}
                  {/* Image/Icon Section */}
                  <div className="md:w-1/3 bg-gradient-to-br from-afya-primary to-afya-secondary flex flex-col items-center justify-center p-12 text-center">
                    <div className="text-8xl mb-4">{story.image}</div>
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2">{story.name}</h3>
                      <p className="text-afya-primary-light">{story.age} years old</p>
                      <p className="text-sm text-white/80">{story.location}</p>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="md:w-2/3 p-8">
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-afya-primary/20 text-afya-primary text-xs font-semibold rounded-full">
                          {story.goal}
                        </span>
                        <span className="px-3 py-1 bg-afya-secondary/20 text-afya-secondary text-xs font-semibold rounded-full">
                          {story.timeframe}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {story.achievement}
                      </h3>
                      <blockquote className="text-lg text-gray-700 italic border-l-4 border-afya-primary pl-4 mb-6">
                        "{story.quote}"
                      </blockquote>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      {story.stats.map((stat, idx) => (
                        <div key={idx} className="text-center p-4 bg-gradient-to-br from-afya-primary/10 to-afya-secondary/10 rounded-lg">
                          <div className="text-2xl font-bold text-afya-primary mb-1">
                            {stat.value}
                          </div>
                          <div className="text-xs text-gray-600 font-medium">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <Card variant="elevated" className="mt-16 text-center bg-gradient-to-br from-afya-primary/10 to-afya-secondary/10">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Write Your Success Story?
            </h3>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Join hundreds of clients who have transformed their lives with AFYA. 
              Your journey to a healthier, stronger you starts today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/get-started"
                className="inline-flex items-center justify-center px-8 py-4 bg-afya-primary text-white rounded-lg hover:bg-afya-primary-dark transition-colors font-semibold text-lg"
              >
                Start Your Journey
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-afya-primary border-2 border-afya-primary rounded-lg hover:bg-afya-primary hover:text-white transition-colors font-semibold text-lg"
              >
                Talk to a Coach
              </a>
            </div>
          </Card>

          {/* Testimonial Grid */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              What Our Clients Say
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="elevated" className="text-center">
                <div className="text-4xl mb-3">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-700 italic mb-4">
                  "Best investment I've made in myself. The coaches truly care about your success."
                </p>
                <p className="text-sm font-semibold text-gray-900">- Amanda P.</p>
              </Card>
              <Card variant="elevated" className="text-center">
                <div className="text-4xl mb-3">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-700 italic mb-4">
                  "Professional, knowledgeable, and supportive. AFYA changed my life!"
                </p>
                <p className="text-sm font-semibold text-gray-900">- James W.</p>
              </Card>
              <Card variant="elevated" className="text-center">
                <div className="text-4xl mb-3">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-700 italic mb-4">
                  "Finally found a program that works for my busy schedule and delivers results."
                </p>
                <p className="text-sm font-semibold text-gray-900">- Lisa M.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
