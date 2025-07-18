<template>
  <div>
    <ConfirmDialog ref="dialogRef" />
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold text-high-emphasis mb-2">
        Application Configuration
      </h1>
      <p class="text-body-1 text-medium-emphasis">
        Configure your application's basic settings, layout preferences, and
        visual appearance.
      </p>
    </div>

    <VForm ref="form" lazy-validation>
      <VRow>
        <!-- Main Configuration Card -->
        <VCol cols="12" md="8">
          <VCard elevation="2" class="mb-6" :loading="loading">
            <VCardItem>
              <VCardTitle class="text-h5 font-weight-bold">
                <VIcon icon="tabler-settings" class="me-2" />
                General Settings
              </VCardTitle>
              <VCardSubtitle>
                Configure basic application information and branding
              </VCardSubtitle>
            </VCardItem>

            <VCardText>
              <VRow>
                <VCol cols="12">
                  <VTextField
                    v-model="appForm.appName"
                    label="Application Name"
                    placeholder="Enter your application name"
                    prepend-inner-icon="tabler-apps"
                    variant="outlined"
                    :rules="[requiredValidator]"
                    hint="This name will appear in the header and browser title"
                    persistent-hint
                  />
                </VCol>
              </VRow>
            </VCardText>

            <VDivider />

            <VCardText>
              <VRow>
                <VCol cols="12" md="6">
                  <VAutocomplete
                    v-model="appForm.layout"
                    label="Layout Style"
                    placeholder="Select layout"
                    prepend-inner-icon="tabler-layout"
                    item-title="name"
                    item-value="id"
                    variant="outlined"
                    clear-icon="tabler-x"
                    :items="layoutOptions"
                    :rules="[requiredValidator]"
                    hint="Choose how your navigation will be displayed"
                    persistent-hint
                  >
                    <template #item="{ props, item }">
                      <VListItem v-bind="props">
                        <template #prepend>
                          <VIcon :icon="item.raw.icon" />
                        </template>
                        <VListItemSubtitle>{{
                          item.raw.description
                        }}</VListItemSubtitle>
                      </VListItem>
                    </template>
                  </VAutocomplete>
                </VCol>

                <VCol cols="12" md="6">
                  <VAutocomplete
                    v-model="appForm.skin"
                    label="Visual Theme"
                    placeholder="Select theme"
                    prepend-inner-icon="tabler-palette"
                    item-title="name"
                    item-value="id"
                    variant="outlined"
                    clear-icon="tabler-x"
                    :items="skinOptions"
                    :rules="[requiredValidator]"
                    hint="Choose your preferred visual style"
                    persistent-hint
                  >
                    <template #item="{ props, item }">
                      <VListItem v-bind="props">
                        <template #prepend>
                          <VIcon :icon="item.raw.icon" />
                        </template>
                        <VListItemSubtitle>{{
                          item.raw.description
                        }}</VListItemSubtitle>
                      </VListItem>
                    </template>
                  </VAutocomplete>
                </VCol>
              </VRow>
            </VCardText>

            <VDivider />

            <VCardActions class="pa-4">
              <VSpacer />
              <VBtn variant="outlined" @click="resetForm" :disabled="pending">
                Reset
              </VBtn>
              <VBtn color="primary" @click="handleSubmit" :loading="pending">
                Save Configuration
              </VBtn>
            </VCardActions>
          </VCard>
        </VCol>

        <!-- Preview/Info Card -->
        <VCol cols="12" md="4">
          <!-- Help Card -->
          <VCard elevation="2">
            <VCardItem>
              <VCardTitle class="text-h5 font-weight-bold">
                <VIcon icon="tabler-calendar-cog" class="me-2" />
                Datetime
              </VCardTitle>
              <VCardSubtitle>
                Configure Datetime Format to Display
              </VCardSubtitle>
            </VCardItem>

            <VCardText>
              <VAutocomplete
                v-model="selectedDatetimeId"
                label="Datetime Format"
                prepend-inner-icon="tabler-calendar-cog"
                item-title="format"
                item-value="id"
                variant="outlined"
                clear-icon="tabler-x"
                :items="dateTimeData"
                :rules="[requiredValidator]"
                hint="Choose how your datatime will be displayed"
                persistent-hint
              >
              </VAutocomplete>
            </VCardText>
            <VDivider />

            <VCardActions class="pa-4">
              <VSpacer />
              <VBtn
                color="primary"
                @click="handleSubmitDatetime"
                :loading="pending"
              >
                Save Configuration
              </VBtn>
            </VCardActions>
          </VCard>
        </VCol>
      </VRow>
    </VForm>
  </div>
