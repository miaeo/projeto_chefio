console.log('Antes do DOM');

window.addEventListener('DOMContentLoaded', () => {
  showPage('licoes');

  // RECUPERA DADOS DO USUÁRIO ARMAZENADOS NO LOCALSTORAGE
  const nomeUsuario = localStorage.getItem("nomeUsuario");
  const idUsuario = localStorage.getItem("idUsuario");
  const elementoNome = document.getElementById("nomeUsuario");
  const adminLink = document.getElementById("admin-link");
  const progresso = JSON.parse(localStorage.getItem(`progresso_${nomeUsuario}`)) || [];

  console.log("progresso:", progresso);
  console.log("Elemento nomeUsuario:", elementoNome);
  console.log("Nome do usuário:", nomeUsuario);
  console.log("idUsuario:", idUsuario);

  // (ADMIN) EXIBE PAINEL
  if (nomeUsuario && nomeUsuario.toLowerCase() === "admin") {
	  adminLink.style.display = "block";
    gerarTabelaAdmin();
  }

  // EXIBE NOME DE USUÁRIO NA NAVBAR
  if (nomeUsuario && elementoNome) {
    elementoNome.textContent = nomeUsuario.toUpperCase();
  }

  atualizarCards(progresso);

  // PARA REPETIR RECEITAS JÁ REALIZADAS, MARCADO COMO REVER
  const botoes = document.querySelectorAll('.iniciar');
  botoes.forEach(botao => {
    const url = botao.getAttribute('data-url');
    const partes = url.split('/');
    const receita = partes[partes.length - 2];

    if (progresso.includes(receita)) {
      const container = botao.parentElement;
      const wrapper = document.createElement("div");
      wrapper.className = "botoes-coluna";
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "column";
      wrapper.style.gap = "8px";

      const botaoConcluido = document.createElement("button");
      botaoConcluido.textContent = "CONCLUÍDO";
      botaoConcluido.className = "botao-concluido";
      botaoConcluido.disabled = true;

      const botaoRever = document.createElement("button");
      botaoRever.textContent = "VER NOVAMENTE";
      botaoRever.className = "ver-novamente";
      botaoRever.setAttribute("data-url", url);

      wrapper.appendChild(botaoConcluido);
      wrapper.appendChild(botaoRever);

      container.removeChild(botao);
      container.appendChild(wrapper);

      botaoRever.addEventListener('click', (event) => {
        event.stopPropagation();
        const url = botaoRever.getAttribute('data-url');
        if (url) {
          localStorage.setItem("reverReceita", "true");
          window.location.href = url;
        }
      });
    } else {
      botao.addEventListener('click', () => {
        window.location.href = url;
      });
    }
    botao.addEventListener('click', () => {
      window.location.href = url;
    });
  });

  // CARREGA POSSÍVEIS ALERTAS PARA O USUÁRIO NAS NOTIFICAÇÕES
  if (idUsuario) {
    carregarAlertaUsuario(idUsuario);
  }
  
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
document.querySelectorAll('.ver-novamente').forEach(botao => {
  botao.addEventListener('click', (event) => {
    event.stopPropagation();
    const url = botao.getAttribute('data-url');
    if (url) {
      localStorage.setItem("reverReceita", "true");
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
        tempo: '35 min',
        img: 'img/brigadeiro.jpg',
        url: 'receitas/brigadeiro/brigadeiro.html'
    },
    {
        nome: 'Macarrão Alho e Óleo',
        tempo: '15 min',
        img: 'img/macarrao.jpeg',
        url: 'receitas/macarrao/macarrao.html'
    },
    {
        nome: 'Batata Assada',
        tempo: '45 min',
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



// BUSCA USUÁRIOS NO BD PARA PREENCHER TABELA (ADMIN)
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
      carregarMensagensSuporte();
    })
    .catch(err => {
      console.error("Erro ao carregar usuários:", err);
    });
}

// BUSCA MENSAGENS DO SUPORTE NO BD PARA PREENCHER TABELA (ADMIN)
function carregarMensagensSuporte() {
  const tabelaSuporte = document.querySelector("#tabelaSuporte tbody");
  tabelaSuporte.innerHTML = "";

  fetch('http://localhost:3000/suporte')
    .then(res => res.json())
    .then(mensagens => {
      if (mensagens.length === 0) {
        tabelaSuporte.innerHTML = `<tr><td colspan="5">Nenhuma mensagem de suporte encontrada.</td></tr>`;
        return;
      }

      mensagens.forEach(msg => {
        const data = new Date(msg.data_envio).toLocaleString('pt-BR');
        tabelaSuporte.innerHTML += `
          <tr>
            <td>${msg.id}</td>
            <td>${msg.email}</td>
            <td>${msg.assunto}</td>
            <td>${msg.descricao}</td>
            <td>${data}</td>
          </tr>
        `;
      });
    })
    .catch(err => {
      console.error("Erro ao carregar suporte:", err);
    });
}



// FUNÇÃO DE BANIR USUÁRIO (ADMIN)
let usuarioParaBanir = null;
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('ban')) {
    const usuarioId = e.target.dataset.id;
    const modal = document.getElementById('modalBanir');
    modal.classList.add('show');
    usuarioParaBanir = usuarioId;
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
      gerarTabelaAdmin();
    } else {
      alert("Erro ao banir usuário.");
    }
  });
});


