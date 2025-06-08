/* ===========================================================================
   src/stores/test.js         (Pinia store)

   Держит ВСЁ, что связано с тестами:
   ─ «Учитель»  → список созданных тестов  (tests[])
   ─ «Студент»  → процесс прохождения одного теста
                  currentTest, questions, answers

   ⚠️ Сейчас ничего не синхронизуем с backend. Когда сервер будет готов,
      в методах addTest() / finishTest() появятся вызовы API.
=========================================================================== */

import { defineStore } from "pinia";

export const useTestStore = defineStore("test", {
  /* -------------------- STATE -------------------- */
  state: () => ({
    /* === Блок teacher === */
    /*  Преподаватель видит таблицу «Tests».           *)
     *  Каждый объект: { id:String, title:String, questions:Number }        */
    tests: [],

    /* === Блок student === */
    currentTest: null, // объект всего теста (id, title, questions[])
    questions: [], // сокращённо currentTest.questions (удобно)
    answers: {}, // { [questionId]: userAnswer }
    //  • single  → String
    //  • multi   → Array<String>
    //  • text    → String
  }),

  /* ------------------- ACTIONS ------------------- */
  actions: {
    /* ---------- teacher side ---------- */
    /** addTest(t)
     *  Добавляем новый тест в начало списка (unshift → свежий сверху)
     *  Пока t приходит из модалки Teacher/Tests.vue,
     *  позже здесь будет   await api.post('/tests', t)  + обновление списка.
     */
    addTest(t) {
      this.tests.unshift(t);
    },

    /* ---------- student side ---------- */
    /** startTest(test)
     *  Сохраняем текущий тест и подготавливаем структуру вопросов/ответов
     *  Вызывается из TestSession.vue или demo-кнопки.
     */
    startTest(test) {
      this.currentTest = test;
      this.questions = test.questions || [];
      this.answers = {}; // очищаем ответы (на случай рестарта)
    },

    /** submitAnswer(questionId, value)
     *  Обновляем ответ по конкретному вопросу.
     *  Используется внутри QuestionCard через   v-model:answer
     */
    submitAnswer(questionId, value) {
      this.answers[questionId] = value;
    },

    /** finishTest()
     *  • Здесь будет отправка answers на сервер
     *  • После успешного сохранения очищаем state.
     */
    finishTest() {
      // TODO: await api.post('/tests/{id}/submit', this.answers)

      this.currentTest = null;
      this.questions = [];
      this.answers = {};
    },
  },
});
