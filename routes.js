const { Router } = require("express");
const multer = require("multer");

const EmpresaController = require("./src/controllers/EmpresaController");

const FuncionarioController = require("./src/controllers/FuncionarioController");
const FuncionarioMiddleware = require("./src/middleware/FuncionarioMiddleware");

const FornecedorController = require("./src/controllers/FornecedorController");
const FornecedorMiddleware = require("./src/middleware/FornecedorMiddleware");

const ClienteController = require("./src/controllers/ClienteController");
const ClienteMiddleware = require("./src/middleware/ClienteMiddleware");

const CardapioController = require("./src/controllers/CardapioController");

const MesaController = require("./src/controllers/MesaController");

const ProdutoController = require("./src/controllers/ProdutoController");
const ProdutoMiddleware = require("./src/middleware/ProdutoMiddleware");

const EstoqueController = require("./src/controllers/EstoqueController");

const PagamentoController = require("./src/controllers/PagamentoController");

const CaixaController = require("./src/controllers/CaixaController");

const PedidoController = require("./src/controllers/PedidoController");

const ProdutosPedidoController = require("./src/controllers/ProdutosPedidoController");

const SessionController = require("./src/controllers/SessionController");

const PDF = require("./src/helpers/PDF");
const EXCEL = require("./src/helpers/EXCEL");

const router = Router();
const file = multer(require("./src/config/multer"));

//============= SESSÕES E ROTAS PÚBLICAS =================
router.post(`/empresas`, EmpresaController.create);

router.post(`/login`, SessionController.login);
router.post(`/logout`, SessionController.logout);

//============= UPLOADS DE ARQUIVOS =================
router.post(`/uploads`, file.single("file"), (req, res) => {
  if (req.file) {
    return res.json({ name: req.file.originalname, foto: req.file.filename });
  }
  return res.status(500).json({ mensagem: "Nenhum arquivo enviado." });
});

//============= RELATÓRIOS, FATURAS ==============
router.post(`/relatorios/:type`, async (req, res) => {
  if (req.params.type.includes("pdf")) {
    await PDF.init();
    await PDF.gerar(`${new Date().getTime()}.pdf`, req.body.conteudo);
  } else {
    const cols = req.body.conteudo.cols;
    EXCEL.createBook("teste", cols);
    for (const row of req.body.conteudo.rows) {
      EXCEL.newRow(row);
    }

    EXCEL.saveBook(`./src/documentos/relatorios/${new Date().getTime()}-excel`);
  }

  return res.json({ sucesso: "" });
});

//ROTAS PRIVADAS APARTIR DESTE PONTO
router.use(SessionController.isLogged);

//============= FUNCIONARIOS =================
router.get(`/funcionarios`, FuncionarioController.index);
router.get(`/funcionarios/:id`, FuncionarioController.show);
router.post(
  `/funcionarios`,
  FuncionarioMiddleware.create,
  FuncionarioController.create
);
router.put(
  `/funcionarios/:id`,
  FuncionarioMiddleware.update,
  FuncionarioController.update
);
router.delete(`/funcionarios/:id`, FuncionarioController.delete);

//============= FORNECEDORES =================
router.get(`/fornecedores`, FornecedorController.index);
router.get(`/fornecedores/:id`, FornecedorController.show);
router.post(
  `/fornecedores`,
  FornecedorMiddleware.create,
  FornecedorController.create
);
router.put(
  `/fornecedores/:id`,
  FornecedorMiddleware.update,
  FornecedorController.update
);
router.delete(`/fornecedores/:id`, FornecedorController.delete);

//============= CLIENTES =================
router.get(`/clientes`, ClienteController.index);
router.get(`/clientes/:id`, ClienteController.show);
router.post(`/clientes`, ClienteMiddleware.create, ClienteController.create);
router.put(`/clientes/:id`, ClienteMiddleware.update, ClienteController.update);
router.delete(`/clientes/:id`, ClienteController.delete);

//============= CARDAPIOS =================
router.get(`/cardapios`, CardapioController.index);
router.get(`/cardapios/:id`, CardapioController.show);
router.post(`/cardapios`, CardapioController.create);
router.put(`/cardapios/:id`, CardapioController.update);
router.delete(`/cardapios/:id`, CardapioController.delete);

//============= MESAS =================
router.get(`/mesas`, MesaController.index);
router.get(`/mesas/:id`, MesaController.show);
router.post(`/mesas`, MesaController.create);
router.put(`/mesas/:id`, MesaController.update);
router.delete(`/mesas/:id`, MesaController.delete);

//============= PRODUTOS =================
router.get(`/produtos`, ProdutoController.index);
router.get(`/produtos/:id`, ProdutoController.show);
router.post(`/produtos`, ProdutoMiddleware.create, ProdutoController.create);
router.put(`/produtos/:id`, ProdutoController.update);
router.delete(`/produtos/:id`, ProdutoController.delete);

//============= MOVIMENTOS DE ESTOQUE =================
router.get(`/movimentoestoque`, EstoqueController.index);
router.get(`/movimentoestoque/:id`, EstoqueController.show);
router.post(`/movimentoestoque`, EstoqueController.create);
router.put(`/movimentoestoque/:id`, EstoqueController.update);
router.delete(`/movimentoestoque/:id`, EstoqueController.delete);

//============= PAGAMENTOS =================
router.get(`/pagamentos`, PagamentoController.index);
router.get(`/pagamentos/:id`, PagamentoController.show);
router.post(`/pagamentos`, PagamentoController.create);
router.put(`/pagamentos/:id`, PagamentoController.update);
router.delete(`/pagamentos/:id`, PagamentoController.delete);

//============= CAIXAS =================
router.get(`/caixas`, CaixaController.index);
router.get(`/caixas/:id`, CaixaController.show);
router.post(`/caixas`, CaixaController.create);
router.put(`/caixas/:id`, CaixaController.update);
router.delete(`/caixas/:id`, CaixaController.delete);

//============= PEDIDOS =================
router.get(`/pedidos`, PedidoController.index);
router.get(`/pedidos/:id`, PedidoController.show);
router.post(`/pedidos`, PedidoController.create);
router.put(`/pedidos/:id`, PedidoController.update);
router.delete(`/pedidos/:id`, PedidoController.delete);

//============= PRODUTOS PEDIDOS =================
router.get(`/produtospedidos`, ProdutosPedidoController.index);
router.get(`/produtospedidos/:id`, ProdutosPedidoController.show);
router.post(`/produtospedidos`, ProdutosPedidoController.create);
router.put(`/produtospedidos/:id`, ProdutosPedidoController.update);
router.delete(`/produtospedidos/:id`, ProdutosPedidoController.delete);

module.exports = router;
