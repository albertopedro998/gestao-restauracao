const pupeteer = require("puppeteer");
const { resolve } = require("path");
const fs = require("node:fs");

class PDF {
  async init() {
    this.browser = await pupeteer.launch({
      headless: "new",
      args: ["--allow-file-access-from-files", "--disable-web-security"],
    });

    this.page = await this.browser.newPage();
  }

  async gerar(
    name,
    conteudo = `<h1>Testando o jogo</h1>`,
    path = resolve(
      __dirname,
      ".",
      "src",
      "..",
      "..",
      "documentos",
      "relatorios"
    )
  ) {
    let headers = "";
    for (const header of conteudo.cols) {
      headers += "<th style='border: 1px solid gray'>" + header + "</th>";
    }

    let rows = "";
    for (const row of conteudo.rows) {
      rows += `<tr>`;
      for (const col in row) {
        rows += `<td style='border: 1px solid gray'>${row[col]}</td>`;
      }
      rows += `</tr>`;
    }

    //IMAGEM CONVERTIDA PARA BASE64
    const image = fs.readFileSync(resolve(__dirname, "logo.jpg"));
    const imageFinal = `data:image/jpeg;base64,${image.toString("base64")}`;

    let html = `
      <html>
        <body style="margin: 10px">
          <div style="display: flex; justify-content: space-between; align-items: center">
              <div>
                  <h1 style="color: orange; font-family: monospace">K-food</h1>
                  <p>Código: <strong>${conteudo.codigo || "[1001]"}</strong></p>
                  <p>Utilizador: <strong>${conteudo.userName || ""}</strong></p>
                  <p>${
                    conteudo.cliente
                      ? "Cliente: <strong>" + conteudo.cliente + "</strong>"
                      : ""
                  } </p>
              </div>
              <div>
                  <figure style="width: 100px; height: 100px">
                      <img src="https://placehold.co/600x400" alt="LOGOTIPO" style="width:100%;height:100%"/>
                  </figure>
              </div>
          </div>
          <h2 style="margin: auto;font-family: monospace; text-align: center; margin: 10px" >${
            conteudo.title
          }</h2>
          <table style="border: 1px solid gray; width: 100%">    
          <thead>
              ${headers}
          </thead>
          
          <tbody>
              ${rows}
          </tbody>
          </table>
        </body>
      </html>
    `;

    //USE waitUntil: networkidle0 para pdfs com imagem e waitUntil: load para pdfs simples
    //USE file://caminho_da_imagem para exibir imagens locais
    await this.page.setContent(html, { waitUntil: "networkidle0" });
    await this.page.pdf({
      path: path + require("path").sep + name,
      format: "A4",
      printBackground: true,
      margin: {
        top: 20,
        left: 20,
        right: 20,
        bottom: 20,
      },
    });

    await this.browser.close();
    console.log(`Gerado com sucesso...`);
  }
}

module.exports = new PDF();
