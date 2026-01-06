produto = new Produto(
  `Bearer ${localStorage.getItem("token")}`,
  "http://localhost:3000"
);
pedido = new Pedido(
  `Bearer ${localStorage.getItem("token")}`,
  "http://localhost:3000"
);
funcionario = new Funcionario(
  `Bearer ${localStorage.getItem("token")}`,
  "http://localhost:3000"
);
cliente = new Cliente(
  `Bearer ${localStorage.getItem("token")}`,
  "http://localhost:3000"
);
mesa = new Mesa(
  `Bearer ${localStorage.getItem("token")}`,
  "http://localhost:3000"
);

function showRowsOnTable(data) {
  let i = 1;
  $(".table-pedidos tbody").empty();
  for (const row of data) {
    try {
      $(".table-pedidos tbody").append(`
            <tr class="align-middle">
              <td>${i++}</td>
              <td>${new Date(row.data_hora).toLocaleString()}</td>
              <td>
                ${row.Cliente?.nome || ""}
              </td>
              <td>${row.Mesa?.numero || ""}</td>
              <td>${row.Funcionario?.nome || ""}</td>
              <td>
                <span class="badge  ${
                  row.status == "entregue"
                    ? "text-bg-success"
                    : "text-bg-warning"
                } ">${row.status}</span>
              </td>
              <td>
                <a href="#" data-id="${
                  row.id
                }" style="text-decoration: none" class="btnVerProdutosPedido"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
                >
                  <i class="bi bi-cart-fill"></i>
                    <span class="badge text-bg-primary ">
                      Produtos
                    </span>
                </a>
              </td>
              <td>${(row.total || 0).toFixed(2)}</td>
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
                  class="btnEditarStatus text-secondary ${
                    row.status == "entregue" && "d-none"
                  }"
                  data-id=${row.id}
                  data-status=${row.status}
                  style="text-decoration: none"
                >
                  <i class="bi bi-${
                    row.status !== "entregue" ? "un" : ""
                  }lock-fill"></i>
                </a>
              </td>
            </tr>
          `);
    } catch (error) {
      console.log(error);
    }
  }

  //ADICIONANDO EVENTOS DE CLIQUE DE EXCLUSÃO E EDIÇÃO

  $(".btnVerProdutosPedido").each((index, elem) => {
    elem.onclick = async function (ev) {
      ev.preventDefault();
      const data = await pedido.getItemsOnPedido(this.dataset.id);
      showProductsOnPedido(data);
    };
  });
  $(".btnExcluir").each((index, elem) => {
    elem.onclick = function (ev) {
      swal({
        title: "Excluir?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (deleted) => {
        if (deleted) {
          await pedido.delete(this.dataset.id);

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
      $("#mesaUpdate").val(data.mesaId);
      $("#funcionarioUpdate").val(data.funcionarioId);
      $("#totalUpdate").val(data.estoqueAtual);
      $("#precoVendaUpdate").val(data.precoVenda);
      $("#precoCompraUpdate").val(data.custo);
      $("#statusUpdate").val(data.status);
    };
  });
  $(".btnEditarStatus").each((index, elem) => {
    elem.onclick = async function (ev) {
      const data = await pedido.update(this.dataset.id, {
        status: "entregue",
      });

      showToastSuccess();
    };
  });
}

function showProductsOnPedido(data = []) {
  //EXIBINDO OS PRODUTOS PEDIDOS NO CARRINHO
  $(".pedidos_document_view").empty();
  let valorTotalPedido = 0;
  $(".informacoes-pedido-view").empty();
  $(".informacoes-pedido-view").append(`
          <div
            class="col-12 d-flex justify-content-center align-items-center gap-3 border-bottom mb-3"
          >
            <p>
              Nº do pedido:
              <span class="badge text-secondary">${
                data[0]?.pedidoId || ""
              }</span> ;
            </p>               
            <p>Mesa: <span class="badge text-secondary">${
              data[0]?.Pedido.Mesa?.numero || ""
            }</span></p>
            <p>
              Estado:
              <span class="badge text-bg-warning">${
                data[0]?.Pedido?.status || ""
              }</span>
            </p>
            <p>
              Total:
              <span class="badge text-bg-success">${
                data[0]?.Pedido?.total.toFixed(2) || ""
              }</span>
            </p>
          </div>

          <div
            class="col-12 d-flex justify-content-between align-items-center gap-3 border-bottom mb-3"
          >
            <p>
              Cliente:
              <span class="badge text-dark">${
                data[0]?.Pedido?.Cliente?.nome || ""
              }</span>
            </p>
            <p>
              Utilizador:
              <span class="badge text-dark">${
                data[0]?.Pedido?.Funcionario?.nome || ""
              }</span>
            </p>
          </div>
        `);

  data.map((el) => {
    valorTotalPedido += parseFloat(el.subtotal);
    $(".pedidos_document_view").append(`
            <tr>
              <td>${el.Produto.nome}</td>
              <td>
                <span class="badge text-bg-danger">${parseFloat(
                  el.Produto.precoVenda
                ).toFixed(2)}</span>
              </td>
              <td>
                <span class="badge text-bg-secondary">${el.quantidade}</span>
              </td>
              <td>
                <span class="badge text-bg-secondary">${
                  100 - (el.precoUnitario * 100) / el.Produto.precoVenda || 0 // Calculando o desconto em porcentagem
                }%</span>
              </td>
              <td>
                <span class="badge text-bg-success" id="subtotal${
                  el.id
                }">${parseFloat(el.subtotal).toFixed(2)}</span>
              </td>
            </tr>
          `);

    $("#total").val(valorTotalPedido.toFixed(2));
  });
}

//EXIBINDO OS PRODUTOS PEDIDOS NO CARRINHO
function showItemsOnCart() {
  let dataUpdate = JSON.parse(localStorage.getItem("pedidos")) || [];

  //EXIBINDO OS PRODUTOS PEDIDOS NO CARRINHO
  $(".produtos_pedidos_view").empty();
  let valorTotalPedido = 0;
  dataUpdate.map((el) => {
    valorTotalPedido += parseFloat(el.subtotal);
    $(".produtos_pedidos_view").append(`
            <tr>
              <td>${el.produto}</td>
              <td>
                <span class="badge text-bg-danger">${parseFloat(
                  el.preco
                ).toFixed(2)}</span>
              </td>
              <td>
                <!-- <span class="badge text-bg-secondary">${el}</span> -->
                <input
                  type="number"
                  min="1"
                  value="${el.quantidade}"
                  class="form-control inputQtd"
                  style="width: 60px"
                  data-id="${el.id}"
                  data-qtdMax="${el.qtdMax}"
                  id="inputQtd${el.id}"
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value="${el.desconto}"
                  class="form-control inputDesc"
                  style="width: 60px"
                  placeholder="0%"
                  data-id="${el.id}"
                  id="inputDesc${el.id}"
                />
              </td>
              <td>
                <span class="badge text-bg-success" id="subtotal${
                  el.id
                }">${parseFloat(el.subtotal).toFixed(2)}</span>
              </td>
              <td>
                <a href="#" class="p-2 text-decoration-none plusProdPedido" data-id=${
                  el.id
                }>
                  <i class="bi bi-cart-plus-fill text-primary"></i>
                </a>
                <a href="#" class="p-2 text-decoration-none minusProdPedido" data-id=${
                  el.id
                }
                >
                  <i class="bi bi-cart-dash-fill text-secondary"></i>
                </a>
              </td>
              <td>
                <a href="#" class="p-2 text-decoration-none deleteProdPedido" data-id=${
                  el.id
                }>
                  <i class="bi bi-trash-fill text-danger"></i>
                </a>
              </td>
            </tr>
          `);

    $("#total").val(valorTotalPedido.toFixed(2));
  });
  $(".inputDesc").each((index, el) => {
    el.oninput = function (ev) {
      let data = JSON.parse(localStorage.getItem("pedidos"));
      data.map((elem) => {
        if (elem.id == this.dataset.id) {
          elem.desconto = this.value;
          elem.subtotal =
            parseInt(elem.quantidade) * parseFloat(elem.preco) -
            parseInt(elem.quantidade) *
              parseFloat(elem.preco) *
              (this.value / 100); // Calculando o subtotal com desconto
        }
      });
      localStorage.setItem("pedidos", JSON.stringify(data));
      showItemsOnCart();
    };
  });
  $(".inputQtd").each((index, el) => {
    el.oninput = function (ev) {
      let data = JSON.parse(localStorage.getItem("pedidos"));
      data.map((elem) => {
        if (elem.id == this.dataset.id) {
          // Evita que a quantidade seja maior que o estoque disponível
          if (elem.qtdMax >= parseInt(this.value)) {
            elem.quantidade = parseInt(this.value);
            elem.subtotal = parseInt(this.value) * parseFloat(elem.preco);
            return;
          }

          showMessageNoProductOnStock();
        }
      });
      localStorage.setItem("pedidos", JSON.stringify(data));
      showItemsOnCart();
    };
  });
  $(".plusProdPedido, .minusProdPedido").each((index, el) => {
    el.onclick = function (ev) {
      const qtd = $(`#inputQtd${this.dataset.id}`);

      let data = JSON.parse(localStorage.getItem("pedidos"));
      data.map((elem) => {
        if (elem.id == this.dataset.id) {
          let value =
            parseInt(qtd.val()) +
            (this.classList.contains("minusProdPedido") ? -1 : 1); //ACRESCENTANDO OU REDUZINDO A QUANTIDADE DE PRODUTOS NO CARRINHO
          if (elem.qtdMax >= value) {
            let newQtd = value > 0 ? value : 1;
            qtd.val(newQtd);
            elem.quantidade = parseInt(qtd.val());
            elem.subtotal = newQtd * parseFloat(elem.preco);
            return;
          }
          showMessageNoProductOnStock();
        }
      });
      localStorage.setItem("pedidos", JSON.stringify(data));
      showItemsOnCart();
    };
  });
  $(".deleteProdPedido").each((index, el) => {
    el.onclick = function (ev) {
      let data = JSON.parse(localStorage.getItem("pedidos"));
      const data_updated = data.filter((elem) => elem.id !== this.dataset.id);
      localStorage.setItem("pedidos", JSON.stringify(data_updated));

      showItemsOnCart();
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
    pedido.index("limit=15&sort=createdAt:DESC"),
    pedido.getAll(),
  ]);

  showRowsOnTable(data);
  pagination(count.length);
}

async function fetchCreate() {
  const fields = [
    "data_hora",
    "status",
    "precoCompra",
    "total",
    "funcionario",
    "mesaId",
    "status",
    "foto",
  ];

  const pedidos = JSON.parse(localStorage.getItem("pedidos"));
  if (!pedidos || pedidos.length === 0) {
    swal({
      text: "Adicione produtos ao pedido antes de salvar.",
      icon: "warning",
    });
    $("#btnSalvar").attr({ disabled: false }).text("Salvar");
    return;
  }
  let totalPedido = 0;
  pedidos.map((el) => {
    totalPedido += parseFloat(el.subtotal);
  });

  const data = await pedido.create({
    data_hora: new Date().toISOString(),
    status: "aberto",
    total: totalPedido,
    funcionarioId: JSON.parse(localStorage.getItem("user")).id,
    mesaId: $("#mesa").val(),
    empresaId: JSON.parse(localStorage.getItem("user")).empresa,
  });

  if (data.id) {
    //Criando os itens do pedido
    for (const el of pedidos) {
      await pedido.createItem({
        pedidoId: data.id,
        produtoId: el.id,
        quantidade: el.quantidade,
        precoUnitario: el.preco - (el.preco * el.desconto) / 100,
        subtotal: el.subtotal,
        empresaId: JSON.parse(localStorage.getItem("user")).empresa,
      });
    }
    localStorage.removeItem("pedidos");
  }

  //EXIBINDO E ESCONDENDO MENSAGENS DE ERRO
  for (const field of fields) {
    $(`#${field}Error`).hide();
  }

  // MOSTRANDO ERROS DE VALIDAÇÃO
  // data.details É UM SET COM OS CAMPOS QUE DERAM ERRO
  if (data.erro || data.details) {
    for (const field of fields) {
      if ([...data.details].includes(field)) {
        $(`#${field}Error`).show().text(data.erro);
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
    "mesaUpdate",
    "totalUpdate",
    "funcionarioUpdate",
    "precoVendaUpdate",
    "precoCompraUpdate",
    "statusUpdate",
    "fotoUpdate",
  ];
  const data = await funcionario.update($("#id").val(), {
    nome: $("#nomeUpdate").val(),
    mesaId: $("#mesaUpdate").val(),
    funcionarioId: $("#funcionarioUpdate").val(),
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
function showMessageNoProductOnStock(text = "") {
  $(".pedidoErrorMessage").show();
  setTimeout(() => {
    $(".pedidoErrorMessage").hide();
  }, 3000);
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
      const data = await pedido.index(this.dataset.pagination);

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

//BUSCAR OS PRODUTOS, FUNCIONARIOS E AS MESAS E MONTAR NA TELA
async function fetchSelectAllNeed() {
  let [produtos, funcionarios, mesas] = await Promise.all([
    produto.getAll(),
    funcionario.getAll(),
    mesa.getAll(),
  ]);
  let id = JSON.parse(localStorage.getItem("user")).id;
  $(".area-produtos-view").empty();
  $("#funcionario, #mesa, #funcionarioUpdate, #mesaUpdate").html(`
          <option value="">Selecione...</option>
        `);

  for (const row of produtos) {
    $(".area-produtos-view").append(`
            <figure
              class="col-lg-6 col-xl-3 border rounded align-items-center justify-content-center d-flex flex-column p-0"
            >
              <img
                src="/src/uploads/${row.imagem}"
                alt="produto"
                srcset=""
                style="width: 100%; height: 200px"
              />
              <figcaption class="px-3" style="width: 100%">
                <div
                  class="d-flex justify-content-between align-items-center col-12 my-3"
                  style="width: 100%"
                >
                  <span>${row.nome}</span>
                  <span class="badge text-bg-danger">${row.precoVenda.toFixed(
                    2
                  )} kz</span>
                </div>
                <button
                  data-id=${row.id}
                  data-produto="${row.nome}"
                  data-quantidade=${row.estoqueAtual}
                  data-preco=${row.precoVenda}
                  class="btn btn-primary mb-2 btn-add-prod"
                  style="width: 100%"
                >
                  Adicionar produto
                </button>
              </figcaption>
            </figure>
          `);
  }
  for (const row of funcionarios) {
    $("#funcionario, #funcionarioUpdate").append(`
            <option value=${row.id} ${row.id == id && "selected"}>${
      row.nome
    }</option>
          `);
  }
  for (const row of mesas) {
    $("#mesa, #mesaUpdate").append(`
            <option value=${row.id}>${row.numero}</option>
          `);
  }

  //ADICIONANDO EVENTO NO BOTÃO ADICIONAR PRODUTO
  $(".btn-add-prod").each((index, elem) => {
    elem.onclick = function (ev) {
      let data = JSON.parse(localStorage.getItem("pedidos")) || [];
      const exists_prod_cart = data.find((elem) => {
        return elem.id == this.dataset.id;
      });
      data.map((elem) => {
        //AUMENTANDO A QUANTIDADE DO PRODUTO SE ELE JÁ EXISTIR NO CARRINHO E TIVER ESTOQUE
        if (elem.id == this.dataset.id) {
          if (this.dataset.quantidade > elem.quantidade) {
            elem.quantidade = parseInt(elem.quantidade) + 1;
            elem.subtotal = parseFloat(elem.preco) * elem.quantidade;
            return;
          }
          showMessageNoProductOnStock();
        }
      });
      if (exists_prod_cart) {
        localStorage.setItem("pedidos", JSON.stringify([...data]));
      } else {
        localStorage.setItem(
          "pedidos",
          JSON.stringify([
            ...data,
            {
              ...this.dataset,
              quantidade: 1,
              desconto: 0,
              qtdMax: this.dataset.quantidade,
              subtotal: this.dataset.preco,
            },
          ])
        );
      }

      showItemsOnCart();
    };
  });
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
            header: "total em estoque",
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
    funcionario = row.funcionario.nome;
    mesa = row.mesa.nome;
    datas.push({
      nome,
      precoVenda,
      custo,
      estoqueAtual,
      funcionario,
      mesa,
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
          "funcionario",
          "Categoria/mesa",
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

  showItemsOnCart();
});
fetchFuncionariosAll();
