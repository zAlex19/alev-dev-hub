export function createOrderSubmitter(api) {
  let inFlight = false;

  return async function submitOrder(payload) {
    if (inFlight) {
      return { ok: false, reason: "in_flight" };
    }

    inFlight = true;
    try {
      const response = await api(payload);
      return { ok: true, id: response.id };
    } finally {
      inFlight = false;
    }
  };
}
