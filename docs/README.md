# Welcome to Convex SaaS Documentation

Convex SaaS is a lightweight, feature-rich, and production-ready starter for your next SaaS application.

# Highlights

- [Live Demo](https://convex-saas.netlify.app)
- [Introduction](./guide/01-introduction.md)
- [Getting Started](https://github.com/get-convex/convex-saas/tree/main/docs#getting-started)
- [Production Deployment](./guide/09-deployment.md)

Check the [Guide](./guide) for full documentation.

# Features

Features provided out of the box:

- 🧩 **Convex**: A complete, reactive, typesafe backend with authentication and file storage.
- ⚡ **Vite**: Next-Gen Frontend Tooling.
- 🛍️ **Stripe**: Subscription Plans, Customer Portal, and more.
- 🔑 **Authentication**: Email Code and Social Logins.
- 🎨 **TailwindCSS**: Utility-First CSS Framework.
- 📐 **ShadCN**: Composable React components.
- 🌙 **Easy Theming**: Switch between Light and Dark modes with ease.
- 🗺️ **TanStack Router**: Simple Route Definitions.
- 📧 **Resend**: Email for Developers.
- 💌 **React Email**: Customizable Emails with React.
- 📋 **Conform**: Type-Safe Form Validation based on Web Fundamentals.
- 📥 **File Uploads**: Profile Picture Uploads with Convex.
- 🌐 **I18N**: Internationalization for your App.
- 🧰 **TanStack Development Tools**: Enhanced Development Experience.
- 💅 **Modern UI**: Carefully crafted UI with a Modern Design System.
- 🏕 **Custom Pages**: Landing, Onboarding, Dashboard and Admin Pages.
- 📱 **Responsive**: Works on all devices, from Mobile to Desktop.

## [Live Demo](https://convex-saas.netlify.app)

> [!NOTE]
> Try upgrading to Pro. Stripe is in test mode, you can use `4242 4242 4242
4242` as a test card number, and any values for the rest.

# Getting Started

1. [Copy this template](https://github.com/new?template_name=convex-saas&template_owner=get-convex)
2. Clone the repo
3. Install dependencies and set up a new Convex project:

```sh
# install dependencies
npm install

# set up a new Convex project
npx convex dev --configure=new --once

# set up Convex Auth
npx @convex-dev/auth
```

# Environment

## Email

[Resend](https://resend.com/) is a simple and easy-to-use email service for developers.

1. Get your API Key by visiting the [Resend Dashboard](https://resend.com/api-keys).
2. Add to your Convex dev deployment:
   ```sh
   npx convex env set AUTH_RESEND_KEY re_...
   ```

## Stripe

In order to use Stripe Subscriptions and seed our database, we'll require to get the secret keys from our Stripe Dashboard.

1. Create a [Stripe Account](https://dashboard.stripe.com/login) or use an existing one.
2. Set to test mode if desired.
3. Visit the [API Keys](https://dashboard.stripe.com/test/apikeys) section and copy `Secret` key.
4. Add to your Convex dev deployment:
   ```sh
   npx convex env set STRIPE_SECRET_KEY sk_test_...
   ```

## Stripe Webhook

Stripe sends webhook events when your users update or delete their subscriptions.

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Run the local webhook server:

```sh
stripe listen --forward-to localhost:5173/api/webhook
```

4. After running the first time, you may be prompted to authenticate. If so, after
   authenticating, rerun the command.
5. The CLI will print a webhook secret key and begin listening for events.
6. Add the webhook secret key to your Convex dev deployment:
   ```sh
   npx convex env set STRIPE_WEBHOOK_SECRET whsec_...
   ```

> [!IMPORTANT]
> This command should be running in your console during local development if testing or handling Stripe Events.

# Development Server

Connect to your Convex development deployment and serve your frontend with a single command:

```sh
npm start
```

You should be able to access your app at [http://localhost:5173](http://localhost:5173) 🎉

# Deployment

## Stripe Webhook - Production

To get started, we'll require to get our Stripe Production Webhook API Key. This key will be required to set up the `STRIPE_WEBHOOK_ENDPOINT` variable in our `.env` file.

1. Visit the [Stripe Webhook](https://dashboard.stripe.com/test/webhooks) section.
2. Create a new Webhook Endpoint.
3. Set the name of your future deployed app as the Webhook URL input. _(Check Notes)_
4. Select the latest Stripe API version from `API version` selector.
5. Select the following events to listen on: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
6. Add the Endpoint and reveal the `Signing Secret` value that has been provided from Stripe Webhook page.
7. Set this new secret as `STRIPE_WEBHOOK_SECRET` variable into your `.env` file.

Done! Now we can start receiving Stripe Events to your deployed app.

## Netlify Deployment

Follow the Convex guide for Netlify deployment: https://docs.convex.dev/production/hosting/netlify

## Done! 🎉

That's it! You've successfully deployed your Convex SaaS application.
