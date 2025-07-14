<script setup>
import { useAuthStore } from "@/stores/auth";
import axiosInstance from "@/utils/axiosInstance";
import { themeConfig } from "@themeConfig";

definePage({
  meta: {
    layout: "blank",
    public: true,
  },
});

// :::::::::::::::::::::::::::::::::::::::::::::::::::: STATES
const form = ref({
  email: "",
  password: "",
});

const isPasswordVisible = ref(false);
const isLoading = ref(false);

const authStore = useAuthStore();

// :::::::::::::::::::::::::::::::::::::::::::::::::::: FUNCTIONS
const handleLogin = async () => {
  isLoading.value = true;

  try {
    const loginData = {
      email: form.value.email,
      password: form.value.password,
    };
    //:::::::: LOGIN
    const resLogin = await axiosInstance.post("/auth/login", loginData);
    window.localStorage.setItem("token", resLogin.data.access_token);
    //:::::::: ME
    const resMe = await axiosInstance.get("/auth/me");
    authStore.setAuth(resMe.data);
    window.location.href = "/";
  } catch (error) {
    console.error("Login error:", error);
  } finally {
    isLoading.value = false;
  }
};
// :::::::::::::::::::::::::::::::::::::::::::::::::::: WATCH
watch(
  form,
  (newValue) => {
    console.log("Form updated:", newValue);
  },
  { deep: true }
);
</script>

<template>
  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol cols="12" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-6">
        <VCardText>
          <h4 class="text-h4 mb-1">
            Welcome to
            <span class="text-capitalize">{{ themeConfig.app.title }}</span
            >! 👋🏻
          </h4>
          <p class="mb-0">Please sign-in to your account</p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="handleLogin">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.email"
                  autofocus
                  label="Email or Username"
                  type="email"
                  placeholder="johndoe@email.com"
                  :disabled="isLoading"
                  required
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  :disabled="isLoading"
                  required
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <!-- remember me -->
              <VCol cols="12"> </VCol>

              <!-- submit button -->
              <VCol cols="12">
                <VBtn
                  block
                  type="submit"
                  :loading="isLoading"
                  :disabled="!form.email || !form.password"
                >
                  Login
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
