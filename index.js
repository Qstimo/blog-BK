import express from "express";
import mongoose from "mongoose";
import { registerValidation, loginValidation, postCreateValidation } from "./validitions/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

mongoose.connect('mongodb+srv://admin:888888@cluster0.mlaiqal.mongodb.net/blog?retryWrites=true&w=majority').then(() => {
    console.log('DB OK')
}).catch(err => console.log('error', err));

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome ')
});

app.listen(4444, (err) => {
    if (err) return console.log(err);
    console.log('server OK')
});


app.post('/auth/register', registerValidation, UserController.register);

app.post('/auth/login', loginValidation, UserController.login);

app.get('/auth/me', checkAuth, UserController.getMe);


app.get('/posts', PostController.getAll);
// app.get('/posts/:id', checkAuth, PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
// app.delete('/posts', checkAuth, PostController.remove);
// app.patch('/posts', checkAuth, PostController.update);