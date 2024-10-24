import mongoose from "mongoose";

 const dataSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
      },
      img: {
        type: String,
        required: true,
      },
      information: {
        strength: {
          type: Number,
          required: true,
        },
        lives: {
          type: Number,
          required: true,
        },
      },
      text: {
        type: String,
        required: true,
      }
 })

 const Data = mongoose.model("enemies", dataSchema);

 export default Data;
