<script setup>
import RLMatch from "./RLMatch.vue";
import { ref, onMounted, reactive } from "vue";

const match_info = ref([]);

const match_list = reactive([]);
const batch_size = 2;

const today = new Date().toISOString().split("T")[0];
console.log(today);


const fetchMatches = async () => {
  try {
    console.log("Fetching matches...");

    const url = `https://zsr.octane.gg/matches?after=${today}&perPage=${batch_size}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Failed to fetch matches");
      return;
    }

    const data = await response.json();

    match_list.length = 0; // Clear existing matches
    match_list.push(...data.matches);

    console.log("Fetched matches", match_list);

    for (const match of match_list) {
      if (match.blue && match.orange) {
        match_info.value.push({
          blue: {
            name: match.blue.team.team.name ? match.blue.team.team.name : "TBD",
            score: match.blue.score ? match.blue.score : 0,
            winner: match.blue.winner,
          },
          orange: {
            name: match.orange.team.team.name
              ? match.orange.team.team.name
              : "TBD",
            score: match.orange.score ? match.orange.score : 0,
            winner: match.orange.winner,
          },
          date: {
            day: match.date.split("T")[0],
            time: match.date.split("T")[1].split("Z")[0].slice(0, 5),
          },
        });
      }
    }
    console.log("list of valid matches :", match_info.value);
  } catch (error) {
    console.error("Error fetching matches", error);
  }
};

onMounted(() => {
  fetchMatches();
});
</script>

<template>
  <div class="flex flex-col rounded-xl bg-indigo-900 p-3">
    <p>Upcoming matches</p>
    <div
      class="flex w-full flex-grow flex-col items-center justify-center gap-2 pt-2"
    >
      <div
        v-if="match_info.length > 0"
        v-for="match in match_info"
        :key="match.date"
        class="flex w-full flex-col items-start justify-between rounded-lg bg-indigo-800 p-2 transition hover:bg-indigo-700"
      >
        <RLMatch :match="match" />
      </div>
      <div v-else class="">No Upcoming matches</div>
    </div>
  </div>
</template>
