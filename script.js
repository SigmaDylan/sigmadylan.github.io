document.getElementById('spamWebhookBtn').addEventListener('click', () => {
    const webhook = document.getElementById('webhook').value;
    const username = document.getElementById('username').value || "FREAKYMENU.lol";
    const message = document.getElementById('message').value;
    const amount = parseInt(document.getElementById('amount').value);
    const delay = parseInt(document.getElementById('delay').value);
    const tts = document.getElementById('tts').checked;

    if (!webhook || !message || isNaN(amount) || isNaN(delay)) {
        alert('Please fill out all required fields!');
        return;
    }

    const data = {
        content: message,
        username: username,
        tts: tts
    };

    async function spamWebhook() {
        for (let i = 0; i < amount; i++) {
            const response = await fetch(webhook, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.status === 204) {
                document.getElementById('response').textContent = `Message sent (${i + 1}/${amount})`;
            } else if (response.status === 429) {
                document.getElementById('response').textContent = 'Ratelimited! Retrying in 5 seconds...';
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
                document.getElementById('response').textContent = 'Error sending message!';
                break;
            }

            await new Promise(resolve => setTimeout(resolve, delay * 1000));
        }

        document.getElementById('response').textContent = 'Spam complete!';
    }

    spamWebhook();
});

document.getElementById('deleteWebhookBtn').addEventListener('click', async () => {
    const webhook = document.getElementById('webhook').value;

    if (!webhook) {
        alert('bro forgot to enter the webhook url lol (Enter the Webhook url)');
        return;
    }

    const response = await fetch(webhook, { method: 'DELETE' });
    if (response.status === 204) {
        document.getElementById('response').textContent = 'Webhook deleted successfully!';
    } else {
        document.getElementById('response').textContent = 'Error deleting webhook!';
    }
});

document.getElementById('webhookInfoBtn').addEventListener('click', async () => {
    const webhook = document.getElementById('webhook').value;

    if (!webhook) {
        alert('bro forgot to enter the webhook url lol (Enter the Webhook url)');
        return;
    }

    const response = await fetch(webhook);
    if (response.ok) {
        const data = await response.json();
        document.getElementById('response').innerHTML = `
            <strong>Name:</strong> ${data.name}<br>
            <strong>Channel ID:</strong> ${data.channel_id}<br>
            <strong>Guild ID:</strong> ${data.guild_id}<br>
            <strong>Token:</strong> ${data.token}<br>
            <strong>ID:</strong> ${data.id}
        `;
    } else {
        document.getElementById('response').textContent = 'Error fetching webhook info!';
    }
});
