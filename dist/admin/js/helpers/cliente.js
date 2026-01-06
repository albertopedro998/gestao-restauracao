funcionario = new Cliente(
  `Bearer ${localStorage.getItem("token")}`,
  "http://localhost:3000"
);

function showRowsOnTable(data) {
  let i = 1;
  $("tbody").empty();
  for (const row of data) {
    try {
      $("tbody").append(`
            <tr class="align-middle">
              <td>${i++}</td>
              <td>${row.nome}</td>
              <td>+244 ${row.telefone}</td>
              <td>${row.email}</td>
              <td>${row.endereco}</td>
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
                    row.status == "ACTIVE" ? "un" : ""
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
      $("#id").val(this.dataset.id);

      $("#nomeUpdate").val(data.nome);
      $("#telefoneUpdate").val(data.telefone);
      $("#enderecoUpdate").val(data.endereco);
      $("#emailUpdate").val(data.email);
    };
  });
  $(".btnEditarStatus").each((index, elem) => {
    elem.onclick = async function (ev) {
      const data = await funcionario.update(this.dataset.id, {
        status: this.dataset.status.includes("ACTIVE") ? "ARCHIVED" : "ACTIVE",
      });

      showToastSuccess("Fornecedor inativado | ativado");
    };
  });
}

async function fetchFuncionariosAll() {
  const data = await funcionario.index("limit=15&sort=createdAt:DESC");

  showRowsOnTable(data);

  pagination((await funcionario.getAll()).length);
}

async function fetchCreate() {
  const fields = ["nome", "endereco", "telefone", "email", ,];

  const data = await funcionario.create({
    nome: $("#nome").val(),
    telefone: $("#telefone").val(),
    endereco: $("#endereco").val(),
    email: $("#email").val(),
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
    "enderecoUpdate",
    "telefoneUpdate",
    "emailUpdate",
  ];
  const data = await funcionario.update($("#id").val(), {
    nome: $("#nomeUpdate").val(),
    telefone: $("#telefoneUpdate").val(),
    endereco: $("#enderecoUpdate").val(),
    email: $("#emailUpdate").val(),
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
  showRowsOnTable(await funcionario.index(`createdAt=${this.value}`));
  loading = false;
});
$("#btnExcel").click(async function (ev) {
  this.textContent = "Salvando...";
  this.disabled = true;

  //REUNINDO OS DADOS PRECISOS EM UM ÚNICO LOCAL PARA SER SALVO EM UM ARQUIVO EXCEL
  let datas = [];
  for (const row of Cliente.DATA) {
    let { id, nome, telefone, endereco, email, createdAt } = row;
    createdAt = new Date(createdAt).toLocaleDateString();
    datas.push({ id, nome, telefone, endereco, email, createdAt });
  }
  await fetch("http://localhost:3000/relatorios/excel", {
    method: "POST",
    body: JSON.stringify({
      conteudo: {
        cols: [
          { header: "ID", key: "id", width: 10 },
          { header: "NOME", key: "nome", width: 20 },
          { header: "TELEFONE", key: "telefone", width: 20 },
          { header: "ENDERECO", key: "endereco", width: 20 },
          { header: "EMAIL", key: "email", width: 20 },
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

  //REUNINDO OS DADOS PRECISOS EM UM ÚNICO LOCAL PARA SER SALVO EM UM ARQUIVO PDF
  let datas = [];
  for (const row of Cliente.DATA) {
    let { nome, telefone, endereco, email, createdAt } = row;
    createdAt = new Date(createdAt).toLocaleDateString();
    datas.push({ nome, telefone, endereco, email, createdAt });
  }
  await fetch("http://localhost:3000/relatorios/pdf", {
    method: "POST",
    body: JSON.stringify({
      conteudo: {
        cols: ["Nome", "Telefone", "Endereco", "email", "Data do cadastro"],
        rows: datas,
        title: "Lista dos clientes",
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

fetchFuncionariosAll();
