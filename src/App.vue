<template>
  <div v-if="loading" className="lds-ripple">
    <div></div>
    <div></div>
  </div>
  <div v-else class="container mx-auto flex flex-col items-center p-4">
    <div class="container">
      <div class="w-full my-4"></div>
      <add-ticker @add-ticker="addTicker" :allCoins="allCoins" />
      <template v-if="tickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <div>
          <button
            class="
              mr-4
              my-4
              inline-flex
              items-center
              py-2
              px-4
              border border-transparent
              shadow-sm
              text-sm
              leading-4
              font-medium
              rounded-full
              text-white
              bg-gray-600
              hover:bg-gray-700
              transition-colors
              duration-300
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-gray-500
            "
            @click="page--"
            v-if="page > 1"
          >
            Назад</button
          ><button
            class="
              my-4
              inline-flex
              items-center
              py-2
              px-4
              border border-transparent
              shadow-sm
              text-sm
              leading-4
              font-medium
              rounded-full
              text-white
              bg-gray-600
              hover:bg-gray-700
              transition-colors
              duration-300
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-gray-500
            "
            @click="page++"
            v-if="hasNextPage"
          >
            Вперед
          </button>
          <div>Фильтр: <input type="text" v-model="filter" /></div>
        </div>
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="t in paginatedTickers"
            :key="t"
            @click="selectTicker(t)"
            :class="{
              'border-4': currentTicker === t,
            }"
            class="
              bg-white
              overflow-hidden
              shadow
              rounded-lg
              border-purple-800 border-solid
              cursor-pointer
            "
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ t.name }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ formatPrice(t.price) }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="removeTicker(t)"
              class="
                flex
                items-center
                justify-center
                font-medium
                w-full
                bg-gray-100
                px-4
                py-4
                sm:px-6
                text-md text-gray-500
                hover:text-gray-600 hover:bg-gray-200 hover:opacity-20
                transition-all
                focus:outline-none
              "
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path></svg
              >Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>
      <section v-if="currentTicker" class="relative">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{ currentTicker.name }} - USD
        </h3>
        <div
          class="flex items-end border-gray-600 border-b border-l h-64"
          ref="graph"
        >
          <div
            v-for="(bar, i) in normalizedGraph"
            :key="i"
            :style="{
              height: bar + '%',
            }"
            class="bg-purple-800 border w-10 h-24"
          ></div>
        </div>
        <button
          @click="selectTicker = null"
          type="button"
          class="absolute top-0 right-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.com/svgjs"
            version="1.1"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 511.76 511.76"
            style="enable-background: new 0 0 512 512"
            xml:space="preserve"
          >
            <g>
              <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
              ></path>
            </g>
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
import { subscribeToTicker, unsubscribeFromTicker } from "./api";
import AddTicker from "./components/AddTicker.vue";

export default {
  name: "App",

  components: {
    AddTicker,
  },

  data() {
    return {
      ticker: "",
      tickers: [],
      currentTicker: null,
      graph: [],
      maxGraphElements: 1,
      allCoins: {},
      hintCoints: [],
      isCoinExist: null,
      loading: true,
      page: 1,
      filter: "",
    };
  },

  created() {
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    if (windowData.filter) {
      this.filter = windowData.filter;
    }

    if (windowData.page) {
      this.page = windowData.page;
    }

    const tickersList = localStorage.getItem("cryptonomicon-tickers");

    if (tickersList) {
      this.tickers = JSON.parse(tickersList);
      this.tickers.forEach((ticker) =>
        subscribeToTicker(ticker.name, (newPrice) =>
          this.updateTicker(ticker.name, newPrice)
        )
      );
    }

    setInterval(this.updateTicker, 5000);
  },

  async mounted() {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/all/coinlist?api_key=f7b2215dbc160c6de3e623e4c9033d61cc562fe5d34186ac4b7e13482dc0a02f`
    );

    const data = await response.json();

    this.allCoins = Object.values(data.Data);
    this.loading = false;

    window.addEventListener("resize", this.calculateMaxGraphElements);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.calculateMaxGraphElements);
  },

  computed: {
    startIndex() {
      return 6 * (this.page - 1);
    },

    endIndex() {
      return 6 * this.page;
    },

    filteredTickers() {
      return this.tickers.filter((ticker) =>
        ticker.name.toLowerCase().includes(this.filter.toLowerCase())
      );
    },

    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },

    hasNextPage() {
      return this.filteredTickers.length > this.endIndex;
    },

    normalizedGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);

      if (maxValue === minValue) {
        return this.graph.map(() => 50);
      }

      return this.graph.map(
        (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      );
    },

    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page,
      };
    },
  },

  methods: {
    addTicker(ticker) {
      if (
        this.tickers.findIndex(
          (el) => el.name.toLowerCase() === ticker.toLowerCase()
        ) >= 0
      ) {
        this.isCoinExist = true;
        return;
      }

      if (
        this.allCoins.findIndex(
          (coin) => coin.Name.toLowerCase() === ticker.toLowerCase()
        ) > 0
      ) {
        const newTicker = {
          name: ticker.toUpperCase(),
          price: "-",
        };

        this.tickers = [...this.tickers, newTicker];

        this.filter = "";

        subscribeToTicker(newTicker.name, (newPrice) =>
          this.updateTicker(newTicker.name, newPrice)
        );
      } else {
        this.isCoinExist = null;
      }
    },

    calculateMaxGraphElements() {
      if (!this.$refs.graph) {
        return;
      }

      const oneColumnWidth = 39;
      this.maxGraphElements = this.$refs.graph.clientWidth / oneColumnWidth;
    },

    formatPrice(price) {
      if (price === "-") {
        return price;
      }

      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    },

    updateTicker(tickerName, price) {
      this.tickers
        .filter((ticker) => ticker.name === tickerName)
        .forEach((ticker) => {
          if (ticker.name === this.currentTicker?.name) {
            this.graph.push(price);
            while (this.graph.length > this.maxGraphElements) {
              this.graph.shift();
            }
          }
          ticker.price = price;
        });
    },

    removeTicker(tickerToRemove) {
      this.tickers = this.tickers.filter((ticker) => ticker !== tickerToRemove);
      this.currentTicker = null;
      unsubscribeFromTicker(tickerToRemove.name);
    },

    selectTicker(ticker) {
      this.currentTicker = ticker;
    },
  },

  watch: {
    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },

    filter() {
      this.page = 1;
    },

    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
      );
    },

    currentTicker() {
      this.graph = [];
      this.$nextTick(() => this.calculateMaxGraphElements());
    },

    tickers() {
      localStorage.setItem(
        "cryptonomicon-tickers",
        JSON.stringify(this.tickers)
      );
    },
  },
};
</script>

<style src="./styles/styles.css"></style>
