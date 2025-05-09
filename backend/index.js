const express = require('express');
const cors=require('cors');
const app = express();
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const blogRouter = require('./routes/posts');
const followRouter=require('./routes/followRouter');
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:5174",
      allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
      credentials: true,
    })
  );
  
app.use('/uploads', express.static('uploads'));

app.use("/auth", authRoutes);
app.use("/blog", blogRouter);
app.use('/user', followRouter);

app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}..`);
});
