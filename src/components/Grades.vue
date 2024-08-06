<script setup>
import Grade from "./Grade.vue";
</script>

<template>
  <div class="rounded-xl bg-indigo-900 p-3 flex flex-col">
    <p>Grades</p>
    <div class="flex w-full flex-grow flex-col items-center justify-end">
      <div class="grid grid-cols-5 grid-rows-2 gap-2 w-full">
        <Grade class="col-span-1 row-span-2" course="Maths" grade="13.7" />
        <Grade class="col-span-2 row-span-1" course="Physique" grade="8.2" />
        <Grade class="col-span-2 row-span-1" course="Info" grade="17.8" />
        <Grade class="col-span-2 row-span-1" course="Elec" grade="4.5" />
        <Grade class="col-span-1 row-span-1" course="Ang" grade="15.8" />
        <Grade class="col-span-1 row-span-1" course="Jap" grade="16.5" />
      </div>
    </div>
  </div>
</template>
