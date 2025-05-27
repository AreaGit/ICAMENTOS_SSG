document.querySelector('.cadastro-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const data = {
    nome: document.getElementById('nome').value,
    cep: document.getElementById('cep').value,
    estado: document.getElementById('estado').value,
    cidade: document.getElementById('cidade').value,
    bairro: document.getElementById('bairro').value,
    rua: document.getElementById('rua').value,
    numeroRes: document.getElementById('numeroRes').value,
    complemento: document.getElementById('complemento').value,
    telefone: document.getElementById('telefone').value,
    cnpj: document.getElementById('cnpj').value,
    razao: document.getElementById('razao').value,
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value
  };

  const confirmarSenha = document.getElementById('confirmar-senha').value;
  if (data.senha !== confirmarSenha) {
    alert('As senhas não coincidem.');
    return;
  }

  try {
    const response = await fetch('/cadastrar', {
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
