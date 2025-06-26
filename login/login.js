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
