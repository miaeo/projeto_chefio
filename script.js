console.log('Antes do DOM');

window.addEventListener('DOMContentLoaded', () => {
  showPage('licoes');

  // RECEBE O NOME DO USUÁRIO E SUBSTITUI NA NAVBAR
  const nomeUsuario = localStorage.getItem("nomeUsuario");
  const elementoNome = document.getElementById("nomeUsuario");
  const adminLink = document.getElementById("admin-link");
  const progresso = JSON.parse(localStorage.getItem(`progresso_${nomeUsuario}`)) || [];

  console.log("progresso:", progresso);
  console.log("Elemento nomeUsuario:", elementoNome);
  console.log("Nome do usuário:", nomeUsuario);

  if (nomeUsuario && nomeUsuario.toLowerCase() === "admin") {
	  adminLink.style.display = "block";
    gerarTabelaAdmin();
  }

  if (nomeUsuario && elementoNome) {
    elementoNome.textContent = nomeUsuario.toUpperCase();
  }

  atualizarCards(progresso);

  const botoes = document.querySelectorAll('.iniciar');
  botoes.forEach(botao => {
    const url = botao.getAttribute('data-url');
    const partes = url.split('/');
    const receita = partes[partes.length - 2];

    if (progresso.includes(receita)) {
      botao.textContent = 'CONCLUÍDO';
      botao.classList.add('botao-concluido');
      botao.disabled = true; // desativa o clique
      botao.style.cursor = 'not-allowed'; // cursor de bloqueado
    } else {
      botao.addEventListener('click', () => {
        window.location.href = url;
      });
    }
    // Redirecionar ao clicar
    botao.addEventListener('click', () => {
      window.location.href = url;
    });
  });
});

const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

// PARA CADA ITEM DA SIDEBAR, ADICIONA UM EVENTO DE CLIQUE
allSideMenu.forEach(item=> {
	const li = item.parentElement;
	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});


// TOGGLE DA SIDEBAR
const menuBar = document.querySelector('#sidebar a .bx.bx-menu');
const sidebar = document.getElementById('sidebar');
menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})
 
// EXIBE A PÁGINA COM BASE NO ID
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.classList.add('active');
        activePage.style.display = 'block';
    }
    const sidebarLinks = document.querySelectorAll('#sidebar .side-menu li');
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
    });
    if (pageId === 'licoes') {
        sidebarLinks[0].classList.add('active');
    } else if (pageId === 'sobre') {
        sidebarLinks[1].classList.add('active');
    } else if (pageId === 'suporte') {
        sidebarLinks[1].classList.add('active');
    } else if (pageId === 'admin') {
		    document.querySelector('#admin-link').classList.add('active');
	}
}


// POP NOS ITENS DE CADA SEÇÃO
const items = document.querySelectorAll('.item');
items.forEach(item => {
    item.addEventListener('click', function () {
        items.forEach(i => i.classList.remove('pop'));
        item.classList.toggle('pop');
    });
});
document.querySelectorAll('.iniciar').forEach(botao => {
    botao.addEventListener('click', (event) => {
        event.stopPropagation();
        const url = botao.getAttribute('data-url');
        if (url) {
            window.location.href = url;
        }
    });
});


// BALÃO DE NOTIFICAÇÃO
const sino = document.getElementById('iconeSino');
const balao = document.getElementById('notificacaoBalao');
const fecharBtn = document.getElementById('fecharNotificacao');
sino.addEventListener('click', (e) => {
  e.stopPropagation();
  balao.classList.toggle('ativo');
});
fecharBtn.addEventListener('click', () => {
  balao.classList.remove('ativo');
});
document.addEventListener('click', (e) => {
  if (!balao.contains(e.target) && e.target !== sino) {
    balao.classList.remove('ativo');
  }
});


// CARROSSEL DA MISSÃO E MÉTODO
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const indicator = document.querySelector(".tab-indicator");
function updateIndicator(button) {
  const offsetLeft = button.offsetLeft;
  const width = button.offsetWidth;
  indicator.style.left = `${offsetLeft}px`;
  indicator.style.width = `${width}px`;
}
tabButtons.forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".tab-btn.active").classList.remove("active");
    document.querySelector(".tab-content.active").classList.remove("active");

    button.classList.add("active");
    const tab = button.getAttribute("data-tab");
    document.getElementById(tab).classList.add("active");

    updateIndicator(button);
  });
});

// INICIALIZA A POSIÇÃO DA BARRINHA
window.addEventListener("load", () => {
  const activeBtn = document.querySelector(".tab-btn.active");
  updateIndicator(activeBtn);
});

// RECEITAS DO NÍVEL 2
const receitasNivel2 = [
    {
        nome: 'Brigadeiro',
        tempo: '10 min',
        img: 'img/brigadeiro.jpg',
        url: 'receitas/brigadeiro/brigadeiro.html'
    },
    {
        nome: 'Macarrão Alho e Óleo',
        tempo: '25 min',
        img: 'img/macarrao.jpeg',
        url: 'receitas/macarrao/macarrao.html'
    },
    {
        nome: 'Batata Assada',
        tempo: '35 min',
        img: 'img/batata.jpg',
        url: 'receitas/batata/batata.html'
    }
];


