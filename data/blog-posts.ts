export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  published: boolean;
}

/**
 * BLOG POSTS DATA
 * 
 * To add a new blog post:
 * 1. Copy the template below
 * 2. Fill in all fields
 * 3. Set published: true when ready to show
 * 4. Save this file
 * 
 * The blog will automatically appear on /blog and be accessible at /blog/[id]
 */

export const blogPosts: BlogPost[] = [
  // TEMPLATE - Copy this to create new posts
  // {
  //   id: "unique-url-slug",
  //   title: "Your Blog Post Title",
  //   excerpt: "A short 1-2 sentence summary that appears on the blog listing page.",
  //   content: `
  //     Write your full blog post content here using markdown-style formatting.
  //     
  //     You can use multiple paragraphs.
  //     
  //     ## Subheadings
  //     
  //     - Bullet points
  //     - Like this
  //     
  //     **Bold text** and *italic text* work too.
  //   `,
  //   category: "Fitness", // Options: Fitness, Nutrition, Wellness
  //   author: "Your Name",
  //   date: "Nov 18, 2025",
  //   readTime: "5 min read",
  //   image: "🏋️", // Use an emoji or later replace with image URL
  //   published: true
  // },
];
