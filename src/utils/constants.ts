import dotenv from 'dotenv';

dotenv.config();

type Environment =
  | 'development'
  | 'production';

export const ENV: Environment = process.env.NODE_ENV as Environment || 'development';

export const TOKEN = process.env.WOOLF_BOT_TOKEN || '';

export const CLIENT_ID = process.env.WOOLF_CLIENT_ID || '';

export const FLICKR_KEY = process.env.FLICKR_API_KEY || '';

export const LOGGLY_KEY = process.env.LOGGLY_KEY || '';

export const ROLE_NAME = 'sprinters';

export const ROLE_COLOR = 7_512_794;

// 24 hours default cache
export const CACHE_TIME = 24 * 60 * 60 * 1000;

export const DEFAULT_TIMEOUT = 5000;
