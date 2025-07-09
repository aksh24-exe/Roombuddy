import mongoose from "mongoose";

const db = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("DataBase is connected");
    })
    .catch((error) => {
      console.log("Database is not Connected",error);
      process.exit(1);
    });
};

export default db;
