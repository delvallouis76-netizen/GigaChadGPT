const GIGA_IMAGE = "https://avatarfiles.alphacoders.com/283/283100.jpg";
const USER_IMAGE = "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
const API_KEY = 	gsk_...Kx3z; // Remplace ici !

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const resetBtn = document.getElementById('reset-btn');

// Personnalité du GigaChad
const SYSTEM_PROMPT = "Tu es GigaChad. Tu es stoïque, motivant et direct. Tu appelles TOUJOURS l'utilisateur 'bro'. Finis toujours tes messages par une signature comme 'Stay awesome', 'Keep grinding' ou 'Peace out'.";

let history = [{ role: "system", content: SYSTEM_PROMPT }];

// Premier message d'accueil
window.onload = () => {
    appendMessage("Pose ta question, bro. Ne bégaye pas.", 'bot');
};

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';
    history.push({ role: "user", content: text });

    const typingId = "typing-" + Date.now();
    showTyping(typingId);

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ model: "llama3-8b-8192", messages: history })
        });

        const data = await response.json();
        const reply = data.choices[0].message.content;

        document.getElementById(typingId).remove();
        appendMessage(reply, 'bot');
        history.push({ role: "assistant", content: reply });

    } catch (e) {
        document.getElementById(typingId).remove();
        appendMessage("Le serveur a flanché. Pas moi. Stay strong.", 'bot');
    }
}

function appendMessage(text, role) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', role);

    const img = document.createElement('img');
    img.src = role === 'bot' ? GIGA_IMAGE : USER_IMAGE;
    img.classList.add('msg-avatar');

    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.innerText = text;

    wrapper.appendChild(img);
    wrapper.appendChild(msgDiv);
    chatWindow.appendChild(wrapper);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTyping(id) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', 'bot');
    wrapper.id = id;
    wrapper.innerHTML = `<img src="${GIGA_IMAGE}" class="msg-avatar"><div class="message typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
    chatWindow.appendChild(wrapper);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

resetBtn.addEventListener('click', () => {
    chatWindow.innerHTML = '';
    history = [{ role: "system", content: SYSTEM_PROMPT }];
    appendMessage("Table rase, bro. On repart à zéro. Stay awesome.", 'bot');
});

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });