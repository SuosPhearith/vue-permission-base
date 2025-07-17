<script setup>
import { useAuthStore } from "@/stores/auth";
import axiosInstance from "@/utils/axiosInstance";
import authV1BottomShape from "@images/svg/auth-v1-bottom-shape.svg?raw";
import authV1TopShape from "@images/svg/auth-v1-top-shape.svg?raw";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import { useRouter } from "vue-router";
const router = useRouter();

definePage({
  meta: {
    layout: "blank",
    public: true,
  },
});

// :::::::::::::::::::::::::::::::::::::::::::::::::::: STATES
const form = ref({
  login: "rotha@gmail.com",
  password: "123456",
});

const isPasswordVisible = ref(false);
const isLoading = ref(false);
const showVerification = ref(false);
const otp = ref("");
const isOtpInserted = ref(false);
const twoFactorKey = ref("");

const authStore = useAuthStore();

// :::::::::::::::::::::::::::::::::::::::::::::::::::: FUNCTIONS
const handleLogin = async () => {
  isLoading.value = true;

  try {
    const loginData = {
      login: form.value.login,
      password: form.value.password,
    };

    const resLogin = await axiosInstance.post("/auth/login", loginData);
    const { access_token, verify, two_factor_key } = resLogin.data;

    // Store token
    window.localStorage.setItem("token", access_token);

    // Fetch user info
    const resMe = await axiosInstance.get("/auth/me");
    authStore.setAuth(resMe.data);

    if (verify === true) {
      showVerification.value = true;
      twoFactorKey.value = two_factor_key;
    } else {
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Login error:", error?.response?.data || error.message);
  } finally {
    isLoading.value = false;
  }
};

const handleOtpVerification = async () => {
  isOtpInserted.value = true;

  try {
    // Add your OTP verification logic here
    const verifyData = {
      two_factor_key: twoFactorKey.value,
      otp: otp.value,
    };

    const resVerify = await axiosInstance.post("/auth/2fa/verify", verifyData);

    window.localStorage.setItem("token", resVerify.data.access_token);
    //:::::::: ME
    const resMe = await axiosInstance.get("/auth/me");
    authStore.setAuth(resMe.data);

    window.location.href = "/";
  } catch (error) {
    console.error("OTP verification error:", error);
    isOtpInserted.value = false;
  }
};

const onOtpFinish = () => {
  handleOtpVerification();
};

const goBackToLogin = () => {
  showVerification.value = false;
  otp.value = "";
  isOtpInserted.value = false;
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
  <div
    class="auth-wrapper d-flex align-center justify-center pa-4"
    v-if="!showVerification"
  >
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1TopShape })"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />

      <!-- 👉 Bottom shape -->
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1BottomShape })"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
      />

      <!-- 👉 Auth Card -->
      <VCard
        class="auth-card"
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <VCardItem class="justify-center">
          <VCardTitle>
            <RouterLink to="/">
              <div class="app-logo">
                <VNodeRenderer :nodes="themeConfig.app.logo" />
                <h1 class="app-logo-title">
                  {{ themeConfig.app.title }}
                </h1>
              </div>
            </RouterLink>
          </VCardTitle>
        </VCardItem>

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
                  v-model="form.login"
                  autofocus
                  label="Email or Username"
                  type="email"
                  placeholder="johndoe@email.com"
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
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <!-- login button -->
                <VBtn
                  class="mt-4"
                  block
                  type="submit"
                  :loading="isLoading"
                  :disabled="!form.login || !form.password"
                >
                  Login
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>

  <!-- OTP Verification -->
  <div v-else class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1TopShape })"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />

      <VNodeRenderer
        :nodes="h('div', { innerHTML: authV1BottomShape })"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
      />

      <VCard
        class="auth-card"
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <VCardItem class="justify-center">
          <VCardTitle>
            <RouterLink to="/">
              <div class="app-logo">
                <VNodeRenderer :nodes="themeConfig.app.logo" />
                <h1 class="app-logo-title">
                  {{ themeConfig.app.title }}
                </h1>
              </div>
            </RouterLink>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <h4 class="text-h4 mb-1">Two Step Verification 💬</h4>
          <p class="mb-1">
            We sent a verification code to your mobile. Enter the code from the
            mobile in the field below.
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="handleOtpVerification">
            <VRow>
              <VCol cols="12">
                <h6 class="text-body-1">Type your 6 digit security code</h6>
                <VOtpInput
                  v-model="otp"
                  :disabled="isOtpInserted"
                  type="number"
                  class="pa-0"
                  @finish="onOtpFinish"
                />
              </VCol>

              <VCol cols="12">
                <VBtn
                  :loading="isOtpInserted"
                  :disabled="isOtpInserted || otp.length !== 6"
                  block
                  type="submit"
                >
                  Verify my account
                </VBtn>
              </VCol>

              <VCol cols="12">
                <div class="d-flex justify-center align-center">
                  <VBtn
                    variant="text"
                    :disabled="isOtpInserted"
                    @click="goBackToLogin"
                  >
                    Back to Login
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";

.v-otp-input {
  .v-otp-input__content {
    padding-inline: 0;
  }
}
</style>
