const Yup = require("yup");

class ProdutoMiddleware {
  async create(req, res, next) {
    const { nome, precoVenda, custo, estoqueAtual, fornecedorId, cardapioId } =
      req.body;
    let schema = Yup.object({
      nome: Yup.string().required(),
    });

    if (!(await schema.isValid({ nome }))) {
      return res
        .status(500)
        .json({ erro: "Nome é obrigatório", campo: "nome" });
    }
    schema = Yup.object({
      estoqueAtual: Yup.number().required(),
    });

    if (!(await schema.isValid({ estoqueAtual }))) {
      return res.status(500).json({
        erro: "A quantidade inicial do produto deve ser maior a 0",
        campo: "quantidade",
      });
    }

    schema = Yup.object({
      fornecedorId: Yup.number().required(),
    });

    if (!(await schema.isValid({ fornecedorId }))) {
      return res.status(500).json({
        erro: "Preencha este campo",
        campo: "fornecedor",
      });
    }
    schema = Yup.object({
      cardapioId: Yup.number().required(),
    });

    if (!(await schema.isValid({ cardapioId }))) {
      return res.status(500).json({
        erro: "Preencha este campo",
        campo: "cardapio",
      });
    }
    schema = Yup.object({
      custo: Yup.number().lessThan(precoVenda).required(),
    });

    if (!(await schema.isValid({ custo }))) {
      return res.status(500).json({
        erro: "preco de compra obrigatório e deve ser menor ou igual ao preço de venda",
        campo: "precoCompra",
      });
    }
    schema = Yup.object({
      precoVenda: Yup.number().required(),
    });

    if (!(await schema.isValid({ precoVenda }))) {
      return res.status(500).json({
        erro: "preco de venda obrigatório",
        campo: "precoVenda",
      });
    }

    return next();
  }

  async update(req, res, next) {
    const { nome, precoVenda } = req.body;
    let schema = Yup.object({
      nome: Yup.string(),
    });

    if (!(await schema.isValid({ nome }))) {
      return res.status(500).json({ erro: "Nome é obrigatório" });
    }

    schema = Yup.object({
      precoVenda: Yup.string().matches(/^\d{9}[A-Z]{2}\d{3}$/),
    });

    if (!(await schema.isValid({ precoVenda }))) {
      return res.status(500).json({
        erro: "precoVenda inválido, siga este padrão [000000000LA000]",
      });
    }

    return next();
  }
}

module.exports = new ProdutoMiddleware();
