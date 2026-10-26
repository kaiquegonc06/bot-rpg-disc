function criarBarra(hpAtual, hpMax) {
  const total = 10;
  const cheios = Math.round((hpAtual / hpMax) * total);
  const vazios = total - cheios;
  return '🟩'.repeat(cheios) + '🟥'.repeat(vazios);
}

const inimigos = {
  boneco: { nome: "Boneco", hp: 8 },
  goblin: { nome: "Goblin", hp: 5 },
  esqueleto: { nome: "Esqueleto", hp: 7 },
  dragao: { nome: "Dragão", hp: 15 },
  vampira: { nome: "Vampira", hp: 20 },
  drmarcus: { nome: "Dr Marcus", hp: 18 }
};

module.exports = { criarBarra, inimigos };