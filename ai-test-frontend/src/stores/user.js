// src/stores/user.js
import { defineStore } from "pinia";
import router from "../router"; // прямой импорт роутера

export const useUserStore = defineStore("user", {
  /* ---------- state ---------- */
  state: () => ({
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null, // 'teacher' | 'student'
    profile: null,
  }),

  /* ---------- getters ---------- */
  getters: {
    isAuth: (state) => !!state.token,
  },

  /* ---------- actions ---------- */
  actions: {
    // имитация логина (позже заменим реальным API)
    login({ token, role }) {
      this.token = token;
      this.role = role;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      router.push(role === "teacher" ? "/teacher" : "/student");
    },

    logout() {
      this.token = null;
      this.role = null;
      this.profile = null;
      localStorage.clear();

      router.push("/login");
    },

    async fetchProfile() {
      if (!this.token) return;
      // заглушка
      this.profile = { name: "Demo User", email: "demo@example.com" };
    },
  },
});
