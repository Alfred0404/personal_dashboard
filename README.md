# 📊My Personal Dashboard

![image](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)![image](https://img.shields.io/badge/Vue%20js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)![image](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)![image](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

This project is a personal dashboard. It has a lot of components such as google calendar, useful links, the last video of your youtube playlist, or even the 2 upcoming RLCS matches ! I designed it to be a cosy place, like a lobby.

Please note that this project is designed to be used only by me, so ther is a lot of configuration in order to make it work on your system.

## 🛠️ Project stack

The project is built with the following technologies:

- **[Vue.js](https://vuejs.org/)**
- **[Tailwind CSS](https://tailwindcss.com/)**

## 🚀 How to use it

### Prerequisites

Be an ECE student with an access to campusonline

Make sure you have **[Node.js](https://nodejs.org/fr)** and **[npm](https://www.npmjs.com/)** (Node Package Manager) installed on your machine.

## Installation

Go to the folder of your choice

```bash
git clone https://github.com/Alfred0404/personal_dashboard.git
cd personal_dashboard
npm install
```

- Install [axios](https://www.npmjs.com/package/axios) : `npm install axios`
- Install [gapi-script](https://www.npmjs.com/package/gapi-script) : `npm install gapi-script`
- Install [Tailwind](https://tailwindcss.com/), see the **[Tailwind Documentation](https://tailwindcss.com/docs/guides/vite#vue)**

## Configuration

The Youtube component use the [Youtube data api v3](https://developers.google.com/youtube/v3/docs?hl=en) and [Google Oauth 2.0](https://developers.google.com/identity/protocols/oauth2?hl=en) to log into to your personal Youtube account and fetch your playlist.

The project uses a .env file wich contain environement variables such as Google client Id, your playlist Id, or your weather api key.
- Create a `.env` file in the root directory.

### Youtube Authentification (GCP)
- Create a new project on [Google Cloud Console](https://console.cloud.google.com)
- Activate Youtube Data API V3
- Create credentials for Oauth 2.0 and API Key
- Add these environnement variables : `VITE_GOOGLE_CLIENT_ID`, `VITE_YOUTUBE_PLAYLIST_ID`

### Google Calendar
- Go to Google Calendar, `settings`, select the agenda you want to embed, `integration code`. ‼️ Grab only the link, not the iframe tag.
- Add this environnement variable: `VITE_GOOGLE_CALDENDAR_LINK`.

### WeatherApi
- Create a [weatherapi](https://www.weatherapi.com/) account and grab your weather api key
- Add this environnement variable: `VITE_WEATHER_API_KEY`.

### Spotify
- Go to spotify, click on one of your playlist, `share > embed > show code` and copy the src link.
- Add this environnement variable: `VITE_SPOTIFY_PLAYLIST_LINK`.

### Github
- Lastly, replace the variable github_username in [GithubContributions.vue](/src/components/GithubContributions.vue) by your github username.


Follow [these](https://support.google.com/calendar/answer/41207?hl=en) steps to embed your Google Calendar.

To get your grades, you will need to install the [TamperMonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) Chrome extension.
Once it's done, create a new Tampermonkey script and paste the [extract_grades_json_and_calc_averages.js](/src/tampermonkey/extract_grades_json_and_calc_averages.js).
Everything should be working.

And you are ready to go 🚀!

## Launching

To start the development server:

```bash
npm run dev
```

To build the app :

```bash
npm run build
```

The generated files will be located in the `dist/.` folder.

## 🤝 How to contribute

Don't hesitate to contribute!

1. Fork the project
2. Create a branch for your feature
   `git checkout -b feature/new-feature`
3. Make your changes and commit them
   `git commit -m 'Add new feature'`.
4. Push to your branch
   `git push origin feature/new-feature`
5. Create a Pull Request

Thank you for taking the time to contribute! If you have any questions or suggestions, please feel free to open an issue.

## References

I used [@firejune](https://github.com/firejune)'s [jandee](https://github.com/firejune/jandee) repo to embed my github contribution chart 🤝.
I used [@BragdonD](https://github.com/BragdonD)'s [ECE-scripts](https://github.com/BragdonD/ECE-Scripts) repo to scrap my grades on the campusonline platform, I couldn't have done this feature without his work 🤝.

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for details.
