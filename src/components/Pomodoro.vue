<template>
  <div class="flex h-full w-full flex-col rounded-xl bg-indigo-900 p-3">
    <p>Pomodoro</p>
    <div
      class="flex flex-grow flex-col items-center justify-evenly rounded-lg"
      :class="currentState === 'Rest Time' ? 'bg-green-500' : 'bg-indigo-950'"
    >
      <p class="text-3xl text-indigo-50">{{ currentState }}</p>
      <p class="text-6xl">{{ formatTime(timer) }}</p>
      <div class="mt-3 flex items-center justify-center">
        <button
          class="cursor-pointer rounded-lg bg-indigo-700 px-4 py-2 text-indigo-200 transition hover:bg-indigo-500 hover:text-indigo-50"
          @click="startTimer"
          v-if="!isTimerRunning"
        >
          Start Session
        </button>
        <button
          class="cursor-pointer rounded-lg bg-indigo-700 px-4 py-2 text-indigo-200 transition hover:bg-indigo-500 hover:text-indigo-50"
          @click="stopTimer"
          v-else
        >
          Stop Session
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const workTime = 25 * 60; // 25 minutes in seconds
const restTime = 5 * 60; // 5 minutes in seconds

const timer = ref(workTime);
const isWorking = ref(true);
const isTimerRunning = ref(false);

function startTimer() {
  isTimerRunning.value = true;
  const interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      isWorking.value = !isWorking.value;
      timer.value = isWorking.value ? workTime : restTime;
    }
  }, 1000);

  watch(isTimerRunning, (newValue) => {
    if (!newValue) {
      clearInterval(interval);
    }
  });
}

function stopTimer() {
  isTimerRunning.value = false;
  timer.value = workTime;
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

const currentState = computed(() => {
  return isWorking.value ? "Work Time" : "Rest Time";
});
</script>
