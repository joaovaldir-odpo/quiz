window.QUIZ_DATA = {
  title: "Álbum Interativo ECA Digital",
  screens: {
    home: "assets/album-1/home.png",
  },
  intro: {
    paragraphs: [
      "Bem-vindo(a) ao Álbum **1** da **Coleção Álbum Interativo ECA Digital!**",
      "Sua missão é descobrir como o ECA Digital ajuda você, criança ou adolescente, a se proteger na internet.",
      "Aqui, você aprenderá seus direitos e deveres no mundo digital.",
      "Responda às perguntas e revele cada figurinha para avançar na sua jornada.",
      "Conquiste troféus, complete desafios e descubra novas figurinhas pelo caminho.",
      "Para conquistar todas as figurinhas, todos os troféus e se tornar um verdadeiro Guardião(ã) Digital, você também precisará completar os Álbuns 2 e 3.",
      "Cada troféu traz um **número** ou uma **letra**, que formam um código secreto. Ao final desse álbum **\"1\"**, está explicado o que esse código oferece.",
      "🌟 Sua aventura começa agora!",
    ],
  },
  answerAreas: [
    { x: 5, y: 73, width: 25, height: 11 },
    { x: 37, y: 73, width: 28, height: 11 },
    { x: 72, y: 73, width: 24, height: 11 },
  ],
  questions: [
    {
      question: "Quando um aplicativo ou jogo precisa proteger crianças?",
      screens: {
        theme: "doc/tema1.PNG",
        question: "doc/pergunta1.PNG",
        correct: "doc/resposta-certa1.PNG",
        wrong: "doc/resposta-errada1.PNG",
      },
      answers: [
        {
          letter: "A",
          text: "Quando o app só funciona à noite.",
          correct: false,
        },
        {
          letter: "B",
          text: "Só quando o celular está sem internet.",
          correct: false,
        },
        {
          letter: "C",
          text: "Quando é feito para crianças ou pode ser usado por elas.",
          correct: true,
        },
      ],
    },
  ],
};
