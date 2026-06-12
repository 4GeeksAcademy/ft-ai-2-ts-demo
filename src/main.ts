import "./style.css";
import { findFlatRateShippingOpportunities } from "./flat_rate";

// Step 1: create a small sample catalog that matches IProduct.
// This gives students concrete data to experiment with.
const SAMPLE_PRODUCTS: IProduct[] = [
  {
    sku: "STB-100",
    name: "Stainless Water Bottle",
    cost: 11,
    dims: { width: 4, height: 4, depth: 10 },
    priceDetails: { minAdvPrice: 39.99, msrp: 45 },
  },
  {
    sku: "HPH-220",
    name: "Over-Ear Headphones",
    cost: 44,
    dims: { width: 8, height: 4, depth: 7 },
    priceDetails: { minAdvPrice: 99, msrp: 129.99 },
  },
  {
    sku: "DCK-310",
    name: "USB-C Docking Station",
    cost: 57,
    dims: { width: 6, height: 2, depth: 8 },
    priceDetails: { minAdvPrice: 89.99, msrp: 109.99 },
  },
  {
    sku: "MON-450",
    name: "27in 4K Monitor",
    cost: 180,
    dims: { width: 26, height: 17, depth: 6 },
    priceDetails: { minAdvPrice: 289.99, msrp: 349.99 },
  },
  {
    sku: "CAB-001",
    name: "Braided USB-C Cable",
    cost: 2.5,
    dims: { width: 5, height: 0.75, depth: 5 },
    priceDetails: { minAdvPrice: 14.99, msrp: 19.99 },
  },
  {
    sku: "NLL-999",
    name: "Legacy Accessory (No MAP)",
    cost: 8,
    dims: { width: 6, height: 2, depth: 4 },
    priceDetails: { minAdvPrice: null, msrp: 12.99 },
  },
];

// Step 2: use a reusable currency formatter for consistent UI output.
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// Step 3: render one product card with all qualifying shipping rates.
const renderOpportunityCard = (opportunity: IFlatRateOpportunity): string => {
  const mapValue = opportunity.product.priceDetails.minAdvPrice as number;

  // Step 3a: find the cheapest qualifying rate cost for this product.
  // If two rates tie, both should be highlighted.
  const cheapestRateCost = Math.min(
    ...opportunity.qualifyingRates.map((rate) => rate.cost),
  );

  const rateList = opportunity.qualifyingRates
    .map((rate) => {
      const isCheapest = rate.cost === cheapestRateCost;
      const listItemClass = isCheapest
        ? "rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm"
        : "rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm";
      const cheapestBadge = isCheapest
        ? '<span class="inline-flex rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">Cheapest</span>'
        : "";

      return `
        <li class="${listItemClass}">
          <div class="mb-1 flex items-center justify-between gap-2">
          <p class="font-medium text-slate-800">${rate.service}</p>
            ${cheapestBadge}
          </div>
          <p class="text-slate-600">Cost: ${money.format(rate.cost)} | Delivery: ${rate.deliveryDays} day(s)</p>
        </li>
      `;
    })
    .join("");

  return `
    <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <header class="mb-3">
        <div class="mb-1 flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-lg font-semibold text-slate-900">${opportunity.product.name}</h2>
          <span class="inline-flex rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">Has Flat-Rate Opportunities</span>
        </div>
        <p class="text-sm text-slate-600">SKU: ${opportunity.product.sku}</p>
      </header>

      <div class="mb-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
        <p class="rounded-md bg-slate-100 px-3 py-2">Cost: <strong>${money.format(opportunity.product.cost)}</strong></p>
        <p class="rounded-md bg-slate-100 px-3 py-2">MAP: <strong>${money.format(mapValue)}</strong></p>
        <p class="rounded-md bg-emerald-50 px-3 py-2 text-emerald-800">Margin: <strong>${money.format(opportunity.margin)}</strong></p>
      </div>

      <p class="mb-2 text-sm font-medium text-slate-800">Qualifying flat-rate options</p>
      <ul class="grid gap-2">${rateList}</ul>
    </article>
  `;
};

// Step 3b: render one product card that has no qualifying flat-rate opportunities.
const renderNoOpportunityCard = (product: IProduct): string => {
  const mapText =
    product.priceDetails.minAdvPrice === null
      ? "No MAP"
      : money.format(product.priceDetails.minAdvPrice);

  return `
    <article class="rounded-xl border border-rose-200 bg-rose-50/40 p-5 shadow-sm">
      <header class="mb-3">
        <div class="mb-1 flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-lg font-semibold text-slate-900">${product.name}</h2>
          <span class="inline-flex rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">No Flat-Rate Opportunities</span>
        </div>
        <p class="text-sm text-slate-600">SKU: ${product.sku}</p>
      </header>

      <div class="mb-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
        <p class="rounded-md bg-white px-3 py-2">Cost: <strong>${money.format(product.cost)}</strong></p>
        <p class="rounded-md bg-white px-3 py-2">MAP: <strong>${mapText}</strong></p>
      </div>

      <p class="text-sm text-rose-800">
        This product did not produce any qualifying USPS flat-rate box options based on current MAP margin and box-fit rules.
      </p>
    </article>
  `;
};

// Step 4: compute opportunities through the functional pipeline.
const opportunities = findFlatRateShippingOpportunities(SAMPLE_PRODUCTS);

// Step 4a: derive products that did not qualify for any flat-rate options.
const opportunityProductSkus = new Set(
  opportunities.map((item) => item.product.sku),
);
const productsWithoutOpportunities = SAMPLE_PRODUCTS.filter(
  (product) => !opportunityProductSkus.has(product.sku),
);

// Step 5: mount a visual lesson-friendly dashboard in #app.
const mountDemo = (): void => {
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app) {
    return;
  }

  const opportunityCards = opportunities
    .map((item) => renderOpportunityCard(item))
    .join("");
  const noOpportunityCards = productsWithoutOpportunities
    .map((item) => renderNoOpportunityCard(item))
    .join("");

  app.className = "w-full max-w-5xl space-y-6";
  app.innerHTML = `
    <section class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
      <h1 class="text-3xl font-bold tracking-tight text-slate-900">Flat-Rate Shipping Opportunity Finder</h1>
      <p class="mt-2 text-slate-600">
        Demo output for MAP margin analysis using USPS Priority Mail flat-rate boxes (placeholder 1/2/3-day pricing).
      </p>
      <div class="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
        <p class="rounded-md bg-slate-100 px-3 py-2">Products in sample data: <strong>${SAMPLE_PRODUCTS.length}</strong></p>
        <p class="rounded-md bg-slate-100 px-3 py-2">Products with opportunities: <strong>${opportunities.length}</strong></p>
        <p class="rounded-md bg-slate-100 px-3 py-2">Products without opportunities: <strong>${productsWithoutOpportunities.length}</strong></p>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold text-slate-900">Products With Opportunities</h2>
      <div class="grid gap-4">${opportunityCards}</div>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold text-slate-900">Products Without Opportunities</h2>
      <div class="grid gap-4">${noOpportunityCards}</div>
    </section>
  `;
};

// Step 6: run the visual mount once the page is ready.
window.onload = () => {
  mountDemo();
};
