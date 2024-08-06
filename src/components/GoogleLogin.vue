<script setup>
import { gapi } from "gapi-script";
import { onMounted } from "vue";

const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID; // Remplace par ton propre Client ID
const emit = defineEmits(["token-received"]);

const load_gapi_client = () => {
  gapi.load("client:auth2", () => {
    gapi.client
      .init({
        client_id: client_id,
        scope: "https://www.googleapis.com/auth/youtube.readonly",
      })
      .then(() => {
        console.log("GAPI client initialized");
      })
      .catch((error) => {
        console.error("Erreur lors de l'initialisation du client GAPI:", error);
      });
  });
};

const sign_in_with_google = () => {
  gapi.auth2
    .getAuthInstance()
    .signIn()
    .then(() => {
      const access_token = gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getAuthResponse().access_token;
      console.log("Token d'accès:", access_token);
      emit("token-received", access_token);
      console.log("event emited!");
    })
    .catch((error) => {
      console.error("Erreur lors de la connexion avec Google:", error);
    });
};

onMounted(() => {
  load_gapi_client();
});
</script>

<template>
  <div>
    <button
      class="rounded-lg border border-indigo-500 p-3 text-sm text-indigo-200 transition hover:border-indigo-700 hover:bg-indigo-700"
      @click="sign_in_with_google"
    >
      Se connecter avec Google
    </button>
  </div>
</template>
