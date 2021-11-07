/* eslint-disable prettier/prettier */
const API_KEY =
  "f7b2215dbc160c6de3e623e4c9033d61cc562fe5d34186ac4b7e13482dc0a02f";

export const loadTicker = (tickers) =>
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers.join(
      ","
    )}&api_key=${API_KEY}`
  ).then((res) => res.json());
