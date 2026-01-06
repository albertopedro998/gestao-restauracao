class Mesa {
  static DATA = {};
  constructor(authorization, url) {
    this.authorization = authorization;
    this.BASE_URL = url;
  }

  async getAll() {
    const empresaId = JSON.parse(localStorage.getItem("user")).empresa;
    Mesa.DATA = await fetch(`${this.BASE_URL}/mesas?empresaId=${empresaId}`, {
      headers: {
        authorization: this.authorization,
      },
    })
      .then((res) => res.json())
      .then((data) => data);

    return Mesa.DATA;
  }
  async index(sqlQuery = "") {
    const empresaId = JSON.parse(localStorage.getItem("user")).empresa;
    Mesa.DATA = await fetch(
      `${this.BASE_URL}/mesas?empresaId=${empresaId}&${sqlQuery}`,
      {
        headers: {
          authorization: this.authorization,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => data);

    return Mesa.DATA;
  }
  async show(id) {
    return await fetch(`${this.BASE_URL}/mesas/${id}`, {
      headers: {
        authorization: this.authorization,
      },
    })
      .then((res) => res.json())
      .then((data) => data);
  }
  async create(data) {
    console.log(data);
    return await fetch(`${this.BASE_URL}/mesas`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async update(id, data) {
    return await fetch(`${this.BASE_URL}/mesas/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
  async delete(id) {
    return await fetch(`${this.BASE_URL}/mesas/${id}`, {
      method: "DELETE",
      headers: {
        authorization: this.authorization,
      },
    }).then((res) => res.json());
  }
}
