<template>
  <VCard title="Permission Management" :loading="loading">
    <VCardText>
      <div v-if="permissions.length > 0">
        <div v-for="module in permissions" :key="module.id" class="mb-6">
          <h6
            class="text-h6 mb-3 d-flex align-center justify-between border rounded-md px-3"
          >
            <span>{{ module.name }}</span>
            <VSwitch
              :model-value="module.is_active"
              @change="toggleModuleActive(module)"
              color="success"
              hide-details
              inset
            />
          </h6>

          <VRow class="">
            <VCol
              v-for="permission in module.permissions"
              :key="permission.id"
              cols="12"
              md="6"
              lg="4"
            >
              <div
                class="d-flex align-center justify-between px-3 border rounded"
              >
                <VTooltip>
                  <template #activator="{ props }">
                    <span v-bind="props" class="text-body-2">
                      {{ formatPermissionName(permission.name) }}
                    </span>
                  </template>
                  <span>{{ permission.name }}</span>
                </VTooltip>

                <VSwitch
                  :model-value="permission.is_active"
                  @change="togglePermissionActive(permission)"
                  :disabled="!module.is_active"
                  :loading="pending"
                  color="success"
                  hide-details
                  inset
                  size="small"
                />
              </div>
            </VCol>
          </VRow>
        </div>
      </div>

      <div v-else-if="!loading" class="text-center py-8">
        <VIcon icon="mdi-shield-alert" size="48" class="text-disabled mb-4" />
        <p class="text-disabled">No permissions available</p>
      </div>

      <div v-if="loading" class="text-center py-8">
        <VProgressCircular indeterminate color="primary" size="40" />
        <p class="text-disabled mt-3">Loading permissions...</p>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup>
import axiosInstance from "@/utils/axiosInstance";

//::::::::::::::::::::::::::::::::::::::::::::::::::::: STATES
const permissions = ref([]);
const originalPermissions = ref([]);
const loading = ref(false);
const pending = ref(false);

//::::::::::::::::::::::::::::::::::::::::::::::::::::: FUNCTIONS
const getPermission = async () => {
  loading.value = true;
  try {
    const res = await axiosInstance.get("/setting/module");
    permissions.value = res.data.data;
    originalPermissions.value = JSON.parse(JSON.stringify(res.data.data));
  } catch (error) {
    console.error("Error fetching permissions:", error);
  } finally {
    loading.value = false;
  }
};

const togglePermissionActive = async (permission) => {
  pending.value = true;
  try {
    await axiosInstance.put(`/setting/permission/${permission.id}`);
  } catch (error) {
    console.error("Error fetching permissions:", error);
  } finally {
    pending.value = false;
  }
};

const toggleModuleActive = async (module) => {
  pending.value = true;
  try {
    await axiosInstance.put(`/setting/module/${module.id}`);
    module.is_active = !module.is_active;
  } catch (error) {
    console.error("Error fetching modules:", error);
  } finally {
    pending.value = false;
  }
};

const formatPermissionName = (name) => {
  return name.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

//::::::::::::::::::::::::::::::::::::::::::::::::::::: INITIAL
onMounted(async () => {
  try {
    await Promise.all([getPermission()]);
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});
</script>
