    const form = document.getElementById("form-recuperacao");
    const mensagem = document.getElementById("mensagem");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;

      const response = await fetch("/esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      mensagem.textContent = data.message;
      mensagem.classList.toggle("erro", !response.ok);
      mensagem.classList.toggle("sucesso", response.ok);
    });