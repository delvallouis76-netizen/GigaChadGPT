const GIGA_IMG = "https://www.giantbomb.com/a/uploads/scale_small/46/462814/3221502-8667190631-latest.jpg";
const USER_IMG = "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
const API_KEY = "gsk_...Kx3z"; // <--- METS TA CLÉ ICI !

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const resetBtn = document.getElementById('reset-btn');

const SYSTEM_PROMPT = "Tu es GigaChad. Tu es stoïque, motivant et direct. Tu appelles toujours l'utilisateur 'bro'. Phrases courtes. Finis par 'Stay awesome' ou 'Keep grinding'.";

// Premier message
window.onload = () => {
    appendMessage("Redresse-toi bro. On commence par quoi aujourd'hui ?", 'bot');
};

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';

    // Animation de chargement
    const tempId = "loading-" + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = tempId;
    loadingDiv.innerHTML = `<div class="message-wrapper bot"><img src="${GIGA_IMG}" class="msg-avatar"><div class="message">...</div></div>`;
    chatWindow.appendChild(loadingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: text }
                ]
            })
        });

        const data = await response.json();
        document.getElementById(tempId).remove();

        if (data.choices && data.choices[0]) {
            appendMessage(data.choices[0].message.content, 'bot');
        } else {
            throw new Error();
        }
    } catch (e) {
        if(document.getElementById(tempId)) document.getElementById(tempId).remove();
        appendMessage("Une erreur, bro. Mais un Chad n'abandonne jamais. Réessaie.", 'bot');
    }
}

function appendMessage(text, role) {
    const wrap = document.createElement('div');
    wrap.classList.add('message-wrapper', role);
    
    const avatar = role === 'bot' ? GIGA_IMG : USER_IMG;
    wrap.innerHTML = `<img src="${avatar}" class="msg-avatar"><div class="message">${text}</div>`;
    
    chatWindow.appendChild(wrap);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.onclick = sendMessage;
userInput.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
resetBtn.onclick = () => {
    chatWindow.innerHTML = '';
    appendMessage("Table rase. On repart à zéro, bro.", 'bot');
};