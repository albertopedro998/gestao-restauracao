funcionario = new Funcionario(
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
              row.status == "ARCHIVED" ? "table-danger" : ""
            }">
              <td>${i++}</td>
              <td style="width: 50px; height: 50px">
                <img
                  src=${
                    row.foto
                      ? "/src/uploads/" + row.foto
                      : "../assets/img/user1-128x128.jpg"
                  }
                  alt=""
                  style="width: 100%; height: 100%"
                />
              </td>
              <td>${row.nome}</td>
              <td>
                <span class="badge text-bg-danger">${row.cargo}</span>
              </td>
              <td>${row.nif}</td>
              <td>$ 1000,00</td>
              <td>$ 900, 00</td>
              <td>${new Date(
                row.createdAt.split("T")[0]
              ).toLocaleDateString()}</td>
              <td>${new Date(
                row.dtNascimento.split("T")[0]
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

      $("#lastPhoto").val(data.foto);
      $("#nomeUpdate").val(data.nome);
      $("#cargoUpdate").val(data.cargo);
      $("#nifUpdate").val(data.nif);
      $("#dtNascimentoUpdate").val(data.dtNascimento.split("T")[0]);
    };
  });
  $(".btnEditarStatus").each((index, elem) => {
    elem.onclick = async function (ev) {
      const data = await funcionario.update(this.dataset.id, {
        status: this.dataset.status.includes("ACTIVE") ? "ARCHIVED" : "ACTIVE",
      });

      showToastSuccess("Utilizador inativado | ativado");
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
  const [data, count] = await Promise.all([
    funcionario.index("limit=15&sort=createdAt:DESC"),
    funcionario.getAll(),
  ]);

  showRowsOnTable(data);

  pagination(count.length);
}

async function fetchCreate() {
  const fields = ["nome", "nif", "senha", "dtNascimento", "cargo", "foto"];

  const file = await upload($("#foto")[0].files[0]);

  const data = await funcionario.create({
    nome: $("#nome").val(),
    cargo: $("#cargo").val(),
    nif: $("#nif").val(),
    dtNascimento: $("#dtNascimento").val(),
    password: $("#senha").val(),
    foto: file.foto || "",
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
    "nifUpdate",
    "senhaUpdate",
    "dtNascimentoUpdate",
    "cargoUpdate",
    "fotoUpdate",
  ];
  const data = await funcionario.update($("#id").val(), {
    nome: $("#nomeUpdate").val(),
    cargo: $("#cargoUpdate").val(),
    nif: $("#nifUpdate").val(),
    dtNascimento: $("#dtNascimentoUpdate").val(),
    password: $("#senhaUpdate").val(),
    foto: file.foto || $("#lastPhoto").val(),
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
  for (const row of Funcionario.DATA) {
    let { id, nome, cargo, nif, createdAt, dtNascimento } = row;
    createdAt = new Date(createdAt).toLocaleDateString();
    dtNascimento = new Date(dtNascimento).toLocaleDateString();
    datas.push({ id, nome, cargo, nif, createdAt, dtNascimento });
  }
  await fetch("http://localhost:3000/relatorios/excel", {
    method: "POST",
    body: JSON.stringify({
      conteudo: {
        cols: [
          { header: "ID", key: "id", width: 10 },
          { header: "NOME", key: "nome", width: 20 },
          { header: "CARGO", key: "cargo", width: 20 },
          { header: "NIF", key: "nif", width: 20 },
          { header: "DATA DE NASCIMENTO", key: "dtNascimento", width: 20 },
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
  for (const row of Funcionario.DATA) {
    let { nome, cargo, nif, createdAt, dtNascimento } = row;
    createdAt = new Date(createdAt).toLocaleDateString();
    dtNascimento = new Date(dtNascimento).toLocaleDateString();
    datas.push({ nome, cargo, nif, createdAt, dtNascimento });
  }
  await fetch("http://localhost:3000/relatorios/pdf", {
    method: "POST",
    body: JSON.stringify({
      conteudo: {
        cols: [
          "Nome",
          "Função",
          "Nif",
          "Data do cadastro",
          "Data do nascimento",
        ],
        rows: datas,
        title: "Lista dos Utilizadores",
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
