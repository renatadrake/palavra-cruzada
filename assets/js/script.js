$(document).ready(function () {
  console.log("Documento carregado. Iniciando...");

  criarEstruturaCruzadas();

  renderCrossword();
  renderClues();

  $("#btnVerificar").on("click", function () {
    console.log("Botão Verificar clicado!");
    verificarRespostas();
  });

  let resizeTimer;
  $(window).resize(function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderCrossword, 200);
  });
});


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

  const tamanhoCelula = Math.min(
    Math.floor($(window).width() / totalColunas * 0.8),
    Math.floor($(window).height() / totalLinhas * 0.8),
    60 // Limite máximo para manter legibilidade
  );

  for (let r = 0; r < totalLinhas; r++) {
    const $rowDiv = $("<div>").addClass("cw-row");

    for (let c = 0; c < totalColunas; c++) {
      const cellData = grid[r][c];
      const $cellDiv = $("<div>")
        .addClass("cw-cell")
        .css({
          width: `${tamanhoCelula}px`,
          height: `${tamanhoCelula}px`,
        });

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

$(window).resize(renderCrossword);


function renderClues() {
  const $cluesList = $("#clues-list");
  $cluesList.empty();

  palavras.forEach((p) => {
    const $li = $("<li>")
      .addClass("li-dicas col-md-6")
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





function criarEstruturaCruzadas() {

  const $bodyCruzadas = $("<div>").addClass("body-cruzadas");
  const $containerJogo = $("<div>").addClass("container-jogo-cruzadas");

  const $divTitle = $("<div>").addClass("div-title").append(
    $("<div>").addClass("row").append(
      $("<div>").addClass("col-title").append(
        $("<h2>")
          .addClass("title-cruzada")
          .html("<strong>Palavras Cruzadas:</strong> Proventos e Descontos de Rescisão"),
        $("<p>")
          .addClass("p-intro-cruzada")
          .html(
            "Encontre os proventos e descontos inerentes ao processo de rescisão na palavra cruzada abaixo. Preencha as lacunas e clique em <strong>Verificar</strong> para conferir."
          )
      )
    )
  );

  const $crosswordContainer = $("<div>").addClass("crossword-container").attr("id", "crossword");

  const $cluesSection = $("<div>").addClass("clues-section").append(
    $("<h2>").addClass("subtitulo-cruzada").text("Dicas"),
    $("<ul>").addClass("row").attr("id", "clues-list"),
    $("<button>").attr("id", "btnVerificar").text("Verificar")
  );

  $containerJogo.append($divTitle, $crosswordContainer, $cluesSection);
  $bodyCruzadas.append($containerJogo);
  $(".div-objeto-cruzadas").append($bodyCruzadas);
}











