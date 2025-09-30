<template>
  <ConfirmDialog ref="dialogRef" />
  <VCard>
    <VCardText>
      <VRow>
        <VCol cols="12" md="3">
          <h2 class="text-lg">Exchange Rate</h2>
        </VCol>
        <VCol cols="12" md="4">
          <VTextField
            v-model="searchQuery"
            label="Search"
            append-inner-icon="tabler-search"
            clear-icon="tabler-x"
            clearable
          />
        </VCol>
        <VCol cols="12" md="2">
          <VBtn block variant="outlined" color="info" @click="handleDetailAPI">
            <VIcon start icon="tabler-link" /> Get API
          </VBtn>
        </VCol>
        <VCol cols="12" md="2">
          <VBtn block variant="outlined" @click="handleCreate">
            <VIcon start icon="tabler-plus" /> Create
          </VBtn>
        </VCol>
        <VCol cols="12" md="1">
          <VBtn
            block
            icon="tabler-reload"
            variant="outlined"
            color="success"
            rounded
            @click="getData"
          />
        </VCol>
      </VRow>
      <VDataTableServer
        class="mt-5"
        v-model:items-per-page="perPage"
        v-model:page="page"
        v-model:sort-by="sortBy"
        :items-length="total"
        :headers="headers"
        :items="data"
        :loading="loading"
        fixed-header
        show-current-page
        :items-per-page-options="[10, 20, 50]"
        @update:sort-by="handleSortChange"
        @update:page="handlePageChange"
        @update:items-per-page="handlePerPageChange"
      >
        <template #item.usd="{ item }">
          <h2
            class="font-bold px-4 py-3 my-2 w-[150px] text-center rounded-lg shadow-md text-green-700 border border-green-300"
          >
            $ 1.00
          </h2>
        </template>
        <template #item.exchange="{ item }">
          <VIcon size="32">tabler-arrows-exchange</VIcon>
        </template>
        <template #item.khr="{ item }">
          <h2
            class="font-bold px-4 py-3 my-2 w-[150px] text-center rounded-lg shadow-md text-green-700 border border-green-300"
          >
            ៛ {{ item?.rate }}
          </h2>
        </template>
        <template #item.created_by="{ item }">
          <div class="text-h6 flex gap-1 items-center">
            <VIcon size="18">tabler-user</VIcon
            >{{ item?.created_by?.name || "N/A" }}
          </div>
          <div class="text-h6 flex gap-1 items-center">
            <VIcon size="18">tabler-calendar-week</VIcon
            >{{ formatDateBySelectedFormat(item?.created_at) }}
          </div>
        </template>
        <template #item.updated_by="{ item }">
          <div class="text-h6 flex gap-1 items-center">
            <VIcon size="18">tabler-user</VIcon
            >{{ item?.updated_by?.name || "N/A" }}
          </div>
          <div class="text-h6 flex gap-1 items-center">
            <VIcon size="18">tabler-calendar-week</VIcon
            >{{ formatDateBySelectedFormat(item?.updated_at) }}
          </div>
        </template>
        <template #item.is_active="{ item }">
          <VBtn
            v-if="item.is_active"
            variant="outlined"
            size="small"
            color="success"
            block
            disabled
          >
            Active
          </VBtn>

          <VBtn
            v-else
            variant="outlined"
            color="error"
            size="small"
            block
            :loading="pending"
            @click="handleActive(item?.id)"
          >
            Inactive
          </VBtn>
        </template>
      </VDataTableServer>
    </VCardText>
  </VCard>
  <ExchangeCreateDialog v-model="createDialog" :refetch="getData" />
  <ExchangeAPIDetailDialog
    v-model="detailAPIDialog"
    :refetch="getData"
    init-id=""
  />
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

import ConfirmDialog from "@/components/customs/confirm/ConfirmDialog.vue";
import { useRouter } from "vue-router";
import axiosInstance from "@/utils/axiosInstance";
import { formatDateBySelectedFormat } from "@/utils/format";
import ExchangeCreateDialog from "@/components/customs/exchange/ExchangeCreateDialog.vue";
import ExchangeAPIDetailDialog from "@/components/customs/exchange/ExchangeAPIDetailDialog.vue";

