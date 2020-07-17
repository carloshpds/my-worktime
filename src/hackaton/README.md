# Cronograma

* 10 min explicando tudo.
* 5 min formando times
* 15 min ajudando com o ambiente.
  + Instalação
  + Forks
* 1h pra resolver e mandar o PR com a solução.

# Avaliação
O PR será analisado na semana seguinte, os critérios serão:

* Suporte a maior quantidade de casos
* Legibilidade do código

# Ambiente
Para a realização do desafio, será necessário instalar algumas coisas.

* NVM para instalar uma versão específica do NodeJS
  + Alternativas
    - Alternativas 1 https://github.com/nvm-sh/nvm
    - Alternativa 2 https://medium.com/@isaacjoe/best-way-to-install-and-use-nvm-on-mac-e3a3f6bc494d
  + Instalar a versão v10.16.3
  ```
  nvm install v10.16.3
  ```

* A tecnologia que vamos usar para a resolução será Typescript
  + Documentação: https://www.typescriptlang.org/docs/home.html
  + instalação
  ```
  npm install -g typescript
  ```

* Vamos utilizar o VS Code como IDE (https://code.visualstudio.com/)
* Recomendo também a instalar a extensão Jest Runner (https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner)

* Por último, instalamos as dependências do projeto rodando na pasta raíz:
```
npm install
```

# Hackaton: Desafio
O desafio consiste em o usuário poder saber em qual horário ele deveria parar de trabalhar já que neste mesmo horário estaria cumprindo sua jornada de trabalho. Não se engane, deve contemplar todos os cenários de batidas do ponto. Isto é:

* Apenas 1 batida de início do trabalho
* 1 batida de início e 1 de saída para o almoço
* 1 batida de início, 1 de saída para o almoço e 1 de retorno do almoço
* 4 batidas
* Mais que 4 batidas
* Resumindo... `Qualquer combinação de batidas!`

Para otimizar o nosso tempo, há certo trabalho já realizado para determinar os cenários de teste.

## Arquivos
Na pasta `calculateShouldLeaveClockTime`:
  * `index.ts` : Arquivo que irá conter a implementação.
  * `index.spec.ts`: Arquivo de teste da implementação do desafio.

## Validar solução
Para ter certeza que seu algoritmo funciona, na pasta raíz, rode:
```
npm test
```