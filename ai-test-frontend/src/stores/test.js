// src/stores/test.js
import { defineStore } from "pinia";

export const useTestStore = defineStore("test", {
  /* ---------- state ---------- */
  state: () => ({
    /* teacher side */
    tests: [], // [{id, title, questions}]
    /* student side */
    currentTest: null,
    questions: [],
    answers: {}, // {questionId: userAnswer}
  }),

  /* ---------- actions ---------- */
  actions: {
    /* ------- teacher ------- */
    addTest(t) {
      this.tests.unshift(t);
    },

    /* ------- student ------- */
    startTest(test) {
      this.currentTest = test;
      this.questions = test.questions || [];
      this.answers = {};
    },

    submitAnswer(questionId, value) {
      this.answers[questionId] = value;
    },

    finishTest() {
      // TODO: отправка answers на сервер
      this.currentTest = null;
      this.questions = [];
      this.answers = {};
    },
  },
});
