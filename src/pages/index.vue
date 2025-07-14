<template>
  <h1 class="text-3xl font-bold underline bg-amber-200">Hello world!</h1>
</template>

<script setup>
import { useCounterStore } from "@/stores/counter";

const counter = useCounterStore();
</script>
