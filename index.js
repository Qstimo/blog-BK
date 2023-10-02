import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { registerValidation, loginValidation, postCreateValidation } from "./validitions/auth.js";
import { PostController, UserController } from './controllers/index.js'
import { handleValidationError, checkAuth } from "./utils/index.js";


mongoose.connect('mongodb+srv://admin:888888@cluster0.mlaiqal.mongodb.net/blog?retryWrites=true&w=majority').then(() => {
    console.log('DB OK')
}).catch(err => console.log('error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('Welcome ')
});

app.listen(4444, (err) => {
    if (err) return console.log(err);
    console.log('server OK')
});

app.use('/uploads', express.static('uploads'));

app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
})


app.post('/auth/register', registerValidation, handleValidationError, UserController.register);

app.post('/auth/login', loginValidation, handleValidationError, UserController.login);

app.get('/auth/me', checkAuth, UserController.getMe);


app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationError, PostController.create);
app.delete('/posts/:id', checkAuth, handleValidationError, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update);