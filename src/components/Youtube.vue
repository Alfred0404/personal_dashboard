<script setup>
import axios from "axios";
import GoogleLogin from "./GoogleLogin.vue";
import { ref, watch } from "vue";

const props = defineProps(["access_token"]);
const access_token = ref(null); // Remplace par le token d'accès obtenu après l'authentification
access_token.value = props.access_token;
const last_video_id = ref(null);
const playlist_id = import.meta.env.VITE_YOUTUBE_PLAYLIST_ID; // Remplace par l'ID de ta playlist YouTube

watch(access_token.value, (new_access_token) => {
  console.log("access token from youtube : ", new_access_token);
});

const fetch_playlist_videos = async () => {
  console.log("access token from youtube : ", access_token.value);

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          part: "snippet",
          playlistId: playlist_id,
          maxResults: 10, // Nombre maximum de résultats à récupérer
        },
        headers: {
          Authorization: `Bearer ${access_token.value}`,
        },
      },
    );

    last_video_id.value =
      response.data.items[
        response.data.items.length - 1
      ].snippet.resourceId.videoId;

    console.log(last_video_id.value);
  } catch (error) {
    console.error("Erreur lors de la récupération des vidéos:", error);
  }
};

const handle_token_received = (token) => {
  console.log("token from youtube : ", token);
  access_token.value = token;
  fetch_playlist_videos();
};
</script>

<template>
  <div class="flex h-full w-full flex-col rounded-xl bg-indigo-900 p-3">
    <p>Youtube</p>
    <iframe
      v-if="last_video_id && access_token !== ''"
      class="h-full w-full flex-grow rounded-lg"
      :src="`https://www.youtube.com/embed/${last_video_id}`"
      frameborder="0"
      allowfullscreen
    ></iframe>
    <div
      class="flex h-full w-full flex-grow items-center justify-center rounded-lg"
      v-else
    >
      <GoogleLogin
        v-if="!access_token"
        @token-received="handle_token_received"
      />
    </div>
  </div>
</template>
