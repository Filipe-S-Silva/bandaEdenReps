const linkPrincipal = 'https://eden20.vercel.app/'
// const linkPrincipal = 'http://localhost:3000/'

async function cadastrarMusica(nome, tom, data, tipo, vocal) {
  const res = await fetch(`${linkPrincipal}musicas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, tom, data, tipo, vocal })
  });
  return await res.json();
}

async function buscarMusica(id) {
  const res = await fetch(`${linkPrincipal}musicas/${id}`);
  return await res.json();
}

async function alterarMusica(id, tom, vocal, tipo, data) {
  const res = await fetch(`${linkPrincipal}musicas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tom,
      vocal,     
      tipo,    
      data
    })
  });

  if (!res.ok) {
    throw new Error('Erro ao atualizar música');
  }

  return await res.json();
}

async function excluirMusica(id) {
  const res = await fetch(`${linkPrincipal}musicas/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    throw new Error('Erro ao excluir música');
  }

  return await res.json();
}

window.addEventListener('load', async ()=>{
    document.body.classList.add('load')
  
    loadStart('sectionLista')
    try {
      await carregarMusicas()
    } catch {
      alert('Erro busca reinicie')
    } finally {
      loadEnd('sectionLista')
    }
})

//pega os inputs do primeiro html
function pegandoMusica() {
  const nome = document.getElementById('nome').value
  const tom = document.getElementById('tom').value
  const tipo = document.querySelector('input[name="tipo"]:checked')?.value || null
  const vocal = document.querySelector('input[name="vocal"]:checked')?.value || null
  const dataCompleta = data()

  if(!nome || !tom || !tipo || !vocal){
    alert('algum campo inválido')
    return
  }
  
  const musica = {
    nome: nome.toUpperCase(), 
    tom: tom.toUpperCase(),
    tipo: tipo,
    vocal: vocal,    
    data: dataCompleta
  }
  
  return musica
}

function data(){
  const date = new Date().getDate();
  const mes = new Date().getMonth() + 1;
  const ano = new Date().getFullYear();
  let dataCompleta = `${date}.${mes}.${ano}` 
  
  if (date < 10) dataCompleta = `0${date}.${mes}.${ano}` 
  if (mes < 10) dataCompleta = `${date}.0${mes}.${ano}` 
  return dataCompleta
}

function loadStart(sessao) {
  sessao == "sectionNova" ?  sectionNova.classList.add('loading') : ""
  sessao == "sectionLista" ?  sectionLista.classList.add('loading') : ""
  sessao == "sectionEditar" ?  sectionEditar.classList.add('loading') : ""
  

  document.getElementById('ballLoading').style.display = 'flex'
}
  
function loadEnd(sessao) {
    sessao == "sectionNova" ?  sectionNova.classList.remove('loading') : null
    sessao == "sectionLista" ?  sectionLista.classList.remove('loading') : null
    sessao == "sectionEditar" ?  sectionEditar.classList.remove('loading') : null    
    document.getElementById('ballLoading').style.display = 'none'
}

function limparInputCadastrar(){
    document.getElementById('nome').value = ''
    document.getElementById('tom').value = ''
    document.getElementById('nome').focus()
    //const radios = document.querySelectorAll('input[type="radio"]');  
    //radios.forEach(radio => radio.checked = false);
}

const btnCadastrarSection = document.getElementById('btnCadastrar')

//btnCadastrar
btnCadastrarSection.addEventListener('click', async ()=>{


    const musica = pegandoMusica()
    loadStart("sectionNova")

    try {
      await cadastrarMusica(musica.nome, musica.tom, musica.data, musica.tipo, musica.vocal)
      carregarMusicas()
      limparInputCadastrar()
      alert('Musica cadastrada')

    } catch (e) {
      console.log(e)
    } finally {
      loadEnd("sectionNova")
    }
})

//render tabela completo

  let musicas = []
  async function carregarMusicas() {
    try {
      const res = await fetch(`${linkPrincipal}musicas`);
      musicas = await res.json();
      filtrar(); 
    } catch (error) {
      console.error("Erro ao carregar músicas:", error);
      alert("Erro ao buscar músicas do servidor.");
    }
  }

  const tabelaBody = document.getElementById("tabelaBody");
  const totalMusicas = document.getElementById("totalMusicas");
  const ianCount = document.getElementById("ianCount");
  const yasminCount = document.getElementById("yasminCount");
  const cleoCount = document.getElementById("cleoCount");

  const filtroVocal = document.getElementById("filtroVocal");
  const filtroTipo = document.getElementById("filtroTipo");
  const buscaInput = document.getElementById("buscaInput");

  const tipoMap = {
    "ADORAÇÃO": 1,
    "EXALTAÇÃO": 2,
    "QUEBRANTAMENTO": 3,
    "CELEBRAÇÃO": 4
  };
  
  const vocalMap = {
    "IAN": 1,
    "YASMIN": 2,
    "CLEO": 3,
    "INDEFINIDO": 4
  };
  

  const tipoMapReverse = Object.fromEntries(Object.entries(tipoMap).map(([k, v]) => [v, k]));
  const vocalMapReverse = Object.fromEntries(Object.entries(vocalMap).map(([k, v]) => [v, k]));

  function renderTabela(filtradas) {
    tabelaBody.innerHTML = "";
    filtradas.forEach((m) => {      

      tabelaBody.innerHTML += `
        <tr>
          <td>${m.idmusica}</td>
          <td>${m.nome}</td>
          <td>${m.tom}</td>
          <td>${tipoMapReverse[m.tipo_idTipo] || "?"}</td>
          <td><strong>${vocalMapReverse[m.vocal_idvocal] || "?"}</strong></td>
          <td><button class="btn-ir" onclick = verDetalhes(${m.idmusica})>•••</button></td>
        </tr>`;
    });   

  }

  function atualizarContadores(lista) {
    totalMusicas.textContent = `TOTAL DE MUSICAS: ${lista.length}`;
    ianCount.textContent = `MUSICAS IAN: ${lista.filter(m => m.vocal_idvocal === vocalMap["IAN"]).length}`;
    yasminCount.textContent = `MUSICAS YASMIN: ${lista.filter(m => m.vocal_idvocal === vocalMap["YASMIN"]).length}`;
    cleoCount.textContent = `MUSICAS CLEO: ${lista.filter(m => m.vocal_idvocal === vocalMap["CLEO"]).length}`;
  }

  function filtrar() {
    let lista = [...musicas];
  
    const vocalSelecionado = filtroVocal.value;
    const tipoSelecionado = filtroTipo.value;
    const busca = buscaInput.value.trim().toLowerCase();
  
    if (vocalSelecionado !== "TODOS") {
      lista = lista.filter(m => m.vocal_idvocal === vocalMap[vocalSelecionado]);
    }
  
    if (tipoSelecionado !== "TODOS") {
      lista = lista.filter(m => m.tipo_idTipo === tipoMap[tipoSelecionado]);
    }
  
    if (busca) {
      lista = lista.filter(m => m.nome.toLowerCase().includes(busca));
    }
  
    renderTabela(lista);
    atualizarContadores(lista);
  }

  filtroVocal.addEventListener("change", filtrar);
  filtroTipo.addEventListener("change", filtrar);
  buscaInput.addEventListener("input", filtrar);


  // Inicializa
  carregarMusicas()

  //3 pontos para editar
  async function verDetalhes(id) {  

    loadStart("sectionLista")

    try{
      const musicaDetalhada = await buscarMusica(id)
      
  
      const musica = musicaDetalhada.detalhes[0]
      localStorage.setItem('idSelecionado', id)    
      let nome = document.getElementById('nomeEdit')
      let tom = document.getElementById('tomEdit')
      const dt = document.getElementById('dtAtualizacao')
  
      nome.value = musica.nome.toUpperCase()
      tom.value = musica.tom.toUpperCase()    
      dt.textContent = `ÚLTIMA ATUALIZAÇÃO: ${musica.dataAtt}`
      // Marcar o radio correto
      const tipoRadio = document.querySelector(`input[name="tipoEdit"][value="${musica.tipo_idTipo}"]`);
      const vocalRadio = document.querySelector(`input[name="vocalEdit"][value="${musica.vocal_idvocal}"]`);
      
      if (tipoRadio) tipoRadio.checked = true;
      if (vocalRadio) vocalRadio.checked = true;
      
      sectionLista.style.display = 'none'
      sectionEditar.style.display = 'flex'

    } catch(e){
      console.log(`Erro: `, e)
    } finally {
      loadEnd("sectionLista")
    }
   
  }

  //voltar
  document.getElementById('btnVoltar').addEventListener('click', ()=>{
    musicOn()
    localStorage.removeItem('idSelecionado')

  })

  //excluir
  document.getElementById('btnExcluir').addEventListener('click', async ()=>{

    const nome = document.getElementById('nomeEdit').value
    if (!confirm(`DESEJA EXCLUIR MUSICA ${nome}?`)) return
    const id = localStorage.getItem('idSelecionado')
    loadStart('sectionEditar')

    try {
      await excluirMusica(id)

      carregarMusicas()
      musicOn()
      localStorage.removeItem('idSelecionado')
      alert(`MUSICA ${nome} REMOVIDA COM SUCESSO`)
      
    } catch (error) { 
      alert(`ERRO AO REMOVER MUSICA ${nome}`)      
    } finally {
      loadEnd('sectionEditar')
    }

  })  

  //editar
  document.getElementById('btnEditar').addEventListener('click', async ()=>{
    const nome = document.getElementById('nomeEdit').value
    if (!confirm(`DESEJA ALTERAR MUSICA ${nome}?`)) return
    
    loadStart('sectionEditar')

    const id = localStorage.getItem('idSelecionado')
    const tom = document.getElementById('tomEdit').value
    const tipo = document.querySelector('input[name="tipoEdit"]:checked')?.value || null
    const vocal = document.querySelector('input[name="vocalEdit"]:checked')?.value || null
    const dataCompleta = data()
    

    if(!tom){
      alert('algum campo inválido')
      return
    }   

    const musicaAtualizada = {
      tom: tom.toUpperCase(),
      tipo: tipo,
      vocal: vocal,    
      data: dataCompleta
    }

    try{
      await alterarMusica(id, musicaAtualizada.tom, musicaAtualizada.vocal, musicaAtualizada.tipo, musicaAtualizada.data)      
      carregarMusicas()
      musicOn()
      localStorage.removeItem('idSelecionado')
      alert(`MUSICA ${nome} ALTERADA COM SUCESSO`)
    } catch(e){
      alert(`ERRO AO ALTERAR MUSICA ${nome}`)
    } finally{ 
      loadEnd('sectionEditar')
    }
    
    

  })
