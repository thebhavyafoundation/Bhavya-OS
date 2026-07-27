# Event: donation.received

## Description

Triggered when a donation is received.

## Payload

- `donationId`: Donation identifier
- `amount`: Donation amount
- `donor`: Donor information (anonymized if requested)
- `campaign`: Campaign identifier
- `timestamp`: When the donation was received

## Subscribers

- Donation Agent (process donation)
- Founder Agent (notify)
- Historian Agent (log donation)

## Actions

1. Process donation
2. Generate receipt
3. Send thank you
4. Update campaign metrics
5. Log donation
