# Quiz Online

Projeto simples de quiz estatico para publicar no GitHub Pages.

## Estrutura

- `index.html`: pagina principal
- `style.css`: estilos
- `app.js`: logica do quiz
- `questions.js`: perguntas e respostas usadas pela pagina
- `assets/`: imagens do cenario

## Como editar

Abra `questions.js` e altere:

- `title`
- `screens`
- `answerAreas`
- `questions`

Cada pergunta aceita:

- `question`
- `theme`
- `questionScreen`
- `wrongScreen`
- `correctScreen`
- `stickerFullScreen`
- `answers`

## Como customizar as telas

As imagens principais ficam em `doc/` por enquanto.

Telas globais:

- `home`: pagina inicial
- `intro`: texto de introducao

Telas de cada pergunta:

- `theme`: tela antes daquela pergunta
- `questionScreen`: tela daquela pergunta
- `wrongScreen`: resposta errada daquela pergunta
- `correctScreen`: recompensa daquela pergunta
- `stickerFullScreen`: figurinha em tela cheia

Exemplo:

```js
{
  question: "Texto da pergunta",
  theme: {
    background: "assets/album-1/pergunta-2/fundo.png",
    character: "assets/album-1/pergunta-2/personagem.png",
    characterStyle: { top: 70, right: 0, width: 128 },
    speech: "Texto do balao",
  },
  questionScreen: {
    background: "assets/album-1/pergunta-2/fundo.png",
    character: "assets/album-1/pergunta-2/personagem.png",
    answerCards: [
      { top: 423, left: 20, width: 90 },
      { top: 423, left: 135, width: 90 },
    ],
    answerAreas: [
      { x: 6, y: 75, width: 26, height: 10 },
      { x: 38, y: 75, width: 26, height: 10 },
    ],
  },
  answers: [
    { letter: "A", text: "Resposta A", correct: false },
    { letter: "B", text: "Resposta B", correct: true },
  ]
}
```

Posicoes visuais usam CSS em objetos `*Style`, com valores em pixels:

- `top`
- `left`
- `right`
- `width`
- `height`
- `fontSize`

Areas clicaveis usam porcentagem da tela:

- `x`: distancia da esquerda
- `y`: distancia do topo
- `width`: largura
- `height`: altura

Isso permite ajustar os botoes sem depender do tamanho do celular ou monitor.

## Trofeus

Trofeus podem ser cadastrados em `questions.js`:

```js
trophies: [
  {
    afterQuestion: 3,
    background: "assets/album-1/trofeu/fundo.png",
    image: "assets/album-1/trofeu/trofeu.png",
    title: "Trofeu desbloqueado",
    text: "Voce concluiu 3 perguntas."
  }
]
```

Quando a pergunta indicada terminar, a tela de trofeu entra automaticamente depois da figurinha em tela cheia.

## Modo debug das areas clicaveis

Ao abrir localmente, as areas clicaveis aparecem com borda vermelha.
No GitHub Pages elas ficam invisiveis automaticamente.

Voce tambem pode forcar pela URL:

- `?debug=1`: mostra as bordas
- `?debug=0`: esconde as bordas

## Publicar no GitHub Pages

1. Envie os arquivos para o repositorio.
2. Va em `Settings > Pages`.
3. Em `Build and deployment`, selecione a branch `main`.
4. Escolha a pasta raiz `/ (root)`.
5. Salve e aguarde a publicacao.
