import { defineThemeConfig } from "@core";
import { Skins } from "@core/enums";
import { breakpointsVuetifyV3 } from "@vueuse/core";
import { VIcon } from "vuetify/components/VIcon";

// ❗ Logo SVG must be imported with ?raw suffix
import logo from "@images/logo.svg?raw";
import {
  AppContentLayoutNav,
  ContentWidth,
  FooterType,
  NavbarType,
} from "@layouts/enums";

let config = localStorage.getItem("config")
  ? JSON.parse(localStorage.getItem("config"))
  : {};

export const { themeConfig, layoutConfig } = defineThemeConfig({
  app: {
    title: config?.app_config?.app_name ?? "Pharmacy",
    logo: h("div", {
      innerHTML: logo,
      style: "line-height:0; color: rgb(var(--v-global-theme-primary))",
    }),
    contentWidth: ContentWidth.Boxed,
    contentLayoutNav:
      config?.app_config?.layout === "vertical"
        ? AppContentLayoutNav.Vertical
        : AppContentLayoutNav.Horizontal,
    overlayNavFromBreakpoint: breakpointsVuetifyV3.lg - 1, // 1 for matching with vuetify breakpoint. Docs: https://next.vuetifyjs.com/en/features/display-and-platform/
    i18n: {
      enable: false,
      defaultLocale: "en",
      langConfig: [
        {
          label: "English",
          i18nLang: "en",
          isRTL: false,
        },
        {
          label: "French",
          i18nLang: "fr",
          isRTL: false,
        },
        {
          label: "Arabic",
          i18nLang: "ar",
          isRTL: true,
        },
      ],
    },
    theme: "light",
    skin:
      config?.app_config?.skin === "bordered" ? Skins.Bordered : Skins.Default,
    iconRenderer: VIcon,
  },
  navbar: {
    type: NavbarType.Sticky,
    navbarBlur: true,
  },
  footer: { type: FooterType.Static },
  verticalNav: {
    isVerticalNavCollapsed: false,
    defaultNavItemIconProps: { icon: "tabler-circle" },
    isVerticalNavSemiDark: false,
  },
  horizontalNav: {
    type: "sticky",
    transition: "slide-y-reverse-transition",
    popoverOffset: 6,
  },

  /*
    // ℹ️  In below Icons section, you can specify icon for each component. Also you can use other props of v-icon component like `color` and `size` for each icon.
    // Such as: chevronDown: { icon: 'tabler-chevron-down', color:'primary', size: '24' },
    */
  icons: {
    chevronDown: { icon: "tabler-chevron-down" },
    chevronRight: { icon: "tabler-chevron-right", size: 20 },
    close: { icon: "tabler-x", size: 20 },
    verticalNavPinned: { icon: "tabler-circle-dot", size: 20 },
    verticalNavUnPinned: { icon: "tabler-circle", size: 20 },
    sectionTitlePlaceholder: { icon: "tabler-minus" },
  },
});
