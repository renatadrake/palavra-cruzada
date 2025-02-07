

const palavras = [
  {
    numero: 1,
    orientacao: "across",
    dica: "Saldo de Salário",
    resposta: "SALDODESALARIO", // 14 letras
    linha: 5,
    coluna: 1 
  },
  {
    numero: 2,
    orientacao: "down",
    dica: "Aviso Prévio",
    resposta: "AVISOPREVIO", // 11 letras
    linha: 2,
    coluna: 1
  },
  {
    numero: 3,
    orientacao: "across",
    dica: "Férias",
    resposta: "FERIAS", // 6 letras
    linha: 4,
    coluna: 5
  },
  {
    numero: 4,
    orientacao: "down",
    dica: "Horas Extras",
    resposta: "HORASEXTRAS", // 11 letras
    linha: 4,
    coluna: 14
  },
  {
    numero: 5,
    orientacao: "across",
    dica: "Adicionais",
    resposta: "ADICIONAIS", // 10 letras
    linha: 14,
    coluna: 2

  },
  {
    numero: 6,
    orientacao: "across",
    dica: "FGTS",
    resposta: "FGTS", // 4 letras
    linha: 1,
    coluna: 9
  },
  {
    numero: 7,
    orientacao: "down",
    dica: "INSS",
    resposta: "INSS", // 4 letras
    linha: 0,
    coluna: 5
  },
  {
    numero: 8,
    orientacao: "down",
    dica: "IRRF",
    resposta: "IRRF", // 4 letras
    linha: 0,
    coluna: 14
  },
  {
    numero: 9,
    orientacao: "across",
    dica: "Adiantamentos",
    resposta: "ADIANTAMENTOS", // 13 letras
    linha: 6,
    coluna: 2
  },
  {
    numero: 10,
    orientacao: "down",
    dica: "Benefícios",
    resposta: "BENEFICIOS", // 10 letras
    linha: 2,
    coluna: 8
  },
];

// Tamanho do grid fixo (16x16)
const totalLinhas = 16;
const totalColunas = 16;


let grid = [];
for (let r = 0; r < totalLinhas; r++) {
  let row = [];
  for (let c = 0; c < totalColunas; c++) {
    row.push({
      blocked: true,  // por padrão bloqueada
      letter: "",
      clueNumber: null
    });
  }
  grid.push(row);
}

/* ================================
   Posiciona as palavras no grid
   ================================ */
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

/* =========================
   RENDERIZA O TABULEIRO
   ========================= */
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
          const $numSpan = $("<span>").addClass("cw-clue-number").text(cellData.clueNumber);
          $cellDiv.append($numSpan);
        }

        const $input = $("<input>")
          .attr("maxlength", "1")
          .data("row", r)
          .data("col", c);
        $cellDiv.append($input);
      }

      $rowDiv.append($cellDiv);
    }
    $crossword.append($rowDiv);
  }
}

/* =========================
   RENDERIZA A LISTA DE DICAS
   ========================= */

function renderClues() {
  const $cluesList = $("#clues-list");
  $cluesList.empty();

  palavras.forEach((p) => {
    const orientTxt = (p.orientacao === "across") ? "Horizontal" : "Vertical";
    const $li = $("<li>").html(
      `<strong>${p.numero} ${orientTxt}:</strong> ${p.dica}`
    );
    $cluesList.append($li);
  });
}

/* =============================
   VERIFICA SE AS RESPOSTAS BATEM
   ============================= */
function checkAnswers() {

  $("input").removeClass("correct incorrect");

  palavras.forEach(({ orientacao, resposta, linha, coluna }) => {
    const upperWord = resposta.toUpperCase();

    for (let i = 0; i < upperWord.length; i++) {
      let r = linha;
      let c = coluna;
      
      if (orientacao === "across") {
        c += i;
      } else {
        r += i;
      }

      const $input = $(`input[data-row='${r}'][data-col='${c}']`);

      if ($input.length > 0) {
        const userLetter = $input.val().toUpperCase().trim();
        
        if (userLetter !== "") {
          if (userLetter === upperWord[i]) {
            $input.addClass("correct");
          } else {
            $input.addClass("incorrect");
          }
        }
      }
    }
  });
}

$(document).ready(function(){
  renderCrossword();
  renderClues();


  $("body").on("input", "input", function(){
    this.value = this.value.replace(/[^a-zA-Z]/g, "").toUpperCase();
  });

  $("#check-button").on("click", function(){
    checkAnswers();
  });
});
