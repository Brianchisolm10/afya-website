import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui";
import { blogPosts } from "@/data/blog-posts";

export async function generateStaticParams() {
  return blogPosts
    .filter(post => post.published)
    .map((post) => ({
      id: post.id,
    }));
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id === params.id && p.published);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter((p) => p.published && p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-afya-light to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-afya-primary via-afya-secondary to-afya-secondary-light text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors"
          >
            ← Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
              {post.category}
            </span>
            <span className="text-white/80">{post.readTime}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-white/90">
            <span>By {post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="elevated" className="p-8 md:p-12">
            {/* Featured Image/Icon */}
            <div className="bg-gradient-to-br from-afya-primary/20 to-afya-secondary/20 rounded-xl flex items-center justify-center text-8xl h-64 mb-8">
              {post.image}
            </div>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none
              prose-headings:text-gray-900 
              prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:font-semibold prose-h3:text-afya-primary prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-ul:my-4 prose-ul:space-y-2
              prose-li:text-gray-700
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-a:text-afya-primary prose-a:no-underline hover:prose-a:text-afya-primary-dark">
              {post.content.split('\n').map((paragraph, idx) => {
                if (paragraph.trim().startsWith('## ')) {
                  return <h2 key={idx}>{paragraph.replace('## ', '')}</h2>;
                } else if (paragraph.trim().startsWith('- ')) {
                  return <li key={idx}>{paragraph.replace('- ', '')}</li>;
                } else if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                  return <p key={idx}><strong>{paragraph.replace(/\*\*/g, '')}</strong></p>;
                } else if (paragraph.trim()) {
                  return <p key={idx}>{paragraph}</p>;
                }
                return null;
              })}
            </div>

            {/* Author Bio */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-afya-primary to-afya-secondary rounded-full flex items-center justify-center text-2xl text-white font-bold">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {post.author}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    AFYA Coach & Wellness Expert
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} variant="elevated" hoverable>
                    <Link href={`/blog/${relatedPost.id}`}>
                      <div className="bg-gradient-to-br from-afya-primary/20 to-afya-secondary/20 flex items-center justify-center text-4xl h-32">
                        {relatedPost.image}
                      </div>
                      <div className="p-4">
                        <span className="text-xs font-semibold text-afya-secondary uppercase">
                          {relatedPost.category}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 mt-2 mb-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {relatedPost.excerpt}
                        </p>
                        <div className="text-xs text-gray-500">
                          {relatedPost.readTime}
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <Card variant="elevated" className="mt-12 text-center bg-gradient-to-br from-afya-primary/10 to-afya-secondary/10">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Fitness Journey?
            </h3>
            <p className="text-gray-700 mb-6">
              Get personalized guidance from our expert coaches
            </p>
            <Link
              href="/get-started"
              className="inline-block px-8 py-3 bg-afya-primary text-white rounded-lg hover:bg-afya-primary-dark transition-colors font-semibold"
            >
              Get Started Today
            </Link>
          </Card>
        </div>
      </article>
    </div>
  );
}
