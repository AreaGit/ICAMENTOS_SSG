const form = document.getElementById('form-chamado');
let enderecoCompleto

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

const cepInput = document.getElementById('cep');
cepInput.addEventListener('input', () => {
    let value = cepInput.value.replace(/\D/g, '');
    if (value.length > 5) {
        value = value.slice(0, 5) + '-' + value.slice(5, 8);
    }
    cepInput.value = value;
});

document.getElementById('cep').addEventListener('blur', async function () {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length === 8) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            
            if (data.erro) {
          alert('CEP não encontrado.');
          return;
        }

        document.getElementById('estado').value = data.uf;
        document.getElementById('cidade').value = data.localidade;
        document.getElementById('bairro').value = data.bairro;
        document.getElementById('rua').value = data.logradouro;
      } catch (error) {
          alert('Erro ao buscar o endereço.');
        }
    }
});

const camposParaCalculo = [
  'produto', 'tipo_icamento', 'estado', 'cidade', 'art', 'vt', 'local', 'regiao'
];

function camposPreenchidos() {
  return camposParaCalculo.every(id => {
    const el = document.getElementById(id);
    return el && el.value.trim() !== '';
  });
}

async function calcularValor() {
  if (!camposPreenchidos()) {
    document.getElementById('valor-icamento').textContent = 'R$ 0,00';
    return;
  }

  const payload = {
    produto: document.getElementById('produto').value,
    tipo_icamento: document.getElementById('tipo_icamento').value,
    uf: document.getElementById('estado').value,
    local: document.getElementById('local').value,
    regiao: document.getElementById('regiao').value,
    art: document.getElementById('art').value,
    vt: document.getElementById('vt').value
  };

  try {
    const res = await fetch('/calcular-valor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      document.getElementById('valor-icamento').textContent = 'Erro: ' + (data.erro || 'Erro desconhecido');
      return;
    }

    document.getElementById('valor-icamento').style.display = 'block';
    document.getElementById('btnCalcular').style.display = 'none';
    document.getElementById('valor-icamento').textContent = `R$ ${data.valor}`;
  } catch {
    document.getElementById('valor-icamento').textContent = 'Erro ao conectar com o servidor.';
  }
}

document.getElementById('btnCalcular').addEventListener('click', calcularValor);

// Detecta alteração nos campos e mostra o botão novamente
camposParaCalculo.forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('change', () => {
      document.getElementById('btnCalcular').style.display = 'block';
      document.getElementById('valor-icamento').style.display = 'none';
    });
  }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
      
    const dataAgendada = new Date(document.getElementById('data_agendada').value);
    const agora = new Date();
    const diffHoras = (dataAgendada - agora) / (1000 * 60 * 60);
    const rua = document.getElementById('rua').value;
    const numero = document.getElementById('numero').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const cep = document.getElementById('cep').value;
      
    if (diffHoras < 48) {
        alert('A data agendada deve ter no mínimo 48 horas a partir de agora.');
        return;
    }

    const endereco = `${rua}, ${numero} - ${bairro}, ${cidade} - ${estado}, ${cep}`;
        
    const formData = new FormData();
    
    formData.append('empresa_id', getCookie("idEmpresa"));
    formData.append('ordem', document.getElementById('ordem').value);
    formData.append('descricao', document.getElementById('descricao').value);
    formData.append('endereco', endereco);
    formData.append('tipo_icamento', document.getElementById('tipo_icamento').value);
    formData.append('produto', document.getElementById('produto').value);
    formData.append('vt', document.getElementById('vt').value);
    formData.append('art', document.getElementById('art').value);
    formData.append('data_agendada', document.getElementById('data_agendada').value);
    formData.append('informacoes_uteis', document.getElementById('informacoes_uteis').value);
        
    const arquivos = document.getElementById('anexos').files;
    for (let i = 0; i < arquivos.length; i++) {
        formData.append('anexos', arquivos[i]);
    }
        
    const res = await fetch('/criar-chamado', {
        method: 'POST',
        body: formData
    });
        
    const result = await res.json();
        
    if (result.success) {
        alert('Chamado criado com sucesso!');
        window.location.href = '/dashboard';
    } else {
        alert('Erro ao criar chamado: ' + result.message);
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    window.location.href = '/dashboard';
});