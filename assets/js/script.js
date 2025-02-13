const palavras = [
  {
    numero: 1,
    orientacao: "across",
    dica: "Valor pendente pelos dias trabalhados.",
    resposta: "SALDODESALARIO", // 14 letras
    linha: 5,
    coluna: 1,
  },
  {
    numero: 2,
    orientacao: "down",
    dica: "Período obrigatório antes da saída do empregado.",
    resposta: "AVISOPREVIO", // 11 letras
    linha: 2,
    coluna: 1,
  },
  {
    numero: 3,
    orientacao: "down",
    dica: "Descanso anual remunerado.",
    resposta: "FERIAS", // 6 letras
    linha: 1,
    coluna: 9,
  },
  {
    numero: 4,
    orientacao: "down",
    dica: "Tempo de trabalho além da jornada habitual.",
    resposta: "HORASEXTRAS", // 11 letras
    linha: 4,
    coluna: 14,
  },
  {
    numero: 5,
    orientacao: "across",
    dica: "Verbas adicionais ao salário.",
    resposta: "ADICIONAIS", // 10 letras
    linha: 9,
    coluna: 3,
  },
  {
    numero: 6,
    orientacao: "across",
    dica: "Fundo de garantia depositado pelo empregador.",
    resposta: "FGTS", // 4 letras
    linha: 11,
    coluna: 12,
  },
  {
    numero: 7,
    orientacao: "down",
    dica: "Contribuição social obrigatória para aposentadoria.",
    resposta: "INSS", // 4 letras
    linha: 9,
    coluna: 5,
  },
  {
    numero: 8,
    orientacao: "down",
    dica: "Imposto retido na fonte.",
    resposta: "IRRF", // 4 letras
    linha: 4,
    coluna: 12,
  },
  {
    numero: 9,
    orientacao: "across",
    dica: "Pagamento antecipado do salário.",
    resposta: "ADIANTAMENTOS", // 13 letras
    linha: 14,
    coluna: 2,
  },
  {
    numero: 10,
    orientacao: "down",
    dica: "Auxílios extras além do salário.",
    resposta: "BENEFICIOS", // 10 letras
    linha: 2,
    coluna: 7,
  },
];

const totalLinhas = 16;
const totalColunas = 16;

let grid = [];
for (let r = 0; r < totalLinhas; r++) {
  let row = [];
  for (let c = 0; c < totalColunas; c++) {
    row.push({
      blocked: true,
      letter: "",
      clueNumber: null,
    });
  }
  grid.push(row);
}

palavras.forEach((palavraObj) => {
  const { numero, orientacao, resposta, linha, coluna } = palavraObj;
  const upperWord = resposta.toUpperCase();

  grid[linha][coluna].clueNumber = numero;

  for (let i = 0; i < upperWord.length; i++) {
    let r = linha;
    let c = coluna;

    if (orientacao === "across") {
      c += i;
    } else {
      r += i;
    }

    grid[r][c].blocked = false;
    grid[r][c].letter = upperWord[i];
  }
});

function renderCrossword() {
  const $crossword = $("#crossword");
  $crossword.empty();

  for (let r = 0; r < totalLinhas; r++) {
    const $rowDiv = $("<div>").addClass("cw-row");

    for (let c = 0; c < totalColunas; c++) {
      const cellData = grid[r][c];
      const $cellDiv = $("<div>").addClass("cw-cell");

      if (cellData.blocked) {
        $cellDiv.addClass("blocked");
      } else {
        if (cellData.clueNumber) {
          const $numSpan = $("<span>")
            .addClass("cw-clue-number")
            .text(cellData.clueNumber);
          $cellDiv.append($numSpan);
        }

        const $input = $("<input>")
          .attr("maxlength", "1")
          .attr("id", `cell-${r}-${c}`)
          .data("row", r)
          .data("col", c);

        $cellDiv.append($input);
      }

      $rowDiv.append($cellDiv);
    }
    $crossword.append($rowDiv);
  }
}

function renderClues() {
  const $cluesList = $("#clues-list");
  $cluesList.empty();

  palavras.forEach((p) => {
    const orientTxt = p.orientacao === "across" ? "Horizontal" : "Vertical";
    const $li = $("<li>")
      .addClass("li-dicas")
      .html(`<strong>${p.numero}:</strong> ${p.dica}`);
    $cluesList.append($li);
  });
}

function verificarRespostas() {
  console.log("Iniciando verificação...");

  for (let r = 0; r < totalLinhas; r++) {
    for (let c = 0; c < totalColunas; c++) {
      const cellData = grid[r][c];
      if (!cellData.blocked) {
        const $input = $(`#cell-${r}-${c}`);
        const letraCorreta = cellData.letter;
        const letraDigitada = $input.val().toUpperCase();

        if (letraDigitada === letraCorreta) {
          $input.removeClass("incorrect").addClass("correct");
        } else {
          $input.removeClass("correct").addClass("incorrect");
          setTimeout(() => {
            $input.removeClass("incorrect");
          }, 3000);
        }
      }
    }
  }

  console.log("Verificação concluída!");
}

$(document).ready(function () {
  console.log("Documento carregado. Iniciando...");
  renderCrossword();
  renderClues();

  $("#btnVerificar").on("click", function () {
    console.log("Botão Verificar clicado!");
    verificarRespostas();
  });
});
