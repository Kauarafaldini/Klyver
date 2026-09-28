import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Klyver API",
      version: "1.0.0",
      description:
        "Documentação automática da API Klyver. Autenticação via cookies HttpOnly (accessToken).",
      contact: { name: "Klyver Corp" },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3000",
        description: "Servidor atual",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  // Lê anotações @openapi de todos os arquivos de rota
  apis: ["./src/routes/**/*.js", "./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
