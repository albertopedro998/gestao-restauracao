class Cardapio {
  static DATA = {};
  constructor(authorization, url) {
    this.authorization = authorization;
    this.BASE_URL = url;
  }

  async getAll() {
    const empresaId = JSON.parse(localStorage.getItem("user")).empresa;
    Cardapio.DATA = await fetch(
      `${this.BASE_URL}/cardapios?empresaId=${empresaId}`,
      {
        headers: {
          authorization: this.authorization,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => data);

    return Cardapio.DATA;
  }
  async index(sqlQuery = "") {
    const empresaId = JSON.parse(localStorage.getItem("user")).empresa;
    Cardapio.DATA = await fetch(
      `${this.BASE_URL}/cardapios?empresaId=${empresaId}&${sqlQuery}`,
      {
        headers: {
          authorization: this.authorization,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => data);

    return Cardapio.DATA;
  }
  async show(id) {
    return await fetch(`${this.BASE_URL}/cardapios/${id}`, {
      headers: {
        authorization: this.authorization,
      },
    })
      .then((res) => res.json())
      .then((data) => data);
  }
  async create(data) {
    console.log(data);
    return await fetch(`${this.BASE_URL}/cardapios`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async update(id, data) {
    return await fetch(`${this.BASE_URL}/cardapios/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async delete(id) {
    return await fetch(`${this.BASE_URL}/cardapios/${id}`, {
      method: "DELETE",
      headers: {
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
}