</template>

<script setup>
import { requiredValidator } from "@/@core/utils/validators";
import ConfirmDialog from "@/components/customs/confirm/ConfirmDialog.vue";
import useSnackbar from "@/composables/useSnackbar";
import axiosInstance from "@/utils/axiosInstance";

import { onMounted, ref } from "vue";

const { trigger } = useSnackbar();

const dialogRef = ref();

const form = ref(null);

const selectedDatetimeId = ref(null);
const dateTimeData = ref([]);

const appForm = ref({
  appName: null,
  layout: null,
  skin: null,
});

const originalForm = ref({
  appName: null,
  layout: null,
  skin: null,
});

const loading = ref(false);
const pending = ref(false);

const layoutOptions = [
  {
    id: "vertical",
    name: "Vertical Layout",
    description: "Side navigation menu",
    icon: "tabler-layout-sidebar",
  },
  {
    id: "horizontal",
    name: "Horizontal Layout",
    description: "Top navigation menu",
    icon: "tabler-layout-navbar",
  },
];

const skinOptions = [
  {
    id: "default",
    name: "Default Theme",
    description: "Clean and modern appearance",
    icon: "tabler-palette",
  },
  {
    id: "bordered",
    name: "Bordered Theme",
    description: "Defined borders and sections",
    icon: "tabler-border-all",
  },
];

const getData = async () => {
  loading.value = true;
  try {
    const res = await axiosInstance.get("/config");
    const config = res.data?.data?.app_config;
    const configDatetime = res.data?.data?.datetime_format;

    appForm.value.appName = config?.app_name || null;
    appForm.value.layout = config?.layout || null;
    appForm.value.skin = config?.skin || null;

    selectedDatetimeId.value = configDatetime?.active || null;
    dateTimeData.value = configDatetime?.formats || [];

    // Store original values for reset functionality
    originalForm.value = { ...appForm.value };
  } catch (error) {
    console.error("Error fetching app config:", error);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  const confirm = await dialogRef.value.show({
    title: "Confirm",
    message: "Are you sure?",
    type: "primary",
  });

  if (confirm) {
    const isValid = await form.value?.validate();

    if (!isValid.valid) return;

    pending.value = true;
    try {
      await axiosInstance.put("/config/app-config", {
        app_name: appForm.value.appName,
        layout: appForm.value.layout,
        skin: appForm.value.skin,
      });
      originalForm.value = { ...appForm.value };
      trigger("Updated Successfully", "success");

      getData();
    } catch (error) {
      console.error("Error saving app config:", error);
    } finally {
      pending.value = false;
    }
  }
};

const handleSubmitDatetime = async () => {
  const confirm = await dialogRef.value.show({
    title: "Confirm",
    message: "Are you sure?",
    type: "primary",
  });

  if (confirm) {
    const isValid = await form.value?.validate();

    if (!isValid.valid) return;

    pending.value = true;
    try {
      await axiosInstance.put("/config/app-datetime", {
        active: +selectedDatetimeId.value,
      });
      trigger("Updated Successfully", "success");
      getData();
    } catch (error) {
      console.error("Error saving app config:", error);
    } finally {
      pending.value = false;
    }
  }
};

const resetForm = () => {
  appForm.value = { ...originalForm.value };
  form.value?.resetValidation();
};

onMounted(() => {
  getData();
});
</script>
