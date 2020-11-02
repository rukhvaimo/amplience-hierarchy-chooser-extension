import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#039be5",
        secondary: "#424242",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
        dark_grey: "#c9cccf",
        light_grey: "#e9eaeb",
        white: "#fff",
        text: "#2c3e50",
      },
    },
  },
  icons: {
    iconfont: "mdi",
  },
});
