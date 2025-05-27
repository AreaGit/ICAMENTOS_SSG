let statusAtualChamado;

const statusSequencia = [
  "Aguardando",
  "Agendamento",
  "Agendado",
  "Em Execução",
  "Finalizado"
];

const statusFinal = ["Finalizado", "No-show", "Cancelado"];

function getProximoStatus(status) {
  const idx = statusSequencia.indexOf(status);
  return idx >= 0 && idx < statusSequencia.length - 1 ? statusSequencia[idx + 1] : null;
}

function aplicarEstiloStatus(status) {
  const statusSpan = document.getElementById('status');
  statusSpan.textContent = status;

  const cores = {
    "Aguardando": "#FFC600",
    "Agendamento": "#00A9E0",
    "Agendado": "#0057B8",
    "Em Execução": "#FF6900",
    "Finalizado": "#00B140",
    "Cancelado": "#E4002B",
    "No-show": "#C800A1"
  };

  statusSpan.style.backgroundColor = cores[status] || "#888B8D";
}

function configurarBotaoAvancarStatus(statusAtual, chamadoId) {
  const proximoStatus = getProximoStatus(statusAtual);
  const btn = document.getElementById('btnAvancarStatus');
  const formFinalizacao = document.getElementById('form-finalizacao');
  const form = document.getElementById("form-finalizar");
  let isReload = 0;

  if (proximoStatus && !statusFinal.includes(statusAtual)) {
    btn.style.display = 'inline-flex';
    btn.onclick = async () => {
      if (proximoStatus === "Finalizado") {
        formFinalizacao.style.display = "block";
        window.location.reload();
        form.onsubmit = async (e) => {
          e.preventDefault();
          btn.textContent = "Finalizando...";
          btn.disabled = true;

          const horario = document.getElementById("horario_finalizacao").value;
          const obs = document.getElementById("obs_finalizacao").value;
          const fotos = document.getElementById("fotos_finalizacao").files;

          const formData = new FormData();
          formData.append("horario_finalizacao", horario);
          formData.append("obs_finalizacao", obs);
          for (let i = 0; i < fotos.length; i++) {
            formData.append("fotos[]", fotos[i]);
          }

          try {
            const res = await fetch(`/empresas-icamento/finalizar-chamado/${chamadoId}`, {
              method: "POST",
              body: formData,
            });

            if (res.ok) {
              aplicarEstiloStatus("Finalizado");
              btn.style.display = "none";
              alert("Chamado finalizado com sucesso!");
              formFinalizacao.style.display = "none";
            } else {
              alert("Erro ao finalizar chamado.");
            }
          } catch (err) {
            console.error(err);
            alert("Erro ao enviar dados.");
          }

          btn.disabled = false;
          btn.textContent = "Avançar Status";
        };
      } else {
        btn.textContent = "Atualizando...";
        btn.disabled = true;

        try {
          const res = await fetch(`/empresa-icamentos/chamado/${chamadoId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: proximoStatus })
          });

          if (res.ok) {
            aplicarEstiloStatus(proximoStatus);
            configurarBotaoAvancarStatus(proximoStatus, chamadoId);
          } else {
            alert("Erro ao atualizar status.");
          }
        } catch (err) {
          alert("Erro de rede.");
        }

        btn.disabled = false;
        btn.textContent = "Avançar Status";
      }
    };
  } else {
    btn.style.display = 'none';
  }
}

async function carregarDetalhes() {
  const urlParams = new URLSearchParams(window.location.search);
  const chamadoId = urlParams.get('id');
  const res = await fetch(`/chamado/${chamadoId}`);
  const chamado = await res.json();

  statusAtualChamado = chamado.status;

  document.getElementById('id').textContent = chamado.id;
  document.getElementById('titulo').textContent = chamado.ordem_servico;
  document.getElementById('endereco').textContent = chamado.endereco;
  document.getElementById('tipo_icamento').textContent = chamado.tipo_icamento;
  document.getElementById('data_agenda').textContent = chamado.data_agenda;
  document.getElementById('status').textContent = chamado.status;
  document.getElementById('observacoes').textContent = chamado.observacoes;

  aplicarEstiloStatus(chamado.status);
  configurarBotaoAvancarStatus(chamado.status, chamado.id);

  const anexosContainer = document.getElementById('anexos');
  chamado.anexos.forEach(anexo => {
    const link = document.createElement('button');
    link.href = `/download-anexo?file=${encodeURIComponent(anexo)}`;
    link.textContent = anexo.split('-').pop();
    link.classList.add('botao-download');
    link.setAttribute('download', '');
    anexosContainer.appendChild(link);
  });

  document.getElementById('btnAvancarStatus').textContent = getProximoStatus(chamado.status);

  if (chamado.status === "Em Execução") {
    document.getElementById('form-finalizacao').style.display = 'block';
    document.getElementById('btnAvancarStatus').style.display = 'none';

    document.getElementById('btnSalvar').addEventListener('click', async () => {
      const horario = document.getElementById("horario_finalizacao").value;
      const obs = document.getElementById("obs_finalizacao").value;
      const fotos = document.getElementById("fotos_finalizacao").files;

      const formData = new FormData();
      formData.append("horario_finalizacao", horario);
      formData.append("obs_finalizacao", obs);
      for (let i = 0; i < fotos.length; i++) {
        formData.append("fotos", fotos[i]);
      }

      const btnSalvar = document.getElementById('btnSalvar');
      btnSalvar.textContent = "Finalizando...";
      btnSalvar.disabled = true;

      try {
        const res = await fetch(`/empresa-icamentos/finalizar-chamado/${chamadoId}`, {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          aplicarEstiloStatus("Finalizado");
          alert("Chamado finalizado com sucesso!");
          document.getElementById('form-finalizacao').style.display = 'none';
          btnSalvar.style.display = 'none';
        } else {
          alert("Erro ao finalizar chamado.");
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao enviar dados.");
      }

      btnSalvar.disabled = false;
      btnSalvar.textContent = "Salvar Finalização";
    });
  }
}

carregarDetalhes();