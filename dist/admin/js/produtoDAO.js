class Produto {
  static DATA = {};
  constructor(authorization, url) {
    this.authorization = authorization;
    this.BASE_URL = url;
  }

  async getAll(query = "") {
    const empresaId = JSON.parse(localStorage.getItem("user")).empresa;
    Produto.DATA = await fetch(
      `${this.BASE_URL}/produtos?empresaId=${empresaId}&${query}`,
      {
        headers: {
          authorization: this.authorization,
        },
      }
    ).then((res) => res.json());

    return Produto.DATA;
  }
  async index(sqlQuery = "") {
    const empresaId = JSON.parse(localStorage.getItem("user")).empresa;
    Produto.DATA = await fetch(
      `${this.BASE_URL}/produtos?empresaId=${empresaId}&${sqlQuery}`,
      {
        headers: {
          authorization: this.authorization,
        },
      }
    ).then((res) => res.json());

    return Produto.DATA;
  }
  async show(id) {
    return await fetch(`${this.BASE_URL}/produtos/${id}`, {
      headers: {
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async create(data) {
    console.log(data);
    return await fetch(`${this.BASE_URL}/produtos`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async update(id, data) {
    return await fetch(`${this.BASE_URL}/produtos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async delete(id) {
    return await fetch(`${this.BASE_URL}/produtos/${id}`, {
      method: "DELETE",
      headers: {
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
}
