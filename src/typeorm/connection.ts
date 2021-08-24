import { createConnection, Connection } from "typeorm";

const dbConnection = async () => {
  const connection: Connection = await createConnection();
  return connection;
};

export default dbConnection;
