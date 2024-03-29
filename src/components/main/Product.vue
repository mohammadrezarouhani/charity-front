<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import UpdateCreateModal from "../UpdateCreateModal.vue";
import Alert from "../Alert.vue";
import useComponentStore from "../../store/componentStore";
import Pagination from "../Pagination.vue";
import { useProduct } from "../../composables/userProductApi";
import ProductHistory from "../ProductHistory.vue";
import History from "../History.vue"

const componentStore = useComponentStore();
const { showLoading, dismissLoading } = componentStore;

const title = ref("ثبت  محصول");
const modalShow = ref(false);
const modalMode = ref("create");
const history = ref(false);
const alertShow = ref(false);
const alertMessage = ref("");

//product
const initialProduct = {
  id: "",
  name: "",
  quantity: 0,
  type: "",
  category_id: "",
  description: "",
  catagory: {
    id: "",
    name: "",
    description: "",
  },
};
const product = reactive(initialProduct);
const productList = ref([]);
const productApi = useProduct();
const { products, productCatagories, lastPage, currentPage, productLoading } =
  productApi;
const productSearchInput = ref("");
const productHistory=ref('')

function setAllChecked(event) {
  const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  allCheckboxes.forEach((el) => {
    el.checked = event.target.checked;
  });
  if (event.target.checked) {
    products.value.map((obj) => productList.value.push(obj));
  } else {
    productList.value = [];
  }
}

function checked(event, product_obj) {
  if (event.target.checked) {
    productList.value.push(product_obj);
  } else {
    const index = productList.value.indexOf(product_obj);
    productList.value.splice(index, 1);
  }
}

async function submitProduct() {
  showLoading();
  if (modalMode.value == "create") {
    await productApi.createProdcut(product);
  } else if ((modalMode.value = "edit")) {
    await productApi.updateProduct(product);
  }
  dismissLoading();
}

function showCreateModal() {
  modalShow.value = true;
  modalMode.value = "create";
  for (const key in product) product[key] = "";
  title.value = "اضافه کردن محصول جدید";
}

function showEditModal(product_obj) {
  modalShow.value = true;
  modalMode.value = "edit";
  Object.assign(product, product_obj);
  title.value = "ویرایش کردن محصول جدید";
}

function deletProduct() {
  if (productList.value.length > 0) {
    alertMessage.value = "ایا از حذف محصولات اطمینان دارید؟";
    alertShow.value = true;
  } else {
    componentStore.showPopup("هیچ محصولی انتخاب نشده است!!! ", "error", 2);
  }
}

async function submitDelete(type) {
  showLoading();
  alertShow.value = false;
  if (type == "yes") {
    await productApi.deleteProducts(productList.value);
    dismissLoading();
  }
}

function showProductHistory(event, id) {
  const tagName = event.target.tagName;
  if ((tagName == "TD") | (tagName == "TR")) {
    history.value = true;
  }
}

watch(productSearchInput, async () => {
  await productApi.filterDebounced(productSearchInput.value);
});

watch(productLoading, () => {
  if (productLoading.value) {
    showLoading();
  } else {
    dismissLoading();
  }
});

onMounted(async () => {
  showLoading();
  await productApi.setAllProdcuts();
  await productApi.setAllCatagories();
  dismissLoading();
});
</script>

