class Auth {
  static BASE_URL = "http://localhost:3000";
  static logged = localStorage.getItem("token") || false;
  static async login(nif, senha) {
    return await fetch(`${Auth.BASE_URL}/login`, {
      method: "POST",
      body: JSON.stringify({ nif, senha }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          Auth.logged = true;
        } else {
          Auth.logged = false;
        }

        return data;
      });
  }

  static logout() {
    localStorage.removeItem("token");
    Auth.logged = false;
  }
  static isLogged() {
    return Auth.logged;
  }

  static redirect(router) {
    location.href = `${router}.html`;
  }
}
