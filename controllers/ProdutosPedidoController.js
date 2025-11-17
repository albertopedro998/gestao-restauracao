const { Op } = require("sequelize");
const { ProdutosPedido, Produto, Pedido } = require("../models");

class ProdutosPedidoController {
  async index(req, res) {
    let {
      produtoId,
      pedidoId,
      quantidade,
      precoUnitario,
      subtotal,
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
    if (produtoId) {
      where = {
        produtoId: {
          [Op.eq]: produtoId,
        },
      };
    }
    if (pedidoId) {
      where = {
        ...where,
        pedidoId: {
          [Op.eq]: pedidoId,
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
    if (subtotal) {
      where = {
        ...where,
        subtotal: {
          [Op.eq]: subtotal,
        },
      };
    }
    if (precoUnitario) {
      where = {
        ...where,
        precoUnitario: {
          [Op.eq]: precoUnitario,
        },
      };
    }
    return res.json(
      await ProdutosPedido.findAll({
        include: [Produto, Pedido],
        where,
        limit,
        offset: (page - 1) * limit,
        order,
      })
    );
  }
  async show(req, res) {
    const produtosPedido = await ProdutosPedido.findByPk(req.params.id, {
      include: [Produto, Pedido],
    });

    return res.json(produtosPedido);
  }
  async create(req, res) {
    try {
      const produtosPedido = await ProdutosPedido.create(req.body);

      return res.json(produtosPedido);
    } catch (error) {
      return res.status(401).json({ error: "Não foi possível criar" });
    }
  }
  async update(req, res) {
    const produtosPedido = await ProdutosPedido.findByPk(req.params.id);

    await produtosPedido.update(req.body);
  }
  async delete(req, res) {
    const produtosPedido = await ProdutosPedido.findByPk(req.params.id);

    await produtosPedido.destroy();
  }
}

module.exports = new ProdutosPedidoController();
