import React, { useEffect, useState } from "react";
import Currency from "./Currency";
const base_url =
  "https://v6.exchangerate-api.com/v6/6d18cfeb97c41f4ab68a0327/latest/USD";
export default function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [currency, setCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangerate, setExchangerate] = useState();
  const [amount, setAmount] = useState(1);
  const [ammountInFromCurrency, setAmmountInFromCurrency] = useState(true);

  let toAmount, fromAmount;
  if (ammountInFromCurrency) {
    toAmount = amount * exchangerate;
    fromAmount = amount;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangerate;
  }
  useEffect(() => {
    fetch(base_url)
      .then((res) => res.json())
      .then((data) => {
        const FirstCurrency = Object.keys(data.conversion_rates)[1];
        const FFirstCurrency = Object.keys(data.conversion_rates)[0];
        setCurrencyOptions([data.base, ...Object.keys(data.conversion_rates)]);
        setCurrency(data.base);
        setCurrency(FFirstCurrency);
        setToCurrency(FirstCurrency);
        setExchangerate(data.conversion_rates[FirstCurrency]);
      });
  }, []);
  useEffect(() => {
    if (currency !== undefined && toCurrency !== undefined) {
      fetch(`${base_url}?base=${currency}&symbols=${toCurrency}`)
        .then((res) => res.json())
        .then((data) => setExchangerate(data.conversion_rates[toCurrency]));
    }
  }, [currency, toCurrency]);
  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmmountInFromCurrency(true);
  }
  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmmountInFromCurrency(false);
  }
  return (
    <div>
      <h1 className="text-3xl font-bold underline m-5">Convert</h1>
      <Currency
        currencyOptions={currencyOptions}
        selectedCurrency={currency}
        onChangeCurrency={(e) => setToCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="m-3 font-bold fontsize text-2xl mt-0">=</div>
      <Currency
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={(e) => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </div>
  );
}
