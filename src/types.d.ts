interface IProduct {
  sku: string;
  cost: number;
  name: string;
  dims: IDims;
  priceDetails: IPriceDetails;
}

interface IDims {
  width: number;
  height: number;
  depth: number;
}

interface IPriceDetails {
  minAdvPrice: null | number;
  msrp: null | number;
}

interface IShippingRate {
  provider: string;
  service: string;
  cost: number;
  deliveryDays: number;
  maxWeight: number;
  maxDimensions: IDims;
}

type TShippingDay = 1 | 2 | 3;

type TDimensionTuple = [number, number, number];

interface IFlatRateBoxTemplate {
  name: string;
  baseCost: number;
  maxWeight: number;
  dimensions: IDims;
}

interface IProductWithMargin {
  product: IProduct;
  margin: number;
}

interface IFlatRateOpportunity {
  product: IProduct;
  margin: number;
  qualifyingRates: IShippingRate[];
}

type TPipeFn = (value: any) => any;
