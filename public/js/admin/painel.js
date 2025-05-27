function mostrarSecao(secao) {
  document.querySelectorAll('.secao').forEach(s => s.style.display = 'none');
  document.getElementById(secao).style.display = 'block';
}
  
async function carregarEmpresas() {
  const res = await fetch('/all-empresas');
  if (!res.ok) return alert('Erro ao carregar empresas');
  const empresas = await res.json();
  const tbody = document.getElementById('listaEmpresas');
  tbody.innerHTML = '';
    
  empresas.forEach(empresa => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${empresa.id}</td>
      <td>${empresa.nome}</td>
      <td>${empresa.razao_social}</td>
      <td>${empresa.cnpj}</td>
      <td>${empresa.cidade}</td>
      <td>${empresa.estado}</td>
      <td><a href="/administradores/dados-empresa?id=${empresa.id}">Visualizar</a></td>
    `;
    tbody.appendChild(tr);
  });
}

carregarEmpresas();

async function carregarAssistencias() {
  const res = await fetch('/all-assistencias');
  if (!res.ok) return alert('Erro ao carregar assistencias');
  const assistencias = await res.json();
  const tbody = document.getElementById('listaAssistencias');
  tbody.innerHTML = '';
    
  assistencias.forEach(assistencia => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${assistencia.id}</td>
      <td>${assistencia.nome}</td>
      <td>${assistencia.razao_social}</td>
      <td>${assistencia.cnpj}</td>
      <td>${assistencia.cidade}</td>
      <td>${assistencia.estado}</td>
      <td><a href="/administradores/dados-assistencia?id=${assistencia.id}">Visualizar</a></td>
    `;
    tbody.appendChild(tr);
  });
}

carregarAssistencias();

async function carregarChamados() {
  const status = document.getElementById('filtroStatus')?.value;
  const dataInicio = document.getElementById('filtroDataInicio')?.value;
  const dataFim = document.getElementById('filtroDataFim')?.value;

  const query = new URLSearchParams();
  if (status) query.append('status', status);
  if (dataInicio) query.append('dataInicio', dataInicio);
  if (dataFim) query.append('dataFim', dataFim);

  const res = await fetch(`/all-chamados?${query.toString()}`);
  if (!res.ok) return alert('Erro ao carregar chamados');
  const chamados = await res.json();

  const tbody = document.getElementById('listaChamados');
  tbody.innerHTML = '';

  chamados.forEach(chamado => {
    const tr = document.createElement('tr');

    const statusOptions = ['Aguardando', 'Agendamento Agendado', 'Em Execução', 'Finalizado', 'No-Show', 'Cancelado']
      .map(status => `<option value="${status}" ${chamado.status === status ? 'selected' : ''}>${status}</option>`)
      .join('');

    tr.innerHTML = `
      <td>${chamado.id}</td>
      <td>${chamado.ordem_servico}</td>
      <td>${chamado.endereco}</td>
      <td>${chamado.tipo_icamento}</td>
      <td>${chamado.data_agenda}</td>
      <td>
        <select data-id="${chamado.id}" class="status-select">
          ${statusOptions}
        </select>
      </td>
    `;

    tbody.appendChild(tr);
  });

  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', async (e) => {
      const chamadoId = e.target.dataset.id;
      const novoStatus = e.target.value;

      const resp = await fetch(`/chamados/${chamadoId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
      });

      if (!resp.ok) {
        alert('Erro ao atualizar status');
        carregarChamados(); // Recarrega para garantir consistência
      }
    });
  });
}

carregarChamados();