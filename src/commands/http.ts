import axios, { AxiosError } from "axios";
import { setupCache } from "axios-cache-adapter";
import { FLICKR_KEY, CACHE_TIME, DEFAULT_TIMEOUT } from "../utils/constants";

const DATAMUSE_API = 'https://api.datamuse.com/words'
const FLICKR_API = 'https://www.flickr.com/services/rest'

const datamuseCache = setupCache({
  maxAge: CACHE_TIME,
  exclude: { query: false },
  readOnError: (error: AxiosError) => {
    return error.response?.status && error.response.status >= 400 && error.response.status < 600
  },
});

export const datamuse = axios.create({
  adapter: datamuseCache.adapter,
  baseURL: DATAMUSE_API,
  timeout: DEFAULT_TIMEOUT,
});

const flickrCache = setupCache({
  maxAge: CACHE_TIME,
  exclude: { query: false },
  readOnError: (error: AxiosError) => {
    return error.response?.status && error.response.status >= 400 && error.response.status < 600
  },
});

export const flickr = axios.create({
  adapter: flickrCache.adapter,
  baseURL: FLICKR_API,
  timeout: DEFAULT_TIMEOUT,
  params: {
    api_key: FLICKR_KEY,
    method: 'flickr.interestingness.getList',
    extras: 'url_l',
    format: 'json',
    nojsoncallback: 1
  }
});
