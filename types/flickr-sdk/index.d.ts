declare module 'flickr-sdk' {
  type RawFlickrPhoto = {
    id: string;
    server: string;
    secret: string;
    url_l?: string;
  }

  type RawFlickrResponse = {
    body: {
      photos: {
        photo: RawFlickrPhoto[]
      }
    }
  }

  type FlickerExtraParam = 'description' | 'license' | 'date_upload' | 'date_taken' | 'owner_name' | 'icon_server' | 'original_format' | 'last_update' | 'geo' | 'tags' | 'machine_tags' | 'o_dims' | 'views' | 'media' | 'path_alias' | 'url_sq' | 'url_t' | 'url_s' | 'url_q' | 'url_m' | 'url_n' | 'url_z' | 'url_c' | 'url_l' | 'url_o';

  type FlickrInterestingnessParams = {
    date?: string;
    extras?: FlickerExtraParam[]
    per_page?: number;
    page?: number;
  }

  interface FlickrInterestingness {
    getList(params: FlickrInterestingnessParams): RawFlickrResponse;
  }

  export default class Flickr {
    constructor(apiKey: string);
    interestingness: FlickrInterestingness;
  }

  export as namespace flickrSdk;
}
