# Creator Links

Aplicacao React minimalista para criadores de conteudo criarem uma arvore de
links moderna, com painel de cadastro separado da visualizacao publica.

## Recursos

- Porta do dono da conta para cadastrar perfil, foto, fundo e links.
- Porta publica somente leitura para visitantes acessarem a arvore de links.
- Redes com icones vetoriais reais usando `react-icons`.
- Acoes do painel com `lucide-react`.
- Cadastro simples: escolher rede, informar URL/usuario e salvar.
- Regras modulares em `src/networks/networkRules.js`.
- Normalizacao e validacao usando a API nativa `URL`.
- Persistencia em arquivo JSON pelo servidor monolitico Node.
- Docker com duas portas expostas no mesmo servico.

## Portas

- Dono/editor: `http://localhost:8080`
- Publico/visitante: `http://localhost:8081`

No modo local sem Docker:

- Dono/editor: `http://localhost:3000`
- Publico/visitante: `http://localhost:3001`

## Desenvolvimento com Vite

Instale as dependencias:

```bash
npm install
```

Servidor Vite do dono:

```bash
npm run dev
```

Servidor Vite publico:

```bash
npm run dev:public
```

Observacao: Vite usa fallback em `localStorage` quando a API Node nao esta
rodando. Para testar as duas portas compartilhando os mesmos dados, use o modo
monolitico abaixo.

## Rodar monolito local

Gere o build:

```bash
npm run build
```

Suba o servidor Node:

```bash
npm start
```

Acesse:

```text
http://localhost:3000
http://localhost:3001
```

## Docker

Suba a aplicacao:

```bash
docker compose up --build
```

Acesse:

```text
http://localhost:8080
http://localhost:8081
```

Para parar:

```bash
docker compose down
```

Os dados ficam no volume Docker `linktree_data`.

## Como adicionar uma nova rede

Registre uma nova entrada em `src/networks/networkRules.js` com:

- `id`
- `name`
- `domains`
- `Icon`
- `accent`
- `normalize`, `validate` e `getLabel` quando a rede precisar de regra propria

Ao registrar a regra, a rede aparece automaticamente no cadastro, no gerenciador
e na arvore publica.
