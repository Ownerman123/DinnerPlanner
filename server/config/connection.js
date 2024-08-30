// Boilerplate connection.
import mongoose from "mongoose";
import dotenv from "dotenv";




dotenv.config();
const connectDB = async () => {
  try {
    console.log('in connection',process.env.MONGODB_URI);
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost/dinnerplannerdb"
      // Set the options to avoid warnings.
      // {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      // }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
export default connectDB;