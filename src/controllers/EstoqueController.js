const { Op } = require("sequelize");
const { Produto, MovimentoEstoque, sequelize } = require("../models");
const ProdutoController = require("./ProdutoController");

class EstoqueController {
  async index(req, res) {
    let {
      tipo,
      quantidade,
      dataMovimento,
      observacao,
      empresaId,
      produtoId,
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
    if (tipo) {
      where = {
        tipo: {
          [Op.like]: tipo,
        },
      };
    }
    if (quantidade) {
      where = {
        ...where,
        quantidade: {
          [Op.eq]: quantidade,
        },
      };
    }
    if (dataMovimento) {
      where = {
        ...where,
        dataMovimento: {
          [Op.eq]: dataMovimento,
        },
      };
    }
    if (observacao) {
      where = {
        ...where,
        observacao: {
          [Op.eq]: observacao,
        },
      };
    }
    if (empresaId) {
      where = {
        ...where,
        empresaId: {
          [Op.eq]: empresaId,
        },
      };
    }
    if (produtoId) {
      where = {
        ...where,
        produtoId: {
          [Op.eq]: produtoId,
        },
      };
    }
    return res.json(
      await MovimentoEstoque.findAll({
        include: [Produto],
        where,
        limit,
        offset: (page - 1) * limit,
        order,
      })
    );
  }
  async show(req, res) {
    const produto = await MovimentoEstoque.findByPk(req.params.id, {
      include: [Produto],
    });

    return res.json(produto);
  }
  async create(req, res) {
    try {
      const produtoFinal = await sequelize.transaction(async (elem) => {
        const produto = await MovimentoEstoque.create(req.body);

        const prod = await Produto.findByPk(produto.produtoId);

        const lastQtdStock = parseInt(prod.estoqueAtual);
        const sumQtd = parseInt(produto.quantidade);

        //CALCULANDO A QUANTIDADE EM ESTOQUE  DEPOIS DE SER FEITO O MOVIMENTO
        const newQtd = produto.tipo.includes("entrada")
          ? lastQtdStock + sumQtd
          : lastQtdStock - sumQtd;

        //ATUALIZANDO A QUANTIDADE NO BANCO
        await prod.update({
          estoqueAtual: newQtd,
        });

        return produto;
      });

      return res.json(produtoFinal);
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Não foi possível criar", msg: error });
    }
  }
  async update(req, res) {
    const produto = await MovimentoEstoque.findByPk(req.params.id);

    await produto.update(req.body);
  }
  async delete(req, res) {
    const produto = await MovimentoEstoque.findByPk(req.params.id);

    await produto.destroy();
  }
}

module.exports = new EstoqueController();
