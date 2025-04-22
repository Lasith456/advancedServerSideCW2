const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const blogRouter = require('./routes/posts');

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use("/auth", authRoutes);
app.use("/blog", blogRouter);

app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}..`);
});
