import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import {register} from "./controllers/auth.js"

const __filename = fileURLToPath(import.meta.url);
// this is to done to grab the file url while using type = modules use directory name
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({limit: "20mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "20mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));
// store images locally 

// setup file storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/assets");
    }, 
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({storage});

app.post("/auth/register", upload.single("picture"), register);

// mongoose
const port = process.env.PORT;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    app.listen(port, ()=> console.log(`Server Running on port ${port}`))
}).catch((err)=> console.log(err));
