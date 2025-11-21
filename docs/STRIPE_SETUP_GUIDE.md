# Stripe Payment Integration Setup Guide

This guide will walk you through setting up Stripe payment processing for the AFYA shop.

## Overview

AFYA uses Stripe to process payments, which includes support for:
- Credit/Debit Cards (Visa, Mastercard, Amex, Discover)
- Apple Pay (automatic on Safari/iOS)
- Google Pay (automatic on Chrome/Android)
- Link by Stripe (one-click checkout)

**Pricing:** 2.9% + $0.30 per successful transaction (no monthly fees)

## Step 1: Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Start now" or "Sign up"
3. Fill in your business information
4. Verify your email address
5. Complete your business profile

**Note:** You can start with a test account and activate it later when ready to accept real payments.

## Step 2: Get Your API Keys

### Test Mode Keys (for development)

1. Log in to your Stripe Dashboard
2. Make sure you're in **Test mode** (toggle in the top right)
3. Go to **Developers** → **API keys**
4. Copy your keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

### Live Mode Keys (for production)

1. Complete your Stripe account activation
2. Switch to **Live mode** in the dashboard
3. Go to **Developers** → **API keys**
4. Copy your live keys:
   - **Publishable key** (starts with `pk_live_...`)
   - **Secret key** (starts with `sk_live_...`)

## Step 3: Configure Environment Variables

Add your Stripe keys to your `.env` file:

```env
# For Development (Test Mode)
STRIPE_SECRET_KEY="sk_test_your_secret_key_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key_here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# For Production (Live Mode)
STRIPE_SECRET_KEY="sk_live_your_secret_key_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your_publishable_key_here"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

**Important:** Never commit your `.env` file to version control!

## Step 4: Set Up Webhook Endpoint

Webhooks allow Stripe to notify your application about payment events.

### Create Webhook in Stripe Dashboard

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL:
   - **Development:** Use [Stripe CLI](https://stripe.com/docs/stripe-cli) for local testing
   - **Production:** `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_...`)

### Add Webhook Secret to Environment

```env
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
```

## Step 5: Test Your Integration

### Using Test Cards

Stripe provides test card numbers for development:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Payment Declined:**
- Card: `4000 0000 0000 0002`

**Requires Authentication (3D Secure):**
- Card: `4000 0025 0000 3155`

[Full list of test cards](https://stripe.com/docs/testing)

### Test Apple Pay / Google Pay

- **Apple Pay:** Only works on Safari with a real Apple device
- **Google Pay:** Only works on Chrome with Google Pay set up
- In test mode, use test cards added to your wallet

### Testing Webhooks Locally

Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
# or
npm install -g stripe
```

Forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will give you a webhook signing secret for local testing.

## Step 6: Go Live Checklist

Before accepting real payments:

- [ ] Complete Stripe account activation
- [ ] Add business details and bank account
- [ ] Switch to live API keys in production environment
- [ ] Set up production webhook endpoint
- [ ] Test complete checkout flow in production
- [ ] Verify order confirmation emails are sent
- [ ] Test refund process
- [ ] Review Stripe Dashboard for any issues

## Payment Flow

Here's how the payment process works:

1. **Customer adds items to cart** → Cart stored in cookies
2. **Customer proceeds to checkout** → Selects donation allocation
3. **Create Payment Intent** → Backend creates Stripe PaymentIntent
4. **Customer enters payment** → Stripe Elements handles card/Apple Pay/Google Pay
5. **Payment processed** → Stripe confirms payment
6. **Webhook notification** → Stripe notifies backend of success/failure
7. **Order confirmed** → Customer receives confirmation email

## Monitoring and Management

### Stripe Dashboard

Access your Stripe Dashboard to:
- View all transactions
- Issue refunds
- Manage disputes
- View analytics
- Export data

### Common Tasks

**Issue a Refund:**
1. Go to **Payments** in Stripe Dashboard
2. Find the payment
3. Click **Refund**
4. Enter amount and reason
5. Confirm refund

**View Failed Payments:**
1. Go to **Payments**
2. Filter by **Failed** status
3. Review failure reasons

**Export Transaction Data:**
1. Go to **Payments**
2. Click **Export**
3. Select date range and format
4. Download CSV

## Troubleshooting

### "No such payment intent" error
- Check that your API keys match (test vs live)
- Verify the payment intent ID is correct

### Webhook signature verification failed
- Check that `STRIPE_WEBHOOK_SECRET` is set correctly
- Ensure you're using the correct secret for test/live mode

### Payment succeeds but order not updated
- Check webhook endpoint is receiving events
- Review server logs for errors
- Verify webhook secret is correct

### Apple Pay/Google Pay not showing
- These only appear on compatible devices/browsers
- Ensure you're using HTTPS in production
- Verify Stripe publishable key is set

## Security Best Practices

1. **Never expose secret keys** - Only use in server-side code
2. **Use HTTPS in production** - Required for payment processing
3. **Verify webhook signatures** - Already implemented in `/api/webhooks/stripe`
4. **Don't store card data** - Stripe handles all sensitive data
5. **Monitor for fraud** - Use Stripe Radar (included free)

## Support

- **Stripe Documentation:** [https://stripe.com/docs](https://stripe.com/docs)
- **Stripe Support:** Available in dashboard
- **Test Mode:** Use freely without charges
- **Integration Help:** Check Stripe's integration guides

## Cost Breakdown

**Per Transaction:**
- 2.9% + $0.30 for successful charges
- No charge for failed payments
- No monthly fees
- No setup fees

**Example:**
- $50 sale = $1.75 fee (you receive $48.25)
- $100 sale = $3.20 fee (you receive $96.80)

The 25% donation is calculated from the sale price, not from what you receive after fees.
