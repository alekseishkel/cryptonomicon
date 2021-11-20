/* eslint-disable prettier/prettier */
const API_KEY =
  "f7b2215dbc160c6de3e623e4c9033d61cc562fe5d34186ac4b7e13482dc0a02f";

export const loadTickers = (tickers) =>
  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers.join(
      ","
    )}&tsyms=USD&api_key=${API_KEY}`
  )
  .then((res) => res.json())
  .then(data => 
    Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, value.USD])
    )
);
