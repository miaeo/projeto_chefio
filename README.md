# Projeto _chef.io_

Projeto de uma plataforma web de ensino de culinária com elementos de **gamificação**. Usuários aprendem receitas e técnicas culinárias de forma divertida e interativa, acumulando progresso conforme completam lições.

## Instalação Local
### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado
- [xampp](https://www.apachefriends.org/pt_br/index.html) instalado

### 1. Clone o repositório

```bash
git clone https://github.com/miaeo/projeto_chefio.git
cd projeto_chefio
```

### 2. Instale o XAMPP
* Após instalação, inicie o Apache e o MySQL no Painel de Controle do XAMPP
* Acesse o [phpMyAdmin](http://localhost/phpmyadmin)

### 3. Crie o banco de dados
No phpMyadmin, execute os comandos:
```sql
CREATE DATABASE chefio;
USE chefio;

CREATE TABLE `suporte` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `assunto` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `data_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
)

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `banido` tinyint(1) DEFAULT 0,
  `motivoBanimento` text DEFAULT NULL,
  `alerta` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
)
```

### 4. Mova o projeto para o diretório do XAMPP
* Coloque a pasta do projeto dentro da pasta `htdocs` do xampp:
```bash
C:\xampp\htdocs\projeto_chefio
```

### 5. Instale as dependências do projeto
No terminal dentro da pasta do projeto, execute o comando:
```bash
npm install express cors body-parser mysql2 bcrypt
```

### 4. Inicie o servidor com:
```bash
cd backend
node server.js
```

A aplicação pode ser acessada em http://localhost/projeto_chefio/login/login.html após iniciar o servidor.

## Estrutura do projeto
```bash
projeto_chefio/
├── backend/ # Backend com Node.js
│ ├── db.js
│ └── server.js
├── img/ # Imagens usadas no projeto
│ └── *.png
├── login/ # Tela de login
│ ├── login.html
│ ├── login.js
│ └── login.css
├── receitas/ # Receitas organizadas por pasta
│ ├── arroz/
│ │ └── arroz.html
│ ├── script.js
│ └── style.css
├── index.html # Página principal
├── style.css 
├── script.js
├── LICENSE # Este projeto está licenciado sob os termos da licença MIT
└── README.md # Este arquivo
```
<br>
<div align="right">Made with 💜 by <a href="https://github.com/miaeo">miaeo</a>.</div>
