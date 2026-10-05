export function createOrderSubmitter(api) {
  return async function submitOrder(payload) {
    const response = await api(payload);
    return { ok: true, id: response.id };
  };
}
