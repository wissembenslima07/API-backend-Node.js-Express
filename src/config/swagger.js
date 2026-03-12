const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Recouvra+ API",
      version: "1.0.0",
      description: "API de gestion du recouvrement (auth, clients, factures, paiements, recouvrement, statistiques).",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      { name: "Health" },
      { name: "Auth" },
      { name: "Clients" },
      { name: "Invoices" },
      { name: "Payments" },
      { name: "CollectionActions" },
      { name: "Stats" },
    ],
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.get("/docs-json", (_req, res) => {
    res.status(200).json(swaggerSpec);
  });
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = {
  setupSwagger,
};
