# Fora da Tela

Next.js + TypeScript + Tailwind CSS, preparado para Vercel.

## Rodar

```sh
npm ci
npm run dev
```

Abra o endereço Local mostrado no terminal. Requer Node.js 20.9 ou superior.

```sh
npm run typecheck
npm run build
npm test
```

Os testes usam Microsoft Edge instalado no Windows. Para outro sistema, remova `channel: 'msedge'` de `playwright.config.ts` e instale o Chromium com `npx playwright install chromium`. O build utiliza Webpack por compatibilidade com o ambiente Windows desta entrega.

## Experiência

- Terra em tela inteira, com horizonte iluminado, aplicativos na metade inferior e dock de vidro, seguindo a referência fornecida.
- Compositor WebGL/GLSL próprio: paralaxe em profundidade ao toque/mouse, deslocamento orbital suave, luzes pulsantes e bloom no nascer do Sol. O efeito usa uma imagem como base; é uma composição 2.5D, não um globo 3D com rotação geográfica completa.
- Limite de 30 fps, densidade de pixels limitada a 1,5, pausa em abas ocultas e preferência por movimento reduzido.
- Fundo local estático preservado quando WebGL não estiver disponível.
- Painéis de vidro, transição de abertura, captura real em moldura de celular e botões com os links dos projetos.
- Tema automático pelo sistema, com alternância sistema → claro → escuro. Ambos preservam o cenário espacial; o tema altera a iluminação e as superfícies de vidro. A escolha persiste no navegador.
- Painéis com foco preso pelo dialog nativo, fechamento por Escape e retorno do foco ao aplicativo.

## Configuração

- `lib/projects.ts`: projetos, URLs, ícones e caminhos das prévias.
- `public/projects/`: sete ícones recortados do print original, sem recriar as identidades.
- Barbearia e Vértice: espaços neutros até receber os ícones originais.
- URLs configuradas: Stopou!, DOE+ RS, Minha Rotina, Minhas Finanças, Karoane e Bruto.
- Rítimo, Barbearia e Vértice aguardam URLs.
- `.env.example`: copiar para `.env.local` e preencher GitHub, LinkedIn e e-mail. Contatos sem configuração ficam desativados.

## Imagens

`public/earth-orbit.webp` é um cenário decorativo gerado para acompanhar a referência visual da usuária. As prévias dos projetos são capturas reais das seis páginas públicas fornecidas, obtidas em 28/10/2026. Minha Rotina e DOE+ RS mostram as respectivas páginas de login, sem autenticação nem dados pessoais. Minhas Finanças mostra a tela inicial apresentada publicamente durante a captura. Nenhuma tela de projeto foi gerada por IA.

A galeria aceita várias capturas: adicione seus caminhos em `screenshots` e deslize para navegar. Os indicadores são criados apenas para as imagens existentes.

## Vercel

Importe esta pasta como um projeto Next.js. Comando de build: `npm run build`. Configure as variáveis de `.env.example` antes do build. Não há banco de dados nem serviço externo obrigatório.

## Verificação desta revisão

O build limpo de produção, a verificação TypeScript e `npm run verify` passaram. A verificação automatizada confere o HTML de produção, nove projetos, bundles, sete ícones, seis prévias e preferências de tema. A execução dos testes Playwright nesta máquina ficou bloqueada na abertura do Microsoft Edge pelo ambiente de execução; não houve resultado de aprovação dos testes de navegador desta revisão. O workflow do GitHub Actions executa a compilação e a suíte com Chromium no Linux a cada push em main.

## Testes sem servidor local

Para testar o HTML e os bundles reais de produção sem abrir uma porta local, defina PLAYWRIGHT_OFFLINE=1 antes de executar npm test, após npm run build. Nesse modo, a fixture apenas entrega os arquivos locais ao navegador; as interações React, os diálogos e a renderização continuam reais. Nenhum site externo é acessado pelos testes.

