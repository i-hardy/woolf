import dotenv from 'dotenv'

dotenv.config();

export const TOKEN = process.env.WOOLF_BOT_TOKEN;

export const FLICKR_KEY = process.env.FLICKR_API_KEY || '';

export const ROLE_NAME = 'sprinters';

export const ROLE_COLOR = 7_512_794;

// One hour default cache
export const CACHE_TIME = 60 * 60 * 1000;