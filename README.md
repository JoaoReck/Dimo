# Dimo

Plataforma pessoal gamificada para anotar, estudar e evoluir. Funciona no PC e no celular (PWA instalável).

**Abas do MVP:** Hoje (resumo, hábitos, XP e sequência), Inbox (captura rápida), Estudos, Inglês (cartões com revisão espaçada) e Roteiro (guarda o estudo e o roteiro de cada vídeo).

**Stack:** Vite + React + Tailwind + Framer Motion + Firebase (Auth, Firestore, Hosting) + PWA.

## Rodar no seu computador

```cmd
git clone https://github.com/JoaoReck/Dimo
cd Dimo
npm install
copy .env.example .env
npm run dev
```

Abra o endereço mostrado no terminal (normalmente http://localhost:5173). `npm start` também funciona.

## Configurar o Firebase (uma vez)

1. No [Console do Firebase](https://console.firebase.google.com), crie (ou use) um projeto e adicione um **app Web**.
2. Copie as chaves do app para o arquivo `.env` (modelo em `.env.example`).
3. **Authentication > Método de login:** ative o **Google**.
4. **Firestore Database:** crie o banco (modo produção).
5. (Recomendado) No `.env`, preencha `VITE_ALLOWED_EMAILS` com o seu e-mail e, em `firestore.rules`, troque a condição pelo seu e-mail para fechar o sistema só para você.

## Publicar

```cmd
npm install -g firebase-tools
firebase login
firebase use --add
npm run build
firebase deploy
```

Isso publica o site (Hosting) e as regras do Firestore. Tudo dentro do plano gratuito.

## Como funciona o XP

| Ação | XP |
|------|----|
| Concluir um estudo | 20 |
| Publicar um vídeo | 30 |
| Novo roteiro | 10 |
| Palavra nova | 5 |
| Organizar item da Inbox | 5 |
| Marcar hábito (1x por dia) | 5 |
| Acertar palavra na revisão | 2 |

A cada 100 XP você sobe de nível. A sequência de dias aumenta quando você abre o app em dias seguidos.
