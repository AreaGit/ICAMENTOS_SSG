document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const chamadoId = urlParams.get('id');
  
  if (!chamadoId) return;
  
  const res = await fetch(`/chamado/${chamadoId}`);
  if (!res.ok) return alert('Erro ao carregar detalhes');
  
  const chamado = await res.json();

  document.getElementById('chamado-id').textContent = '#' + chamado.id;
  document.getElementById('chamado-status').textContent = chamado.status;
  document.getElementById('chamado-ordem').textContent = chamado.ordem_servico;
  document.getElementById('chamado-tipo').textContent = chamado.tipo_icamento;
  document.getElementById('chamado-produto').textContent = chamado.produto;
  document.getElementById('chamado-vt').textContent = chamado.vt;
  document.getElementById('chamado-art').textContent = chamado.art;
  document.getElementById('chamado-data').textContent = chamado.data_agenda;
  document.getElementById('chamado-endereco').textContent = chamado.endereco;
  
  const anexos = chamado.anexos;
  const anexosContainer = document.getElementById('chamado-anexos');

  anexos.forEach(path => {
    const nomeArquivo = decodeURIComponent(path.split('/').pop());

    const botao = document.createElement('button');
    botao.classList.add('botao-download');
    botao.innerHTML = `📎 <span>${nomeArquivo}</span>`;

    botao.onclick = async () => {
      botao.disabled = true;
      botao.classList.add('loading');
      botao.innerHTML = '⏳ Baixando...';

      try {
        const res = await fetch(`/download/${encodeURIComponent(nomeArquivo)}`);
        if (!res.ok) throw new Error('Erro no download');

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = nomeArquivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        botao.innerHTML = `✅ <span>${nomeArquivo}</span>`;
      } catch (err) {
        console.error(err);
        botao.innerHTML = `❌ <span>Erro ao baixar</span>`;
      } finally {
        botao.disabled = false;
        botao.classList.remove('loading');
      }
    };

    anexosContainer.appendChild(botao);
  });
});