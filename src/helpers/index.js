const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--allow-file-access-from-files',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });

  const page = await browser.newPage();

  // caminho absoluto correto
  const imagePath = path.join(process.cwd(), "logo.jpg");

  console.log("Caminho da imagem:", imagePath);

  const html = `
    <html>
      <body>
        <h1>Testando imagem</h1>
        <img src="file://${imagePath}" style="width:300px;">
      </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: "networkidle0" });

  // Debug: tira um screenshot da página ANTES do PDF
  await page.screenshot({ path: "preview.png" });

  await page.pdf({ path: "saida.pdf", format: "A4" });

  await browser.close();
})();
