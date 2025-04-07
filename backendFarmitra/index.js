const dotenv = require('dotenv')
dotenv.config()
const express = require("express");
 const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const CropRoutes = require("./Components/routes/CropCategory.Routes")
const AddCropName = require("./Components/routes/AddCropName.route")
const CropSummary = require("./Components/routes/CropSummery.route")
const app = express();
app.use(cors("*"));
const PORT = 8000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use("/api",  CropRoutes);
app.use("/api" , AddCropName)
app.use("/api" , CropSummary)



app.listen(PORT, () => {
  console.log(`server is running on ${PORT}` )
});
