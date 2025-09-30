<template>
  <ConfirmDialog ref="dialogRef" />
  <VCard>
    <VCardText>
      <VRow>
        <VCol cols="12">
          <div class="flex justify-between items-center">
            <h2 class="text-lg">Receive</h2>
            <div class="flex itmes-center gap-2">
              <VTextField
                label="Search"
                width="250"
                append-inner-icon="tabler-search"
              />
              <VBtn @click="handleCreate"> Create </VBtn>
            </div>
          </div>
        </VCol>
        <VCol>
          <div class="flex flex-wrap gap-2 items-center">
            <VAutocomplete
              :items="[{ id: 1, name: 'Option 1' }]"
              item-title="name"
              item-value="id"
              class="w-[200px]"
              clearable
              clear-icon="tabler-x"
              variant="outlined"
              label="Select expense source"
            />
            <VAutocomplete
              :items="[{ id: 1, name: 'Option 1' }]"
              item-title="name"
              item-value="id"
              class="w-[200px]"
              clearable
              clear-icon="tabler-x"
              variant="outlined"
              label="Select Supplier"
            />
            <VAutocomplete
              :items="[{ id: 1, name: 'Option 1' }]"
              item-title="name"
              item-value="id"
              class="w-[200px]"
              clearable
              clear-icon="tabler-x"
              variant="outlined"
              label="Select Start Date"
            />
            <VAutocomplete
              :items="[{ id: 1, name: 'Option 1' }]"
              item-title="name"
              item-value="id"
              class="w-[200px]"
              clearable
              clear-icon="tabler-x"
              variant="outlined"
              label="Select End Date"
            />
            <VBtn prepend-icon="tabler-filter">Apply</VBtn>
          </div>
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
        <!-- full name -->
        <template #item.receive="{ item }">
          <div class="d-flex align-center">
            <VAvatar size="32" color="primary">
              <v-icon>tabler-package-import</v-icon>
            </VAvatar>
            <div class="d-flex flex-column ms-3">
              <span
                class="d-block font-weight-medium text-high-emphasis text-truncate"
                >{{ item.name }}</span
              >
              <small>
                {{ item.supplier }}
              </small>
            </div>
          </div>
        </template>
        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex align-center gap-2 flex-wrap">
            <VSwitch :loading="pending" color="success" hide-details active />
            <VBtn icon variant="text" color="medium-emphasis">
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <VListItem link>
                    <template #prepend>
                      <VIcon icon="tabler-pencil" />
                    </template>
                    <VListItemTitle>Edit</VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
          </div>
        </template>
      </VDataTableServer>
    </VCardText>
  </VCard>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

import ConfirmDialog from "@/components/customs/confirm/ConfirmDialog.vue";
import { useRouter } from "vue-router";

const headers = ref([
  { title: "Receive", key: "receive", sortable: false },
  { title: "Expense Source", key: "expense", sortable: false },
  { title: "Total", key: "total", sortable: false },
  { title: "Product Count", key: "product_count", sortable: false },
  { title: "Created At", key: "created_at", sortable: false },
  { title: "Created By", key: "created_by", sortable: false },
  { title: "", key: "actions", sortable: false },
]);

//::::::::::::::::::::::::::::::::::::::::::::::::::::: STATES
const loading = ref(false);
const pending = ref(false);
const data = ref([
  {
    id: 1,
    supplier: "Suos Phearith",
    name: "R-00000001",
    expense: "Government",
    total: "$2000",
    product_count: 200,
    created_at: "2025-12-31",
    created_by: "Suos Phearith",
  },
  {
    id: 2,
    supplier: "Ven Dara",
    name: "R-00000002",
    expense: "Donation",
    total: "$1500",
    product_count: 200,
    created_at: "2025-08-15",
    created_by: "Suos Phearith",
  },
]);
const router = useRouter();

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

// Status options
const statusOptions = ref([
  { title: "Active", value: "1" },
  { title: "Inactive", value: "0" },
]);

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

    // const res = await axiosInstance.get(`/setting/role?${params.toString()}`);
    // resData.value = res.data.data;
    total.value = res.data.meta.total;
  } catch (error) {
    console.error("Error fetching:", error);
  } finally {
    loading.value = false;
  }
};

//::::::::::::::::::::::::::::::::::::::::::::::::::::: ACTION HANDLERS

const handleCreate = () => {
  router.push("receives/create");
};

const editRole = (role) => {
  updateId.value = role.id;
  dialogUpdate.value = true;
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
