window.QUIZ_DATA = {
  title: "Quiz online",
  image: "assets/scene-1.jpg",
  questions: [
    {
      question: "Qual linguagem roda no navegador para dar interatividade ao quiz?",
      category: "Fundamentos",
      hint: "A lógica da interface fica no arquivo app.js.",
      answers: [
        { text: "JavaScript", correct: true },
        { text: "SQL", correct: false },
        { text: "CSS", correct: false },
        { text: "JSON", correct: false },
        { text: "HTML", correct: false },
      ],
    },
    {
      question: "Qual arquivo é melhor para editar as perguntas com facilidade?",
      category: "Conteúdo",
      hint: "Mantê-lo separado facilita atualizar o quiz com o tempo.",
      answers: [
        { text: "questions.js", correct: true },
        { text: "style.css", correct: false },
        { text: "index.html", correct: false },
        { text: "README.md", correct: false },
      ],
    },
    {
      question: "Qual serviço publica páginas estáticas direto do repositório?",
      category: "Hospedagem",
      hint: "Você escolheu esse caminho para o projeto.",
      answers: [
        { text: "GitHub Pages", correct: true },
        { text: "Banco de dados SQL", correct: false },
        { text: "FTP obrigatório", correct: false },
        { text: "Servidor dedicado", correct: false },
      ],
    },
  ],
};
