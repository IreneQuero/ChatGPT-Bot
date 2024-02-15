const chatLog = document.querySelector('.chat-log'),
    userInput = document.getElementById('user-input'),
    sendButton = document.getElementById('send-button'),
    buttonIcon = document.getElementById('button-icon'),
    info = document.querySelector('.info');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const message = userInput.value.trim();

    if (message === '') {
        return;
    } else if (message === 'developer') {
        userInput.value = '';
        appendMessage('user', message);
        setTimeout(() => {
            appendMessage('bot', 'Hello Developer, How is your day?');
            buttonIcon.className = 'fa-solid fa-paper-plane';
        }, 2000);
        return;
    }

    appendMessage('user', message);
    userInput.value = '';

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': 'API Key',
            'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com'
        },
        body: JSON.stringify({
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ],
            web_access: false
        })
    };

    try {
        const response = await fetch('https://open-ai21.p.rapidapi.com/chatgpt', options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        appendMessage('bot', data.result);
        buttonIcon.className = 'fa-solid fa-paper-plane';
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        appendMessage('bot', 'Error: Check Your Api Key!');
        buttonIcon.className = 'fa-solid fa-paper-plane';
    }
}

function appendMessage(sender, message) {
    info.style.display = "none";
    buttonIcon.className = 'fas fa-spinner fa-pulse';

    const messageElement = document.createElement('div');
    const iconElement = document.createElement('div');
    const chatElement = document.createElement('div');
    const icon = document.createElement('i');

    chatElement.classList.add("chat-box");
    iconElement.classList.add("icon");
    messageElement.classList.add(sender);
    messageElement.innerText = message;

    if (sender === 'user') {
        icon.classList.add('fa-regular', 'fa-user');
        iconElement.id = 'user-icon';
    } else {
        icon.classList.add('fa-solid', 'fa-robot');
        iconElement.id = 'bot-icon';
    }

    iconElement.appendChild(icon);
    chatElement.appendChild(iconElement);
    chatElement.appendChild(messageElement);
    chatLog.appendChild(chatElement);
    chatLog.scrollTo = chatLog.scrollHeight;
}
