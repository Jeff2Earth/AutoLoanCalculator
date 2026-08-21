# Auto Loan Calculator — Version 1

A responsive, mobile-friendly auto loan payment calculator designed for GitHub Pages.

## Features

- Vehicle price
- Trade-in value
- Trade payoff
- Cash down
- Sales tax rate
- Taxes/fees
- Optional trade-in tax credit
- APR
- Primary loan term
- Estimated monthly payment
- Amount financed
- Total interest
- Total payments
- Positive/negative trade equity
- 36/48/60/72/75/84-month payment comparison
- Local browser storage so entries survive a refresh
- Responsive phone/tablet/desktop layout
- No server or database required

## Publish with GitHub Pages

1. Create a new repository named `AutoLoanCalculator`.
2. Upload `index.html`, `style.css`, `app.js`, and `README.md`.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`.
6. Save.

Your site will be available at:

`https://YOUR-GITHUB-USERNAME.github.io/AutoLoanCalculator/`

## Calculation

The calculator estimates:

`Amount Financed = Vehicle Price + Tax + Fees - Trade Value - Down Payment + Trade Payoff`

When **Tax trade-in credit** is enabled:

`Taxable Amount = Vehicle Price - Trade Value`

The standard amortization formula is used for monthly payment.

> Important: Tax treatment, title/registration charges, dealer fees, lender fees, and other rules vary by state and lender. This is an estimate and should not be represented as a lender quote.
