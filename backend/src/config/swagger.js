import swaggerJsdoc from "swagger-jsdoc";

const options = {
  apis: ["./src/routes/*.js"],
  definition: {
    components: {
      securitySchemes: {
        cookieAuth: {
          in: "cookie",
          name: "token",
          type: "apiKey",
        },
      },
    },
    info: {
      description: "API Hệ thống Quản lý Học tập AI",
      title: "LMS API",
      version: "1.0.0",
    },
    openapi: "3.0.0",
    servers: [
      {
        description: "Máy chủ phát triển",
        url: "http://localhost:8000",
      },
    ],
  },
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
