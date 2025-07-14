<template>
  <div>
    <v-card>
      <VCardText class="d-flex flex-wrap gap-4">
        <VSpacer />

        <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div style="inline-size: 15.625rem">
            <AppTextField v-model="searchQuery" placeholder="Search User" />
          </div>

          <!-- 👉 Add user button -->
          <VBtn
            prepend-icon="tabler-plus"
            @click="isAddNewUserDrawerVisible = true"
          >
            Add New User
          </VBtn>
        </div>
      </VCardText>
      <VCardText>
        <VRow>
          <!-- 👉 Select Role -->
          <VCol cols="12" sm="4">
            <AppSelect
              v-model="selectedRole"
              placeholder="Select Role"
              :items="roles"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>
          <!-- 👉 Select Plan -->
          <VCol cols="12" sm="4">
            <AppSelect
              v-model="selectedPlan"
              placeholder="Select Plan"
              :items="plans"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>
          <!-- 👉 Select Status -->
          <VCol cols="12" sm="4">
            <AppSelect
              v-model="selectedStatus"
              placeholder="Select Status"
              :items="status"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />
      <VDataTable
        :headers="headers"
        :items="users"
        :items-per-page="10"
        :loading="loading"
        fixed-header
      >
        <!-- full name -->
        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <VAvatar
              size="32"
              :color="item.avatar ? '' : 'primary'"
              :class="item.avatar ? '' : 'v-avatar-light-bg primary--text'"
              :variant="!item.avatar ? 'tonal' : undefined"
            >
              <VImg v-if="item.avatar" :src="item.avatar" />
              <span v-else>{{ avatarText(item.fullName) }}</span>
            </VAvatar>
            <div class="d-flex flex-column ms-3">
              <span
                class="d-block font-weight-medium text-high-emphasis text-truncate"
                >{{ item.name }}</span
              >
              <small>
                <span v-for="role in item.roles" class="">
                  {{ role.name }}</span
                >
              </small>
            </div>
          </div>
        </template>
      </VDataTable>
    </v-card>
  </div>
</template>

<script setup>
import axiosInstance from "@/utils/axiosInstance";

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
    key: "startDate",
    sortable: false,
  },
  {
    title: "STATUS",
    key: "status",
    sortable: false,
  },
  {
    title: "ACTION",
    key: "action",
    sortable: false,
  },
];

//::::::::::::::::::::::::::::::::::::::::::::::::::::: STATES
const loading = ref(false);
const users = ref([]);

//::::::::::::::::::::::::::::::::::::::::::::::::::::: FUNCTIONS
const getHome = async () => {
  loading.value = true;
  try {
    const res = await axiosInstance.get("/user");
    users.value = res.data.data;
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

//::::::::::::::::::::::::::::::::::::::::::::::::::::: INITIAL
onMounted(() => {
  getHome();
});
</script>
