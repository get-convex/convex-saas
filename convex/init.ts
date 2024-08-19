import { asyncMap } from "convex-helpers";
import { ERRORS } from "~/errors";
import { internalAction, internalMutation } from "@cvx/_generated/server";
import schema, {
  CURRENCIES,
  Currency,
  Interval,
  INTERVALS,
  PlanKey,
  PLANS,
} from "@cvx/schema";
import { internal } from "@cvx/_generated/api";
import { stripe } from "@cvx/stripe";

const seedProducts = [
  {
    key: PLANS.FREE,
    name: "Free",
    description: "Start with the basics, upgrade anytime.",
    prices: {
      [INTERVALS.MONTH]: {
        [CURRENCIES.USD]: 0,
        [CURRENCIES.EUR]: 0,
      },
      [INTERVALS.YEAR]: {
        [CURRENCIES.USD]: 0,
        [CURRENCIES.EUR]: 0,
      },
    },
  },
  {
    key: PLANS.PRO,
    name: "Pro",
    description: "Access to all features and unlimited projects.",
    prices: {
      [INTERVALS.MONTH]: {
        [CURRENCIES.USD]: 1990,
        [CURRENCIES.EUR]: 1990,
      },
      [INTERVALS.YEAR]: {
        [CURRENCIES.USD]: 19990,
        [CURRENCIES.EUR]: 19990,
      },
    },
  },
];

export const insertSeedPlan = internalMutation({
  args: schema.tables.plans.validator,
  handler: async (ctx, args) => {
    await ctx.db.insert("plans", {
      stripeId: args.stripeId,
      key: args.key,
      name: args.name,
      description: args.description,
      prices: args.prices,
    });
  },
});

export default internalAction(async (ctx) => {
  /**
   * Stripe Products.
   */
  const products = await stripe.products.list({
    limit: 1,
  });
  if (products?.data?.length) {
    console.info("🏃‍♂️ Skipping Stripe products creation and seeding.");
    return;
  }

  const seededProducts = await asyncMap(seedProducts, async (product) => {
    // Format prices to match Stripe's API.
    const pricesByInterval = Object.entries(product.prices).flatMap(
      ([interval, price]) => {
        return Object.entries(price).map(([currency, amount]) => ({
          interval,
          currency,
          amount,
        }));
      },
    );

    // Create Stripe product.
    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.description,
    });

    // Create Stripe price for the current product.
    const stripePrices = await Promise.all(
      pricesByInterval.map((price) => {
        return stripe.prices.create({
          product: stripeProduct.id,
          currency: price.currency ?? "usd",
          unit_amount: price.amount ?? 0,
          tax_behavior: "inclusive",
          recurring: {
            interval: (price.interval as Interval) ?? INTERVALS.MONTH,
          },
        });
      }),
    );

    const getPrice = (currency: Currency, interval: Interval) => {
      const price = stripePrices.find(
        (price) =>
          price.currency === currency && price.recurring?.interval === interval,
      );
      if (!price) {
        throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
      }
      return { stripeId: price.id, amount: price.unit_amount || 0 };
    };

    await ctx.runMutation(internal.init.insertSeedPlan, {
      stripeId: stripeProduct.id,
      key: product.key as PlanKey,
      name: product.name,
      description: product.description,
      prices: {
        [INTERVALS.MONTH]: {
          [CURRENCIES.USD]: getPrice(CURRENCIES.USD, INTERVALS.MONTH),
          [CURRENCIES.EUR]: getPrice(CURRENCIES.EUR, INTERVALS.MONTH),
        },
        [INTERVALS.YEAR]: {
          [CURRENCIES.USD]: getPrice(CURRENCIES.USD, INTERVALS.YEAR),
          [CURRENCIES.EUR]: getPrice(CURRENCIES.EUR, INTERVALS.YEAR),
        },
      },
    });

    return {
      key: product.key,
      product: stripeProduct.id,
      prices: stripePrices.map((price) => price.id),
    };
  });
  console.info(`📦 Stripe Products has been successfully created.`);

  // Configure Customer Portal.
  await stripe.billingPortal.configurations.create({
    business_profile: {
      headline: "Organization Name - Customer Portal",
    },
    features: {
      customer_update: {
        enabled: true,
        allowed_updates: ["address", "shipping", "tax_id", "email"],
      },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: { enabled: true },
      subscription_update: {
        enabled: true,
        default_allowed_updates: ["price"],
        proration_behavior: "always_invoice",
        products: seededProducts
          .filter(({ key }) => key !== PLANS.FREE)
          .map(({ product, prices }) => ({ product, prices })),
      },
    },
  });

  console.info(`👒 Stripe Customer Portal has been successfully configured.`);
  console.info(
    "🎉 Visit: https://dashboard.stripe.com/test/products to see your products.",
  );
});
