(function () {
    const form = document.querySelector("form.contact-form");
    if (!form) return;

    const loadingEl = form.querySelector(".loading");
    const errorEl = form.querySelector(".error-message");
    const sentEl = form.querySelector(".sent-message");
    const submitBtn = form.querySelector('button[type="submit"]');

    function hide(el) { if (el) el.style.display = "none"; }
    function show(el) { if (el) el.style.display = "block"; }

    function setState(state, errorText) {
        if (state === "idle") {
            hide(loadingEl); hide(errorEl); hide(sentEl);
            if (submitBtn) submitBtn.disabled = false;
            return;
        }
        if (state === "loading") {
            show(loadingEl); hide(errorEl); hide(sentEl);
            if (submitBtn) submitBtn.disabled = true;
            return;
        }
        if (state === "success") {
            hide(loadingEl); hide(errorEl); show(sentEl);
            if (submitBtn) submitBtn.disabled = false;
            return;
        }
        if (state === "error") {
            hide(loadingEl); show(errorEl); hide(sentEl);
            if (errorEl && errorText) errorEl.textContent = errorText;
            if (submitBtn) submitBtn.disabled = false;
        }
    }

    setState("idle");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        setState("loading");

        try {
            const res = await fetch(form.action, {
                method: (form.method || "POST").toUpperCase(),
                body: new FormData(form),
                headers: { "Accept": "application/json" }
            });

            let data = {};
            try { data = await res.json(); } catch (_) {}

            if (res.ok) {
                setState("success");
                form.reset();

                if (data && data.next) {
                    setTimeout(() => { window.location.href = data.next; }, 700);
                }
            } else {
                const msg =
                    (data && (data.error || data.message)) ||
                    "Erreur lors de l'envoi du message";
                setState("error", msg);
            }
        } catch (err) {
            setState("error", "Impossible d'envoyer le message (erreur réseau).");
        }
    });
})();
