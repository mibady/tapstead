# Stripe Events to Track

## One-Time Payments (Cleaning Services)
- `checkout.session.completed`: When a customer successfully completes the checkout
- `payment_intent.succeeded`: When payment is successfully processed
- `payment_intent.payment_failed`: When payment fails
- `payment_intent.requires_action`: When payment needs additional authentication

## Subscriptions (Regular Cleaning Services)
- `customer.subscription.created`: When a customer starts a new subscription
- `customer.subscription.updated`: When subscription details change
- `customer.subscription.deleted`: When subscription is cancelled
- `invoice.payment_succeeded`: When subscription payment succeeds
- `invoice.payment_failed`: When subscription payment fails

## Customer Management
- `customer.created`: When a new customer is created in Stripe
- `customer.updated`: When customer details are updated

## Refunds and Disputes
- `charge.refunded`: When a refund is issued
- `charge.dispute.created`: When a customer disputes a charge
- `charge.dispute.closed`: When a dispute is resolved

## Error Tracking
- `payment_intent.payment_failed`: Details about why a payment failed
- `charge.failed`: When a charge fails