import app from "./app.js";
import { initializeDatabase } from "./database.js";


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
};

startServer();
