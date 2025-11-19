export interface SuccessStory {
  id: string;
  name: string;
  age: number;
  location: string;
  goal: string;
  achievement: string;
  timeframe: string;
  quote: string;
  stats: {
    label: string;
    value: string;
  }[];
  image: string;
  published: boolean;
}

/**
 * SUCCESS STORIES DATA
 * 
 * To add a new success story:
 * 1. Copy the template below
 * 2. Fill in all fields with real client information
 * 3. Get client permission to share their story
 * 4. Set published: true when ready to show
 * 5. Save this file
 * 
 * The story will automatically appear on /success-stories
 */

export const successStories: SuccessStory[] = [
  // TEMPLATE - Copy this to create new stories
  // {
  //   id: "unique-client-id",
  //   name: "Client Name (First name + Last initial)",
  //   age: 30,
  //   location: "City, MD",
  //   goal: "Their primary goal",
  //   achievement: "What they accomplished",
  //   timeframe: "How long it took",
  //   quote: "A powerful quote from the client about their experience with AFYA.",
  //   stats: [
  //     { label: "Stat 1", value: "Value" },
  //     { label: "Stat 2", value: "Value" },
  //     { label: "Stat 3", value: "Value" }
  //   ],
  //   image: "💪", // Use emoji or later replace with photo URL
  //   published: true
  // },
];
