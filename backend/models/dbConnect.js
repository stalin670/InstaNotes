import { connect } from "mongoose";

const dbConnect = async () => {
  try {
    const mongoDbConnection = await connect(process.env.MONGO_URL);
    console.log(`Database connected : ${mongoDbConnection.connection.host}`);
  } catch (error) {
    console.log(`Database connection failed ${error}`);
    process.exit(1);
  }
};

export default dbConnect;
