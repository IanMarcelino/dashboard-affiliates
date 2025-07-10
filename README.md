# 🧭 Dashboard de Afiliados

Este projeto é um **dashboard para afiliados** desenvolvido em **React**, com foco na visualização de métricas personalizadas para cada usuário autenticado.

## 🚀 Tecnologias Utilizadas

- **React** – Front-end moderno e responsivo
- **Supabase** – Autenticação de usuários e banco de dados
- **Notion API** – Fonte de dados dos afiliados (ex: depósitos, cliques, conversões)

## ⚙️ Funcionalidades

- 🔐 Login seguro via Supabase
- 📊 Exibição de KPIs por afiliado (CPA, FTD, RevShare)
- 📅 Filtros por intervalo de datas
- 📥 Integração com dados dinâmicos do Notion
- 📈 Cálculo automático de comissões baseado em deals individuais

## 🗂 Estrutura do Projeto

- `components/` – Componentes reutilizáveis do dashboard
- `pages/` – Roteamento e estrutura principal
- `lib/` – Funções auxiliares (ex: autenticação, filtros, cálculos)
- `api/` – Comunicação com o Notion via rotas intermediárias (proxy)

## 📌 Como Funciona

1. O usuário faz login via Supabase
2. O sistema identifica o afiliado autenticado e sua `btag`
3. Os dados são buscados da planilha Notion filtrando por essa `btag`
4. Os valores de comissão são calculados no front-end com base nos tipos de deal configurados
5. O usuário visualiza suas métricas, histórico e desempenho no painel

## 📦 Instalação

```bash
git clone https://github.com/seu-usuario/nome-do-repo.git
cd nome-do-repo
npm install
npm run dev
