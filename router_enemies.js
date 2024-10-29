import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Data from "./models/Data.js";
import User from "./models/User.js"
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const router = express.Router();

router.use(express.json());

router.get("/test", (request, response) => {
  response.send("Allo, Ready for creating some enemies!");
});

router.get("/data", async (request, response) => {
  try {
    const cards = await Data.find();
    response.json(cards);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.get("/data/:id", async (request, response) => {
  try {
    const data = await Data.findById(request.params.id);
    response.json(data);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.post("/post", async (request, response) => {

  try {
    const data = new Data(request.body); // Pass the request body directly
    const dataToSave = await data.save();
    response.status(200).json(dataToSave);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
  
});

router.delete("/delete/:id", async (request, response) => {
  try {
    const id = request.params.id;

    const data = await Data.findByIdAndDelete(id);
    response.send(`Document with ${data?.name} er blevet slettet`);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

router.put("/update/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const updatedData = request.body;

    const options = { new: true };

    const result = await Data.findByIdAndUpdate(id, updatedData, options);

    response.send(result);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {

    return res.status(401).json({ error: 'Invalid credentials' });
    
  }

  // Save the user's ID in the session
  req.session.userId = user._id;

  console.log(req.session);

  res.json({ message: 'Login successful' });
   
});

router.post('/register', async (req, res) => {

  try {

    const { email, password } = req.body; //request our form input

       // Check if email and password are provided
       if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});



//--- START searchs ---------------------------------------------------------

router.get("/getName", async (request, response) => {
  const data = await Data.find({ name: "poul" });
  response.json(data);
});

router.get("/getByQuery", async (request, response) => {
  try {
    // Extract the query parameter from the URL
    const { param } = request.query;
    // Use mongoose.find() to search the database based on the provided name
    // const data = await Data.find({ name: param });

    /* const data = await Data.find({
      $or: [{ name: param }, { text: param }]
      }); 
 */

    const data = await Data.find({
      $or: [
        { name: { $regex: new RegExp(param, "i") } },
        { text: { $regex: new RegExp(param, "i") } },
        //{ 'information.strength': { $eq: param } }
      ],
    });

    response.json(data);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: error.message });
  }
});

//--- END searchs ---------------------------------------------------------

export default router;
