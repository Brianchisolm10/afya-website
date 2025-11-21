/**
 * Health Tools Configuration
 * 
 * This module defines the configuration and metadata for all health tools
 */

export interface ToolConfig {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  gradient: string; // Tailwind gradient classes
  category: 'nutrition' | 'movement' | 'recovery' | 'youth';
  order: number;
  isActive: boolean;
}

/**
 * Configuration for all health tools
 */
export const TOOL_CONFIGS: ToolConfig[] = [
  {
    id: 'energy-protein',
    title: 'Daily Energy & Protein Needs',
    description: 'Find your calorie and protein starting point',
    icon: 'Utensils',
    gradient: 'from-teal-500 to-cyan-600', // Vibrant turquoise gradient
    category: 'nutrition',
    order: 1,
    isActive: true,
  },
  {
    id: 'plate-builder',
    title: 'Plate Builder',
    description: 'Learn balanced meal proportions',
    icon: 'Pizza',
    gradient: 'from-purple-500 to-indigo-600', // Vibrant lavender/purple gradient
    category: 'nutrition',
    order: 2,
    isActive: true,
  },
  {
    id: 'hydration-sleep',
    title: 'Hydration & Sleep Snapshot',
    description: 'Check your recovery habits',
    icon: 'Droplets',
    gradient: 'from-blue-500 to-teal-600', // Blue to turquoise gradient
    category: 'recovery',
    order: 3,
    isActive: true,
  },
  {
    id: 'heart-rate-zones',
    title: 'Heart Rate Zone Finder',
    description: 'Know your training intensities',
    icon: 'Heart',
    gradient: 'from-rose-500 to-pink-600', // Vibrant coral/pink gradient
    category: 'movement',
    order: 4,
    isActive: true,
  },
  {
    id: 'recovery-checkin',
    title: 'Stress & Recovery Check-In',
    description: 'Assess your readiness to train',
    icon: 'Activity',
    gradient: 'from-violet-500 to-purple-600', // Vibrant purple gradient
    category: 'recovery',
    order: 5,
    isActive: true,
  },
  {
    id: 'youth-corner',
    title: 'Youth Corner',
    description: 'Balance screen time and play',
    icon: 'Users',
    gradient: 'from-emerald-500 to-teal-600', // Vibrant green to turquoise
    category: 'youth',
    order: 6,
    isActive: true,
  },
];

/**
 * Get tool configuration by ID
 */
export function getToolConfig(id: string): ToolConfig | undefined {
  return TOOL_CONFIGS.find((tool) => tool.id === id);
}

/**
 * Get all active tools
 */
export function getActiveTools(): ToolConfig[] {
  return TOOL_CONFIGS.filter((tool) => tool.isActive).sort((a, b) => a.order - b.order);
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: ToolConfig['category']): ToolConfig[] {
  return TOOL_CONFIGS.filter((tool) => tool.category === category && tool.isActive).sort(
    (a, b) => a.order - b.order
  );
}
