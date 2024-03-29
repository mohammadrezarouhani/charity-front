<script setup>
import { ref, watch, onMounted } from "vue";
import Pagination from "../Pagination.vue";

let menuLayout;
let menuButton;
let openerSpan;

const menu = ref(false);
const input = ref("");
const emit = defineEmits(["onFilter", "onSelect","nextPage","prevPage","gotoPage"]);
const { dataList, current, lastpage, initialValue, index } = defineProps([
  "dataList",
  "current",
  "lastpage",
  "initialValue",
  "loading"
]);

const selectValue = ref(initialValue);

function onSelect(data) {
  menu.value = false;
  if (data.name) {
    selectValue.value = data.name;
  } else if (data.first_name) {
    selectValue.value = data.first_name + " " + data.last_name;
  }
  emit("onSelect", data);
}

function onOpenerClick() {
  menu.value = !menu.value;
}

watch(input, () => {
  emit("onFilter", input.value);
});

function closeMenuOnClickOutside(event) {
  menuLayout = document.getElementById("drop-down-menu");
  openerSpan = document.getElementById("opener-span");
  menuButton = document.querySelector(".opener-button");

  if (menuLayout != null) {
    if (
      !menuLayout.contains(event.target) &
      !openerSpan.contains(event.target) &
      (event.target.className != "opener-button")
    ) {
      menu.value = false;
    }
  }
}

onMounted(() => {
  document.addEventListener("click", closeMenuOnClickOutside);
});
</script>

<template>
  <div class="menu-layout">
    <div class="opener" id="opener-layout">
      <span
        v-if="!menu"
        class="material-symbols-sharp ico"
        id="opener-span"
        @click="onOpenerClick"
        >expand_more</span
      >
      <span
        v-if="menu"
        class="material-symbols-sharp ico"
        @click="onOpenerClick"
        >close</span
      >
      <input
        type="button"
        class="opener-button"
        :value="selectValue"
        @click="onOpenerClick"
      />
    </div>
    <div v-if="menu" class="menu" id="drop-down-menu">
      <div class="input">
        <span class="material-symbols-sharp search">search</span>
        <input type="text" v-model="input" />
      </div>

      <div class="pagination">
        <Pagination
          id="pagination"
          :currentPage="current"
          :lastPage="lastpage"
          @next="emit('nextPage');"
          @prev="emit('prevPage');"
          @goTo="emit('gotoPage',number);"
        />
      </div>

      <!-- Menu -->
      <div class="data-list" i>
        <ul>
          <li v-for="data in dataList" @click="onSelect(data)" :key="data.id">
            {{ data.name }} {{ data.first_name }}
            {{ data.last_name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-layout {
  align-items: center;
  background-color: var(--color-light);
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 2.4rem;
  margin-top: 1rem;
  position: relative;
}

.menu-layout .opener {
  border-radius: var(--border-radius-1);
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
}

.menu-layout .opener .opener-button {
  width: inherit;
  background-color: inherit;
  text-align: right;
}

.menu-layout .menu {
  align-items: center;
  background-color: var(--color-background);
  border-radius: 0 0 0.4rem 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 20rem;
  overflow: auto;
  padding: 0.6rem;
  position: absolute;
  top: 2.4rem;
  width: 100%;
  z-index: 12;
}

.menu-layout .disabled {
  display: none;
}

.menu-layout .menu .input {
  width: inherit;
  display: flex;
  background-color: white;
  align-items: center;
  height: 2.4rem;
}

.menu-layout .menu .input input {
  background-color: var(--color-white);
  border-radius: var(--border-radius-1);
  width: 100%;
  height: 2.4rem;
  padding-right: 2rem;
  margin: 0px !important;
}

.menu-layout .menu .input .search {
  font-weight: bold;
  position: absolute;
  text-align: center;
}
.menu-layout .menu .data-list {
  width: 100%;
}
.menu-layout .menu .data-list ul {
  width: 100%;
}
.menu-layout .menu .data-list ul li {
  color: var(--color-dark);
  height: 2rem;
  text-align: center;
  width: inherit;
}

.menu-layout .menu .data-list ul li:hover {
  background-color: var(--color-light);
  color: var(--color-primary);
  transition: all 300ms ease;
}
</style>
