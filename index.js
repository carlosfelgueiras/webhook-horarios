import "dotenv/config";
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json("Turnos LEIC");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});

// Export the Express API
export default app;
