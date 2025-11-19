# How to Add Your Own Content to AFYA Website

This guide shows you how to add your own blog posts and success stories to your website. No coding experience required!

---

## 📝 Adding Blog Posts

### Step 1: Open the Blog Data File

Navigate to: `data/blog-posts.ts`

### Step 2: Copy the Template

Find this template in the file:

```typescript
{
  id: "unique-url-slug",
  title: "Your Blog Post Title",
  excerpt: "A short 1-2 sentence summary that appears on the blog listing page.",
  content: `
    Write your full blog post content here using markdown-style formatting.
    
    You can use multiple paragraphs.
    
    ## Subheadings
    
    - Bullet points
    - Like this
    
    **Bold text** and *italic text* work too.
  `,
  category: "Fitness", // Options: Fitness, Nutrition, Wellness
  author: "Your Name",
  date: "Nov 18, 2025",
  readTime: "5 min read",
  image: "🏋️", // Use an emoji or later replace with image URL
  published: true
},
```

### Step 3: Fill in Your Information

**id**: Create a unique URL-friendly name (use lowercase and dashes)
- Example: `"5-tips-for-better-sleep"`
- This will be the URL: `yoursite.com/blog/5-tips-for-better-sleep`

**title**: Your blog post headline
- Example: `"5 Tips for Better Sleep and Recovery"`

**excerpt**: A short summary (1-2 sentences)
- This appears on the blog listing page
- Example: `"Quality sleep is essential for fitness recovery. Here are five proven strategies to improve your sleep quality."`

**content**: Your full blog post
- Write naturally, like you're talking to a friend
- Use `## ` for subheadings
- Use `- ` for bullet points
- Use `**text**` for bold
- Leave blank lines between paragraphs

**category**: Choose one:
- `"Fitness"` - Workouts, exercise, training
- `"Nutrition"` - Diet, meals, supplements
- `"Wellness"` - Mental health, recovery, lifestyle

**author**: Your name or coach name
- Example: `"Coach Sarah"`

**date**: Publication date
- Format: `"Nov 18, 2025"`

**readTime**: Estimated reading time
- Count words, divide by 200, round up
- Example: `"5 min read"`

**image**: For now, use an emoji
- Fitness: 🏋️ 💪 🏃 🚴 ⚡
- Nutrition: 🥗 🍎 🥑 🥩 💧
- Wellness: 😴 🧘 🧠 ❤️ 🌟

**published**: Set to `true` when ready to show
- Use `false` to save as draft

### Step 4: Add to the Array

Paste your new blog post inside the `blogPosts` array:

```typescript
export const blogPosts: BlogPost[] = [
  {
    id: "5-tips-for-better-sleep",
    title: "5 Tips for Better Sleep and Recovery",
    excerpt: "Quality sleep is essential for fitness recovery. Here are five proven strategies.",
    content: `
      Sleep is one of the most underrated aspects of fitness. While you're resting, your body repairs muscles, consolidates memories, and recharges for the next day.
      
      ## Why Sleep Matters
      
      During deep sleep, your body releases growth hormone, which is essential for muscle repair and growth. Poor sleep can lead to:
      
      - Decreased performance
      - Slower recovery
      - Increased injury risk
      - Reduced motivation
      
      ## 5 Tips for Better Sleep
      
      **1. Stick to a Schedule**
      Go to bed and wake up at the same time every day, even on weekends.
      
      **2. Create a Dark Environment**
      Use blackout curtains or an eye mask to block all light.
      
      **3. Cool Your Room**
      Keep your bedroom between 65-68°F for optimal sleep.
      
      **4. Limit Screen Time**
      Avoid phones and computers for at least 1 hour before bed.
      
      **5. Try Magnesium**
      Consider a magnesium supplement 30 minutes before bed.
      
      Start with one tip tonight and gradually add more. Your body will thank you!
    `,
    category: "Wellness",
    author: "Coach Sarah",
    date: "Nov 18, 2025",
    readTime: "4 min read",
    image: "😴",
    published: true
  },
  // Add more posts here
];
```

### Step 5: Save the File

Save `data/blog-posts.ts` and your blog post will automatically appear on the website!

---

## 🌟 Adding Success Stories

### Step 1: Get Client Permission

**IMPORTANT**: Always get written permission from clients before sharing their story!

### Step 2: Open the Success Stories Data File

Navigate to: `data/success-stories.ts`

### Step 3: Copy the Template

```typescript
{
  id: "unique-client-id",
  name: "Client Name (First name + Last initial)",
  age: 30,
  location: "City, MD",
  goal: "Their primary goal",
  achievement: "What they accomplished",
  timeframe: "How long it took",
  quote: "A powerful quote from the client about their experience with AFYA.",
  stats: [
    { label: "Stat 1", value: "Value" },
    { label: "Stat 2", value: "Value" },
    { label: "Stat 3", value: "Value" }
  ],
  image: "💪", // Use emoji or later replace with photo URL
  published: true
},
```

