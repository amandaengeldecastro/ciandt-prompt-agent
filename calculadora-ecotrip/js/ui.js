/* ── Autocomplete ─────────────────────────────────────── */

function renderAutocomplete(dropdownId, items, onSelect) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.innerHTML = "";

  if (items.length === 0) {
    dropdown.innerHTML = `<li class="autocomplete__message">Nenhuma cidade encontrada</li>`;
    dropdown.classList.remove("hidden");
    return;
  }

  items.forEach(item => {
    const li = document.createElement("li");
    li.className = "autocomplete__item";
    li.setAttribute("role", "option");
    li.textContent = item.label;
    li.addEventListener("mousedown", e => {
      e.preventDefault(); // prevent blur before click
      onSelect(item);
    });
    dropdown.appendChild(li);
  });

  dropdown.classList.remove("hidden");
}

function showAutocompleteLoading(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.innerHTML = `<li class="autocomplete__message">🔍 Buscando cidades...</li>`;
  dropdown.classList.remove("hidden");
}

function hideAutocomplete(dropdownId) {
  document.getElementById(dropdownId).classList.add("hidden");
}

/* ── Distance helper ──────────────────────────────────── */

function showDistanceLoading() {
  const helper = document.querySelector(".calculator-form__helper");
  helper.textContent = "⏳ Calculando distância por estrada...";
  helper.classList.add("calculator-form__helper--loading");
}

function resetDistanceHelper() {
  const helper = document.querySelector(".calculator-form__helper");
  helper.textContent = "A distância será preenchida automaticamente";
  helper.classList.remove("calculator-form__helper--loading");
}

/* ── Form helpers ─────────────────────────────────────── */

function setDistanceValue(km) {
  document.getElementById("distance").value = km ?? "";
}

function toggleManualDistanceInput(enabled) {
  const input = document.getElementById("distance");
  if (enabled) {
    input.removeAttribute("readonly");
    input.classList.remove("calculator-form__input--readonly");
    input.value = "";
    input.focus();
  } else {
    input.setAttribute("readonly", "");
    input.classList.add("calculator-form__input--readonly");
  }
}

function showSection(id) {
  document.getElementById(id).classList.remove("hidden");
}

function hideAllResults() {
  ["results", "comparison", "carbon-credits"].forEach(id =>
    document.getElementById(id).classList.add("hidden")
  );
}

/* ── Result renderers ─────────────────────────────────── */

function renderResults(emissions, origin, destination, transport) {
  const { label, icon } = TRANSPORT_LABELS[transport];
  const { value, unit } = formatEmission(emissions.kg);
  const isZero = emissions.kg === 0;

  document.getElementById("results-content").innerHTML = `
    <h2 class="results__title">📊 Resultado da Emissão</h2>
    <p style="font-size:.875rem;color:var(--color-text-muted);margin-bottom:.85rem">
      ${origin} → ${destination} &nbsp;·&nbsp; ${icon} ${label}
    </p>
    <div class="result-card${isZero ? " result-card--zero" : ""}">
      <span class="result-card__label">CO₂ emitido</span>
      <span>
        <span class="result-card__value">${isZero ? "Nenhuma" : value}</span>
        ${isZero ? "" : `<span class="result-card__unit"> ${unit}</span>`}
      </span>
    </div>
    ${isZero
      ? `<p style="font-size:.875rem;color:var(--color-success);margin-top:.5rem">
           🌱 Ótima escolha! Bicicleta não emite CO₂.
         </p>`
      : ""}
  `;
  showSection("results");
}

function renderComparison(allModes, selectedMode) {
  const maxKg = Math.max(...allModes.map(m => m.kg));

  const items = allModes.map(({ mode, kg }) => {
    const { label, icon } = TRANSPORT_LABELS[mode];
    const pct      = maxKg > 0 ? (kg / maxKg) * 100 : 0;
    const isZero   = kg === 0;
    const isActive = mode === selectedMode;
    const { value, unit } = formatEmission(kg);

    return `
      <li class="comparison-item${isZero ? " comparison-item--zero" : ""}${isActive ? " comparison-item--active" : ""}">
        <div class="comparison-item__header">
          <span class="comparison-item__name">${icon} ${label}</span>
          <span class="comparison-item__value">${isZero ? "0 g CO₂" : `${value} ${unit}`}</span>
        </div>
        <div class="comparison-item__bar-track">
          <div class="comparison-item__bar-fill" style="width:${pct.toFixed(1)}%"></div>
        </div>
      </li>`;
  }).join("");

  document.getElementById("comparions-content").innerHTML = `
    <h2 class="comparison__title">⚖️ Comparação entre Modais</h2>
    <ul class="comparison-list">${items}</ul>
  `;
  showSection("comparison");
}

function renderCarbonCredits(emissionKg) {
  const contentEl = document.getElementById("carbon-credits-content");

  if (emissionKg === 0) {
    contentEl.innerHTML = `
      <h2 class="carbon-credits__title">🌳 Créditos de Carbono</h2>
      <p style="font-size:.9rem;color:var(--color-success)">
        Nenhuma emissão — nenhum crédito necessário. Continue pedalando! 🚲
      </p>`;
    showSection("carbon-credits");
    return;
  }

  const { tons, creditCost, treesNeeded, carKmEquiv } = calculateCarbonMetrics(emissionKg);
  const tonDisplay = tons < 0.01
    ? `${(tons * 1_000).toFixed(2)} kg`
    : `${tons.toFixed(4)} t`;

  contentEl.innerHTML = `
    <h2 class="carbon-credits__title">🌳 Créditos de Carbono</h2>
    <div class="credits-grid">
      <div class="credits-card">
        <span class="credits-card__icon">🏭</span>
        <span class="credits-card__label">Total emitido</span>
        <span class="credits-card__value">${tonDisplay} CO₂</span>
      </div>
      <div class="credits-card">
        <span class="credits-card__icon">💰</span>
        <span class="credits-card__label">Custo p/ neutralizar</span>
        <span class="credits-card__value">R$ ${creditCost.toFixed(2)}</span>
      </div>
      <div class="credits-card">
        <span class="credits-card__icon">🌳</span>
        <span class="credits-card__label">Árvores necessárias / ano</span>
        <span class="credits-card__value">${treesNeeded.toFixed(1)}</span>
      </div>
      <div class="credits-card">
        <span class="credits-card__icon">🚗</span>
        <span class="credits-card__label">Equivale a dirigir</span>
        <span class="credits-card__value">${Math.round(carKmEquiv)} km</span>
      </div>
    </div>
    <p class="credits-tip">
      💡 Crédito de carbono calculado a R$ ${CARBON_CREDIT_BRL_PER_TON}/t CO₂ — referência do mercado voluntário brasileiro.
    </p>
  `;
  showSection("carbon-credits");
}
