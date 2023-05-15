# API - SISTEMA DE FREQUÊNCIA PARA ESTÁGIOS MEDICINA UFSC

Consiste em uma API para uso em um sistema que fará o planejamento e a frequência de estudantes do curso de Medicina da Universidade Federal de Santa Catarina.

## FRAMEWORKS NECESSÁRIOS:

Para rodar é preciso ter o framework NodeJs instalado. Para baixar e instalar basta entrar no seguinte link e seguir os passos ali descritos [https://nodejs.org/en/download].
Acredito que o gerenciador de pacotes chamado de NPM já venha junto com o NodeJs. Após instalados deve ser possível ver a versão deles digitando o seguinte na linha de comando:

- `npm -v`
- `node -v`

As respostas a esses comandos deve ser algo como:

- `9.6.6`
- `v16.17.0`

## ARQUIVOS NECESSÁRIOS:

Antes de começar a rodar é necessário adicionar um arquivo na raiz do projeto, chamado `.env`. Este arquivo pode ser criado através do arquivo existente chamado `.env.exemplo`

## COMO RODAR LOCALMENTE:

Para rodar basta seguir os seguintes passos:

- `npm install` ou `yarn`
- `npm run dev` ou `yarn dev`

## TESTES:

Antes de rodar faça testes para ver se está todo certo. Para realizar estes testes basta digitar no terminal:

- `npm run test` ou `yarn test`
- `npm run test_coverage` ou `yarn test_coverage`

A primeira opção executará os testes já preprogramados e mostrará em vermelho caso algum esteja dando erro. 
A segunda opção fará a mesma coisa que a primeira, no entanto esta também mostrará as a covertura dos testes no código, ou seja, mostrará todas as linhas que foram testadas (em verde) e todas as que não foram (em vermelho).