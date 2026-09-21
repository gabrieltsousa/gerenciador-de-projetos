# Gerenciador de Projetos

SPA para criar, editar, remover e favoritar projetos, com busca, ordenação e histórico de buscas recentes.

## Demo

🔗 [Acessar aplicação](https://gerenciador-de-projetos-tawny.vercel.app)

## Funcionalidades

- Criação de projetos
- Edição de projetos
- Exclusão com confirmação
- Favoritar e desfavoritar projetos
- Filtro para visualizar apenas favoritos
- Ordenação alfabética
- Ordenação por projetos iniciados mais recentemente
- Ordenação por prazo de finalização
- Busca a partir de 3 caracteres
- Histórico das últimas 5 buscas
- Highlight do termo pesquisado nos resultados
- Persistência dos projetos no navegador
- Upload, redimensionamento e compressão da capa do projeto

## Stack

- **Vue 3 + TypeScript + Vite**
- **Vue Router** — 4 rotas (listagem, criar, editar, resultado de busca); só a exclusão usa modal
- **Pinia** — estado de domínio (lista de projetos); estado visual (busca, filtro, ordenação, modal aberto) fica local em composables/componentes
- **Zod** — schema único de validação, com o tipo TypeScript inferido dele (`z.infer`)
- **Vitest + Vue Testing Library** — testes de comportamento para componentes/páginas, testes diretos para funções puras (datas, busca, ordenação)
- **ESLint (flat config) + Prettier**

Os trade-offs de cada escolha estão em [Decisões de arquitetura](#decisões-de-arquitetura).

## Como executar

```bash
npm install
npm run dev
```

## Qualidade

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

> Os checks de tipagem, lint, testes e build passam antes da geração do build de produção.

## Scripts

| Script               | O que faz                             |
| -------------------- | -------------------------------------- |
| `npm run dev`         | Servidor de desenvolvimento            |
| `npm run build`        | Typecheck + build de produção          |
| `npm run preview`      | Serve o build de produção localmente   |
| `npm run test`         | Roda a suíte de testes uma vez         |
| `npm run test:watch`   | Testes em modo watch                   |
| `npm run lint`         | ESLint (zero warnings tolerados)       |
| `npm run lint:fix`     | ESLint com autofix                     |
| `npm run format`       | Prettier                               |
| `npm run typecheck`    | Só o typecheck, sem build              |

## Estrutura

```
src/
  project/              # domínio único — sem pasta modules/, não há um segundo domínio a agrupar
    project.model.ts       # schema Zod + tipos inferidos
    project.repository.ts  # abstração de persistência (localStorage)
    project.store.ts       # estado de domínio (Pinia)
    project.dates.ts       # formatação/comparação de data (funções puras)
    project.sorting.ts     # as 3 estratégias de ordenação (funções puras)
    project.search.ts      # normalização, match e highlight de busca (funções puras)
    composables/            # useProjectFilters, useSearchHistory, useProjectForm, useDeleteProjectFlow
    components/             # ProjectCard, ProjectForm, SearchBar, DeleteProjectModal...
    pages/                  # 3 componentes para as 4 rotas — ProjectFormPage atende criar e editar
    __tests__/
  ui/                    # genéricos reaproveitáveis fora do domínio de projetos
    BaseButton.vue, BaseModal.vue, AppIcon.vue, useClickOutside.ts
  router/
  assets/                # tokens.css (design tokens) + base.css (reset mínimo)
```

## Decisões de arquitetura

**Vue 3 + TypeScript + Vite, sem Nuxt.** A aplicação é inteiramente client-side e não possui requisitos de SSR, SEO ou rotas de servidor. Por isso, Vite atende ao escopo com menor complexidade operacional.

**Decisões de simplificação da stack.** VeeValidate não foi adotado: o formulário tem poucos campos e uma única regra cross-field, e Zod combinado com um composable pequeno (`useProjectForm`) já cobre a validação sem duplicar responsabilidade com uma segunda biblioteca. Pelo mesmo motivo, datas e ícones usam recursos nativos (`Intl.DateTimeFormat`, SVG) em vez de bibliotecas dedicadas.

**Persistência via Repository.** `ProjectRepository` é uma interface e `LocalStorageProjectRepository` é a única implementação — sem classe base genérica, sem factory. O ganho direto: nenhum componente Vue toca `localStorage`, e a store é testável sem mockar a Web Storage API. O contrato é assíncrono mesmo com o localStorage sendo síncrono por baixo — uma implementação HTTP com os mesmos 5 métodos pode ser injetada sem alterar `project.store.ts`, embora loading state, paginação e retry continuem sendo acréscimos à parte, não algo que a interface já resolve.

**Store Pinia com apenas estado de domínio.** A store expõe `projects` e as 5 ações que o alteram. `isLoading`/`error` foram descartados como estado da store: `loadProjects()` lê do localStorage, sem uma etapa de carregamento perceptível, e o erro de uma ação específica é contextual à tela que a disparou.

**Estado sempre derivado, nunca duplicado.** `visibleProjects` (favoritos + ordenação) e os resultados de busca são `computed` sobre a coleção original — nunca uma segunda cópia da lista. Favoritar um projeto reflete em todo lugar automaticamente porque `favorite` é lido do mesmo objeto.

**Datas como string ISO, convertidas para `Date` só na exibição.** `new Date('2024-09-01')` é interpretado como meia-noite UTC; em fusos atrás de UTC (`America/Sao_Paulo`, por exemplo) isso desloca a data exibida para o dia anterior. A correção é construir o `Date` a partir dos componentes ano/mês/dia locais, não da string diretamente — coberto por teste de regressão específico.

**"Prazo mais próximo" — interpretação explícita.** O requisito não define o que fazer com projetos já vencidos. A regra adotada (documentada em `project.sorting.ts`) é: projetos ativos vêm antes dos encerrados e, dentro de cada grupo, o prazo mais próximo vem primeiro.

**Validação com Zod, feedback progressivo por campo.** `useProjectForm` deriva `isValid`/`errors` via `computed` sobre um objeto reativo, sem um passo imperativo de validação que possa ficar dessincronizado. O botão de salvar não fica `disabled`: um elemento desabilitado sai da ordem de tab, o que impede um usuário de teclado de alcançá-lo para entender por que está bloqueado. O botão fica visualmente "fraco" até o formulário ser válido, e o erro de um campo aparece assim que o usuário sai dele (`touched`), não só depois de uma tentativa de envio.

**`<dialog>` nativo para o modal de exclusão.** `.showModal()` entrega focus trap e fechamento com Escape nativamente em Chrome, Firefox e Safari atuais. A restauração de foco nativa falha quando o elemento que abriu o modal é removido do DOM antes do fechamento — caso real encontrado no menu de opções do card (`CardOptionsMenu.vue`), tratado devolvendo o foco manualmente antes de fechar.

**Busca sem `v-html`.** `HighlightText` divide o texto em segmentos e renderiza `<mark>` — nenhum dado vindo de busca é interpretado como HTML.

**Sem debounce na busca.** A filtragem é local, em memória, sobre uma lista pequena — não há latência real a esconder.

**Rotas reais para criar, editar e buscar, não modais.** Criação e edição têm páginas dedicadas com navegação de volta, e o resultado de busca é uma página própria — apenas a exclusão usa modal.

## Limitações conhecidas

- **Ícones** são formas SVG padrão/reconhecíveis, não extraídas pixel a pixel do Figma (não vieram como assets exportáveis, só dentro das imagens de referência).
- **Capa do projeto** é redimensionada (máx. 1200px) e reencodada em JPEG no cliente antes de virar data URL (teto de ~400KB já comprimida). O localStorage tem quota compartilhada (~5–10MB) entre todos os projetos, e um limite alto no arquivo bruto sozinho não protegeria isso — duas capas de 2MB já passam de uma quota conservadora de 5MB em base64.
- Testes de `<dialog>` no Vitest precisam de um polyfill de `showModal`/`close` em `src/test/setup.ts` — o jsdom não implementa o comportamento modal do elemento (o comportamento nativo foi validado em browser real durante o desenvolvimento).
- 2 vulnerabilidades moderadas reportadas por `npm audit` estão em ferramental de dev (`vitest`/`@vitest/mocker`) — não afetam o build de produção.

## Possíveis evoluções

- Trocar `LocalStorageProjectRepository` por uma implementação HTTP — a interface `ProjectRepository` absorve a troca mecânica dos 5 métodos, mas loading state, paginação e retry seriam acréscimos novos sobre store e componentes, não algo que já vem pronto.
- Autenticação e projetos por usuário.
- Paginação/scroll infinito se o volume de projetos crescer muito além do que uma lista local comporta bem.
- Sincronização multiusuário (hoje cada navegador tem seus próprios dados).
