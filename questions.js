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
  trophies: [],
  questions: [
    {
      question: "Quando um aplicativo ou jogo precisa proteger crianças?",
      screens: {},
      theme: {
        background: "assets/album-1/pergunta-1/fundo.png",
        character: "assets/album-1/pergunta-1/enki.png",
        characterStyle: { top: 70, right: 0, width: 128 },
        speech:
          "Oi, meu nome é **[[white:ENKI]]** e vou ajudar você nessa aventura, vamos começar!",
        speechStyle: { top: 69, left: 21, width: 222, fontSize: "13.5px" },
        copyStyle: { top: 153, left: 20, right: 19 },
        nextButton: { y: 69 },
        paragraphs: [
          "A lei **protege crianças e adolescentes** em jogos, \naplicativos e sites.",
          "",
          "Se um serviço digital é feito para esse público ou **pode ser acessado** facilmente **por eles**, devem ser adotadas medidas de proteção, mesmo que a empresa seja de outro país.",
        ],
      },
      questionScreen: {
        background: "assets/album-1/pergunta-1/fundo.png",
        character: "assets/album-1/pergunta-1/inanna.png",
        characterStyle: { top: 70, left: 10, width: 240 },
        speech:
          "Oi, meu nome é [[white:Inanna]] acerte a resposta e abra a **1ª figurinha**",
        speechStyle: { top: 140, left: 151, width: 195, fontSize: "13.5px" },
        bannerStyle: { top: 323, left: 43, width: 282 },
        answerCards: [
          { top: 423, left: 20, width: 90 },
          { top: 423, left: 135, width: 90 },
          { top: 423, left: 250, width: 90 },
        ],
        answerAreas: [
          { x: 6, y: 75, width: 26, height: 10 },
          { x: 38, y: 75, width: 26, height: 10 },
          { x: 71, y: 75, width: 26, height: 14 },
        ],
      },
      wrongScreen: {
        background: "assets/album-1/pergunta-1/fundo.png",
        character: "assets/album-1/pergunta-1/inanna-resposta-errada.png",
        characterStyle: { top: 10, left: 60, width: 400 },
        speech: "Leia com atenção",
        speechStyle: { top: 64, left: 100, width: 115, fontSize: 18 },
        questionStyle: { top: 300, left: 13, width: 219 },
        answerStyle: { top: 380, left: 75, width: 140 },
        backButtonStyle: { top: 430, left: 96, width: 98, height: 43 },
        backArrowStyle: { top: 458, left: 74, width: 139 },
        backHotspot: { x: 27, y: 72, width: 29, height: 8 },
      },
      correctScreen: {
        background: "assets/album-1/pergunta-1/fundo-figurinha.png",
        header: "assets/album-1/pergunta-1/header-figurinha.png",
        sticker: "assets/album-1/pergunta-1/figurinha.png",
        title: "FIGURINHA (Nº 01)",
        headerStyle: { top: 7, left: 86, width: 188 },
        titleStyle: { top: 121, left: 88, width: 184 },
        stickerStyle: { top: 153, left: 78, width: 206 },
        nextButton: { y: 79.8 },
      },
      stickerFullScreen: {
        background: "assets/album-1/pergunta-1/fundo.png",
        sticker: "assets/album-1/pergunta-1/figurinha.png",
        stickerStyle: { top: -10, left: -24, width: 398, maxHeight: 580 },
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
