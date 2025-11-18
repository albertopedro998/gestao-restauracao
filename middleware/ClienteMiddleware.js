const Yup = require("yup");

class ClienteMiddleware {
  async create(req, res, next) {
    const { nome, telefone, email, endereco } = req.body;
    let schema = Yup.object({
      nome: Yup.string().required(),
    });

    if (!(await schema.isValid({ nome }))) {
      return res.status(500).json({ erro: "Nome é obrigatório" });
    }
    schema = Yup.object({
      telefone: Yup.string()
        .required()
        .matches(/^9\d{8}$/),
    });

    if (!(await schema.isValid({ telefone }))) {
      return res
        .status(500)
        .json({ erro: "telefone inválido, siga este padrão [000000000LA000]" });
    }
    schema = Yup.object({
      email: Yup.string().required().email(),
    });

    if (!(await schema.isValid({ email }))) {
      return res.status(500).json({ erro: "Email é obrigatório" });
    }
    schema = Yup.object({
      endereco: Yup.string(),
    });

    if (!(await schema.isValid({ endereco }))) {
      return res.status(500).json({ erro: "Endereço é obrigatório" });
    }

    return next();
  }

  async update(req, res, next) {
    const { nome, telefone, email, endereco } = req.body;
    let schema = Yup.object({
      nome: Yup.string(),
    });

    if (!(await schema.isValid({ nome }))) {
      return res.status(500).json({ erro: "Nome é obrigatório" });
    }

    schema = Yup.object({
      telefone:
        Yup.string()
        .matches(/^9\d{8}$/),
    });

    if (!(await schema.isValid({ telefone }))) {
      return res
        .status(500)
        .json({ erro: "telefone inválido, siga este padrão [000000000LA000]" });
    }
    schema = Yup.object({
      email: Yup.string().email(),
    });

    if (!(await schema.isValid({ email }))) {
      return res.status(500).json({ erro: "Email é obrigatório" });
    }
    schema = Yup.object({
      endereco: Yup.string(),
    });

    if (!(await schema.isValid({ endereco }))) {
      return res.status(500).json({ erro: "Endereço é obrigatório" });
    }

    return next();
  }
}

module.exports = new ClienteMiddleware();
