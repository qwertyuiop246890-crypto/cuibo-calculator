function parsePercent(input) {
  const v = parseFloat(input);
  if (isNaN(v)) return 0;
  return v / 100;
}

function parseNumber(input) {
  const v = parseFloat(input);
  if (isNaN(v)) return 0;
  return v;
}

function formatCurrency(v) {
  if (!isFinite(v)) return '-';
  return 'NT$ ' + v.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatCurrency1(v) {
  if (!isFinite(v)) return '-';
  return 'NT$ ' + v.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatPercent(v) {
  if (!isFinite(v)) return '-';
  return (v * 100).toFixed(1) + '%';
}

function calc() {
  // inputs
  const priceJpy = parseNumber(document.getElementById('priceJpy').value);
  const ratePer100 = parseNumber(document.getElementById('rate').value);
  const foreignFeePct = parsePercent(document.getElementById('foreignFee').value);
  const daigouFeePct = parsePercent(document.getElementById('daigouFee').value);
  const profitRatePct = parsePercent(document.getElementById('profitRate').value);
  const weight = parseNumber(document.getElementById('weight').value);
  const shipPerGram = parseNumber(document.getElementById('shipPerGram').value);
  const cardFeePct = parsePercent(document.getElementById('cardFee').value);
  const taxRatePct = parsePercent(document.getElementById('taxRate').value);

  // 匯率：使用 TWD / 100 JPY，方便輸入
  const rate = ratePer100 / 100;

  // 商品成本（台幣）
  const itemCostTwd = priceJpy * rate;

  // 國外交易手續費
  const foreignFeeTwd = itemCostTwd * foreignFeePct;

  // 台幣成本（商品＋國外手續費）
  const baseCostTwd = itemCostTwd + foreignFeeTwd;

  // 代購費（視為成本）
  const daigouCostTwd = baseCostTwd * daigouFeePct;

  // 運費
  const shipCostTwd = weight * shipPerGram;

  // 設定額外利潤
  const profitTwd = baseCostTwd * profitRatePct;

  // 售價（未稅未含運）＝ 台幣成本＋代購費＋額外利潤
  const sellNoShipNoTax = baseCostTwd + daigouCostTwd + profitTwd;

  // 含運售價（未稅）
  const sellNoTax = sellNoShipNoTax + shipCostTwd;

  // 刷卡手續費
  const cardCostTwd = sellNoTax * cardFeePct;

  // 刷卡後金額（未稅）
  const afterCardNoTax = sellNoTax + cardCostTwd;

  // 營業稅
  const taxCostTwd = afterCardNoTax * taxRatePct;

  // 最終售價（含稅）
  const finalPrice = afterCardNoTax + taxCostTwd;

  // 最終總成本（含代購費＋運費＋刷卡＋稅）
  const totalCost = baseCostTwd + daigouCostTwd + shipCostTwd + cardCostTwd + taxCostTwd;

  // 實際利潤（真正賺到的）
  const realProfit = finalPrice - totalCost;
  const realProfitRate = totalCost > 0 ? realProfit / totalCost : 0;

  // 輸出
  document.getElementById('rItemCost').textContent = formatCurrency1(itemCostTwd);
  document.getElementById('rForeignFee').textContent = formatCurrency1(foreignFeeTwd);
  document.getElementById('rBaseCost').textContent = formatCurrency1(baseCostTwd);
  document.getElementById('rDaigouCost').textContent = formatCurrency1(daigouCostTwd);
  document.getElementById('rShipCost').textContent = formatCurrency1(shipCostTwd);
  document.getElementById('rCardCost').textContent = formatCurrency1(cardCostTwd);
  document.getElementById('rTaxCost').textContent = formatCurrency1(taxCostTwd);
  document.getElementById('rTotalCost').textContent = formatCurrency(totalCost);

  document.getElementById('rSellNoShipNoTax').textContent = formatCurrency1(sellNoShipNoTax);
  document.getElementById('rSellNoTax').textContent = formatCurrency1(sellNoTax);
  document.getElementById('rAfterCardNoTax').textContent = formatCurrency1(afterCardNoTax);
  document.getElementById('rFinalPrice').textContent = formatCurrency(finalPrice);
  document.getElementById('rRealProfit').textContent = formatCurrency(realProfit);
  document.getElementById('rRealProfitRate').textContent = formatPercent(realProfitRate);
}

function resetAll() {
  const ids = [
    'priceJpy', 'rate', 'foreignFee', 'daigouFee', 'profitRate',
    'weight', 'shipPerGram', 'cardFee', 'taxRate'
  ];
  ids.forEach(id => {
    document.getElementById(id).value = '';
  });

  const outIds = [
    'rItemCost', 'rForeignFee', 'rBaseCost', 'rDaigouCost',
    'rShipCost', 'rCardCost', 'rTaxCost', 'rTotalCost',
    'rSellNoShipNoTax', 'rSellNoTax', 'rAfterCardNoTax',
    'rFinalPrice', 'rRealProfit', 'rRealProfitRate'
  ];
  outIds.forEach(id => {
    document.getElementById(id).textContent = '-';
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // 預設一些常用值（可依需求調整）
  document.getElementById('rate').value = '22.5';
  document.getElementById('foreignFee').value = '1.5';
  document.getElementById('daigouFee').value = '10';
  document.getElementById('profitRate').value = '5';
  document.getElementById('cardFee').value = '2.5';
  document.getElementById('taxRate').value = '5';

  document.getElementById('calcBtn').addEventListener('click', calc);
  document.getElementById('resetBtn').addEventListener('click', resetAll);

  // 即時更新：輸入時自動重算
  const inputs = document.querySelectorAll('input');
  inputs.forEach(el => {
    el.addEventListener('input', calc);
  });

  calc();
});
