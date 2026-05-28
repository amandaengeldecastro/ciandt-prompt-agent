const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const OSRM      = "https://router.project-osrm.org/route/v1/driving";

async function searchCities(query) {
  const params = new URLSearchParams({
    q:              query,
    format:         "json",
    countrycodes:   "br",
    limit:          "8",
    addressdetails: "1",
  });

  const res = await fetch(`${NOMINATIM}?${params}`);
  if (!res.ok) throw new Error("Falha na busca de cidades");

  const data = await res.json();

  const cityTypes = new Set(["city", "town", "village", "municipality", "administrative"]);
  const seen      = new Set();

  return data
    .filter(item => cityTypes.has(item.type) || cityTypes.has(item.addresstype))
    .map(item => {
      const addr     = item.address ?? {};
      const name     = addr.city ?? addr.town ?? addr.village ?? addr.municipality
                       ?? item.display_name.split(",")[0].trim();
      const state    = addr.state ?? "";
      const label    = state ? `${name}, ${state}` : name;
      return { label, lat: parseFloat(item.lat), lon: parseFloat(item.lon) };
    })
    .filter(item => {
      if (seen.has(item.label)) return false;
      seen.add(item.label);
      return true;
    })
    .slice(0, 6);
}

async function getRoadDistanceKm(coordA, coordB) {
  const url = `${OSRM}/${coordA.lon},${coordA.lat};${coordB.lon},${coordB.lat}?overview=false`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha ao calcular rota");

  const data = await res.json();
  if (data.code !== "Ok" || !data.routes?.length) throw new Error("Rota não encontrada");

  return Math.round(data.routes[0].distance / 1000);
}
