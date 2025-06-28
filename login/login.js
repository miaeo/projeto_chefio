const btnEntrar = document.getElementById("btnEntrar");
const cadastro = document.getElementById("cadastro");
const loginForm = document.getElementById("loginForm");
const btnLoginFinal = document.getElementById("botaoLogin");
const voltarBtn = document.getElementById("voltarBtn");
const carregando = document.getElementById("carregando");
const registerForm = document.getElementById("registerForm");

btnEntrar.addEventListener("click", () => {
  cadastro.classList.add("hidden");
  setTimeout(() => {
    loginForm.classList.add("show");
    loginForm.classList.remove("hidden");
  }, 300);
});

voltarBtn.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  loginForm.classList.remove("show");
  cadastro.classList.remove("hidden");
});

// LOGIN
btnLoginFinal.addEventListener("click", async () => {
  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;

  if (!email || !senha) {
    alert("Preencha todos os campos para continuar.");
    return;
  }

  carregando.classList.remove("hidden");

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok && data.sucesso) {
      // Login OK
      if (data.usuario && data.usuario.nome) {
        localStorage.setItem("nomeUsuario", data.usuario.nome);
        localStorage.setItem("idUsuario", data.usuario.id);
      }
      setTimeout(() => {
        carregando.classList.add("hidden");
        window.location.href = "../index.html";
      }, 2000);
    } else if (response.status === 403 && data.banido) {
      // Usuário banido
      setTimeout(() => {
        carregando.classList.add("hidden");
        alert(`Seu acesso foi bloqueado.\nMotivo: ${data.motivo}`);
      }, 2000);
    } else {
      // Outros erros de login (401 etc)
      setTimeout(() => {
        carregando.classList.add("hidden");
        alert("Email ou senha inválidos.");
      }, 2000);
    }
  } catch (erro) {
    setTimeout(() => {
      carregando.classList.add("hidden");
      alert("Erro ao conectar com o servidor.");
    }, 2000);
  }
});

// CADASTRO
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nomeCad').value;
  const email = document.getElementById('emailCad').value;
  const senha = document.getElementById('senhaCad').value;

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos para continuar.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Cadastro realizado com sucesso!");
      registerForm.reset();
    } else {
      alert(data.message || "Erro ao cadastrar.");
    }
  } catch (error) {
    alert("Erro ao conectar com o servidor.");
    console.error(error);
  }
});


// ESQUECI MINHA SENHA
// Etapa 1 - Confirmar email
document.querySelector('.link-senha').addEventListener('click', () => {
  document.getElementById('modalEmail').classList.remove('hidden');
});

function fecharModalEmail() {
  document.getElementById('modalEmail').classList.add('hidden');
}
function fecharModalSenha() {
  document.getElementById('modalNovaSenha').classList.add('hidden');
}

document.getElementById('proximoPasso').addEventListener('click', () => {
  const email = document.getElementById('emailRecuperar').value;
  const carregando = document.getElementById('carregandoRecuperacao');

  if (!email) return alert("Digite o email!");

  carregando.classList.remove("hidden");

  fetch('http://localhost:3000/verificar-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  .then(res => res.json())
  .then(data => {
    setTimeout(() => {
      carregando.classList.add("hidden");

      if (data.existe) {
        document.getElementById('modalEmail').classList.add('hidden');
        document.getElementById('modalNovaSenha').classList.remove('hidden');
        localStorage.setItem('emailRecuperacao', email);
      } else {
        alert("Email não encontrado no sistema.");
      }
    }, 2000);
  })
  .catch(() => {
    setTimeout(() => {
      carregando.classList.add("hidden");
      alert("Erro ao verificar email.");
    }, 2000);
  });
});

// Etapa 2 - Redefinir senha
document.getElementById('confirmarRecuperacao').addEventListener('click', () => {
  const novaSenha = document.getElementById('novaSenha').value;
  const email = localStorage.getItem('emailRecuperacao');

  if (!novaSenha) {
    alert("Digite uma nova senha!");
    return;
  }

  fetch('http://localhost:3000/redefinir-senha', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, novaSenha })
  })
  .then(res => res.json())
  .then(data => {
    alert("Senha redefinida com sucesso!");
    fecharModalSenha();
  })
  .catch(() => alert("Erro ao redefinir senha."));
});
