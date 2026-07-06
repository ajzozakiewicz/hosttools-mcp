import { apiGet, apiPost, type GetToken } from './client.js'
import type { Reservation, GuestCounts, PricingQuote } from '../types/api.js'

interface GetReservationsResponse {
  reservations: Reservation[];
  userID: string;
}

export async function getReservations(
  getToken: GetToken,
  listingId: string,
  startDate: string,
  endDate: string
): Promise<Reservation[]> {
  const res = await apiGet<GetReservationsResponse>(
    `/api/getReservations/${listingId}/${startDate}/${endDate}`,
    getToken
  )
  return res.reservations
}

export async function getReservation(
  getToken: GetToken,
  reservationId: string
): Promise<Reservation> {
  return apiGet<Reservation>(`/api/getReservation/${reservationId}`, getToken)
}

export interface CreateReservationInput {
  listingID: string;
  startDate: string;
  endDate: string;
  confirmationCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  guests: GuestCounts;
  hostPayout: number;
  guestPrice: number;
  status?: 'inquiry' | 'pending' | 'accepted';
  notes?: string;
  checkInTime?: number;
  checkOutTime?: number;
}

export async function createReservation(
  getToken: GetToken,
  input: CreateReservationInput
): Promise<{ success: boolean; reservationID: string }> {
  return apiPost('/api/createReservation', getToken, input)
}

export interface UpdateReservationInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  accessCode?: string | null;
  checkInTime?: number;
  checkOutTime?: number;
  notes?: string;
  guideBookURL?: string | null;
  verificationURL?: string | null;
  verificationStatus?: string | null;
  incidentURL?: string | null;
}

export async function updateReservation(
  getToken: GetToken,
  reservationId: string,
  updates: UpdateReservationInput
): Promise<{ success: boolean }> {
  return apiPost(`/api/setReservation/${reservationId}`, getToken, updates)
}

export async function cancelReservation(
  getToken: GetToken,
  reservationId: string
): Promise<{ success: boolean }> {
  return apiPost(`/api/cancelReservation/${reservationId}`, getToken, {})
}

export async function getPricingQuote(
  getToken: GetToken,
  listingId: string,
  startDate: string,
  endDate: string,
  guests: GuestCounts
): Promise<PricingQuote> {
  return apiPost<PricingQuote>(`/api/getQuote/${listingId}`, getToken, {
    startDate,
    endDate,
    guests,
  })
}
