# Automacao Selenium WebDriver e Grid

Projeto JavaScript com Selenium WebDriver 4, Mocha e Selenium Grid 4 para a pagina publica de pratica. As mesmas suites rodam localmente ou em sessoes remotas do Grid.

## Requisitos

- Node.js 22 ou superior e npm.
- Chrome e Firefox para execucao local. O Selenium Manager resolve os drivers locais.
- Docker Desktop em execucao para iniciar o Grid local.

No Windows, verifique os navegadores com:

```powershell
.\scripts\setup-browsers.ps1
```

Se a politica do PowerShell bloquear o script, execute-o em uma sessao autorizada pelo administrador da maquina. A configuracao aceita `CHROME_BINARY` e `FIREFOX_BINARY` para caminhos personalizados.
O script reutiliza Chrome/Firefox ja instalados; se Chrome nao estiver disponivel, baixa o Chrome for Testing para o perfil do usuario.

Instale as dependencias do projeto:

```powershell
npm ci
```

## Testes locais

Chrome e modo local sao os padroes:

```powershell
$env:EXECUTION_MODE = 'local'
$env:BROWSER = 'chrome'
$env:HEADLESS = 'true'
npm test
```

Firefox:

```powershell
$env:BROWSER = 'firefox'
npm test
```

Execucao paralela local limitada a dois arquivos de teste:

```powershell
npm run test:parallel
```

## Selenium Grid local

O Compose inicia um Hub e Nodes separados para Chrome e Firefox. Cada Node aceita uma sessao por vez.

```powershell
npm run grid:up
npm run grid:wait
$env:EXECUTION_MODE = 'grid'
$env:SELENIUM_REMOTE_URL = 'http://localhost:4444'
$env:BROWSER = 'chrome'
npm run test:grid
$env:BROWSER = 'firefox'
npm run test:grid
npm run grid:down
```

O endpoint pode ser alterado por `SELENIUM_REMOTE_URL`. Para outro navegador, adicione um Node compativel ao Compose e um conjunto de opcoes na fabrica de drivers; os Page Objects e testes nao precisam mudar.

## Relatorios e falhas

`npm run test:junit` grava `test-results.xml` com o reporter XUnit integrado ao Mocha. O reporter roda serialmente; o Mocha paralelo e validado separadamente com `npm run test:parallel`. O GitHub Actions executa Chrome e Firefox em jobs separados, inicia o Grid e publica o XML e a pasta `artifacts/` como artefatos. Em falhas, o hook tenta salvar screenshot, stack trace e logs de console do navegador; indisponibilidade dos logs nao substitui a falha original.

Para limitar carga no site publico, o Grid aceita uma sessao por Node e os comandos paralelos usam no maximo dois workers. Os testes criam e encerram uma sessao por caso, nao repetem casos automaticamente e nao verificam metricas dinamicas. A suite de links consulta URLs externas que devem responder com status HTTP de erro entre 400 e 503.

## Escopo e limitacoes

- Formulario: verifica preenchimento, selecoes, calendarios, intervalos de datas e opcoes de cores. A pagina nao apresentou um envio associado ao formulario principal; nao e afirmada persistencia de dados.
- Upload: verifica selecao de arquivo unico e multiplo e as mensagens de status no navegador; os arquivos nao sao enviados a um servidor.
- Tabela estatica: compara os seis registros observados na pagina durante a analise.
- Paginacao: valida a troca da primeira para a segunda pagina e o retorno.
- Alertas: verifica mensagens e resultados de alerta simples, confirmacao e prompt.
- Widgets: verifica menu por hover, copia de texto, arrastar e soltar, slider e formas SVG.
- Links: valida os codigos HTTP 400, 401, 403, 404, 408, 500, 502 e 503; depende da disponibilidade dos sites externos.
- A pagina e de terceiros e pode mudar; expectativas baseadas em dados publicados podem precisar de manutencao.
- A execucao local Chrome/Firefox foi validada. A execucao Grid depende do Docker Desktop; o ambiente de desenvolvimento precisa dele instalado e iniciado.

## CI

O workflow `.github/workflows/selenium.yml` roda em push, pull request e acionamento manual. Nao usa credenciais ou secrets.