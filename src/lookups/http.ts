import axios from "axios";

const DATAMUSE_API = 'https://api.datamuse.com/words'

export const datamuse = axios.create({
  baseURL: DATAMUSE_API,
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
})