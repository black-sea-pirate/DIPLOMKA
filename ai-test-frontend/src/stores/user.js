/* ===========================================================================
   src/stores/user.js                (Pinia store)

   Отвечает за авторизацию:
     • token      — «пропуск» (JWT или session-id)
     • role       — 'teacher' | 'student'
     • profile    — объект с данными пользователя (имя, email …)

   Сейчас логин/логаут работают без сервера: мы просто сохраняем «fake-jwt»
   и роль в  localStorage.  Когда появится backend:
     1) метод login() будет вызывать  await api.post('/auth/login', …)
     2) метод fetchProfile()  запрашивать  /profile
=========================================================================== */

import { defineStore } from "pinia";
import router from "@/router"; // прямой импорт экземпляра роутера

export const useUserStore = defineStore("user", {
  /* -------------------- STATE -------------------- */
  state: () => ({
    // читаем token/role из localStorage, чтобы при перезагрузке страница
    // оставалась авторизованной (guard проверяет state.token)
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null, // 'teacher' | 'student'
    profile: null, // будем грузить позже
  }),

  /* ------------------- GETTERS ------------------- */
  getters: {
    /* isAuth → true, если token не пустой */
    isAuth: (state) => !!state.token,
  },

  /* ------------------- ACTIONS ------------------- */
  actions: {
    /** login({ token, role })
     *  1) сохраняем token / role в store
     *  2) дублируем в localStorage  (простой persist)
     *  3) перенаправляем на «домашнюю» страницу нужной роли
     *
     *  Пока *имитация*: token приходит из Login.vue как 'fake-jwt'.
     *  Будет заменено на реальный ответ API.
     */
    login({ token, role }) {
      this.token = token;
      this.role = role;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      router.push(role === "teacher" ? "/teacher" : "/student");
    },

    /** logout()
     *  1) очищаем состояние и localStorage
     *  2) переходим на /login
     */
    logout() {
      this.token = null;
      this.role = null;
      this.profile = null;
      localStorage.clear();

      router.push("/login");
    },

    /** fetchProfile()
     *  При настоящем API здесь будет запрос:
     *     const { data } = await api.get('/profile')
     *     this.profile = data
     *
     *  Сейчас оставляем заглушку, чтобы показать идею.
     */
    async fetchProfile() {
      if (!this.token) return;
      // demo-profile
      this.profile = { name: "Demo User", email: "demo@example.com" };
    },
  },
});
