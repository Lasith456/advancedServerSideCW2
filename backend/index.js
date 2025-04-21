const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}..`);
});
