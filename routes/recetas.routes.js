import { Router } from "express";
import { readFile, writeFile } from "fs/promises";

const RecetasRouter = Router();

try {
    const fileRecetas = await readFile("./json/recetas.json", "utf-8");
    var dataRecetas = fileRecetas ? JSON.parse(fileRecetas) : [];
} catch (error) {
    console.error('Error reading or parsing JSON:', error);
    dataRecetas = [];
}

RecetasRouter.get('/infoRecetas', (req, res) => {
    res.status(200).json(dataRecetas); //return [] if it is void :D thanks to the validations above
});

RecetasRouter.post('/', async (req, res) => {
    try {
        const { descripcion, ingredientes, nombre } = req.body; 

        // Load ingredients data
        const fileIngredientes = await readFile("./json/ingredientes.json", "utf-8");
        const dataIngredientes = fileIngredientes ? JSON.parse(fileIngredientes) : [];

        // Check if all ingredients exist
        const ingredientesNoEncontrados = ingredientes.filter(ingrediente =>
            !dataIngredientes.some(ing => ing.id === ingrediente)
        );

        if (ingredientesNoEncontrados.length > 0) {
            return res.status(400).json({ message: "Los siguientes ingredientes no existen:", ingredientes: ingredientesNoEncontrados });
        }

        // Generate a new ID for the recipe
        const newId = dataRecetas.length > 0 ? dataRecetas[dataRecetas.length - 1].id + 1 : 1;

        // Add the new recipe
        dataRecetas.push({
            descripcion, ingredientes, nombre, id: newId
        });

        // Save the updated data
        await writeFile("./json/recetas.json", JSON.stringify(dataRecetas, null, 2));

        res.status(201).json({ message: "Receta agregada correctamente", receta: dataRecetas });
    } catch (error) {
        console.error("Error al agregar la receta:", error);
        res.status(500).send("Error interno del servidor");
    }
});

export default RecetasRouter;
