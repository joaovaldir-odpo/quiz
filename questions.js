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
        correct: "doc/resposta-certa1.PNG",
        wrong: "doc/resposta-errada1.PNG",
      },
      theme: {
        background: "assets/album-1/pergunta-1/fundo.png",
        character: "assets/album-1/pergunta-1/enki.png",
        speech:
          "Oi, meu nome é **[[white:ENKI]]** e vou ajudar você nessa aventura, vamos começar!",
        paragraphs: [
          "A lei **protege crianças e adolescentes** em jogos, \naplicativos e sites.",
          "",
          "Se um serviço digital é feito para esse público ou **pode ser acessado** facilmente **por eles**, devem ser adotadas medidas de proteção, mesmo que a empresa seja de outro país.",
        ],
      },
      questionScreen: {
        background: "assets/album-1/pergunta-1/fundo.png",
        character: "assets/album-1/pergunta-1/inanna.png",
        speech:
          "Oi, meu nome é [[white:Inanna]] acerte a resposta e abra a **1ª figurinha**",
        answerAreas: [
          { x: 6, y: 75, width: 26, height: 10 },
          { x: 38, y: 75, width: 26, height: 10 },
          { x: 71, y: 75, width: 26, height: 14 },
        ],
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
