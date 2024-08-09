# Welcome to Convex SaaS Documentation

Convex SaaS is a lightweight, feature-rich, and production-ready starter for your next SaaS application.

# Highlights

- [Live Demo](https://convex-saas.netlify.app)
- [Introduction](./guide/01-introduction.md)
- [Getting Started](https://github.com/erquhart/convex-saas/tree/main/docs#getting-started)
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

[![Remix SaaS](https://raw.githubusercontent.com/dev-xo/dev-xo/main/remix-saas/intro.png)](https://remix-saas.fly.dev)

> [!NOTE]
> Try upgrading to Pro. Stripe is in test mode, you can use `4242 4242 4242
4242` as a test card number, and any values for the rest.

# Getting Started

1. [Copy this template](https://github.com/new?template_name=convex-saas&template_owner=erquhart)
2. Clone the repo
3. Run some commands:

```sh
npm install
npx convex dev
```

# Environment

Remix SaaS requires a few environment variables to be set in order to work as expected. To keep it even simpler, on template initialization, some of these variables are already set for you.

Let's take a look at the required environment variables:

# Email

In order to send emails, Remix SaaS uses [Resend](https://resend.com/), a simple and easy-to-use email service for developers.

- You can get your API Key by visiting the [Resend Dashboard](https://resend.com/api-keys).

# Stripe

In order to use Stripe Subscriptions and seed our database, we'll require to get the secret keys from our Stripe Dashboard.

1. Create a [Stripe Account](https://dashboard.stripe.com/login) or use an existing one.
2. Visit [API Keys](https://dashboard.stripe.com/test/apikeys) section and copy the `Publishable` and `Secret` keys.
3. Paste each one of them into your `.env` file as `STRIPE_PUBLIC_KEY` and `STRIPE_SECRET_KEY` respectively.

## Stripe Webhook

In order to start receiving Stripe Events to our Webhook Endpoint, we'll require to install the [Stripe CLI.](https://stripe.com/docs/stripe-cli) Once installed run the following command in your console. _(Make sure you're in the root of your project)_:

```sh
stripe listen --forward-to localhost:3000/api/webhook
```

This should give you a Webhook Secret Key. Copy and paste it into your `.env` file as `STRIPE_WEBHOOK_ENDPOINT`.

> [!IMPORTANT]
> This command should be running in your console while developing, especially when testing or handling Stripe Events.

# Database

Before starting our development, we'll require to setup our Prisma Migrations. Remix SaaS uses Prisma as its ORM, with SQLite as its default database. You can change it to any other database supported by Prisma.

To start our migrations, run the following command in your console:

```sh
npx prisma migrate dev --name init
```

> [!NOTE]
> Resetting migrations will require us to clean our Stripe Data. You can do that by visiting your [Stripe Test Dashboard](https://dashboard.stripe.com/test/developers), scrolling down and clicking on `Delete all test data` button.

# Development Server

Now that we have everything configured, we can start our development server. Run the following command in your console:

```sh
npm run dev
```

You should be able to access your app at 🎉 [http://localhost:3000](http://localhost:3000).

# Deployment

Deployment and some other docs are available in the [Deployment](./guide/09-deployment.md) section.

# Support

If you found **Remix SaaS** helpful, consider supporting it with a ⭐ [Star](https://github.com/dev-xo/remix-saas). It helps the repository grow and provides the required motivation to continue maintaining the project. Thank you!
