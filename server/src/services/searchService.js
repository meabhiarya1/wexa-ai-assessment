import { fetchSearchResults } from "../repositories/searchRepository.js";

export async function searchAll(term) {
  return fetchSearchResults(term);
}
