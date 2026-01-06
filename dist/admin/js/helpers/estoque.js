funcionario = new Produto(
  `Bearer ${localStorage.getItem("token")}`,
  "http://localhost:3000"
);
estoque = new Estoque(
  `Bearer ${localStorage.getItem("token")}`,
  "http://localhost:3000"
);

function showRowsOnTable(data) {
  let i = 1;
  $(".produtos").empty();
  for (const row of data) {
    try {
      $(".produtos").append(`
            <a
                href="#"
                class="produto d-inline-block overflow-hidden text-decoration-none position-relative"
                data-bs-target="#novoFuncionario"
                data-bs-toggle="modal"
                data-id=${row.id}
                >
                <figure
                    class="position-relative ${
                      row.estoqueAtual > 20
                        ? ""
                        : row.estoqueAtual >= 10
                        ? "border-warning"
                        : "border-danger"
                    } border rounded shadow flex-grow-1 bg-gray"
                    style="height: 200px; width: 250px"
                >
                    <img
                    src="/src/uploads/${row.imagem}"
                    alt=""
                    class="rounded"
                    style="height: 100%; width: 100%"
                    />
                    <figcaption
                    class="d-flex gap-3 flex-wrap text-white"
                    style="
                        position: absolute;
                        bottom: 10px;
                        top: auto;
                        text-shadow: 1px 1px 1px black;
                        font-size: 1.3em;
                        font-weight: bold;
                    "
                    >
                    ${row.nome}
                    </figcaption>
                </figure>
                <p
                    class="badge ${
                      row.estoqueAtual > 20
                        ? "text-bg-primary"
                        : row.estoqueAtual >= 10
                        ? "text-bg-warning"
                        : "text-bg-danger"
                    } text-white position-absolute"
                    style="top: 5px; right: 5px"
                >
                    Quantidade: ${row.estoqueAtual}
                </p>
                <p
                    class="badge ${
                      row.estoqueAtual > 20
                        ? "text-bg-primary"
                        : row.estoqueAtual >= 10
                        ? "text-bg-warning"
                        : "text-bg-danger"
                    } text-white position-absolute"
                    style="top: 30px; right: 5px"
                >
                    Nível: ${
                      row.estoqueAtual > 20
                        ? "Alto"
                        : row.estoqueAtual >= 10
                        ? "médio"
                        : "baixo"
                    }
                </p>
                <p
                    class="badge ${
                      row.status == "disponivel"
                        ? "text-bg-primary"
                        : "text-bg-danger"
                    } text-white position-absolute"
                    style="top: 55px; right: 5px"
                >
                    Estado: ${row.status}
                </p>
            </a>
          `);
    } catch (error) {}
  }

  //ADICIONANDO EVENTOS DE CLIQUE DE EXCLUSÃO E EDIÇÃO

  $(".produto").each((index, elem) => {
    elem.onclick = async function (ev) {
      const [product, stocks] = await Promise.all([
        funcionario.show(this.dataset.id),
        estoque.getAll(`produtoId=${this.dataset.id}`),
      ]);

      $("#produtoIdDetailStock").val(product.id);
      $("#produtoNomeDetailStock").text(product.nome);
      $("#produtoPhotoDetailStock").attr(
        "src",
        `/src/uploads/${product.imagem}`
      );

      $(".produtoListDetailStock").empty();

      stocks.map((row) => {
        $(".produtoListDetailStock").append(`
            <tr>
                <td>${row.Produto.nome}</td>
                <td>${row.quantidade}</td>
                <td>${new Date(row.dataMovimento).toLocaleDateString()}</td>
                <td>${row.oservacao ?? ""}</td>
                <td>${row.tipo}</td>
            </tr>
            `);
      });
      console.log(product, stocks);
    };
  });
}

async function fetchFuncionariosAll() {
  const data = await funcionario.index("limit=15&sort=createdAt:DESC");

  showRowsOnTable(data);

  pagination((await funcionario.getAll()).length);
}

