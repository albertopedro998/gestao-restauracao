const { Op } = require("sequelize");
const { Produto, Cardapio, Fornecedor } = require("../models");

class ProdutoController {
  async index(req, res) {
    let {
      nome,
      precoVenda,
      custo,
      estoqueAtual,
      status,
      fornecedorId,
      cardapioId,
      limit,
      page,
      sort,
    } = req.query;
    limit = limit | 25;
    page = page | 1;
    let where = {};
    let order = [];
    if (sort) {
      for (const row of sort.split(";")) {
        order.push(row.split(":"));
      }
    }
    if (nome) {
      where = {
        nome: {
          [Op.like]: nome,
        },
      };
    }
    if (precoVenda) {
      where = {
        ...where,
        precoVenda: {
          [Op.eq]: precoVenda,
        },
      };
    }
    if (custo) {
      where = {
        ...where,
        custo: {
          [Op.eq]: custo,
        },
      };
    }
    if (fornecedorId) {
      where = {
        ...where,
        fornecedorId: {
          [Op.eq]: fornecedorId,
        },
      };
    }
    if (cardapioId) {
      where = {
        ...where,
        cardapioId: {
          [Op.eq]: cardapioId,
        },
      };
    }
    if (estoqueAtual) {
      where = {
        ...where,
        estoqueAtual: {
          [Op.eq]: estoqueAtual,
        },
      };
    }
    if (status) {
      where = {
        ...where,
        status: {
          [Op.like]: status,
        },
      };
    }
    return res.json(
      await Produto.findAll({
        include: [Cardapio, Fornecedor],
        where,
        limit,
        offset: (page - 1) * limit,
        order,
      })
    );
  }
  async show(req, res) {
    const produto = await Produto.findByPk(req.params.id, {
      include: [Fornecedor],
    });

    return res.json(produto);
  }
  async create(req, res) {
    try {
      const produto = await Produto.create(req.body);

      return res.json(produto);
    } catch (error) {
      return res.status(401).json({ error: "Não foi possível criar" });
    }
  }
  async update(req, res) {
    const produto = await Produto.findByPk(req.params.id);

    try {
      await produto.update(req.body);
      return res.json({ mensagem: "Operação realizada com sucesso" });
    } catch (e) {
      return res.json({ erro: "Não foi possível realizar esta operação" });
    }
  }
  async delete(req, res) {
    const produto = await Produto.findByPk(req.params.id);

    try {
      await produto.destroy();
      return res.json({ mensagem: "Operação realizada com sucesso" });
    } catch (e) {
      return res.json({ erro: "Não foi possível realizar esta operação" });
    }
  }
}

module.exports = new ProdutoController();
