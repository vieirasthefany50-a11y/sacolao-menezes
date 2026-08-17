const produtosSacolaol = require('./cardapio.js');
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis do arquivo .env de forma segura

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Para servir os arquivos do front-end (index.html, etc.)

// Importa os produtos do cardápio

// Configuração da IA utilizando a variável de ambiente (Seguro para o GitHub)
const apiKey = process.env.GEMINI_API_KEY;

// Exemplo de rota principal da API
app.get('/api/produtos', (req, res) => {
    res.json(produtosSacolaol);
});

// Porta onde o servidor vai rodar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});