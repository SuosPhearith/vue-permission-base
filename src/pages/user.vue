<template>
  <div>
    <ConfirmDialog ref="dialogRef" />
    <v-card>
      <VCardText class="d-flex flex-wrap gap-4">
        <VSpacer />

        <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <VTextField
            width="300"
            v-model="searchQuery"
            variant="outlined"
            label="Search User"
            prepend-inner-icon="tabler-search"
            clearable
          />

          <!-- 👉 Add user button -->
          <VBtn prepend-icon="tabler-plus" @click="dialogCreate = true">
            Add New User
          </VBtn>
        </div>
      </VCardText>
      <VCardText>
        <VRow>
          <!-- 👉 Select Role -->
          <VCol cols="12" sm="4">
            <VSelect
              v-model="selectedRole"
              :items="roles"
              item-title="name"
              item-value="id"
              clearable
              clear-icon="tabler-x"
              variant="outlined"
              label="Select Role"
            />
          </VCol>

          <!-- 👉 Select Status -->
          <VCol cols="12" sm="4">
            <VSelect
              v-model="selectedStatus"
              :items="statusOptions"
              item-title="title"
              item-value="value"
              clearable
              clear-icon="tabler-x"
              variant="outlined"
              label="Select Status"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />
      <VDataTableServer
        v-model:items-per-page="perPage"
        v-model:page="page"
        v-model:sort-by="sortBy"
        :items-length="total"
        :headers="headers"
        :items="users"
        :loading="loading"
        fixed-header
        show-current-page
        :items-per-page-options="[10, 20, 50]"
        @update:sort-by="handleSortChange"
        @update:page="handlePageChange"
        @update:items-per-page="handlePerPageChange"
      >
        <!-- full name -->
        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <VAvatar size="32" color="primary">
              <v-icon>tabler-user-filled</v-icon>
            </VAvatar>
            <div class="d-flex flex-column ms-3">
              <span
                class="d-block font-weight-medium text-high-emphasis text-truncate"
                >{{ item.name }}</span
              >
              <small>
                <span v-for="role in item.roles" :key="role.id" class="pe-1">
                  {{ role.name }}
                </span>
              </small>
            </div>
          </div>
        </template>

        <template #item.created_at="{ item }">
          <span>{{ formatDateDDMMYYHHMM(item.created_at) }}</span>
        </template>

        <template #item.updated_at="{ item }">
          <span>{{ formatDateDDMMYYHHMM(item.updated_at) }}</span>
        </template>

        <template #item.status="{ item }">
          <v-chip v-if="item.is_active" size="small" color="success">
            Active
          </v-chip>
          <v-chip v-else size="small" color="error">Inactive</v-chip>
        </template>

        <!-- Actions -->
        <template #item.action="{ item }">
          <div class="d-flex align-center gap-2">
            <VSwitch
              v-model="item.is_active"
              :loading="pending"
              @change="toggleStatus(item?.id)"
              color="success"
              hide-details
            />
            <VBtn icon variant="text" color="medium-emphasis">
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <VListItem link @click="editUser(item)">
                    <template #prepend>
                      <VIcon icon="tabler-pencil" />
                    </template>
                    <VListItemTitle>Edit</VListItemTitle>
                  </VListItem>
                  <VListItem link @click="resetPassword(item)">
                    <template #prepend>
                      <VIcon icon="tabler-lock-open-2" />
                    </template>
                    <VListItemTitle>Reset Password</VListItemTitle>
                  </VListItem>
                  <VListItem link @click="deleteUser(item)" class="text-error">
                    <template #prepend>
                      <VIcon icon="tabler-trash" />
                    </template>
                    <VListItemTitle>Delete</VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
          </div>
        </template>
      </VDataTableServer>
    </v-card>
    <CreateUserDialog v-model="dialogCreate" :refetch-user-list="getUsers" />
    <UpdateUserDialog
      :user-id="updateUserId"
      v-model="dialogUpdate"
      :refetch-user-list="getUsers"
    />
    <ResetPasswordDialog
      :user-id="updateUserId"
      v-model="dialogReset"
      :refetch-user-list="getUsers"
    />
  </div>
</template>

<script setup>
import axiosInstance from "@/utils/axiosInstance";
import { formatDateDDMMYYHHMM } from "@/utils/format";
import { onMounted, ref, watch } from "vue";

