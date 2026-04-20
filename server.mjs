// Production HTTPS server — uses the same mkcert-signed certificates as dev
// so LAN clients (MacBook, iPad) continue trusting the site without warnings.
//
// Usage:
//   node server.mjs            # defaults: HTTPS on 0.0.0.0:3000
//   PORT=4000 node server.mjs  # override port
//   HOST=127.0.0.1 node ...    # override bind
//   HTTPS=0 node server.mjs    # plain HTTP (skip cert loading)

import { createServer as createHttpsServer } from "node:https";
import { createServer as createHttpServer } from "node:http";
import { readFileSync } from "node:fs";
import { parse } from "node:url";
import next from "next";

const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOST || "0.0.0.0";
const useHttps = process.env.HTTPS !== "0";
const certPath = process.env.HTTPS_CERT || "certificates/localhost.pem";
const keyPath = process.env.HTTPS_KEY || "certificates/localhost-key.pem";

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const handler = (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  };

  if (useHttps) {
    let httpsOptions;
    try {
      httpsOptions = {
        key: readFileSync(keyPath),
        cert: readFileSync(certPath),
      };
    } catch (err) {
      console.error(
        `\n⚠️  Failed to load certificate (${certPath}, ${keyPath}).`
      );
      console.error("   Generate them with mkcert or set HTTPS=0 for plain HTTP.\n");
      console.error(err.message);
      process.exit(1);
    }

    createHttpsServer(httpsOptions, handler).listen(port, hostname, () => {
      const display = hostname === "0.0.0.0" ? "localhost" : hostname;
      console.log(`\n▲ IELTS Practice (prod)`);
      console.log(`  Local:    https://${display}:${port}`);
      console.log(`  Network:  https://${hostname}:${port}\n`);
    });
  } else {
    createHttpServer(handler).listen(port, hostname, () => {
      console.log(`\n▲ IELTS Practice (prod, HTTP)`);
      console.log(`  http://${hostname}:${port}\n`);
    });
  }
});
