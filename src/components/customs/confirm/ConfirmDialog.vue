<script setup>
import { computed, defineExpose, ref } from "vue";

const dialog = ref(false);
const resolveFn = ref(null);
const title = ref("");
const message = ref("");
const type = ref("info"); // Default type

const show = (options) => {
  title.value =
    options.title ||
    (options.type === "danger" ? "Confirm Deletion" : "Confirmation");
  message.value =
    options.message ||
    (options.type === "danger"
      ? "Are you sure you want to delete this item?"
      : "Please confirm your action.");
  type.value = options.type || "info";
  dialog.value = true;

  return new Promise((resolve) => {
    resolveFn.value = resolve;
  });
};

const confirm = () => {
  dialog.value = false;
  resolveFn.value(true);
};

const cancel = () => {
  dialog.value = false;
  resolveFn.value(false);
};

// Computed properties for dynamic styling
const iconConfig = computed(() => {
  switch (type.value) {
    case "danger":
      return {
        icon: "tabler-question-mark",
        color: "#dc2626",
        bgColor: "rgba(220, 38, 38, 0.1)",
      };
    case "warning":
      return {
        icon: "tabler-question-mark",
        color: "#d97706",
        bgColor: "rgba(217, 119, 6, 0.1)",
      };
    case "success":
      return {
        icon: "tabler-question-mark",
        color: "#059669",
        bgColor: "rgba(5, 150, 105, 0.1)",
      };
    case "info":
    default:
      return {
        icon: "tabler-question-mark",
        color: "#2563eb",
        bgColor: "rgba(37, 99, 235, 0.1)",
      };
  }
});

const confirmButtonConfig = computed(() => {
  switch (type.value) {
    case "danger":
      return { text: "Delete", color: "#dc2626", bgColor: "#dc2626" };
    case "warning":
      return { text: "Continue", color: "#d97706", bgColor: "#d97706" };
    case "success":
      return { text: "Confirm", color: "#059669", bgColor: "#059669" };
    case "info":
    default:
      return { text: "Confirm", color: "#2563eb", bgColor: "#2563eb" };
  }
});

defineExpose({ show });
</script>

<template>
  <v-dialog v-model="dialog" max-width="440" persistent>
    <v-card class="dialog-card" elevation="24">
      <!-- Content Section -->
      <div class="dialog-content">
        <!-- Icon Container -->
        <div
          class="icon-container"
          :style="{ backgroundColor: iconConfig.bgColor }"
        >
          <v-icon :color="iconConfig.color" size="46" class="icon">
            {{ iconConfig.icon }}
          </v-icon>
        </div>

        <!-- Title -->
        <h2 class="dialog-title">
          {{ title }}
        </h2>

        <!-- Message -->
        <p class="dialog-message">
          {{ message }}
        </p>
      </div>

      <!-- Actions Section -->
      <div class="dialog-actions">
        <v-btn
          class="action-btn cancel-btn"
          variant="outlined"
          @click="cancel"
          size="large"
        >
          Cancel
        </v-btn>
        <v-btn
          class="action-btn confirm-btn"
          variant="flat"
          @click="confirm"
          size="large"
          :style="{
            backgroundColor: confirmButtonConfig.bgColor,
            color: 'white',
          }"
        >
          {{ confirmButtonConfig.text }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dialog-card {
  border-radius: 16px !important;
  border: none;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 24px 24px;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.icon {
  flex-shrink: 0;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.dialog-message {
  font-size: 15px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
  max-width: 320px;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
}

.action-btn {
  flex: 1;
  height: 44px !important;
  border-radius: 8px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  box-shadow: none !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.cancel-btn {
  color: #6b7280 !important;
  border-color: #d1d5db !important;
  background-color: transparent !important;
}

.cancel-btn:hover {
  background-color: #f9fafb !important;
  border-color: #9ca3af !important;
}

.confirm-btn {
  position: relative;
  overflow: hidden;
}

.confirm-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.confirm-btn:active {
  transform: translateY(0);
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .dialog-content {
    padding: 24px 20px 20px;
  }

  .dialog-actions {
    flex-direction: column;
    padding: 0 20px 20px;
  }

  .action-btn {
    flex: none;
  }

  .dialog-message {
    font-size: 14px;
  }
}
</style>