const headers = ref([
  { title: "USD", key: "usd", sortable: false, align: "center" },
  { title: "Exchnage", key: "exchange", sortable: false, align: "center" },
  { title: "KHR", key: "khr", sortable: true, align: "center" },
  { title: "source", key: "source", sortable: true },
  { title: "Created", key: "created_by", sortable: true },
  { title: "Active", key: "updated_by", sortable: true },
  { title: "Active", key: "is_active", sortable: true },
]);

//::::::::::::::::::::::::::::::::::::::::::::::::::::: STATES
const loading = ref(false);
const pending = ref(false);
const data = ref([]);
const router = useRouter();

const createDialog = ref(false);
const detailAPIDialog = ref(false);

const updateId = ref(null);

//:::::::::::::::::::::::: DIALOG
const dialogRef = ref();
const dialogUpdate = ref(false);

//:::::::::::::::::::::::: TABLE & PAGINATION
const perPage = ref(10);
const page = ref(1);
const total = ref(0);
const sortBy = ref([]);

//:::::::::::::::::::::::: FILTER
const searchQuery = ref("");
const selectedStatus = ref(null);

//::::::::::::::::::::::::::::::::::::::::::::::::::::: FUNCTIONS

const setup = async () => {
  loading.value = true;
  try {
    // Call api
  } catch (error) {
    console.error("Error fetching roles:", error);
  } finally {
    loading.value = false;
  }
};

const getData = async () => {
  loading.value = true;
  try {
    // Build query parameters
    const params = new URLSearchParams();

    // Pagination
    params.append("per_page", perPage.value);
    params.append("page", page.value);

    // Search
    if (searchQuery.value) {
      params.append("keyword", searchQuery.value);
    }

    // Filters

    if (selectedStatus.value !== null) {
      params.append("is_active", selectedStatus.value);
    }

    // Sorting
    if (sortBy.value.length > 0) {
      const sortItem = sortBy.value[0];
      params.append("sort_direction", sortItem.order);
    }

    if (sortBy?.value[0]) {
      const sortItem = sortBy.value[0];

      switch (sortItem.key) {
        case "created_at":
          params.append("sort_by", "created_at");
          break;
        case "khr":
          params.append("sort_by", "rate");
          break;
        case "is_active":
          params.append("sort_by", "is_active");
          break;
        case "source":
          params.append("sort_by", "source");
          break;
        case "created_by":
          params.append("sort_by", "created_by");
          break;
        case "updated_by":
          params.append("sort_by", "updated_by");
          break;
      }
    }

    const res = await axiosInstance.get(
      `/billing/exchange?${params.toString()}`
    );
    data.value = res.data.data;
    total.value = res.data.meta.total;
  } catch (error) {
    console.error("Error fetching:", error);
  } finally {
    loading.value = false;
  }
};

//::::::::::::::::::::::::::::::::::::::::::::::::::::: ACTION HANDLERS

const handleCreate = () => {
  createDialog.value = true;
};

const handleDetailAPI = () => {
  detailAPIDialog.value = true;
};

const handleActive = async (id) => {
  const confirm = await dialogRef.value.show({
    title: "Confirm",
    message: "Are you sure?",
    type: "primary",
  });
  if (!confirm) {
    return;
  }
  pending.value = true;
  try {
    await axiosInstance.put(`/billing/exchange/${id}`);
    getData();
  } catch (error) {
    console.error("Error fetching roles:", error);
  } finally {
    pending.value = false;
  }
};

//::::::::::::::::::::::::::::::::::::::::::::::::::::: EVENT HANDLERS

const handleSortChange = (newSortBy) => {
  sortBy.value = newSortBy;
  page.value = 1;
  getData();
};

const handlePageChange = (newPage) => {
  page.value = newPage;
  getData();
};

const handlePerPageChange = (newPerPage) => {
  perPage.value = newPerPage;
  page.value = 1; // Reset to first page when items per page changes
  getData();
};

//::::::::::::::::::::::::::::::::::::::::::::::::::::: DEBOUNCED FUNCTIONS

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const debouncedSearch = debounce(() => {
  page.value = 1; // Reset to first page when searching
  getData();
}, 500);

const debouncedFilter = debounce(() => {
  page.value = 1; // Reset to first page when filtering
  getData();
}, 300);

//::::::::::::::::::::::::::::::::::::::::::::::::::::: WATCHERS

watch(searchQuery, () => {
  debouncedSearch();
});

watch([selectedStatus], () => {
  debouncedFilter();
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::: INITIAL
onMounted(async () => {
  try {
    await Promise.all([setup(), getData()]);
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});
</script>
