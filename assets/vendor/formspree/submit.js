var form = document.getElementById("contact-form");

async function handleSubmit(event) {
    event.preventDefault();
    var status = document.getElementById("my-form-status");
    var data = new FormData(event.target);

    status.innerHTML = `<div class="loading">Envoi en cours...</div>`;

    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            status.innerHTML = `<div class="sent-message">Votre message a été envoyé. Merci !</div>`;
            form.reset()
        } else {
            response.json().then(data => {
                let message;
                if (Object.hasOwn(data, 'errors')) {
                    message = data["errors"].map(error => error["message"]).join(", ")
                } else {
                    message = "Erreur lors de l'envoi du message !"
                }
                status.innerHTML = `<div class="error-message">${message}</div>`;
            })
        }
    }).catch(error => {
        status.innerHTML = `<div class="error-message">Impossible d'envoyer le message. Veuillez réessayer plus tard.</div>`;
    });
}
form.addEventListener("submit", handleSubmit)