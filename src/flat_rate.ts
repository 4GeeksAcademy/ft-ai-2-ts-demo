// These constants model USPS Priority Mail Flat Rate BOXES only (no envelopes).
// Dimensions are in inches and represent the max external package profile we allow.
const USPS_FLAT_RATE_BOXES: IFlatRateBoxTemplate[] = [
  {
    name: "Small Flat Rate Box",
    baseCost: 10.2,
    maxWeight: 70,
    dimensions: { width: 8.6875, height: 5.4375, depth: 1.75 },
  },
  {
    name: "Medium Flat Rate Box (Top Loading)",
    baseCost: 17.1,
    maxWeight: 70,
    dimensions: { width: 11.25, height: 8.75, depth: 6 },
  },
  {
    name: "Medium Flat Rate Box (Side Loading)",
    baseCost: 17.1,
    maxWeight: 70,
    dimensions: { width: 14, height: 12, depth: 3.5 },
  },
  {
    name: "Large Flat Rate Box",
    baseCost: 23.35,
    maxWeight: 70,
    dimensions: { width: 12.25, height: 12.25, depth: 6 },
  },
];

// Centralized shipping day options for placeholder USPS speed tiers.
const SHIPPING_DAYS: TShippingDay[] = [1, 2, 3];

// These surcharges create placeholder 1/2-day "faster" tiers for demonstration.
// USPS Priority Flat Rate itself is typically delivered in 1-3 days.
const PLACEHOLDER_DAY_SURCHARGES: Record<TShippingDay, number> = {
  1: 8,
  2: 4,
  3: 0,
};

// Small utility to compose single-input/single-output functions in sequence.
// This is the core "functional composition" helper for the workflow.
const pipe = <TInput, TOutput>(...fns: TPipeFn[]) => {
  return (input: TInput): TOutput => {
    return fns.reduce<any>((acc, fn) => fn(acc), input) as TOutput;
  };
};

// Converts dimensions into a sorted tuple so orientation does not matter.
const normalizeDims = (dims: IDims): TDimensionTuple => {
  const sorted = [dims.width, dims.height, dims.depth].sort((a, b) => a - b);
  return [sorted[0], sorted[1], sorted[2]];
};

// Checks whether a product fits a box when rotation is allowed.
const productFitsBox = (productDims: IDims, boxDims: IDims): boolean => {
  const [p1, p2, p3] = normalizeDims(productDims);
  const [b1, b2, b3] = normalizeDims(boxDims);
  return p1 <= b1 && p2 <= b2 && p3 <= b3;
};

// Step 1: keep only products that have a numeric MAP value.
const keepProductsWithMap = (products: IProduct[]): IProduct[] => {
  return products.filter(
    (product) => product.priceDetails.minAdvPrice !== null,
  );
};

// Step 2: compute margin = MAP - cost for each remaining product.
const addMargin = (products: IProduct[]): IProductWithMargin[] => {
  return products.map((product) => ({
    product,
    margin: (product.priceDetails.minAdvPrice as number) - product.cost,
  }));
};

// Step 3: keep only products with a positive margin.
const keepPositiveMargins = (
  productsWithMargin: IProductWithMargin[],
): IProductWithMargin[] => {
  return productsWithMargin.filter((item) => item.margin > 0);
};

// Creates 1/2/3-day placeholder rates from one USPS box profile.
const buildDeliveryRatesFromBox = (
  box: IFlatRateBoxTemplate,
): IShippingRate[] => {
  return SHIPPING_DAYS.map((deliveryDays) => ({
    provider: "USPS",
    service: `${box.name} - ${deliveryDays}-Day (Placeholder Tier)`,
    cost: Number(
      (box.baseCost + PLACEHOLDER_DAY_SURCHARGES[deliveryDays]).toFixed(2),
    ),
    deliveryDays,
    maxWeight: box.maxWeight,
    maxDimensions: box.dimensions,
  }));
};

// Step 4: for each product, generate every affordable shipping rate it can fit into.
const mapToOpportunities = (
  productsWithMargin: IProductWithMargin[],
): IFlatRateOpportunity[] => {
  return productsWithMargin
    .map(({ product, margin }) => {
      const qualifyingRates = USPS_FLAT_RATE_BOXES.filter((box) =>
        productFitsBox(product.dims, box.dimensions),
      )
        .flatMap((box) => buildDeliveryRatesFromBox(box))
        .filter((rate) => margin >= rate.cost)
        .sort((a, b) => a.deliveryDays - b.deliveryDays || a.cost - b.cost);

      return {
        product,
        margin,
        qualifyingRates,
      };
    })
    .filter((item) => item.qualifyingRates.length > 0);
};

// Step 5: sort results so the biggest MAP margin opportunities show up first.
const sortByMarginDescending = (
  opportunities: IFlatRateOpportunity[],
): IFlatRateOpportunity[] => {
  return [...opportunities].sort((a, b) => b.margin - a.margin);
};

// Public API: full functional pipeline for flat-rate opportunity detection.
export const findFlatRateShippingOpportunities = (
  products: IProduct[],
): IFlatRateOpportunity[] => {
  const evaluate = pipe<IProduct[], IFlatRateOpportunity[]>(
    keepProductsWithMap,
    addMargin,
    keepPositiveMargins,
    mapToOpportunities,
    sortByMarginDescending,
  );

  return evaluate(products);
};

// Optional export for lesson/demo reuse where students inspect available rate shapes.
export const getFlatRateBoxTemplates =
  (): ReadonlyArray<IFlatRateBoxTemplate> => {
    return USPS_FLAT_RATE_BOXES;
  };
