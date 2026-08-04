const requiredDatabaseVars = ["COGNODB_URI", "COGNODB_USERNAME", "COGNODB_PASSWORD"];

export function getServerConfig() {
  return {
    port: process.env.PORT || 8080,
    clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    database: {
      uri: process.env.COGNODB_URI,
      username: process.env.COGNODB_USERNAME,
      password: process.env.COGNODB_PASSWORD
    }
  };
}

export function getMissingDatabaseVars() {
  return requiredDatabaseVars.filter((name) => !process.env[name]);
}