async function fetchCreate() {
  const fields = ["tipo", "quantidade", "data", "observacao"];

  const data = await estoque.create({
    nome: $("#nome").val(),
    quantidade: $("#quantidade").val() || 0,
    tipo: $("#tipo").val(),
    dataMovimento: $("#data").val() || new Date(),
    produtoId: $("#produtoIdDetailStock").val(),
    observacao: $("#observacao").val(),
    empresaId: JSON.parse(localStorage.getItem("user")).empresa,
  });

  //EXIBINDO E ESCONDENDO MENSAGENS DE ERRO
  for (const field of fields) {
    $(`#${field}Error`).hide();
  }
  if (data.erro) {
    for (const field of fields) {
      if (data.campo.includes(field)) {
        $(`#${data.campo}Error`).show().text(data.erro);
        continue;
      }

      $(`#${field}Error`).hide();
    }
  } else {
    showToastSuccess();
  }
  $("#btnSalvar").attr({ disabled: false }).text("Salvar");
}

async function fetchUpdate() {
  const fields = [
    "nomeUpdate",
    "cardapioUpdate",
    "quantidadeUpdate",
    "fornecedorUpdate",
    "precoVendaUpdate",
    "precoCompraUpdate",
    "statusUpdate",
    "fotoUpdate",
  ];
  const data = await estoque.update($("#id").val(), {
    nome: $("#nomeUpdate").val(),
    cardapioId: $("#cardapioUpdate").val(),
    fornecedorId: $("#fornecedorUpdate").val(),
    status: $("#statusUpdate").val(),
    precoVenda: $("#precoVendaUpdate").val(),
    custo: $("#precoCompraUpdate").val(),
  });

  //EXIBINDO E ESCONDENDO MENSAGENS DE ERRO
  for (const field of fields) {
    $(`#${field}Error`).hide();
  }
  if (data.erro) {
    for (const field of fields) {
      if (data.campo.includes(field)) {
        $(`#${data.campo}Error`).show().text(data.erro);
        continue;
      }

      $(`#${field}Error`).hide();
    }
  } else {
    showToastSuccess();
  }
  $("#btnAtualizar").attr({ disabled: false }).text("Atualizar");
}

function showToastSuccess(text = "") {
  if (text) $(".toast-body").text(text);
  $("#toastWarning").addClass("show");
  setTimeout(() => {
    $("#toastWarning").removeClass("show");
    location.reload();
  }, 1500);
}

//PAGINAÇÃO E FILTROS
function pagination(rows, limit = 15) {
  const page = Math.ceil(rows / limit) || 1;
  $(".pagination").html(`
          <li class="page-item">
            <a class="page-link page-previous" href="#">«</a>
          </li>`);
  for (let i = 0; i < page; i++) {
    $(".pagination").append(`
          <li class="page-item">
            <a class="page-link page-number" href="#" data-pagination="limit=${limit}&page=${
      i + 1
    }&sort=createdAt:DESC">${i + 1}</a>
          </li>`);
  }
  $(".pagination").append(`
          <li class="page-item">
            <a class="page-link page-next" href="#">»</a>
          </li>`);

  $(".page-number").each((index, elem) => {
    elem.onclick = async function (ev) {
      const data = await funcionario.index(this.dataset.pagination);

      showRowsOnTable(data);
    };
  });
  $(".page-next").click(async (ev) =>
    console.log(
      "Pegar a paginação ativa, ver o número da página se possível adicionar 1."
    )
  );
  $(".page-previous").click(async (ev) =>
    console.log(
      "Pegar a paginação ativa, ver o número da página se possível reduzir 1."
    )
  );
}

