import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import axios from "axios";
import "./style.css";
import App from "./App.vue";

// إعداد Axios عشان يبعت التوكن مع كل ريكويست (كأنه بيبرز البطاقة للباك إند)
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// لو الباك إند رد بـ 401 (يعني التوكن خلص أو مش موجود)، اطرده بره
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
    return Promise.reject(error);
  },
);

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
