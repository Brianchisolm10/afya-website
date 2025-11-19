import Link from "next/link";
import { Card } from "@/components/ui";
import { blogPosts } from "@/data/blog-posts";

const publishedPosts = blogPosts.filter(post => post.published);

// Sample posts for when there's no content yet
const samplePosts = [
  {
    id: "1",
    title: "5 Essential Stretches for Better Flexibility",
    excerpt: "Improve your range of motion and reduce injury risk with these fundamental stretching exercises that you can do anywhere.",
    category: "Fitness",
    author: "Coach Sarah",
    date: "Nov 15, 2025",
    readTime: "5 min read",
    image: "🧘"
  },
  {
    id: "2",
    title: "Meal Prep Made Simple: A Beginner's Guide",
    excerpt: "Save time and eat healthier with our step-by-step guide to meal prepping. Includes recipes and storage tips.",
    category: "Nutrition",
    author: "Coach Mike",
    date: "Nov 12, 2025",
    readTime: "8 min read",
    image: "🥗"
  },
  {
    id: "3",
    title: "The Importance of Rest Days in Your Fitness Journey",
    excerpt: "Learn why taking rest days is crucial for muscle recovery, preventing burnout, and achieving your fitness goals.",
    category: "Wellness",
    author: "Coach Sarah",
    date: "Nov 10, 2025",
    readTime: "6 min read",
    image: "😴"
  },
  {
    id: "4",
    title: "Building a Home Gym on a Budget",
    excerpt: "You don't need expensive equipment to get fit. Discover affordable alternatives and essential items for your home workout space.",
    category: "Fitness",
    author: "Coach Alex",
    date: "Nov 8, 2025",
    readTime: "7 min read",
    image: "🏋️"
  },
  {
    id: "5",
    title: "Hydration: The Often Overlooked Key to Performance",
    excerpt: "Understanding how proper hydration affects your workouts, recovery, and overall health. Plus, tips to drink more water.",
    category: "Nutrition",
    author: "Coach Mike",
    date: "Nov 5, 2025",
    readTime: "5 min read",
    image: "💧"
  },
  {
    id: "6",
    title: "Mindfulness and Movement: The Mind-Body Connection",
    excerpt: "Explore how incorporating mindfulness into your fitness routine can enhance results and reduce stress.",
    category: "Wellness",
    author: "Coach Sarah",
    date: "Nov 3, 2025",
    readTime: "6 min read",
    image: "🧠"
  },
  {
    id: "7",
    title: "HIIT vs. Steady-State Cardio: Which is Right for You?",
    excerpt: "Compare high-intensity interval training with traditional cardio to find the best approach for your fitness goals.",
    category: "Fitness",
    author: "Coach Alex",
    date: "Nov 1, 2025",
    readTime: "7 min read",
    image: "🏃"
  },
  {
    id: "8",
    title: "Protein Myths Debunked: What You Really Need to Know",
    excerpt: "Separate fact from fiction when it comes to protein intake, timing, and sources for optimal muscle growth and recovery.",
    category: "Nutrition",
    author: "Coach Mike",
    date: "Oct 29, 2025",
    readTime: "8 min read",
    image: "🥩"
  },
  {
    id: "9",
    title: "Setting Realistic Fitness Goals That Stick",
    excerpt: "Learn the SMART goal framework and how to create achievable milestones that keep you motivated long-term.",
    category: "Wellness",
    author: "Coach Sarah",
    date: "Oct 27, 2025",
    readTime: "6 min read",
    image: "🎯"
  }
];

const categories = ["All", "Fitness", "Nutrition", "Wellness"];

// Use real posts if available, otherwise show samples
const postsToDisplay = publishedPosts.length > 0 ? publishedPosts : samplePosts;
const showComingSoon = publishedPosts.length === 0;

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-afya-light to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-afya-primary via-afya-secondary to-afya-secondary-light text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
            AFYA Blog & Tips
          </h1>
          <p className="text-xl md:text-2xl text-white drop-shadow-md">
            Expert advice on fitness, nutrition, and wellness
          </p>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-12 flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full font-medium bg-gray-200 text-gray-700 hover:bg-afya-primary hover:text-white transition-colors"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Coming Soon Message */}
          {showComingSoon && (
            <Card variant="elevated" className="mb-12 text-center bg-gradient-to-br from-afya-primary/10 to-afya-secondary/10">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Blog Posts Coming Soon!
              </h2>
              <p className="text-gray-700 mb-6">
                We're working on creating amazing content for you. Check back soon for fitness tips, nutrition advice, and wellness insights from our expert coaches.
              </p>
              <p className="text-sm text-gray-600">
                In the meantime, explore our sample posts below to see what's coming!
              </p>
            </Card>
          )}

          {/* Featured Post */}
          {postsToDisplay.length > 0 && (
            <Card variant="elevated" className="mb-12 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-afya-primary to-afya-secondary flex items-center justify-center text-8xl p-12">
                  {postsToDisplay[0].image}
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center gap-3 mb-3">
                    {!showComingSoon && (
                      <span className="px-3 py-1 bg-afya-primary text-white text-xs font-semibold rounded-full">
                        FEATURED
                      </span>
                    )}
                    {showComingSoon && (
                      <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                        SAMPLE
                      </span>
                    )}
                    <span className="px-3 py-1 bg-afya-secondary/20 text-afya-secondary text-xs font-semibold rounded-full">
                      {postsToDisplay[0].category}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {postsToDisplay[0].title}
                  </h2>
                  <p className="text-gray-700 mb-6 text-lg">
                    {postsToDisplay[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{postsToDisplay[0].author}</span>
                      <span>•</span>
                      <span>{postsToDisplay[0].date}</span>
                      <span>•</span>
                      <span>{postsToDisplay[0].readTime}</span>
                    </div>
                    {!showComingSoon && (
                      <Link
                        href={`/blog/${postsToDisplay[0].id}`}
                        className="text-afya-primary hover:text-afya-primary-dark font-semibold"
                      >
                        Read More →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {postsToDisplay.slice(1).map((post) => (
              <Card key={post.id} variant="elevated" hoverable className="flex flex-col">
                <div className="bg-gradient-to-br from-afya-primary/20 to-afya-secondary/20 flex items-center justify-center text-6xl h-48">
                  {post.image}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-afya-secondary/20 text-afya-secondary text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                    {showComingSoon && (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-700 text-xs font-semibold rounded-full">
                        SAMPLE
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{post.author}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{post.date}</span>
                      {!showComingSoon && (
                        <Link
                          href={`/blog/${post.id}`}
                          className="text-afya-primary hover:text-afya-primary-dark font-semibold text-sm"
                        >
                          Read More →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Newsletter Signup */}
          <Card variant="elevated" className="mt-16 text-center bg-gradient-to-br from-afya-primary/10 to-afya-secondary/10">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Get Weekly Fitness Tips
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for expert advice, workout ideas, and nutrition tips delivered straight to your inbox.
            </p>
            <form className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afya-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-afya-primary text-white rounded-lg hover:bg-afya-primary-dark transition-colors font-semibold whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
