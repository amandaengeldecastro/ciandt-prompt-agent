# 🍃 Calculadora EcoTrip: Simulador de Impacto Ambiental para Viagens

Calculadora web que estima as emissões de CO₂ de uma viagem com base na rota real por estrada e no modal de transporte escolhido, exibindo comparações entre modais e informações sobre compensação de carbono.

Desenvolvido para a **DIO** | Projeto GitHub — gerado com **Claude** (not Copilot)

---

## Funcionalidades

- Busca dinâmica de cidades brasileiras via **Nominatim (OpenStreetMap)**
- Cálculo automático da distância real por estrada via **OSRM**
- Opção de inserir a distância manualmente como fallback
- Seleção do modal de transporte: 🚲 bicicleta, 🚗 carro, 🚌 ônibus ou 🚚 caminhão
- Exibição do resultado de emissão de CO₂
- Comparação visual entre todos os modais (barras proporcionais)
- Métricas de compensação: custo em R$, árvores necessárias por ano, km equivalente de carro

---

## APIs utilizadas (gratuitas, sem chave)

| API | Uso |
|---|---|
| [Nominatim](https://nominatim.openstreetmap.org) | Autocomplete de cidades brasileiras em tempo real |
| [OSRM](https://router.project-osrm.org) | Distância real por estrada entre as cidades selecionadas |

---

## Estrutura do projeto

```
calculadora-ecotrip/
├── index.html
├── css/
│   └── style.css          # Tema EcoTrip, CSS variables, responsivo
└── js/
    ├── routes-data.js      # Clientes das APIs Nominatim e OSRM
    ├── config.js           # Fatores de emissão e configurações
    ├── calculator.js       # Lógica de cálculo de CO₂ e métricas
    ├── ui.js               # Autocomplete, renderização dos resultados
    └── app.js              # Inicialização, eventos e orquestração
```

---

## Como usar

1. Clone o repositório
2. Abra `index.html` no navegador — **não requer servidor, build ou dependências**
3. Digite a cidade de origem (mín. 3 letras) e selecione na lista
4. Faça o mesmo para o destino — a distância é calculada automaticamente
5. Escolha o modal de transporte
6. Clique em **Calcular emissão**

> Se a rota não for encontrada pelas APIs, marque **"Inserir distância manualmente"** e informe o valor.

---

## Fatores de emissão utilizados

| Modal | g CO₂ / km | Fonte |
|---|---|---|
| Bicicleta | 0 | — |
| Carro | 171 | CETESB 2023 |
| Ônibus | 89 | IPCC Transport |
| Caminhão | 800 | IPCC Transport |

Crédito de carbono calculado a **R$ 50 / tonelada CO₂** — referência do mercado voluntário brasileiro.

---

## Tecnologias

- HTML5 semântico com nomenclatura **BEM**
- CSS3 com custom properties (design tokens)
- JavaScript vanilla (ES6+), sem frameworks ou dependências externas
