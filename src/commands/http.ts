import axios, { AxiosError } from "axios";
import { setupCache } from "axios-cache-adapter";
import { FLICKR_KEY, CACHE_TIME } from "../utils/constants";
import { DatamuseWord } from "./types";
import { noResult } from "../responses.json";

const DATAMUSE_API = 'https://api.datamuse.com/words'
const FLICKR_API = 'https://www.flickr.com/services/rest'

function returnDefaultIfFailure(data: string): DatamuseWord[] {
  const response = JSON.parse(data);
  if (response.code) {
    return [{
      word: noResult,
    }]
  }
  return response;
}

const datamuseCache = setupCache({
  maxAge: CACHE_TIME,
  readOnError: (error: AxiosError) => {
    return error.response?.status && error.response.status >= 400 && error.response.status < 600
  },
});

export const datamuse = axios.create({
  adapter: datamuseCache.adapter,
  baseURL: DATAMUSE_API,
  timeout: 2500,
  transformResponse: [returnDefaultIfFailure],
});

const flickrCache = setupCache({
  maxAge: CACHE_TIME,
  readOnError: (error: AxiosError) => {
    return error.response?.status && error.response.status >= 400 && error.response.status < 600
  },
});

export const flickr = axios.create({
  adapter: flickrCache.adapter,
  baseURL: FLICKR_API,
  timeout: 2500,
  params: {
    api_key: FLICKR_KEY,
    method: 'flickr.interestingness.getList',
    extras: 'url_l',
    format: 'json',
    nojsoncallback: 1
  }
});
