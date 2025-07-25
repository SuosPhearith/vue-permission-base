<script setup>
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const smsVerificationNumber = ref('+1(968) 819-2547')
const isTwoFactorDialogOpen = ref(false)

// Recent devices Headers
const recentDeviceHeader = [
  {
    title: 'BROWSER',
    key: 'browser',
  },
  {
    title: 'DEVICE',
    key: 'device',
  },
  {
    title: 'LOCATION',
    key: 'location',
  },
  {
    title: 'RECENT ACTIVITY',
    key: 'activity',
  },
]

const recentDevices = [
  {
    browser: 'Chrome on Windows',
    logo: 'tabler-brand-windows',
    color: 'info',
    device: 'HP Specter 360',
    location: 'Switzerland',
    activity: '10, July 2021 20:07',
  },
  {
    browser: 'Chrome on iPhone',
    logo: 'tabler-device-mobile',
    color: 'error',
    device: 'iPhone 12x',
    location: 'Australia',
    activity: '13, July 2021 10:10',
  },
  {
    browser: 'Chrome on Android',
    logo: 'tabler-brand-android',
    color: 'success',
    device: 'OnePlus 9 Pro',
    location: 'Dubai',
    activity: '4, July 2021 15:15',
  },
  {
    browser: 'Chrome on macOS',
    logo: 'tabler-brand-apple',
    color: 'secondary',
    device: 'Apple iMac',
    location: 'India',
    activity: '20, July 2021 21:01',
  },
  {
    browser: 'Chrome on Windows',
    logo: 'tabler-brand-windows',
    color: 'info',
    device: 'HP Specter 360',
    location: 'Switzerland',
    activity: '10, July 2021 20:07',
  },
  {
    browser: 'Chrome on Android',
    logo: 'tabler-brand-android',
    color: 'success',
    device: 'OnePlus 9 Pro',
    location: 'Dubai',
    activity: '4, July 2021 15:15',
  },
]
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- 👉 Change password -->
      <VCard title="Change Password">
        <VCardText>
          <VAlert
            variant="tonal"
            color="warning"
            title="Ensure that these requirements are met"
            text="Minimum 8 characters long, uppercase & symbol"
            class="mb-4"
            closable
          />

          <VForm @submit.prevent="() => {}">
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  label="New Password"
                  placeholder="············"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  label="Confirm Password"
                  autocomplete="confirm-password"
                  placeholder="············"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>

              <VCol cols="12">
                <VBtn type="submit">
                  Change Password
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Two step verification -->
      <VCard
        title="Two-steps verification"
        subtitle="Keep your account secure with authentication step."
      >
        <VCardText>
          <div class="text-h6 mb-1">
            SMS
          </div>
          <AppTextField placeholder="+1(968) 819-2547">
            <template #append>
              <IconBtn>
                <VIcon
                  icon="tabler-edit"
                  size="22"
                />
              </IconBtn>
              <IconBtn>
                <VIcon
                  icon="tabler-user-plus"
                  size="22"
                />
              </IconBtn>
            </template>
          </AppTextField>

          <p class="mb-0 mt-4">
            Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to log in. <a
              href="javascript:void(0)"
              class="text-decoration-none"
            >Learn more</a>.
          </p>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Recent devices -->
      <VCard title="Recent devices">
        <VDivider />
        <VDataTable
          :items="recentDevices"
          :headers="recentDeviceHeader"
          hide-default-footer
          class="text-no-wrap"
        >
          <template #item.browser="{ item }">
            <div class="d-flex align-center gap-x-4">
              <VIcon
                :icon="item.logo"
                :color="item.color"
                size="22"
              />
              <div class="text-body-1 text-high-emphasis">
                {{ item.browser }}
              </div>
            </div>
          </template>
          <!-- TODO Refactor this after vuetify provides proper solution for removing default footer -->
          <template #bottom />
        </VDataTable>
      </VCard>
    </VCol>
  </VRow>

  <!-- 👉 Enable One Time Password Dialog -->
  <TwoFactorAuthDialog
    v-model:is-dialog-visible="isTwoFactorDialogOpen"
    :sms-code="smsVerificationNumber"
  />
</template>
