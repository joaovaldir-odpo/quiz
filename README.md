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
- `screens`
- `answerAreas`
- `category`
- `hint`
- `answers`

## Como customizar as telas

As imagens principais ficam em `doc/` por enquanto.

Telas globais:

- `home`: pagina inicial
- `intro`: texto de introducao

Telas de cada pergunta:

- `theme`: tela antes daquela pergunta
- `question`: tela daquela pergunta
- `correct`: recompensa daquela pergunta
- `wrong`: resposta errada daquela pergunta

Exemplo:

```js
{
  question: "Texto da pergunta",
  screens: {
    theme: "doc/tema1.PNG",
    question: "doc/pergunta1.PNG",
    correct: "doc/resposta-certa1.PNG",
    wrong: "doc/resposta-errada1.PNG",
  },
  answers: []
}
```

As areas clicaveis usam porcentagem da tela:

- `x`: distancia da esquerda
- `y`: distancia do topo
- `width`: largura
- `height`: altura

Isso permite ajustar os botoes sem depender do tamanho do celular ou monitor.

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
