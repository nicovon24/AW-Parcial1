import express from 'express';
import bodyParser from 'body-parser'; 
import recetasRouter from './routes/recetas.routes.js';
import recetasIngredientes from './routes/ingredientes.routes.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3001;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

app.use("/recetas", recetasRouter)

app.use("/ingredientes", recetasIngredientes)