//BUSCAR OS FORNECEDORES E AS CATEGORIA
async function fetchSelectAllNeed() {
  $("#fornecedor, #cardapio, #fornecedorUpdate, #cardapioUpdate").html(`
          <option value="">Selecione...</option>
        `);
  for (const row of await fornecedor.getAll()) {
    $("#fornecedor, #fornecedorUpdate").append(`
            <option value=${row.id}>${row.nome}</option>
          `);
  }
  for (const row of await cardapio.getAll()) {
    $("#cardapio, #cardapioUpdate").append(`
            <option value=${row.id}>${row.nome}</option>
          `);
  }
}

let loading = false;
$("#nomeFiltro").keydown(async function (ev) {
  if (ev.keyCode == 13 && !loading) {
    loading = true;
    showRowsOnTable(await funcionario.index(`nome=%${this.value}%`));
    loading = false;
  }
});
$("#dtNascimentoFiltro").change(async function (ev) {
  loading = true;
  showRowsOnTable(
    await funcionario.index(`dtNascimento=${this.value}T00:00:00.000Z`)
  );
  loading = false;
});
$("#btnExcel").click(async function (ev) {
  this.textContent = "Salvando...";
  this.disabled = true;

  //REUNINDO OS DADOS PRECISOS EM UM ÚNICO LOCAL PARA SER SALVO EM UM ARQUIVO EXCEL
  let datas = [];
  for (const row of Produto.DATA) {
    let { id, nome, precoVenda, custo, createdAt, estoqueAtual } = row;
    createdAt = new Date(createdAt).toLocaleDateString();
    datas.push({ id, nome, precoVenda, custo, estoqueAtual, createdAt });
  }
  await fetch("http://localhost:3000/relatorios/excel", {
    method: "POST",
    body: JSON.stringify({
      conteudo: {
        cols: [
          { header: "ID", key: "id", width: 10 },
          { header: "NOME", key: "nome", width: 20 },
          { header: "Preço_venda", key: "precoVenda", width: 20 },
          { header: "Preço_compra", key: "custo", width: 20 },
          {
            header: "Quantidade em estoque",
            key: "estoqueAtual",
            width: 20,
          },
          { header: "DATA_CADASTRO", key: "createdAt", width: 20 },
        ],
        rows: datas,
      },
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  this.textContent = "excel";
  this.disabled = false;
  showToastSuccess("Salvo com sucesso");
});
$("#btnPdf").click(async function (ev) {
  this.textContent = "Salvando...";
  this.disabled = true;
  let datas = [];
  for (const row of Produto.DATA) {
    let { nome, precoVenda, custo, createdAt, estoqueAtual } = row;
    createdAt = new Date(createdAt).toLocaleDateString();
    fornecedor = row.Fornecedor.nome;
    cardapio = row.Cardapio.nome;
    datas.push({
      nome,
      precoVenda,
      custo,
      estoqueAtual,
      fornecedor,
      cardapio,
      createdAt,
    });
  }
  await fetch("http://localhost:3000/relatorios/pdf", {
    method: "POST",
    body: JSON.stringify({
      conteudo: {
        codigo: "",
        userName: JSON.parse(localStorage.getItem("user")).nome,
        cliente: "",
        cols: [
          "Nome",
          "Preço_venda",
          "Preço_compra",
          "Qtd. estoque",
          "Fornecedor",
          "Categoria/Cardapio",
          "Data do cadastro",
        ],
        rows: datas,
        title: "Lista dos Produtos",
      },
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  this.textContent = "pdf";
  this.disabled = false;
  showToastSuccess("Salvo com sucesso");
});
$("#btnSalvar").click(async function (ev) {
  this.disabled = true;
  this.innerText = "Salvando...";
  fetchCreate();
});
$("#btnAtualizar").click(async function (ev) {
  this.disabled = true;
  this.innerText = "Atualizando...";
  fetchUpdate();
});
$("#btnNewProduto").click(async function (ev) {
  await fetchSelectAllNeed();
});
fetchFuncionariosAll();
