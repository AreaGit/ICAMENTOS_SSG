const form = document.getElementById("form-resetar");
    const mensagem = document.getElementById("mensagem");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const tipo = urlParams.get("tipo");

      const senha = document.getElementById("senha").value;
      const confirmarSenha = document.getElementById("confirmarSenha").value;

      if (senha !== confirmarSenha) {
        mensagem.textContent = "As senhas não coincidem.";
        mensagem.classList.add("erro");
        return;
      }

      const response = await fetch("/resetar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, tipo, senha })
      });

      const data = await response.json();
      mensagem.textContent = data.message;
      if(response.ok) {
        mensagem.classList.toggle("sucesso", response.ok);
        setTimeout(() => {
          window.location.href = '/'
        }, 5000);
      } else {
        mensagem.classList.toggle("erro", !response.ok);
      };
      
    });