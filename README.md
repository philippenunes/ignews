# 📌 Ignews  

Aplicação desenvolvida durante o bootcamp da **Rocketseat**, com foco em assinaturas de conteúdo.  
O **Ignews** é um blog com autenticação, sistema de pagamento recorrente e publicação de posts, integrando **Next.js**, **Stripe**, **Firebase** e **Prismic CMS**.  

---

## ✨ Features  

- 🔐 Autenticação com **GitHub OAuth**  
- 💳 Pagamentos recorrentes via **Stripe**  
- 📄 Gerenciamento de posts com **Prismic CMS**  
- 🔥 Persistência de dados com **Firebase**  
- ⚡ Renderização com **SSR** e **SSG** no Next.js  
- 📡 Webhooks para atualização em tempo real das assinaturas  
- 🎨 Estilização com **Sass Modules**  

---

## 🛠️ Tecnologias  

- [Next.js](https://nextjs.org/)  
- [React](https://reactjs.org/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [Stripe](https://stripe.com/)  
- [Firebase](https://firebase.google.com/)  
- [Prismic CMS](https://prismic.io/)  
- [Next Auth](https://next-auth.js.org/)  
- [Sass](https://sass-lang.com/)  

---

## 🚀 Como rodar o projeto  

### 🔧 Pré-requisitos  
- Node.js (>= 14)  
- Yarn ou NPM  
- Conta no [Stripe](https://stripe.com/), [Prismic](https://prismic.io/) e [Firebase](https://firebase.google.com/)  

### 📥 Clonando o repositório  
```bash
git clone https://github.com/seu-usuario/ignews.git
cd ignews
```

### 📦 Instalando as dependências  
```bash
yarn install
# ou
npm install
```

### ⚙️ Configurando variáveis de ambiente  
Crie um arquivo **.env.local** na raiz do projeto com as seguintes variáveis:  

```env
# Stripe
STRIPE_API_KEY=your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_public_stripe_key
STRIPE_SUCCESS_URL=http://localhost:3000/posts
STRIPE_CANCEL_URL=http://localhost:3000/

# GitHub Auth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Firebase
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Prismic
PRISMIC_ENDPOINT=your_prismic_endpoint
PRISMIC_ACCESS_TOKEN=your_prismic_access_token
```

### ▶️ Rodando o projeto  
```bash
yarn dev
# ou
npm run dev
```

Acesse: **[http://localhost:3000](http://localhost:3000)**  

---

## 📷 Preview  

<img width="894" height="752" alt="image" src="https://github.com/user-attachments/assets/d898236d-3816-4b14-a6b8-c35795347cfc" />  

---

## 📚 Aprendizados  

Durante o desenvolvimento, foram aplicados conceitos como:  

- Autenticação OAuth com **NextAuth**  
- **SSR** (Server Side Rendering) e **SSG** (Static Site Generation) no Next.js  
- Integração com **APIs externas** (Stripe, Prismic, Firebase)  
- Utilização de **Webhooks** para manter dados sincronizados  
- Boas práticas de arquitetura front-end  

---

## 📝 Licença  

Este projeto está sob a licença MIT.  

Feito com 💜 durante o treinamento da **Rocketseat** 🚀  
