funcionario = new Produto(
  `Bearer ${localStorage.getItem("token")}`,
  "http://localhost:3000"
);
fornecedor = new Fornecedor(
  `Bearer ${localStorage.getItem("token")}`,
  "http://localhost:3000"
);
cardapio = new Cardapio(
  `Bearer ${localStorage.getItem("token")}`,
  "http://localhost:3000"
);

function showRowsOnTable(data) {
  let i = 1;
  $("tbody").empty();
  for (const row of data) {
    try {
      $("tbody").append(`
            <tr class="align-middle ${
              row.status == "indisponivel" ? "table-danger" : ""
            }">
              <td>${i++}</td>
              <td style="width: 50px; height: 50px">
                <img
                  src=${
                    row.imagem
                      ? "/src/uploads/" + row.imagem
                      : "../assets/img/user1-128x128.jpg"
                  }
                  alt=""
                  style="width: 100%; height: 100%"
                />
              </td>
              <td>${row.nome}</td>
              <td>
                <span class="badge text-bg-success">${row.precoVenda.toFixed(
                  2
                )}</span>
              </td>
              <td>
                <span class="badge text-bg-primary">
                ${row.custo.toFixed(2)}</span></td>
              <td>${row.estoqueAtual}</td>
              <td>${row.status}</td>
              <td>${row.Fornecedor.nome}</td>
              <td>${row.Cardapio.nome}</td>
              <td>${new Date(
                row.createdAt.split("T")[0]
              ).toLocaleDateString()}</td>
              <td>
                <a href="#" class="btnExcluir" data-id=${
                  row.id
                } style="text-decoration: none">
                  <i class="bi bi-trash text-danger"></i>
                </a>
                <a
                  href="#"
                  class="btnEditar"
                  data-id=${row.id}
                  data-bs-toggle="modal"
                  data-bs-target="#editarFuncionario"
                  style="text-decoration: none"
                >
                  <i class="bi bi-pencil-square"></i>
                </a>
                <a
                  href="#"
                  class="btnEditarStatus text-secondary "
                  data-id=${row.id}
                  data-status=${row.status}
                  style="text-decoration: none"
                >
                  <i class="bi bi-${
                    row.status == "disponivel" ? "un" : ""
                  }lock-fill"></i>
                </a>
              </td>
            </tr>
          `);
    } catch (error) {}
  }

  //ADICIONANDO EVENTOS DE CLIQUE DE EXCLUSÃO E EDIÇÃO

  $(".btnExcluir").each((index, elem) => {
    elem.onclick = function (ev) {
      swal({
        title: "Excluir?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (deleted) => {
        if (deleted) {
          await funcionario.delete(this.dataset.id);

          window.location.reload();
        }
      });
    };
  });
  $(".btnEditar").each((index, elem) => {
    elem.onclick = async function (ev) {
      const data = await funcionario.show(this.dataset.id);
      await fetchSelectAllNeed();
      $("#id").val(this.dataset.id);

      $("#lastPhoto").val(data.imagem);
      $("#nomeUpdate").val(data.nome);
      $("#cardapioUpdate").val(data.cardapioId);
      $("#fornecedorUpdate").val(data.fornecedorId);
      $("#quantidadeUpdate").val(data.estoqueAtual);
      $("#precoVendaUpdate").val(data.precoVenda);
      $("#precoCompraUpdate").val(data.custo);
      $("#statusUpdate").val(data.status);
    };
  });
  $(".btnEditarStatus").each((index, elem) => {
    elem.onclick = async function (ev) {
      const data = await funcionario.update(this.dataset.id, {
        status:
          this.dataset.status == "disponivel" ? "indisponivel" : "disponivel",
      });

      showToastSuccess();
    };
  });
}

//UPLOADS FILE
async function upload(file) {
  const form = new FormData();

  form.append("file", file);
  return await fetch("http://localhost:3000/uploads", {
    method: "POST",
    body: form,
    headers: {
      //"Content-Type": "multipart/form-data",
      authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((data) => data);
}

async function fetchFuncionariosAll() {
  const data = await funcionario.index("limit=15&sort=createdAt:DESC");

  showRowsOnTable(data);

  pagination((await funcionario.getAll()).length);
}

async function fetchCreate() {
  const fields = [
    "nome",
    "precoVenda",
    "precoCompra",
    "quantidade",
    "fornecedor",
    "cardapio",
    "status",
    "foto",
  ];

  const file = await upload($("#foto")[0].files[0]);

  const data = await funcionario.create({
    nome: $("#nome").val(),
    cardapioId: $("#cardapio").val(),
    fornecedorId: $("#fornecedor").val(),
    precoVenda: $("#precoVenda").val(),
    custo: $("#precoCompra").val(),
    estoqueAtual: $("#quantidade").val(),
    status: $("#status").val(),
    imagem: file.foto || "",
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
  const file = await upload($("#fotoUpdate")[0].files[0]);

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
  const data = await funcionario.update($("#id").val(), {
    nome: $("#nomeUpdate").val(),
    cardapioId: $("#cardapioUpdate").val(),
    fornecedorId: $("#fornecedorUpdate").val(),
    status: $("#statusUpdate").val(),
    precoVenda: $("#precoVendaUpdate").val(),
    custo: $("#precoCompraUpdate").val(),
    imagem: file.foto || $("#lastPhoto").val(),
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
