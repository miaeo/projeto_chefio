const mysql = require('mysql2');

const conexao = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chefio'
});

conexao.connect((err) => {
  if (err) {
    console.error('Erro ao conectar com o MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});

module.exports = conexao;