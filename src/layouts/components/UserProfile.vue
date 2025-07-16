<template>
  <ConfirmDialog ref="dialogRef" />
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg :src="avatar1" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar color="primary" variant="tonal">
                    <VImg :src="avatar1" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ authUser.name || " " }}
            </VListItemTitle>
            <VListItemSubtitle>{{ authUser.email || " " }}</VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="tabler-user" size="22" />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="tabler-settings" size="22" />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem>

          <!-- 👉 Pricing -->
          <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="tabler-currency-dollar" size="22" />
            </template>

            <VListItemTitle>Pricing</VListItemTitle>
          </VListItem>

          <!-- 👉 FAQ -->
          <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="tabler-help" size="22" />
            </template>

            <VListItemTitle>FAQ</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <div class="flex mx-2">
            <VBtn
              class="w-full"
              @click="logoutUser(authUser?.id)"
              color="error"
            >
              <template #prepend>
                <VIcon class="me-2" icon="tabler-logout" size="22" />
              </template>
              Logout
            </VBtn>
          </div>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>

<script setup>
// Import VueJS
import { onMounted, ref } from "vue";

// Import Assets
import ConfirmDialog from "@/components/customs/confirm/ConfirmDialog.vue";
import avatar1 from "@images/avatars/avatar-1.png";

const authUser = ref(null);
const dialogRef = ref();

const getUserAuth = async () => {
  const res = await axiosInstance.get(`/auth/me`);
  authUser.value = res.data.user;
};

const logoutUser = async (userId) => {
  const confirm = await dialogRef.value.show({
    title: "Confirm Logout",
    message: "Are you sure to logout this User?",
    type: "danger",
  });

  if (confirm) {
    try {
      await axiosInstance.post(`/auth/logout`);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
    }
  }
};

onMounted(async () => {
  try {
    await Promise.all([getUserAuth()]);
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});
</script>