// REGISTRA O PROGRESSO DO USUÁRIO
function atualizarCards(progresso) {
  const totalReceitasParaLiga = 10;
  const receitasConcluidas = progresso.length;
  const ligasCardP = document.querySelector('.ligas-card p');
  const receitasFaltantes = Math.max(totalReceitasParaLiga - receitasConcluidas, 0);
  ligasCardP.innerHTML = `
    <img class="shield" src="https://d35aaqx5ub95lt.cloudfront.net/images/leagues/d4280fdf64d66de7390fe84802432a53.svg"> 
    Complete mais ${receitasFaltantes} receita${receitasFaltantes !== 1 ? 's' : ''} pra subir de ranque.
  `;

  // MISSÃO DIÁRIA
  const xpPorReceita = 2;
  const xpMaximo = 10;
  let xpAtual = receitasConcluidas * xpPorReceita;
  if (xpAtual > xpMaximo) xpAtual = xpMaximo;

  let porcentagemXP = (xpAtual / xpMaximo) * 100;

  const progressBar = document.querySelector('.progress-bar');
  const progress = document.querySelector('.progress');
  progress.style.width = `${porcentagemXP}%`;

  progressBar.style.background = 'var(--dark)';

  const nivel2 = document.querySelector('.nivel-2');
  const itensNivel2 = nivel2.querySelectorAll('.item2');

  if (receitasConcluidas >= 3) {
      nivel2.classList.remove('bloqueado');
      itensNivel2.forEach((item, index) => {
          item.classList.remove('bloqueado');
          item.classList.add('item');
          item.innerHTML = `
              <img src="${receitasNivel2[index].img}" alt="${receitasNivel2[index].nome}">
              <div class="info">
                  <h3>${receitasNivel2[index].nome}</h3>
                  <p><i class='bx bx-time-five' style="font-size: 15px;"></i> ${receitasNivel2[index].tempo}</p>
              </div>
              <button class="iniciar" data-url="${receitasNivel2[index].url}">INICIAR</button>
          `;
      });

      document.querySelectorAll('.item').forEach(item => {
          item.addEventListener('click', function () {
              document.querySelectorAll('.item').forEach(i => i.classList.remove('pop'));
              item.classList.toggle('pop');
          });
      });
      document.querySelectorAll('.iniciar').forEach(botao => {
          botao.addEventListener('click', (event) => {
              event.stopPropagation();
              const url = botao.getAttribute('data-url');
              if (url) {
                  window.location.href = url;
              }
          });
      });
  }
}

// SORT DA TABELA ADMIN
const sortDirections = {};

function sortTable(columnIndex) {
    const table = document.getElementById('tabela');
    const rows = Array.from(table.rows).slice(1);
    
    const currentDirection = sortDirections[columnIndex] || 'asc';
    const isAscending = currentDirection === 'asc';

    const sortedRows = rows.sort((a, b) => {
        const aText = a.cells[columnIndex].innerText.toLowerCase();
        const bText = b.cells[columnIndex].innerText.toLowerCase();

        if (aText < bText) return isAscending ? -1 : 1;
        if (aText > bText) return isAscending ? 1 : -1;
        return 0;
    });

    rows.forEach(() => table.deleteRow(1));

    sortedRows.forEach(row => table.tBodies[0].appendChild(row));

    sortDirections[columnIndex] = isAscending ? 'desc' : 'asc';
}

function gerarTabelaAdmin() {
  console.log 
  const tabela = document.querySelector("#tabela tbody");
  tabela.innerHTML = "";

  fetch('http://localhost:3000/usuarios')
    .then(response => response.json())
    .then(usuarios => {
      usuarios.forEach(usuario => {
        const progresso = JSON.parse(localStorage.getItem(`progresso_${usuario.nome}`)) || [];
        const xp = progresso.length * 2;

        let secao = "SEÇÃO 1";
        let classe = "um";
        if (progresso.length >= 6) {
          secao = "SEÇÃO 3";
          classe = "tres";
        } else if (progresso.length >= 3) {
          secao = "SEÇÃO 2";
          classe = "dois";
        }

        tabela.innerHTML += `
          <tr>
            <td>${usuario.id}</td>
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td><span class="secao-box ${classe}">${secao}</span></td>
            <td>${xp} xp</td>
            <td>
              <i class='bx bx-block ban' title="Banir Usuário" data-id="${usuario.id}"></i>
              <i class='bx bxs-error warning' title="Emitir alerta"></i>
            </td>
          </tr>
        `;
      });
    })
    .catch(err => {
      console.error("Erro ao carregar usuários:", err);
    });
}

let usuarioParaBanir = null;

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('ban')) {
    const usuarioId = e.target.dataset.id;
    const modal = document.getElementById('modalBanir');
    modal.classList.add('show');
    usuarioParaBanir = usuarioId;
    // Limpa campo motivo ao abrir modal
    document.getElementById('motivoInput').value = "";
  }
});

function fecharModalBanir() {
  const modal = document.getElementById('modalBanir');
  modal.classList.remove('show');
  usuarioParaBanir = null;
}

document.getElementById('confirmarBanir').addEventListener('click', () => {
  const motivo = document.getElementById('motivoInput').value.trim();

  if (!motivo) {
    alert("Por favor, informe o motivo do banimento.");
    return;
  }

  fetch(`http://localhost:3000/usuarios/${usuarioParaBanir}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      banido: true,
      motivoBanimento: motivo
    })
  })
  .then(res => {
    if (res.ok) {
      alert("Usuário banido com sucesso.");
      fecharModalBanir();
      gerarTabelaAdmin(); // atualiza tabela
    } else {
      alert("Erro ao banir usuário.");
    }
  });
});
