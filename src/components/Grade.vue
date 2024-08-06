<script setup>
const props = defineProps(["course", "grade"]);

const get_background_color = (grade) => {
  if (grade >= 15.0 && grade <= 20.0) {
    return "bg-green-600 text-green-100 hover:bg-green-500";
  } else if (grade >= 10.0 && grade < 15.0) {
    return "bg-lime-600 text-lime-100 hover:bg-lime-500";
  } else if (grade >= 5.0 && grade < 10.0) {
    return "bg-amber-600 text-amber-100 hover:bg-amber-500";
  } else if (grade >= 0.0 && grade < 5.0) {
    return "bg-rose-600 text-rose-100 hover:bg-rose-500";
  }
};
</script>

<template>
  <div
    class="h-full w-full rounded-lg p-1.5 transition"
    :class="get_background_color(props.grade)"
  >
    <p>{{ props.course }}</p>
    <p>{{ props.grade }}</p>
  </div>
</template>
