import { Platform } from '@/types/DailySnapshot';

export const PLATFORMS: Platform[] = [
  'instagram',
  'facebook',
  'tiktok',
  'x'
];

export const PLATFORM_SOURCES: Record<Platform, string[]> = {
  instagram: ['r/Instagram', 'r/socialmedia'],
  facebook: ['r/facebook', 'r/socialmedia'],
  tiktok: ['r/TikTok', 'r/socialmedia'],
  x: ['r/Twitter', 'r/socialmedia']
};