### Step 4: Fill in Client Information

**id**: Unique identifier
- Example: `"jessica-m-weight-loss"`

**name**: First name + Last initial for privacy
- Example: `"Jessica M."`

**age**: Client's age
- Example: `32`

**location**: City and state
- Example: `"Baltimore, MD"`

**goal**: What they wanted to achieve
- Example: `"Weight Loss & Strength"`

**achievement**: What they accomplished
- Example: `"Lost 45 lbs and gained confidence"`

**timeframe**: How long it took
- Example: `"6 months"`

**quote**: Client testimonial (get exact wording)
- Example: `"AFYA didn't just help me lose weight - they helped me build a sustainable, healthy lifestyle. I feel stronger and more energized than ever!"`

**stats**: Three key metrics (be specific!)
- Weight lost: `{ label: "Weight Lost", value: "45 lbs" }`
- Body fat: `{ label: "Body Fat", value: "-12%" }`
- Strength: `{ label: "Strength Gain", value: "+40%" }`
- Time: `{ label: "Marathon Time", value: "4:15:32" }`
- A1C: `{ label: "A1C Reduction", value: "-2.1%" }`

**image**: Use an emoji that represents their journey
- Weight loss: 💪 ⚡ 🌟
- Running: 🏃 🏅 🎯
- Strength: 🏋️ 💪 🔥
- Health: ❤️ 🩺 ✨
- Wellness: 🧘 🌈 😊

**published**: Set to `true` when ready

### Step 5: Real Example

```typescript
{
  id: "marcus-t-marathon",
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
  image: "🏃",
  published: true
},
```

### Step 6: Save the File

Save `data/success-stories.ts` and the story will appear on your website!

---

## 🎨 Using Real Photos (Future Enhancement)

Right now we're using emojis as placeholders. When you're ready to use real photos:

### For Blog Posts:
1. Add photos to `public/images/blog/`
2. Name them clearly: `sleep-tips.jpg`
3. Update the image field: `image: "/images/blog/sleep-tips.jpg"`

### For Success Stories:
1. Get client permission for photo use
2. Add photos to `public/images/success-stories/`
3. Name them: `jessica-m.jpg`
4. Update the image field: `image: "/images/success-stories/jessica-m.jpg"`

---

## ✅ Checklist Before Publishing

### Blog Posts:
- [ ] Content is well-written and proofread
- [ ] Category is correct (Fitness, Nutrition, or Wellness)
- [ ] Read time is accurate
- [ ] ID is unique and URL-friendly
- [ ] Excerpt is compelling
- [ ] `published: true` is set

### Success Stories:
- [ ] Client gave written permission
- [ ] Name uses first name + last initial only
- [ ] Quote is accurate (client's exact words)
- [ ] Stats are accurate and specific
- [ ] Story is inspiring and authentic
- [ ] `published: true` is set

---

## 🚀 Publishing Workflow

### Draft → Review → Publish

1. **Create Draft**: Set `published: false`
2. **Review**: Check content, spelling, accuracy
3. **Get Approval**: Show to client (for success stories)
4. **Publish**: Change to `published: true`
5. **Save File**: Content goes live immediately!

---

## 💡 Content Ideas

### Blog Post Topics:
- Workout routines for beginners
- Meal prep tips and recipes
- Recovery and rest day importance
- Motivation and mindset
- Common fitness myths debunked
- Equipment recommendations
- Seasonal fitness tips
- Goal-setting strategies

### Success Story Angles:
- Weight loss transformations
- Strength and muscle gain
- Marathon/race completions
- Health condition management (diabetes, etc.)
- Postpartum recovery
- Senior fitness achievements
- Mental health improvements
- Lifestyle changes

---

## 🆘 Troubleshooting

### "My blog post isn't showing up"
- Check that `published: true` is set
- Make sure the ID is unique
- Verify the file saved correctly
- Refresh your browser

### "I see a syntax error"
- Check for missing commas between posts
- Make sure quotes are properly closed
- Verify brackets `{ }` are balanced
- Look for the red squiggly lines in your editor

### "The formatting looks wrong"
- Use `## ` for subheadings (with space after ##)
- Use `- ` for bullet points (with space after -)
- Leave blank lines between paragraphs
- Use backticks for the content field: \`content\`

---

## 📞 Need Help?

If you get stuck:
1. Check the sample posts in the data files
2. Copy the exact format of working examples
3. Ask your developer for assistance
4. Keep it simple - you can always add more later!

---

## 🎯 Quick Start Guide

**Want to add your first blog post right now?**

1. Open `data/blog-posts.ts`
2. Copy the template
3. Fill in your information
4. Set `published: true`
5. Save the file
6. Refresh your website
7. Visit `/blog` to see it live!

**That's it! You're a content publisher now! 🎉**

---

*Remember: Start simple. You can always add more content and improve existing posts over time. The most important thing is to get started and share your expertise with your clients!*
