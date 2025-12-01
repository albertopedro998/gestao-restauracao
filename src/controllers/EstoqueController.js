const { Op } = require("sequelize");
const { Produto, MovimentoEstoque } = require("../models");

class EstoqueController {
  async index(req, res) {
    let {
      tipo,
      quantidade,
      dataMovimento,
      observacao,
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
    if (produtoId) {
      where = {
        ...where,
        produtoId: {
          [Op.like]: produtoId,
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
      const produto = await MovimentoEstoque.create(req.body);

      return res.json(produto);
    } catch (error) {
      return res.produtoId(401).json({ error: "Não foi possível criar" });
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
