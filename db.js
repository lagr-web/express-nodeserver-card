//db.js

import mongoose from "mongoose";

const MONGO_URI = process.env.DB;//mongodb://127.0.0.1:27017/Card

  mongoose
    .connect(MONGO_URI)

    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
    

 export default mongoose;
