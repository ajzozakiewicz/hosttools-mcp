import { apiGet, apiPost, apiDelete, type GetToken } from './client.js'

interface WebhookResponse {
  webhookURL: string;
}

export async function getWebhook(getToken: GetToken): Promise<WebhookResponse> {
  return apiGet<WebhookResponse>('/api/getWebhook', getToken)
}

export async function setWebhook(
  getToken: GetToken,
  webhookURL: string
): Promise<{ success: boolean }> {
  return apiPost('/api/setWebhook', getToken, { webhookURL })
}

export async function deleteWebhook(getToken: GetToken): Promise<{ success: boolean }> {
  return apiDelete('/api/deleteWebhook', getToken)
}
