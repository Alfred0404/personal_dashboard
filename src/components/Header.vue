<script setup>
import Date from "./Date.vue";
import UseFullLinks from "./UseFulLinks.vue";
import Hello from "./Hello.vue";
</script>

<template>
  <div class="grid grid-cols-10 gap-2">
    <Date class="col-span-3" />
    <UseFullLinks class="col-span-6" />
    <Hello class="col-span-1" name="Alfred" />
  </div>
</template>
