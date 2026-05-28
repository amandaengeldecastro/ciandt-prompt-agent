document.addEventListener("DOMContentLoaded", () => {
  const originInput    = document.getElementById("origin");
  const destInput      = document.getElementById("destination");
  const manualCheckbox = document.getElementById("manual-distance");
  const form           = document.getElementById("calculator-form");

  // Stores the coordinates of each selected city
  const selectedCities = { origin: null, destination: null };

  function debounce(fn, delay) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
  }

  async function tryAutoFillDistance() {
    if (manualCheckbox.checked) return;
    const { origin, destination } = selectedCities;
    if (!origin || !destination) return;

    showDistanceLoading();
    try {
      const km = await getRoadDistanceKm(origin, destination);
      setDistanceValue(km);
    } catch {
      setDistanceValue(null);
    } finally {
      resetDistanceHelper();
    }
  }

  function makeSearchHandler(inputEl, dropdownId, field) {
    return debounce(async () => {
      const query = inputEl.value.trim();

      if (query.length < 3) { hideAutocomplete(dropdownId); return; }

      // User is editing after a previous selection — clear stored coords
      if (selectedCities[field]?.label !== query) selectedCities[field] = null;

      showAutocompleteLoading(dropdownId);
      try {
        const cities = await searchCities(query);
        renderAutocomplete(dropdownId, cities, city => {
          selectedCities[field] = city;
          inputEl.value = city.label;
          hideAutocomplete(dropdownId);
          tryAutoFillDistance();
        });
      } catch {
        hideAutocomplete(dropdownId);
      }
    }, 350);
  }

  originInput.addEventListener("input", makeSearchHandler(originInput, "origin-dropdown", "origin"));
  destInput.addEventListener("input",   makeSearchHandler(destInput,   "destination-dropdown", "destination"));

  originInput.addEventListener("blur", () => setTimeout(() => hideAutocomplete("origin-dropdown"),      150));
  destInput.addEventListener("blur",   () => setTimeout(() => hideAutocomplete("destination-dropdown"), 150));

  manualCheckbox.addEventListener("change", () => {
    toggleManualDistanceInput(manualCheckbox.checked);
    if (!manualCheckbox.checked) tryAutoFillDistance();
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const origin      = originInput.value.trim();
    const destination = destInput.value.trim();
    const distance    = parseFloat(document.getElementById("distance").value);
    const transport   = document.querySelector('input[name="transport"]:checked')?.value;

    if (!origin || !destination) {
      alert("Por favor, informe a cidade de origem e o destino.");
      return;
    }
    if (!distance || distance <= 0) {
      alert("Distância inválida. Selecione uma cidade da lista ou ative a inserção manual.");
      return;
    }
    if (!transport) {
      alert("Selecione um modo de transporte.");
      return;
    }

    hideAllResults();

    const emissions = calculateEmissions(distance, transport);
    const allModes  = calculateAllModes(distance);

    renderResults(emissions, origin, destination, transport);
    renderComparison(allModes, transport);
    renderCarbonCredits(emissions.kg);

    document.getElementById("results").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
