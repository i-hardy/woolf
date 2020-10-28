import axios from "axios";
import { DatamuseWord } from "./types";
import { noResult } from "../responses.json";

const DATAMUSE_API = 'https://api.datamuse.com/words'

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