<template>
  <main>
    <!-- <History/> -->
    <ProductHistory v-if="history" @close="history = !history" />
    <Alert v-if="alertShow" @submit="submitDelete" :message="alertMessage" />
    <UpdateCreateModal
      v-if="modalShow"
      @onClose="modalShow = false"
      :title="title"
      :errorInput="productApi.inputErrors"
      @onSubmit="submitProduct"
    >
      <input type="text" placeholder="عنوان" v-model="product.name" />
      <input
        type="number"
        placeholder="تعداد"
        min="0"
        v-model="product.quantity"
      />
      <select name="type" v-model="product.type">
        <option value="" selected disabled>نوع محصول</option>
        <option value="product">کالا</option>
        <option value="cash">نقدی</option>
      </select>

      <select name="catagory" v-model="product.category_id">
        <option value="" selected disabled>دسته بندی</option>
        <option
          v-for="catagory in productCatagories"
          :value="catagory.id"
          :key="catagory.id"
        >
          {{ catagory.name }}
        </option>
      </select>

      <textarea
        name="explanation"
        placeholder="توضیحات"
        v-model="product.description"
      ></textarea>
    </UpdateCreateModal>

    <div class="header">
      <h1>محصولات</h1>

      <div class="input-fields">
        <div class="search-bar">
          <span class="material-symbols-sharp">travel_explore</span>
          <input
            type="text"
            placeholder="جستجو "
            v-model="productSearchInput"
          />
        </div>
        <div class="buttons">
          <span @click="deletProduct">
            <font-awesome-icon
            class="icon"
              icon="fa-solid fa-trash-can"
              size="xl"
              style="color: #c13e3e; margin: 0px;"
            />
          </span>

          <span class="material-symbols-sharp" @click="showCreateModal">
            add
          </span>
        </div>
      </div>
    </div>

    <Pagination
      v-if="lastPage > 1"
      id="pagination"
      :currentPage="currentPage"
      :lastPage="lastPage"
      @next="productApi.nextPage"
      @prev="productApi.prevPage"
      @goTo="productApi.gotoPage"
    />

    <table>
      <thead>
        <tr>
          <th><input type="checkbox" @change="setAllChecked" /></th>
          <th>عنوان</th>
          <th>دسته بندی</th>
          <th class="responsive-hidden">توضیحات</th>
          <th class="responsive-hidden"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="product in products"
          :key="product.id"
          @click="showProductHistory($event, product.id)"
        >
          <td><input type="checkbox" @change="checked($event, product)" /></td>
          <td>{{ product.name }}</td>

          <td v-if="product.category != null">{{ product.category.name }}</td>
          <td class="responsive-hidden">
            {{ product.description == null ? "...." : product.description }}
          </td>
          <td class="responsive-hidden primary">
            <span
              class="material-symbols-sharp"
              @click="showEditModal(product)"
            >
              edit_square
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
main .header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

main .header .input-fields {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

main .header .search-bar {
  align-items: center;
  background-color: var(--color-white);
  border-radius: 0.8rem;
  color: var(--color-dark);
  display: flex;
  gap: 0.3rem;
  height: 3rem;
  width: 20rem;
}

main .header .search-bar input {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  border-radius: inherit;
  background-color: inherit;
  color: inherit;
  font-size: 1.4rem;
}

main .header .search-bar span {
  color: green;
}

main .header .buttons {
  display: flex;
  flex-direction: row;
  margin-left: 4rem;
  gap: 0.8rem;
}

main .header .buttons span {
  height: 3rem;
  width: 3rem;
  color: rgb(0, 155, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--color-white);
  cursor: pointer;
  box-shadow: var(--box-shadow);
  transition: all 300ms ease;
}

main .header .buttons span:hover {
  box-shadow: none;
  transition: all 300ms ease;
}

main table {
  border-radius: var(--card-border-radius);
  text-align: center;
  transition: all 300ms ease;
  width: 100%;
  padding: var(--card-padding);
}

main table thead tr {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1rem;
}

main table tbody tr {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  height: 6rem;
  background-color: var(--color-white);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
  transition: all 300ms ease;
}

main table tbody tr:hover {
  box-shadow: none;
  transition: all 300ms ease;
}

main table tbody tr td {
  flex-basis: 20%;
}

main table tbody tr td:first-child {
  display: flex;
  align-items: center;
  justify-content: center;
}

main table thead tr th {
  flex-basis: 20%;
}

main table thead tr th:first-child {
  flex-basis: 8%;
}

main table tbody tr td:first-child {
  flex-basis: 8%;
}

@media screen and (max-width: 768px) {
  main {
    width: 100vw;
  }
  main .header {
    margin-top: 2rem;
    position: relative;
  }

  main .header * {
    margin: 0 1rem 0 0;
  }

  main .header .input-fields {
    display: flex;
    flex-direction: column;
    margin: 0px;
    padding: 0px;
  }

  main .header .input-fields .search-bar{
    width: 98%;
    margin: 0px;
    padding: 0px;
    align-items: center;
    justify-content: flex-end;
    order: 2;
  }

  main .header .input-fields .buttons{
    gap:0px;
    left: 5px;
    margin: 0px;
    padding: 0px;
    position: absolute;
    top: 0px;
  }

  main table thead tr th {
    flex-basis: 33%;
  }

  main table tbody tr td {
    flex-basis: 33%;
  }

  table .responsive-hidden {
    display: none;
  }

  main table tbody tr {
    box-shadow: none;
  }
}
</style>
