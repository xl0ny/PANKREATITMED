import { httpGet } from "./client";

interface CartResponse {
  pankreatit_order_id: number;
  criteria_amount: number;
}

/**
 * Get draft order info from backend
 * Endpoint: GET /api/pankreatitorders/cart
 * Uses JWT token from localStorage if auth=true
 */
export async function getDraftOrderId(options?: { 
  timeoutMs?: number;
  auth?: boolean;
}): Promise<CartResponse> {
  const url = `/api/pankreatitorders/cart`;
  return await httpGet<CartResponse>(url, {
    timeoutMs: options?.timeoutMs,
    auth: options?.auth
  });
}

export default getDraftOrderId;
