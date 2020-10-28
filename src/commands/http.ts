import axios from "axios";
import Flickr, { RawFlickrPhoto } from "flickr-sdk";
import { FLICKR_KEY } from "../utils/constants";
import { DatamuseWord, FlickrPhoto } from "./types";
import { noResult } from "../responses.json";

const DATAMUSE_API = 'https://api.datamuse.com/words'
const flickrClient = new Flickr(FLICKR_KEY);

function returnDefaultIfFailure(data: string): DatamuseWord[] {
  const response = JSON.parse(data);
  if (response.code) {
    return [{
      word: noResult,
    }]
  }
  return response;
}

export const datamuse = axios.create({
  baseURL: DATAMUSE_API,
  timeout: 2500,
  transformResponse: [returnDefaultIfFailure],
})

function createFlickrPhoto(photo: RawFlickrPhoto): FlickrPhoto {
  return {
    id: photo.id,
    url: photo.url_l,
  };
}

export const flickr = {
  async get(): Promise<FlickrPhoto[]> {
    const { body } = await flickrClient.interestingness.getList({ per_page: 50, extras: ['url_l'] });
    return body.photos.photo.map(createFlickrPhoto);
  }
}