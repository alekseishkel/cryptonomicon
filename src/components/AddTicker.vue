<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            @keydown.enter="addTicker"
            @input="showHint"
            type="text"
            name="wallet"
            id="wallet"
            class="
              block
              w-full
              pr-10
              border-gray-300
              text-gray-900
              focus:outline-none focus:ring-gray-500 focus:border-gray-500
              sm:text-sm
              rounded-md
            "
            placeholder="Например DOGE"
          />
        </div>
      </div>
    </div>
    <ul class="flex h-8">
      <li
        @click="setTicker($event), addTicker($event)"
        v-for="(coin, i) in hintCoints.splice(0, 4)"
        :key="i"
        class="p-1 mr-2 mt-2 bg-gray-200 text-xs rounded-md cursor-pointer"
      >
        {{ coin.Name }}
      </li>
    </ul>
    <p v-if="isCoinExist === false" class="mt-2 text-xs text-red-500">
      Coin does not exist
    </p>
    <p v-if="isCoinExist === true" class="mt-2 text-xs text-red-500">
      Coin already added
    </p>
    <add-button @click="addTicker" type="button" class="my-4" />
  </section>
</template>

<script>
import AddButton from "./AddButton.vue";

export default {
  components: {
    AddButton,
  },

  data() {
    return {
      ticker: "",
      tickers: [],
      hintCoints: [],
      isCoinExist: null,
    };
  },

  props: {
    allCoins: {
      type: Array,
      reqiured: true,
    },
  },

  emits: {
    "add-ticker": (value) =>
      (typeof value === "string" || typeof value === "number") &&
      value.length > 0,
  },

  methods: {
    addTicker() {
      if (this.ticker.length === 0) {
        return;
      }

      this.$emit("add-ticker", this.ticker);
      this.ticker = "";
      this.hintCoints = [];
    },

    setTicker(evt) {
      this.ticker = evt.target.textContent;
    },

    showHint() {
      this.hintCoints = this.allCoins.filter(
        (coin) =>
          coin.Name.toLowerCase().includes(this.ticker.toLowerCase()) ||
          coin.CoinName.toLowerCase().includes(this.ticker.toLowerCase())
      );
      this.hintCoints.length === 0
        ? (this.isCoinExist = false)
        : (this.isCoinExist = null);
      this.ticker.length === 0 ? (this.hintCoints = []) : null;
    },
  },
};
</script>
