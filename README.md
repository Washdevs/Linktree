# Minimal Linktree

Aplicacao React minimalista para criar, editar e organizar links de redes sociais
em uma pagina estilo Linktree.

## Recursos

- Editor de perfil com nome, usuario, bio, foto e imagem de fundo.
- Cadastro de link por rede/plataforma e URL.
- Edicao, remocao e ordenacao dos links salvos.
- Regras modulares de redes em `src/networks/networkRules.js`.
- Normalizacao e validacao de URL usando a API nativa `URL` do navegador.
- Persistencia local via `localStorage`.
- Build monolitico em Docker servido por Nginx.

## Desenvolvimento local

Instale as dependencias:

```bash
npm install
```

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse:

```text
http://localhost:5173
```

## Build local

```bash
npm run build
```

Opcionalmente, visualize o build:

```bash
npm run preview
```

## Docker

Suba a aplicacao com Docker Compose:

```bash
docker compose up --build
```

Acesse:

```text
http://localhost:8080
```

Para parar:

```bash
docker compose down
```

## Como adicionar uma nova rede

Registre uma nova entrada em `src/networks/networkRules.js` com:

- `id`
- `name`
- `domains`
- `initials` ou `icon`
- `accent`
- `normalize`, `validate` e `getLabel` quando a rede precisar de regra propria

Com isso, a rede aparece automaticamente no seletor e passa a ser usada pelo
fluxo de criacao/edicao de links.
