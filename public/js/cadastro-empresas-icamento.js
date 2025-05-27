const bancoUser = document.getElementById('banco');
let codBanco;

function normalize(text) {
  return text ? text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
}

bancoUser.addEventListener('input', () => {
  let bancoNome = normalize(bancoUser.value);
  if (bancoNome.length >= 3) {
    fetch('https://brasilapi.com.br/api/banks/v1')
    .then(response => response.json())
    .then(data => {
    const banco = data.find(b => b.name && normalize(b.name).includes(bancoNome));
      if (banco) {
        bancoUser.classList.remove('invalid');
        bancoUser.classList.add('valid');
        validBancoUser = true;
        codBanco = banco.code.toString().padStart(3, '0');
      } else {
        bancoUser.classList.remove('valid');
        bancoUser.classList.add('invalid');
        validBancoUser = false;
      }
    })
    .catch(error => {
      console.error('Erro ao buscar dados dos bancos:', error);
      bancoUser.classList.remove('valid');
      bancoUser.classList.add('invalid');
      validBancoUser = false;
    });
  } else {
    bancoUser.classList.remove('valid');
    bancoUser.classList.add('invalid');
    validBancoUser = false;
  }
  console.log(codBanco)
});
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
    conta_corrente: document.getElementById('conta').value,
    agencia: document.getElementById('agencia').value,
    banco: codBanco,
    senha: document.getElementById('senha').value
  };
  
  const confirmarSenha = document.getElementById('confirmar-senha').value;
  if (data.senha !== confirmarSenha) {
    alert('As senhas não coincidem.');
    return;
  }
  
  try {
    const response = await fetch('/cadastrar-empresas-icamento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    if (result.success === true) {
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