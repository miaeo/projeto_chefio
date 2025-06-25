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

function registrarProgresso() {
	console.log('Função registrarProgresso() chamada');
    const nomeUsuario = localStorage.getItem("nomeUsuario");
    const path = window.location.pathname;
    const partes = path.split('/');
    const receita = partes.includes("receitas") ? partes[partes.length - 2] : null;

    if (nomeUsuario && receita) {
        const progressoKey = `progresso_${nomeUsuario}`;
        const progresso = JSON.parse(localStorage.getItem(progressoKey)) || [];

        console.log(`Usuário logado: ${nomeUsuario}`);
        console.log(`Receita atual: ${receita}`);
        console.log(`Progresso antes:`, progresso);

        if (!progresso.includes(receita)) {
            progresso.push(receita);
            localStorage.setItem(progressoKey, JSON.stringify(progresso));
            console.log(`Receita "${receita}" adicionada ao progresso.`);
        } else {
            console.log(`Receita "${receita}" já estava no progresso.`);
        }

        console.log(`Progresso depois:`, JSON.parse(localStorage.getItem(progressoKey)));
    } else {
        console.warn("Não foi possível salvar progresso. Usuário ou receita inválida.");
    }
}

document.addEventListener('DOMContentLoaded', function () {
	const btn = document.querySelector('.continuar');
	const infoDiv = document.querySelector('.info');
	const receitaDiv = document.querySelector('.receita');
	const aprendDiv = document.querySelector('.aprender');
	const parabensDiv = document.querySelector('.parabens');
	const scrollContainer = document.querySelector('#content main');

	let etapaAtual = 'info';

	infoDiv.classList.add('active');

	btn.addEventListener('click', function () {
		if (etapaAtual === 'info') {
			infoDiv.classList.remove('active');
			receitaDiv.classList.add('active');
			etapaAtual = 'receita';
		} else if (etapaAtual === 'receita') {
			receitaDiv.classList.remove('active');
			aprendDiv.classList.add('active');
			etapaAtual = 'aprender';
		} else if (etapaAtual === 'aprender') {
			aprendDiv.classList.remove('active');
			parabensDiv.classList.add('active');
			btn.textContent = 'FINALIZAR';
			etapaAtual = 'parabens';
		} else if (etapaAtual === 'parabens') {
			console.log("Entrou no bloco parabens"); // <--- test
			registrarProgresso();
			const modal = document.getElementById('modal-badge');
			modal.style.display = 'flex';
			btn.style.display = 'none';
		}
		
		scrollContainer.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	});
});