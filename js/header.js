/*
   ==============================
   |   Desenvolvido por Filipe  |
   |  github.com/FILIPE-S-SILVA |
   ==============================
*/



const btnCadastrar = document.getElementById('btnNovaMusica')
const btnListar = document.getElementById('listaMusicas')

const sectionNova = document.getElementById('novaMusica')
const sectionLista = document.getElementById('musicas')
const sectionEditar = document.getElementById('editar')

function editarSair() {
    document.getElementById('editar').style.display = 'none'
}

function musicOn() {
    btnCadastrar.classList.remove('on')
    btnListar.classList.add('on')
    
    sectionNova.style.display = 'none'
    sectionLista.style.display = 'flex'
    editarSair();
}

btnCadastrar.addEventListener('click', ()=>{

    btnCadastrar.classList.add('on')
    btnListar.classList.remove('on')
    
    sectionNova.style.display = 'flex'
    sectionLista.style.display = 'none'
    editarSair();
})

btnListar.addEventListener('click', ()=>{
    musicOn()
})


//Filipe_Dev7 passou aqui
