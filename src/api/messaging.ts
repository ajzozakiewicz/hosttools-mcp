import { apiPost, type GetToken } from './client.js'

export async function sendMessage(
  getToken: GetToken,
  reservationId: string,
  message: string
): Promise<{ success: boolean }> {
  return apiPost(`/api/sendMessage/${reservationId}`, getToken, { message })
}
