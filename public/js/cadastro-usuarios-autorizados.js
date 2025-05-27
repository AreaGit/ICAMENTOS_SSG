document.querySelector('.cadastro-form').addEventListener('submit', async function (e) {
  e.preventDefault();

      function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while(c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if(c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    
    let idEmpresa = getCookie("idEmpresa");

  const data = {
    empresa_id: idEmpresa,
    nome: document.getElementById('nome').value,
    telefone: document.getElementById('telefone').value,
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value
  };

  try {
    const response = await fetch('/cadastrar-usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
      alert('Cadastro realizado com sucesso!');
      // Redirecionar ou limpar formulário
    } else {
      alert('Erro no cadastro: ' + (result.error || ''));
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao enviar requisição.');
  }
});
