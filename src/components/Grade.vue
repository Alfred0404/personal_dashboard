<script setup>
const props = defineProps(["course", "grade", "coef", "module_id"]);

const get_background_color = (grade) => {
  if (grade >= 15.0 && grade <= 20.0) {
    return "text-green-400";
  } else if (grade >= 10.0 && grade < 15.0) {
    return "text-lime-400";
  } else if (grade >= 5.0 && grade < 10.0) {
    return "text-orange-400";
  } else if (grade >= 0.0 && grade < 5.0) {
    return "text-rose-400";
  }
};

const get_after_style = (module_id) => {
  const module_styles = {
    1: "after:bg-teal-600",
    2: "after:bg-fuchsia-600",
    3: "after:bg-blue-600",
    4: "after:bg-pink-600",
  };
  return module_styles[module_id] || "";
};
</script>

<template>
  <div
    class="h-full w-auto rounded-lg transition"
    :class="[get_background_color(props.grade), 'row-span-1'].join(' ')"
  >
    <div
      class="relative flex h-full flex-col justify-between p-2 before:absolute before:bottom-0 before:right-0 before:z-30 before:flex before:size-fit before:items-center before:justify-center before:rounded-br-sm before:rounded-tl-lg before:bg-indigo-900 before:px-2 before:py-1 before:text-indigo-50 before:content-[attr(data-coef)] after:absolute after:inset-0 after:flex after:h-full after:items-center after:justify-center after:rounded-md"
      :class="get_after_style(props.module_id)"
      :data-module-id="props.module_id"
      :data-coef="props.coef"
    >
      <p class="z-10 text-indigo-50">{{ props.course }}</p>
      <p class="z-10 font-bold">{{ props.grade }}</p>
    </div>
  </div>
</template>
