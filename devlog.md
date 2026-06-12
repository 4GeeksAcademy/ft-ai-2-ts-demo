# Dev Log: Flat-Rate Shipping Opportunity Finder

## Original Problem

[Whiteboard with additional context](https://canva.link/fts9jjgv9tnv7dw)

An ecommerce company can earn preferential listing placement on sales channels when it offers free 1/2/3-day shipping.

To support that goal, we needed a TypeScript system that analyzes unified product records (`IProduct`) and identifies products where margin is large enough to absorb shipping costs.

Business pricing constraints for this exercise:

- MAP (Minimum Advertised Price) is treated as a practical price floor (ignoring tactics like "see price in cart").
- MSRP is treated as a practical price ceiling.

Shipping constraints for this exercise:

- Only USPS Priority Mail flat-rate boxes are evaluated.
- Flat-rate envelopes are intentionally excluded.
- Placeholder shipping pricing is acceptable for classroom/demo use.

## Solution Overview

We implemented a functional composition pipeline in `src/flat_rate.ts` that:

1. Filters to products with a non-null MAP.
2. Computes margin as `MAP - cost`.
3. Filters to positive-margin products.
4. Builds USPS flat-rate shipping options (1/2/3-day placeholder tiers) for box sizes.
5. Checks package fit against flat-rate box dimensions (rotation-aware fit).
6. Keeps rates where margin can cover shipping cost.
7. Sorts opportunities by highest margin.

The result is an array of `IFlatRateOpportunity` records per qualifying product.

## Type Design Decisions

To keep types centralized and easy for students to inspect, shared types were consolidated in `src/types.d.ts`.

Added/used key types:

- `TShippingDay` for 1/2/3-day tiers.
- `TDimensionTuple` for normalized dimensions.
- `IFlatRateBoxTemplate` for USPS box definitions.
- `IProductWithMargin` for intermediate pipeline transformations.
- `IFlatRateOpportunity` for final output records.
- `TPipeFn` for the composition helper.

## USPS Placeholder Modeling

In `src/flat_rate.ts`, we defined USPS box templates (boxes only) and used placeholder cost logic:

- Base cost per box profile.
- Day-based surcharge map for 1/2/3-day tiers.

This preserves realistic structure while remaining simple enough for teaching functional steps.

## Visual Demo Work

A visual demo was wired in `src/main.ts` to make pipeline outputs concrete for students.

Implemented demo features:

- Sample `IProduct` dataset with mixed outcomes.
- Dashboard summary counts.
- Product cards with opportunities and product cards without opportunities.
- Status badges for both groups.
- Cheapest qualifying shipping option highlighted in green per product (ties also highlighted).

## Current Behavior

The demo currently shows:

- Products that can support free flat-rate 1/2/3-day shipping given MAP-to-cost margin.
- Products that cannot, with explicit labeling.
- Qualifying rate detail (service, cost, delivery days), including cheapest-rate emphasis.

## Notes and Limitations

- Shipping costs are placeholders for demonstration.
- Weight is modeled in rate definitions, but product weight is not currently part of `IProduct`, so weight-based filtering is not yet enforced.
- MSRP is included as domain context (pricing ceiling) but is not yet actively used in the current qualification formula, which is MAP-focused.

## Next Iteration Ideas

- Add product weight to `IProduct` and enforce USPS max-weight constraints.
- Add interactive controls in the demo (minimum margin threshold, day-tier filters, box-type filters).
- Introduce optional profitability guards beyond shipping coverage (for example, minimum retained margin after shipping).
