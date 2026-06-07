# Quiz Online

Projeto simples de quiz estatico para publicar no GitHub Pages.

## Estrutura

- `index.html`: pagina principal
- `style.css`: estilos
- `app.js`: logica do quiz
- `questions.js`: perguntas e respostas usadas pela pagina
- `assets/`: imagens do cenario

Organizacao sugerida dos assets:

- `assets/album-1/geral/`: imagens compartilhadas entre perguntas
- `assets/album-1/pergunta-1/`: imagens especificas da pergunta 1
- `assets/album-1/pergunta-2/`: imagens especificas da pergunta 2
- `doc/`: imagens de referencia dos prototipos

## Como editar

Abra `questions.js` e altere:

- `title`
- `screens`
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
- `demoScreen`: tela extra de demonstracao depois da figurinha
- `demoStickerScreen`: figurinha extra aberta pela demonstracao
- `demoStickerFullScreen`: figurinha extra em tela cheia

Exemplo:

```js
{
  question: "Texto da pergunta",
  theme: {
    background: "assets/album-1/geral/fundo.png",
    character: "assets/album-1/pergunta-2/personagem.png",
    characterStyle: { top: 70, right: 0, width: 128 },
    speech: "Texto do balao",
  },
  questionScreen: {
    background: "assets/album-1/geral/fundo.png",
    character: "assets/album-1/pergunta-2/personagem.png",
    answerCards: [
      { top: 423, left: 20, width: 90 },
      { top: 423, left: 135, width: 90 },
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

Em telas de tema, `wrapAvoidStyle` reserva uma area invisivel dentro do texto para ele quebrar ao redor de personagem ou imagem sobreposta:

```js
wrapAvoidStyle: { width: 150, height: 145, marginLeft: 8 }
```

Quando a imagem estiver do lado esquerdo, use:

```js
wrapAvoidStyle: { side: "left", width: 150, height: 145, marginRight: 8 }
```

O botao `Proxima pagina` usa `nextButton` com porcentagem da tela:

- `x`: distancia da esquerda
- `y`: distancia do topo
- `width`: largura
- `height`: altura

O proprio botao visual e clicavel, entao a area de clique acompanha o desenho.
O padrao do botao e `y: 90`; configure `nextButton` apenas quando precisar mudar a posicao ou tamanho daquela tela.

Nas respostas, o proprio `answerCard` e clicavel. Ajuste a posicao e tamanho em `answerCards`, e a area clicavel acompanha automaticamente.

Na tela de erro, `backControlStyle` controla a posicao do conjunto `Volte` + seta. O conjunto inteiro e clicavel.

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

As areas clicaveis ficam invisiveis por padrao, inclusive localmente.

Voce tambem pode forcar pela URL:

- `?debug=1`: mostra as bordas
- `?debug=0`: esconde as bordas

Para abrir uma pergunta especifica durante ajustes:

- `?question=3&screen=theme`
- `?question=3&screen=question`
- `?question=3&screen=wrong`
- `?question=3&screen=correct`
- `?question=3&screen=stickerFull`
- `?question=4&screen=demo`
- `?question=4&screen=demoSticker`
- `?question=4&screen=demoStickerFull`
- `?question=3&screen=trophy`

Troque o numero em `question` para abrir outra pergunta.

## Publicar no GitHub Pages

1. Envie os arquivos para o repositorio.
2. Va em `Settings > Pages`.
3. Em `Build and deployment`, selecione a branch `main`.
4. Escolha a pasta raiz `/ (root)`.
5. Salve e aguarde a publicacao.
