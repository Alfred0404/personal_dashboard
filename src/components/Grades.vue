<script setup>
import { ref, computed } from "vue";
import Grade from "./Grade.vue";

const grades = ref(null);
const current_month = new Date().getMonth();

window.addEventListener("message", (event) => {
  if (event.origin !== "https://campusonline.inseec.net") {
    return;
  }
  grades.value = JSON.parse(event.data);
  console.log("iframe message received :", grades.value);
});

const all_courses = computed(() => {
  if (!grades.value) return null;

  const current_year = grades.value[0];
  console.log("current_year :", current_year);

  const current_semester =
    current_month <= 1 ? current_year.semesters[0] : current_year.semesters[1];
  console.log("current month :", current_month);
  console.log("current_semester :", current_semester);

  let courses = [];
  let module_id = 0;

  // sort modules by the sum of their courses' coefficients
  current_semester.modules.sort((a, b) => {
    const sum_coef_a = a.courses.reduce((acc, course) => acc + course.coefficient, 0);
    const sum_coef_b = b.courses.reduce((acc, course) => acc + course.coefficient, 0);
    return sum_coef_b - sum_coef_a;
  });

  current_semester.modules.forEach((module) => {
    module_id++;
    module.courses.forEach((course) => {
      course.module_id = module_id;
      courses.push(course);
    });
  });

  // tri les cours par coefficient décroissant
  courses.sort((a, b) => b.coefficient - a.coefficient);
  // sort by module_id
  courses.sort((a, b) => a.module_id - b.module_id);

  console.log("all courses :", courses);
  return courses;
});
</script>

<template>
  <div class="flex flex-col rounded-xl bg-indigo-900 p-3">
    <p>Grades</p>
    <div class="flex w-full flex-grow flex-col items-center justify-end">
      <div class="grid grid-cols-3 w-full gap-2">
        <Grade
          class="text-xs"
          v-for="course in all_courses"
          :key="course.name"
          :course="course.name.split(' / ')[0]"
          :grade="course.average"
          :coef="course.coefficient"
          :module_id="course.module_id"
        />
      </div>
    </div>
    <iframe
      class="hidden h-full w-full flex-grow rounded-lg border-2 border-indigo-400"
      src="https://campusonline.inseec.net/note/note.php?AccountName=0%2BHIsIomHaMXLccdGi6GmWIfC2E1e%2BWv3lbOOw%2FzJoQ%3D%20&couleur=VERT"
      frameborder="0"
      allowfullscreen
    ></iframe>
  </div>
</template>
