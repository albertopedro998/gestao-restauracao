class EmpresaDAO {
  static DATA = {};
  constructor(authorization, url) {
    this.authorization = authorization;
    this.BASE_URL = url;
  }

  async getAll() {
    EmpresaDAO.DATA = await fetch(`${this.BASE_URL}/empresas`, {
      headers: {
        authorization: this.authorization,
      },
    }).then((res) => res.json());

    return EmpresaDAO.DATA;
  }
  async index(sqlQuery = "") {
    EmpresaDAO.DATA = await fetch(`${this.BASE_URL}/empresas?${sqlQuery}`, {
      headers: {
        authorization: this.authorization,
      },
    }).then((res) => res.json());

    return EmpresaDAO.DATA;
  }
  async show(id) {
    return await fetch(`${this.BASE_URL}/empresas/${id}`, {
      headers: {
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async create(data) {
    return await fetch(`${this.BASE_URL}/empresas`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async update(id, data) {
    return await fetch(`${this.BASE_URL}/empresas/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async delete(id) {
    return await fetch(`${this.BASE_URL}/empresas/${id}`, {
      method: "DELETE",
      headers: {
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
}
