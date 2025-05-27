function getCookie(cname) {
    let name = cname + "="
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while(c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if(c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return "";
}

let idEmpresa = getCookie("idEmpresa");
let idUsuario = getCookie("idUsuario");

if (!idEmpresa && !idUsuario) {
    window.location.href = `/`;
}

async function carregarChamado() {
    const id = getCookie("idEmpresa") || getCookie("empresaId");
    const response = await fetch(`/chamados/${id}`);
    const chamados = await response.json();
    const chamadosLista = document.getElementById('chamados-lista');
    chamadosLista.innerHTML = '';
    
    console.log(chamados)

    if(chamados) {
        chamados.forEach(chamado => {
            const div = document.createElement('div');
            div.className = 'chamado-card';
            div.innerHTML = `
                <div>
                    <h3>Chamado ${chamado.id}</h3>
                    <p>Data: ${chamado.data_agenda}</p>
                    <p>Status: <span class="status status-aberto">${chamado.status}</span></p>
                </div>
                <a href="/chamado-detalhes?id=${chamado.id}" class="detalhes-btn">Ver detalhes</a>
            `;
            chamadosLista.appendChild(div);
        });
    } else {
        console.log("Não há chamados")
    }
}

carregarChamado();

document.getElementById('logout-btn').addEventListener('click', async() => {
    fetch('/logout', {
        method: 'GET',
        credentials: 'include' // Garante que os cookies sejam enviados na requisição
    })
    .then(response => {
        if (response.redirected) {
            // Se o servidor redirecionar, redireciona também no frontend
            window.location.href = response.url;
        } else {
            console.log("Logout feito, mas sem redirecionamento.");
        }
    })
    .catch(error => {
        console.error('Erro ao fazer logout:', error);
    });  
});