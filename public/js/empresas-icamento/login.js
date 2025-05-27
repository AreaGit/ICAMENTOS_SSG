document.querySelector('.login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.querySelector('#email').value.trim();
    const senha = document.querySelector('#senha').value.trim();

    try {
        const response = await fetch('/login-empresas-icamento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Redireciona para o painel após login bem-sucedido
            window.location.href = "/empresas-icamento/painel";
        } else {
            alert(data.message || 'Erro ao fazer login.');
        }
    } catch (err) {
        console.error('Erro na requisição:', err);
        alert('Erro ao conectar com o servidor.');
    }
});