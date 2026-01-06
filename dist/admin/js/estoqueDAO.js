class Estoque {
  static DATA = {};
  constructor(authorization, url) {
    this.authorization = authorization;
    this.BASE_URL = url;
  }

  async getAll(query = "") {
    const empresaId = JSON.parse(localStorage.getItem("user")).empresa;
    Estoque.DATA = await fetch(
      `${this.BASE_URL}/movimentoestoque?empresaId=${empresaId}&${query}`,
      {
        headers: {
          authorization: this.authorization,
        },
      }
    ).then((res) => res.json());

    return Estoque.DATA;
  }
  async index(sqlQuery = "") {
    const empresaId = JSON.parse(localStorage.getItem("user")).empresa;
    Estoque.DATA = await fetch(
      `${this.BASE_URL}/movimentoestoque?empresaId=${empresaId}&${sqlQuery}`,
      {
        headers: {
          authorization: this.authorization,
        },
      }
    ).then((res) => res.json());

    return Estoque.DATA;
  }
  async show(id) {
    return await fetch(`${this.BASE_URL}/movimentoestoque/${id}`, {
      headers: {
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async create(data) {
    console.log(data);
    return await fetch(`${this.BASE_URL}/movimentoestoque`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async update(id, data) {
    return await fetch(`${this.BASE_URL}/movimentoestoque/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async delete(id) {
    return await fetch(`${this.BASE_URL}/movimentoestoque/${id}`, {
      method: "DELETE",
      headers: {
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
}
