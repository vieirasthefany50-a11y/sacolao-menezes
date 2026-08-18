require('dotenv').config();
const express = require('express');
const cors = require('cors');
const produtosSacolaol = require('./cardapio.js');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Rota para entregar os produtos do cardápio ao site
app.get('/api/produtos', (req, res) => {
    res.json(produtosSacolaol);
});

// Rota para o Chatbot interagir usando a Groq
app.post('/api/chat', async (req, res) => {
    try {
        const { mensagem } = req.body;
        const apiKey = process.env.GROQ_API_KEY;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "Você é o atendente virtual do Sacolão Menezes. Ajude o cliente com o pedido de hortifrúti, informe preços, some o total, solicite obrigatoriamente o nome dele, o endereço de entrega e a forma de pagamento. Reitere que trabalhamos exclusivamente com entrega e finalize sempre agradecendo."
                    },
                    {
                        role: "user",
                        content: mensagem
                    }
                ]
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            const textoResposta = data.choices[0].message.content;
            res.json({ resposta: textoResposta });
        } else {
            res.status(500).json({ resposta: "Erro ao processar resposta da IA." });
        }

    } catch (error) {
        console.error("Erro no chat:", error);
        res.status(500).json({ resposta: "Desculpe, tive um problema ao processar sua mensagem. Tente novamente!" });
    }
});

// Porta onde o servidor vai rodar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});