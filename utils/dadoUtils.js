// Função utilitária para rolar dados em JS
function rolarDado(comando) {
  const match = comando.match(/(\d+)d(\d+)/i);
  if (!match) return Math.floor(Math.random() * 20) + 1;

  const qtdDados = parseInt(match[1]);
  const lados = parseInt(match[2]);
  let total = 0;

  for (let i = 0; i < qtdDados; i++) {
    total += Math.floor(Math.random() * lados) + 1;
  }
  return total;
}

// Função auxiliar para criar pausa em segundos
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = { rolarDado, esperar };