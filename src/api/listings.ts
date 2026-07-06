import { apiGet, apiPost, type GetToken } from './client.js'
import type { Listing, Calendar, PriceEntry, ListingGroup } from '../types/api.js'

interface GetListingsResponse {
  listings: Listing[];
  userID: string;
}

export async function getListings(
  getToken: GetToken,
  startDate?: string,
  endDate?: string
): Promise<Listing[]> {
  const query: Record<string, string> = {}
  if (startDate) query.startDate = startDate
  if (endDate) query.endDate = endDate
  const res = await apiGet<GetListingsResponse>('/api/getListings', getToken, query)
  return res.listings
}

export async function getListing(getToken: GetToken, listingId: string): Promise<Listing> {
  return apiGet<Listing>(`/api/getListing/${listingId}`, getToken)
}

export async function updateListing(
  getToken: GetToken,
  listingId: string,
  updates: Partial<Listing>
): Promise<{ success: boolean; syncPushed?: boolean }> {
  return apiPost(`/api/setListing/${listingId}`, getToken, updates)
}

export async function getCalendar(
  getToken: GetToken,
  listingId: string,
  startDate: string,
  endDate: string
): Promise<Calendar> {
  return apiGet<Calendar>(`/api/getCalendar/${listingId}/${startDate}/${endDate}`, getToken)
}

export async function setPrices(
  getToken: GetToken,
  listingId: string,
  prices: PriceEntry[]
): Promise<{ success: boolean }> {
  return apiPost(`/api/setPrices/${listingId}`, getToken, { prices })
}

export async function getListingGroups(getToken: GetToken): Promise<ListingGroup[]> {
  return apiGet<ListingGroup[]>('/api/listingGroups', getToken)
}

export async function getListingGroup(
  getToken: GetToken,
  groupId: string
): Promise<ListingGroup> {
  return apiGet<ListingGroup>(`/api/getListingGroup/${groupId}`, getToken)
}
