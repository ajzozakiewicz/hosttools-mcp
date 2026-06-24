import { apiGet, type GetToken } from "./client.js";
import type { Review } from "../types/api.js";

interface GetReviewsResponse {
  count: number;
  listingID: string;
  reviews: Review[];
}

export async function getReviews(
  getToken: GetToken,
  listingId: string
): Promise<GetReviewsResponse> {
  return apiGet<GetReviewsResponse>(`/api/getReviews/${listingId}`, getToken);
}
