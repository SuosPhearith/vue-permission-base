<script setup>
import navItems from "@/navigation/vertical";
import { themeConfig } from "@themeConfig";

// Components
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import UserProfile from "@/layouts/components/UserProfile.vue";
import NavBarI18n from "@core/components/I18n.vue";

// @layouts plugin
import { VerticalNavLayout } from "@layouts";
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center justify-between">
        <div>
          <IconBtn
            id="vertical-nav-toggle-btn"
            class="ms-n3 d-lg-none"
            @click="toggleVerticalOverlayNavActive(true)"
          >
            <VIcon size="26" icon="tabler-menu-2" />
          </IconBtn>
        </div>

        <div class="flex justify-center items-center gap-2">
          <NavbarThemeSwitcher />

          <NavBarI18n
            v-if="
              themeConfig.app.i18n.enable &&
              themeConfig.app.i18n.langConfig?.length
            "
            :languages="themeConfig.app.i18n.langConfig"
          />
          <UserProfile />
        </div>
      </div>
    </template>

    <!-- 👉 Pages -->
    <slot />
  </VerticalNavLayout>
</template>