import ConfirmDialog from "@/components/customs/confirm/ConfirmDialog.vue";
import CreateUserDialog from "@/components/customs/user/CreateUserDialog.vue";
import ResetPasswordDialog from "@/components/customs/user/ResetPasswordDialog.vue";
import UpdateUserDialog from "@/components/customs/user/UpdateUserDialog.vue";

const headers = [
  {
    title: "NAME",
    key: "name",
    sortable: false,
  },
  {
    title: "EMAIL",
    key: "email",
    sortable: false,
  },
  {
    title: "CREATED DATE",
    key: "created_at",
    sortable: true,
  },
  {
    title: "UPDATED DATE",
    key: "updated_at",
    sortable: true,
  },
  {
    title: "STATUS",
    key: "status",
    sortable: false,
  },
  {
    title: "ACTIONS",
    key: "action",
    sortable: false,
  },
];

//::::::::::::::::::::::::::::::::::::::::::::::::::::: STATES
const loading = ref(false);
const pending = ref(false);
const roles = ref([]);
const users = ref([]);

const updateUserId = ref(null);

//:::::::::::::::::::::::: DIALOG
const dialogRef = ref();
const dialogCreate = ref(false);
const dialogUpdate = ref(false);
const dialogReset = ref(false);

//:::::::::::::::::::::::: TABLE & PAGINATION
const perPage = ref(10);
const page = ref(1);
const total = ref(0);
const sortBy = ref([]);

//:::::::::::::::::::::::: FILTER
const searchQuery = ref("");
const selectedRole = ref(null);
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
    const res = await axiosInstance.get("/setting/setup?select=role");
    roles.value = res.data.data.roles;
  } catch (error) {
    console.error("Error fetching roles:", error);
  } finally {
    loading.value = false;
  }
};

const getUsers = async () => {
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
    if (selectedRole.value) {
      params.append("role_id", selectedRole.value);
    }

    if (selectedStatus.value !== null) {
      params.append("is_active", selectedStatus.value);
    }

    // Sorting
    if (sortBy.value.length > 0) {
      const sortItem = sortBy.value[0];
      params.append("sort_direction", sortItem.order);
    }

    const res = await axiosInstance.get(`/user?${params.toString()}`);
    users.value = res.data.data;
    total.value = res.data.meta.total;
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    loading.value = false;
  }
};

const toggleStatus = async (id) => {
  pending.value = true;
  try {
    await axiosInstance.put(`/user/${id}/toggle-status`);
    // Refresh current page data
    await getUsers();
  } catch (error) {
    alert("Error updating status");
    console.error("Error toggling status:", error);
  } finally {
    pending.value = false;
  }
};

//::::::::::::::::::::::::::::::::::::::::::::::::::::: ACTION HANDLERS

const editUser = (user) => {
  updateUserId.value = user.id;
  dialogUpdate.value = true;
};

const resetPassword = (user) => {
  updateUserId.value = user.id;
  dialogReset.value = true;
};

const deleteUser = async (user) => {
  const confirm = await dialogRef.value.show({
    title: "Confirm Back",
    message: "Your data will be lost after back??",
    type: "danger",
  });

  if (confirm) {
    try {
      pending.value = true;
      await axiosInstance.delete(`/user/${user.id}`);
      getUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      pending.value = false;
    }
  }
};

//::::::::::::::::::::::::::::::::::::::::::::::::::::: EVENT HANDLERS

const handleSortChange = (newSortBy) => {
  sortBy.value = newSortBy;
  page.value = 1;
  getUsers();
};

const handlePageChange = (newPage) => {
  page.value = newPage;
  getUsers();
};

const handlePerPageChange = (newPerPage) => {
  perPage.value = newPerPage;
  page.value = 1; // Reset to first page when items per page changes
  getUsers();
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
  getUsers();
}, 500);

const debouncedFilter = debounce(() => {
  page.value = 1; // Reset to first page when filtering
  getUsers();
}, 300);

//::::::::::::::::::::::::::::::::::::::::::::::::::::: WATCHERS

watch(searchQuery, () => {
  debouncedSearch();
});

watch([selectedRole, selectedStatus], () => {
  debouncedFilter();
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::: INITIAL
onMounted(async () => {
  try {
    await Promise.all([setup(), getUsers()]);
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});
</script>
