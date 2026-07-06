import { apiGet, type GetToken } from './client.js'
import type { User } from '../types/api.js'

export function getUser(getToken: GetToken): Promise<User> {
  return apiGet<User>('/api/getUser', getToken)
}
