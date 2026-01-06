const { Op } = require("sequelize");
const { Empresa, User } = require("../models");
const bcrypt = require("bcryptjs");
class EmpresaController {
  async index(req, res) {
    let { nome, site, endereco, NIF, limit, page, sort } = req.query;
    limit = parseInt(limit) || 1000;
    page = page || 1;
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
    if (site) {
      where = {
        ...where,
        site: {
          [Op.like]: site,
        },
      };
    }
    if (endereco) {
      where = {
        ...where,
        endereco: {
          [Op.like]: endereco,
        },
      };
    }
    if (NIF) {
      where = {
        ...where,
        NIF: {
          [Op.like]: NIF,
        },
      };
    }
    return res.json(
      await Empresa.findAll({
        attributes: { exclude: ["senha"] },
        where,
        limit,
        offset: (page - 1) * limit,
        order,
      })
    );
  }
  async show(req, res) {
    const empresa = await Empresa.findByPk(req.params.id, {
      attributes: { exclude: ["senha"] },
    });

    return res.json(empresa);
  }
  async create(req, res) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const userExists = await User.findOne({
          where: { NIF: req.body.NIF },
        });

        if (userExists) {
          return res.status(500).json({
            erro: "Já existe este NIF na base de dados",
            campo: "nif",
          });
        }
        req.body.senha = await bcrypt.hash(req.body.password, 8);
        const user = await User.create(req.body);
        const empresa = await Empresa.create({ ...req.body, userId: user.id });
        return empresa;
      });
      return res.json(result);
    } catch (error) {
      return res.status(401).json({ error: "Não foi possível criar" });
    }
  }
  async update(req, res) {
    const empresa = await Empresa.findByPk(req.params.id);

    try {
      await empresa.update(req.body);
      return res.json({ sucesso: "Sucesso" });
    } catch (e) {
      return res.status(501).json({ erro: "Erro ao atualizar" });
    }
  }
  async delete(req, res) {
    const empresa = await Empresa.findByPk(req.params.id);

    try {
      await empresa.destroy();
      return res.json({ sucesso: "Sucesso" });
    } catch (e) {
      return res.status(501).json({ erro: "Erro ao excluir" });
    }
  }
}

module.exports = new EmpresaController();
