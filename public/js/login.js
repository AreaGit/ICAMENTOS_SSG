document.addEventListener('DOMContentLoaded', () => {
  const email = document.getElementById('email');
  const senha = document.querySelector('#senha');
  
  email.addEventListener('input', () => {
    // Remove espaços e força letras minúsculas
    email.value = email.value.trim().toLowerCase();
    
    // Validação simples de e-mail com regex
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    
    if (!emailValido && email.value !== "") {
      email.style.border = 'red';
    } else {
      email.style.border = 'black';
    }
  });
});
document.querySelector('.login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.querySelector('#email').value.trim();
    const senha = document.querySelector('#senha').value.trim();

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (response.ok) {
        // Redireciona para o painel após login bem-sucedido
        window.location.href = "/dashboard";
      } else {
        alert(data.message || 'Erro ao fazer login.');
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      alert('Erro ao conectar com o servidor.');
    }
  });