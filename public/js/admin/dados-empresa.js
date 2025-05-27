async function carregarEmpresa() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const response = await fetch(`/empresa/${id}`);
    const empresa = await response.json();
    
    console.log(empresa)
    
    if (response.ok) {
        for (const campo in empresa) {
            const input = document.querySelector(`[name="${campo}"]`);
            if (input) input.value = empresa[campo];
        }
    } else {
        alert(empresa.message || 'Erro ao carregar empresa');
    }
}
 
carregarEmpresa();

 document.getElementById("formEmpresa").addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch("/empresa/salvar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      alert(result.message);
    });