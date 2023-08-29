import { ref } from "vue";
import axiosInstance from "../services/axios";
import useComponentStore from "../store/componentStore";

export function useAids() {
  const peopleAids = ref([]);
  const peopleAidCount = ref(0);
  const cashLoadingLoading=ref(false)
  const productLoading=ref(false)
  const peopleAidLoading=ref(false)
  const currentPage = ref(1);
  const lastPage = ref(1);
  const cashDonations = ref(0);
  const productDonationsCount = ref(0);
  const productDonations = ref({});
  const inputError = ref("");
  let timeID;
  const componentStore = useComponentStore();
  const { showPopup, showLoading, dismissLoading } = componentStore;

  async function setCashDonation() {
    try {
      cashLoadingLoading.value=true
      const response = await axiosInstance.get("/api/people-aids?type=cash");
      cashDonations.value = response.data.count;
    } catch (error) {
      showPopup("مشکلی رخ داده است!!!", "error");
    }finally{
      cashLoadingLoading.value=false
    }
  }

  async function setProductDonation() {
    try {
      productLoading.value=true
      const response = await axiosInstance.get("/api/people-aids/");
      productDonations.value = response.data;
      productDonationsCount.value = response.data.count;
    } catch (error) {
      showPopup("مشکلی رخ داده است!!!", "error");
    }finally{
      productLoading.value=false
    }
  }

  async function setAllAids() {
    try {
      const response = await axiosInstance.get("/api/people-aids");
      peopleAids.value = response.data.peopleAids;
      peopleAidCount.value = response.data.count;
      lastPage.value = Math.ceil(peopleAidCount.value / 10);
    } catch (error) {
      showPopup("مشکلی رخ داده است!!!", "error");
    }
  }

  async function createAids(peopleAid) {
    try {
      ValidateFields(peopleAid);
      await axiosInstance.post("/api/people-aids", peopleAid);
      componentStore.showPopup("با موفقیت ساخته شد !!!", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      if (error.isAxiosError) {
        showPopup("مشکلی پیش امده است", "error");
      } else {
        inputError.value = error.message;
        setTimeout(() => {
          inputError.value = "";
        }, 3000);
      }
    }
  }

  async function updateAids(peopleAid) {
    try {
      ValidateFields(peopleAid);
      await axiosInstance.put(`/api/people-aids/${peopleAid.id}`, peopleAid);
      componentStore.showPopup("با موفقیت ویرایش شد !!!", "success");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      if (error.isAxiosError) {
        showPopup("مشکلی پیش امده است", "error");
      } else {
        inputError.value = error.message;
        setTimeout(() => {
          inputError.value = "";
        }, 3000);
      }
    }
  }

  async function deleteAids(peopleAidList = []) {
    if (peopleAidList.length > 0) {
      const people_aid_ids = peopleAidList.map((obj) => obj.id);
      try {
        await axiosInstance.post("/api/people-aids/delete-multi", {
          people_aid_ids: people_aid_ids,
        });
        showPopup("با موفقیت حذف شد", "success");

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        if (error.isAxiosError) {
          showPopup("مشکلی پیش امده است", "error");
        } else {
          inputError.value = error.message;
          setTimeout(() => {
            inputError.value = "";
          }, 3000);
        }
      }
    }
  }

  async function filterAids(key=' ') {
    try {
      await axiosInstance
        .get(`/api/people-aids?title=${key}`)
        .then((response) => {
          peopleAids.value = response.data.peopleAids;
        });
    } catch (error) {
      showPopup("مشکلی پیش امده است", "error");
    }
  }

  function filterDebounced(key) {
    clearTimeout(timeID);

    timeID = setTimeout(async () => {
      await filterAids(key);
    });
  }

  async function nextPage() {
    if (currentPage.value < lastPage.value) {
      showLoading();
      try {
        const response=await axiosInstance.get(`/api/people-aids?page=${++currentPage.value}`);
        peopleAids.value = response.data.peopleAids;
      } catch (error) {
        showPopup("مشکلی پیش امده است", "error");
      } finally {
        dismissLoading();
      }
    }
  }

  async function prevPage() {
    if (currentPage.value > 1) {
      showLoading();
      try {
        const response=await axiosInstance.get(`/api/people-aids?page=${--currentPage.value}`);
        peopleAids.value = response.data.peopleAids;
      } catch (error) {
        showPopup("مشکلی پیش امده است", "error");
      } finally {
        dismissLoading();
      }
    }
  }

  async function gotoPage(number) {
    if ((number <= lastPage.value) & (number > 0)) {
      showLoading();
      try {
        const response=await axiosInstance.get(`/api/people-aids?page=${number}`);
        peopleAids.value = response.data.peopleAids;
        currentPage.value=number
      } catch (error) {
        console.log(error)
        showPopup("مشکلی پیش امده است", "error");
      } finally {
        dismissLoading();
      }
    }
  }

  function ValidateFields(obj) {
    if (obj.title == "") {
      throw new Error("عنوان نمیتواند خالی باشد");
    } else if (obj.product_id == "") {
      throw new Error("کالای مورد نظر را انتخاب کنید");
    } else if (obj.helper_id == "") {
      throw new Error("مددیار مورد نظر خود را انتخاب نمایید");
    } else if (obj.quantity <= 0) {
      throw new Error("تعداد کالا های اهدایی را مشخص کنید");
    }
  }

  return {
    peopleAids,
    currentPage,
    lastPage,
    productDonationsCount,
    cashDonations,
    inputError,
    setCashDonation,
    setProductDonation,
    setAllAids,
    createAids,
    updateAids,
    deleteAids,
    filterAids: filterDebounced,
    nextPage,
    prevPage,
    gotoPage,
  };
}
