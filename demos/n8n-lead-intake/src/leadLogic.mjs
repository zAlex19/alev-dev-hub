export function normalizeLead(input = {}) {
  const name = String(input.name ?? "").trim();
  const email = String(input.email ?? "").trim().toLowerCase();
  const company = String(input.company ?? "").trim();
  const budget = Number(input.budget ?? 0);

  return {
    name,
    email,
    company,
    budget: Number.isFinite(budget) ? Math.max(0, budget) : 0,
    valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  };
}

export function routeLead(lead) {
  if (!lead.valid) return { route: "reject", priority: "none" };
  if (lead.budget >= 1000) return { route: "sales", priority: "high" };
  if (lead.budget >= 250) return { route: "sales", priority: "normal" };
  return { route: "nurture", priority: "low" };
}