// FUNÇÃO DE ENVIAR ALERTA PARA USUÁRIO (ADMIN)
let usuarioParaAlertar = null;
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('warning')) {
    const usuarioId = e.target.closest('tr').querySelector('td').innerText;
    const modal = document.getElementById('modalAlerta');
    modal.classList.add('show');
    usuarioParaAlertar = usuarioId;
    document.getElementById('mensagemAlerta').value = "";
  }
});

function fecharModalAlerta() {
  const modal = document.getElementById('modalAlerta');
  modal.classList.remove('show');
  usuarioParaAlertar = null;
}

document.getElementById('confirmarAlerta').addEventListener('click', () => {
  const mensagem = document.getElementById('mensagemAlerta').value.trim();

  if (!mensagem) {
    alert("Por favor, digite a mensagem de alerta.");
    return;
  }

  fetch(`http://localhost:3000/usuarios/${usuarioParaAlertar}/alerta`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ alerta: mensagem })
  })
  .then(res => {
    if (res.ok) {
      alert("Alerta enviado com sucesso.");
      fecharModalAlerta();
      gerarTabelaAdmin();
    } else {
      alert("Erro ao enviar alerta.");
    }
  });
});


// CARREGA ALERTA DO USUÁRIO NAS NOTIFICAÇÕES
function carregarAlertaUsuario(usuarioId) {
  fetch(`http://localhost:3000/usuarios/${usuarioId}/alerta`)
    .then(response => response.json())
    .then(data => {
      const conteudo = document.getElementById('conteudoNotificacao');

      if (data.alerta && data.alerta.trim() !== "") {
        conteudo.innerHTML = `
          <i class='bx bxs-error-circle' style="font-size: 60px; color: #FEA946;"></i>
          <h1><strong>Atenção!</strong></h1>
          <p>${data.alerta}</p>
          <button 
              id="dismissAlerta" 
              style="
                font-size: 9px; 
                font-family: Cambria; 
                display: block; 
                margin-top: 140px;
              "
            >
              MARCAR COMO LIDA
          </button>
        `;

        // BOLINHA DE NOTIFICAÇÃO
        const iconeSino = document.getElementById('iconeSino');
        if (!document.querySelector('.notificacao-bolinha')) {
          const bolinha = document.createElement('span');
          bolinha.classList.add('notificacao-bolinha');
          iconeSino.parentElement.appendChild(bolinha);
        }

        // APÓS CLICAR EM "MARCAR COMO LIDO"
        document.getElementById('dismissAlerta').addEventListener('click', () => {
          fetch(`http://localhost:3000/usuarios/${usuarioId}/alerta`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ alerta: "" })
          }).then(() => {
            conteudo.innerHTML = `
              <i class='bx bxs-bell' style="font-size: 60px;"></i>
              <h1><strong>Sem notificações por enquanto!</strong></h1>
              <p>Fique ligado! Notificações sobre suas atividades vão aparecer aqui.</p>
            `;

            const bolinhaExistente = document.querySelector('.notificacao-bolinha');
            if (bolinhaExistente) bolinhaExistente.remove();
          });
        });
      }
    })
    .catch(err => {
      console.error("Erro ao carregar alerta:", err);
    });
}


// ENVIO DE MENSAGEM PARA O SUPORTE
document.querySelector('.formulario').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const assunto = document.getElementById('assunto').value;
  const descricao = document.getElementById('descricao').value;

  if (!email || !assunto || !descricao) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/suporte', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, assunto, descricao })
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      this.reset();
    } else {
      alert(data.message || 'Erro ao enviar mensagem.');
    }
  } catch (err) {
    alert('Erro ao conectar com o servidor.');
  }
});
