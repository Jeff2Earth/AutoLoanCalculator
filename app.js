const $ = id => document.getElementById(id);

const fields = [
  "vehiclePrice", "tradeValue", "tradePayoff", "downPayment",
  "taxRate", "fees", "apr", "term", "taxTrade"
];

const money = n => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 2
}).format(Number.isFinite(n) ? n : 0);

const num = id => {
  const value = parseFloat($(id).value);
  return Number.isFinite(value) ? Math.max(0, value) : 0;
};

function loanPayment(principal, annualRate, months) {
  principal = Math.max(0, principal);
  if (principal === 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  return principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
}

function calculate() {
  const price = num("vehiclePrice");
  const trade = num("tradeValue");
  const payoff = num("tradePayoff");
  const down = num("downPayment");
  const taxRate = num("taxRate");
  const fees = num("fees");
  const apr = num("apr");
  const term = parseInt($("term").value, 10);
  const taxTrade = $("taxTrade").checked;

  const taxableAmount = Math.max(0, price - (taxTrade ? trade : 0));
  const tax = taxableAmount * taxRate / 100;
  const equity = trade - payoff;

  // Amount financed = vehicle price + tax + fees - trade allowance - cash down + payoff.
  const amountFinanced = Math.max(0, price + tax + fees - trade - down + payoff);
  const payment = loanPayment(amountFinanced, apr, term);
  const totalPayments = payment * term;
  const totalInterest = Math.max(0, totalPayments - amountFinanced);

  $("primaryPayment").textContent = money(payment);
  $("primaryTermLabel").textContent = `${term} months at ${apr.toFixed(2)}% APR`;
  $("amountFinanced").textContent = money(amountFinanced);
  $("totalInterest").textContent = money(totalInterest);
  $("totalPayments").textContent = money(totalPayments);
  $("tradeEquity").textContent = money(equity);

  $("estimatedTax").textContent = money(tax);
  $("equityResult").textContent = `${equity < 0 ? "-" : ""}${money(Math.abs(equity))}`;
  $("equityResult").style.color = equity < 0 ? "#ffb4ab" : "#9ef0c3";
  $("taxableLabel").textContent = `Taxable: ${money(taxableAmount)}`;

  const taxPercent = amountFinanced > 0 ? Math.min(100, (tax / amountFinanced) * 100) : 0;
  $("taxBar").style.width = `${taxPercent}%`;

  renderComparison(amountFinanced, apr, term);
  saveState();
}

function renderComparison(principal, apr, selectedTerm) {
  const terms = [36, 48, 60, 72, 75, 84];
  const grid = $("comparisonGrid");
  grid.innerHTML = "";

  terms.forEach(months => {
    const payment = loanPayment(principal, apr, months);
    const interest = Math.max(0, payment * months - principal);
    const item = document.createElement("div");
    item.className = `compare-item ${months === selectedTerm ? "active" : ""}`;
    item.innerHTML = `
      <div class="compare-term">${months} months</div>
      <div class="compare-payment">${money(payment)}</div>
      <div class="compare-interest">${money(interest)} interest</div>
    `;
    item.addEventListener("click", () => {
      $("term").value = months;
      calculate();
    });
    grid.appendChild(item);
  });
}

function saveState() {
  const state = {};
  fields.forEach(id => {
    const el = $(id);
    state[id] = el.type === "checkbox" ? el.checked : el.value;
  });
  localStorage.setItem("autoLoanCalculatorV1", JSON.stringify(state));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem("autoLoanCalculatorV1"));
    if (!saved) return;
    fields.forEach(id => {
      if (saved[id] === undefined) return;
      const el = $(id);
      if (el.type === "checkbox") el.checked = saved[id];
      else el.value = saved[id];
    });
  } catch (_) {}
}

fields.forEach(id => {
  $(id).addEventListener("input", calculate);
  $(id).addEventListener("change", calculate);
});

$("resetBtn").addEventListener("click", () => {
  localStorage.removeItem("autoLoanCalculatorV1");
  $("vehiclePrice").value = 40000;
  $("tradeValue").value = 15000;
  $("tradePayoff").value = 12000;
  $("downPayment").value = 3000;
  $("taxRate").value = 7;
  $("fees").value = 1200;
  $("apr").value = 6.99;
  $("term").value = 72;
  $("taxTrade").checked = true;
  calculate();
});

loadState();
calculate();
