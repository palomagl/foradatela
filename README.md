<div align="center">

# fora da tela<span>.</span>

### Não é só um portfólio. É um lugar para abrir ideias.

Um pequeno universo de experiências digitais, jogos e produtos que ganharam vida fora do código.

**[✦ Entrar no Fora da Tela](https://foradatela.vercel.app/)**

</div>

---

<table>
<tr>
<td width="53%" valign="middle">

### Um toque. Outro mundo.

Em vez de uma lista de repositórios, uma tela inicial que parece um launcher: ícones próprios, projetos que se abrem como aplicativos, detalhes em vidro translúcido e acesso direto a cada experiência.

Cada projeto tem algo para descobrir. Alguns são jogos. Outros resolvem problemas reais do dia a dia.

O melhor jeito de conhecer é **abrir e experimentar**.

**[Explorar os projetos →](https://foradatela.vercel.app/)**

</td>
<td width="47%" align="center">

<img src="public/readme/stopou-real-preview.webp" alt="Captura real do painel do jogo Stopou! aberto no Fora da Tela, com dois celulares e um botão para jogar" width="360" />

<sub>Detalhe real da experiência: Stopou! aberto no Fora da Tela.</sub>

</td>
</tr>
</table>

## O que existe aqui?

**Projetos para usar, não apenas observar.** Um jogo de Stop multiplayer em que os amigos entram por código; um aplicativo que estima calorias pela foto do prato e acompanha a hidratação; uma rotina que registra despesas pelo Telegram; uma plataforma de doação de sangue com pontos de coleta próximos; experiências de e-commerce, delivery e controle financeiro, inclusive compartilhado com a família.

O portfólio foi pensado para que cada produto conte sua própria história, com **identidade, telas reais e um caminho direto para experimentar**.

## Uma vitrine que também é um produto

A interface é parte da experiência: Liquid Glass, animações discretas, navegação responsiva, abertura dos projetos em painéis e modo claro/escuro. O fundo tem uma versão em WebGL, com alternativa para navegadores sem suporte e respeito à preferência por movimento reduzido.

O espaço **“Ver mais projetos”** deixa a coleção crescer sem transformar a página inicial em uma lista interminável.

<div align="center">

### Tem mais vindo por aí.

**[Conheça o Fora da Tela](https://foradatela.vercel.app/)** · **[GitHub](https://github.com/palomagl)** · **[LinkedIn](https://www.linkedin.com/in/palomagl)**

<sub>Projeto independente de Paloma · feito para apresentar o que construo de uma forma que também merece ser explorada.</sub>

</div>

<details>
<summary>Para quem quer explorar o código</summary>

O site usa Next.js, TypeScript e CSS, com WebGL para o cenário visual. Os projetos, links e caminhos das imagens ficam em `lib/projects.ts`.

```bash
npm ci
npm run dev
```

Para verificar a entrega: `npm run build`, `npm run typecheck`, `npm run verify` e `npm test`. Os testes de navegador são executados pelo workflow do GitHub Actions.

</details>
