import bodyParser from "body-parser";
import express from "express";
import { Client } from "pg";

class App {
  public express;
  public port: number;
  public bodyParser = bodyParser();

  constructor() {
    this.express = express();
    this.cors();
    this.port = 8901;

    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(bodyParser.json());

    this.routes();

    this.express.listen(this.port, () => {
      console.log(`Fluffly Bassoon is playing sweet tunes on ${this.port}!`);
    });
  }

  private cors() {
    this.express.use((req, res, next) => {
      const allowedOrigins = ["http://localhost:8900"];
      const reqOrigin = req.headers.origin;
      if (allowedOrigins.indexOf(reqOrigin) !== -1) {
        res.header("Access-Control-Allow-Origin", reqOrigin);
      }
      res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Credentials");
      res.header("Access-Control-Allow-Credentials", true);

      next();
    });
  }

  private routes() {
    this.express.get("/", (req, res) => {
      res.send("Welcome to Fluffy Bassoon :)");
    });

    // A product has been sold | Koala webhook
    this.express.get("/product/sold", (req, res) => {
      res.send("Welcome to Fluffy Bassoon :)");
    });

    // A product has been changed | Koala webhook
    this.express.get("/product/changed", (req, res) => {
      res.send("Welcome to Fluffy Bassoon :)");
    });

    // A product has been sold | Koala webhook
    this.express.get("/product/new", (req, res) => {
      res.send("Welcome to Fluffy Bassoon :)");
    });

    // Import endpoint for GScript
    this.express.get("/import", (req, res) => {
      res.send("Welcome to Fluffy Bassoon :)");
    });

    // A product has been updated
    this.express.post("/product/update", (req, res) => {
      res.send("Welcome to Fluffy Bassoon :)");
    });
  }

  // Simple DB function
  private async getData(query) {
    const client = new Client({
      database: "bassoon",
      host: "localhost",
      password: "password",
      port: 8902,
      user: "postgres",
    });

    await client.connect();
    const result = await client.query(query)
      .then((res: any) => { return; })
      .catch((e: any) => console.error(e.stack));
    await client.end();
    return result;
  }
}

const Website = new App();
