window.QUIZ_DATA = {
  title: "Album Interativo ECA Digital",
  screens: {
    home: "doc/pagina inicial.PNG",
    intro: "doc/pagina2.PNG",
  },
  answerAreas: [
    { x: 5, y: 73, width: 25, height: 11 },
    { x: 37, y: 73, width: 28, height: 11 },
    { x: 72, y: 73, width: 24, height: 11 },
  ],
  questions: [
    {
      question: "Quando um aplicativo ou jogo precisa proteger criancas?",
      screens: {
        theme: "doc/tema1.PNG",
        question: "doc/pergunta1.PNG",
        correct: "doc/resposta-certa1.PNG",
        wrong: "doc/resposta-errada1.PNG",
      },
      answers: [
        {
          letter: "A",
          text: "Quando o app so funciona a noite.",
          correct: false,
        },
        {
          letter: "B",
          text: "So quando o celular esta sem internet.",
          correct: false,
        },
        {
          letter: "C",
          text: "Quando e feito para criancas ou pode ser usado por elas.",
          correct: true,
        },
      ],
    },
  ],
};
