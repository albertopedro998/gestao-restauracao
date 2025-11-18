const { Router } = require("express");
const multer = require("multer");

const FuncionarioController = require("./controllers/FuncionarioController");
const FuncionarioMiddleware = require("./middleware/FuncionarioMiddleware");

const FornecedorController = require("./controllers/FornecedorController");
const FornecedorMiddleware = require("./middleware/FornecedorMiddleware");

const ClienteController = require("./controllers/ClienteController");
const ClienteMiddleware = require("./middleware/ClienteMiddleware");

const CardapioController = require("./controllers/CardapioController");

const MesaController = require("./controllers/MesaController");

const ProdutoController = require("./controllers/ProdutoController");

const EstoqueController = require("./controllers/EstoqueController");

const PagamentoController = require("./controllers/PagamentoController");

const CaixaController = require("./controllers/CaixaController");

const PedidoController = require("./controllers/PedidoController");

const ProdutosPedidoController = require("./controllers/ProdutosPedidoController");

const SessionController = require("./controllers/SessionController");

const router = Router();
const file = multer(require("./config/multer"));

//============= SESSÕES E ROTAS PÚBLICAS =================
router.post(`/login`, SessionController.login);
router.post(`/logout`, SessionController.logout);

//ROTAS PRIVADAS APARTIR DESTE PONTO
router.use(SessionController.isLogged);

//============= UPLOADS DE ARQUIVOS =================
router.post(`/uploads`, file.single("file"), (req, res) => {
  return res.send("Sucesso");
});

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
router.post(`/produtos`, ProdutoController.create);
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
