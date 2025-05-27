async function carregarChamados(filtros = {}) {
  const params = new URLSearchParams(filtros).toString();
  const res = await fetch(`/empresa-icamentos/chamados?${params}`);
  const chamados = await res.json();
  
  const tbody = document.getElementById('listaChamados');
  tbody.innerHTML = '';
  
  chamados.forEach(chamado => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td>${chamado.id}</td>
    <td>${chamado.ordem_servico}</td>
    <td>${chamado.endereco}</td>
    <td>${chamado.data_agenda}</td>
    <td>${chamado.status}</td>
    <td><button onclick="window.location.href='/empresas-icamento/chamado?id=${chamado.id}'">Ver</button></td>
    `;
    tbody.appendChild(tr);
  });
}

document.querySelector('button').addEventListener('click', () => {
  const status = document.getElementById('filtroStatus').value;
  const dataInicio = document.getElementById('filtroDataInicio').value;
  const dataFim = document.getElementById('filtroDataFim').value;
  
  const filtros = {};
  if (status) filtros.status = status;
  if (dataInicio) filtros.dataInicio = dataInicio;
  if (dataFim) filtros.dataFim = dataFim;
  
  carregarChamados(filtros);
});

// Carrega todos inicialmente
carregarChamados();