const { Op } = require("sequelize");
const { Pedido, Funcionario, Cliente, Mesa } = require("../models");

class PedidoController {
  async index(req, res) {
    let {
      data_hora,
      total,
      mesaId,
      clienteId,
      status,
      funcionarioId,
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
    if (data_hora) {
      where = {
        data_hora: {
          [Op.like]: data_hora,
        },
      };
    }
    if (total) {
      where = {
        ...where,
        total: {
          [Op.eq]: total,
        },
      };
    }
    if (mesaId) {
      where = {
        ...where,
        mesaId: {
          [Op.eq]: mesaId,
        },
      };
    }
    if (funcionarioId) {
      where = {
        ...where,
        funcionarioId: {
          [Op.eq]: funcionarioId,
        },
      };
    }
    if (clienteId) {
      where = {
        ...where,
        clienteId: {
          [Op.eq]: clienteId,
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
      await Pedido.findAll({
        include: [Funcionario, Cliente, Mesa],
        where,
        limit,
        offset: (page - 1) * limit,
        order,
      })
    );
  }
  async show(req, res) {
    const pedido = await Pedido.findByPk(req.params.id, {
      include: [Funcionario, Cliente, Mesa],
    });

    return res.json(pedido);
  }
  async create(req, res) {
    try {
      const pedido = await Pedido.create(req.body);

      return res.json(pedido);
    } catch (error) {
      return res.status(401).json({ error: "Não foi possível criar" });
    }
  }
  async update(req, res) {
    const pedido = await Pedido.findByPk(req.params.id);

    await pedido.update(req.body);
  }
  async delete(req, res) {
    const pedido = await Pedido.findByPk(req.params.id);

    await pedido.destroy();
  }
}

module.exports = new PedidoController();
