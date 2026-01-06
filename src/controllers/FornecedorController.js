const { Op } = require("sequelize");
const { Fornecedor } = require("../models");

class FornecedorController {
  async index(req, res) {
    let { nome, email, empresaId, createdAt, limit, page, sort } = req.query;
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
    if (email) {
      where = {
        ...where,
        email: {
          [Op.like]: email,
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
    if (createdAt) {
      where = {
        ...where,
        createdAt: {
          [Op.like]: createdAt,
        },
      };
    }
    return res.json(
      await Fornecedor.findAll({
        where,
        limit,
        offset: (page - 1) * limit,
        order,
      })
    );
  }
  async show(req, res) {
    const fornecedor = await Fornecedor.findByPk(req.params.id, {});

    return res.json(fornecedor);
  }
  async create(req, res) {
    try {
      const fornecedor = await Fornecedor.create(req.body);

      return res.json(fornecedor);
    } catch (error) {
      return res.status(401).json({ error: "Não foi possível criar" });
    }
  }
  async update(req, res) {
    const fornecedor = await Fornecedor.findByPk(req.params.id);

    try {
      await fornecedor.update(req.body);
      return res.json({ mensagem: "Atualizado com sucesso" });
    } catch (error) {
      return res
        .status(500)
        .json({ erro: "Não foi possível realizar a operação" });
    }
  }
  async delete(req, res) {
    const fornecedor = await Fornecedor.findByPk(req.params.id);

    try {
      await fornecedor.destroy();
      return res.json({ mensagem: "Deletado com sucesso" });
    } catch (error) {
      return res
        .status(500)
        .json({ erro: "Não foi possível realizar a operação" });
    }
  }
}

module.exports = new FornecedorController();
