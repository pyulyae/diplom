module.exports = [
  {
    context: [
      "/api/v1/authorizations/",
      "/api/v1/me/",
      "/api/v1/clients/"
    ],
    target: "http://localhost:8090",
    secure: false
  },
  {
    context: [
      "/api/v1/files",
      "/api/v1/languages",
      "/api/v1/classifications"
    ],
    target: "http://localhost:8091",
    secure: false
  }
];
