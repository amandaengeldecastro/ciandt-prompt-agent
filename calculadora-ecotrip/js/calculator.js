function calculateEmissions(distanceKm, transportMode) {
  const factorGPerKm = EMISSION_FACTORS[transportMode] ?? 0;
  const grams = factorGPerKm * distanceKm;
  return {
    grams,
    kg:   grams / 1_000,
    tons: grams / 1_000_000,
  };
}

function calculateAllModes(distanceKm) {
  return Object.keys(EMISSION_FACTORS).map(mode => ({
    mode,
    ...calculateEmissions(distanceKm, mode),
  }));
}

function calculateCarbonMetrics(emissionKg) {
  const tons         = emissionKg / 1_000;
  const creditCost   = tons * CARBON_CREDIT_BRL_PER_TON;
  const treesNeeded  = emissionKg / KG_CO2_PER_TREE_YEAR;
  const carKmEquiv   = emissionKg * (1_000 / EMISSION_FACTORS.car);
  return { tons, creditCost, treesNeeded, carKmEquiv };
}

function formatEmission(kg) {
  if (kg === 0)   return { value: "0", unit: "g CO₂" };
  if (kg < 1)     return { value: (kg * 1_000).toFixed(0), unit: "g CO₂" };
  if (kg < 1_000) return { value: kg.toFixed(2), unit: "kg CO₂" };
  return           { value: (kg / 1_000).toFixed(3), unit: "t CO₂" };
}
