const fs = require("fs");
let jogadores = {};

function carregarDados() {
  if (fs.existsSync("jogadores.json")) {
    jogadores = JSON.parse(fs.readFileSync("jogadores.json", "utf-8"));
  }
}

function salvarDados() {
  fs.writeFileSync("jogadores.json", JSON.stringify(jogadores, null, 2));
}

function getHpBase(userId) {
  if (!jogadores[userId]) {
    jogadores[userId] = { hpBase: 10 };
    salvarDados();
  }
  return jogadores[userId].hpBase;
}

carregarDados();

module.exports = { getHpBase };