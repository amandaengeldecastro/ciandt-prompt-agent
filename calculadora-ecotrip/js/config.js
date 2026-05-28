// CO2 emission factors in grams per km (per passenger / per vehicle for truck)
// Sources: CETESB 2023, IPCC Transport Chapter
const EMISSION_FACTORS = {
  bicycle: 0,
  car:     171,   // average gasoline passenger car, Brazil
  bus:     89,    // intercity bus, per passenger
  truck:   800,   // heavy goods vehicle, per trip
};

const TRANSPORT_LABELS = {
  bicycle: { label: "Bicicleta", icon: "🚲" },
  car:     { label: "Carro",     icon: "🚗" },
  bus:     { label: "Ônibus",    icon: "🚌" },
  truck:   { label: "Caminhão",  icon: "🚚" },
};

// Average CO2 absorbed by one tree per year (kg) — IPCC reference
const KG_CO2_PER_TREE_YEAR = 21;

// Carbon credit price in BRL per metric ton CO2 — voluntary Brazilian market
const CARBON_CREDIT_BRL_PER_TON = 50;
