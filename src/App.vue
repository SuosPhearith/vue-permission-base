<script setup>
import ScrollToTop from "@core/components/ScrollToTop.vue";
import initCore from "@core/initCore";
import { initConfigStore, useConfigStore } from "@core/stores/config";
import { hexToRgb } from "@core/utils/colorConverter";
import { useTheme } from "vuetify";
import axiosInstance from "./utils/axiosInstance";

import Loading from "./components/customs/Loading.vue";
import { useAuthStore } from "./stores/auth";

const { global } = useTheme();

// ℹ️ Sync current theme with initial loader theme
initCore();
initConfigStore();

const configStore = useConfigStore();

//:::::::::::::::::::::::::::::::::::::::::::::::: FETCH PERMISSION

const authStore = useAuthStore();
const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  try {
    const res = await axiosInstance.get("/auth/me");
    authStore.setAuth(res.data);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

//:::::::::::::::::::::::::::::::::::::::::::::::: FETCH PERMISSION
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp
      :style="`--v-global-theme-primary: ${hexToRgb(
        global.current.value.colors.primary
      )}`"
      v-if="!loading"
    >
      <RouterView />

      <ScrollToTop />
    </VApp>
    <Loading v-else />
  </VLocaleProvider>
</template>
