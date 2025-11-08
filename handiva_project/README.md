# Handiva - Handcrafted Marketplace (Scaffold)

This project is a scaffold for **Handiva**, an e-commerce platform for handcrafted goods (woolen items, Telangana region crafts, pottery, jute, paper craft, handmade jewelry, etc.)
Frontend is plain **HTML/CSS/Vanilla JS** (no frameworks). Backend uses **Express.js** + **MongoDB**.

## What's included
- Frontend (`frontend/`) — multi-page HTML/CSS/JS responsive UI (buyer/seller flows, product catalog, product page, dashboards).
- Backend (`backend/`) — Express server with basic API endpoints and MongoDB models (User, Product, Order, Contact).
- A demo AI-chatbot placeholder and language translator mock are included in frontend JS (client-side) for demo only.
- Tribal contact form that submits to backend.

## Run locally (quick)
1. Install MongoDB and start it (or use MongoDB Atlas).
2. Backend:
   - `cd backend`
   - `npm install`
   - create `.env` with `MONGO_URI` if needed
   - `npm start` (or `npm run dev` with nodemon)
3. Frontend:
   - The backend serves frontend static files automatically. Visit `http://localhost:5000/`.

This is a scaffold and demo. Replace mock chatbot/translator with production integrations (OpenAI, Google Translate, payment gateways) as needed.
