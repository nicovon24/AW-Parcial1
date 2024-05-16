import { Router } from "express";
import { readFile, writeFile } from "fs/promises";

const IngredientesRouter = Router();

try {
    const fileIngredientes = await readFile("./json/ingredientes.json", "utf-8");
    var dataIngredientes = fileIngredientes ? JSON.parse(fileIngredientes) : [];
} catch (error) {
    console.error('Error reading or parsing JSON:', error);
    dataIngredientes = [];
}

IngredientesRouter.get('/infoIngredientes', (req, res) => {
    res.status(200).json(dataIngredientes);
});

IngredientesRouter.post('/', async (req, res) => {
    try {
        const { nombre } = req.body; 

        const fileIngredientes = await readFile("./json/ingredientes.json", "utf-8");
        const dataIngredientes = fileIngredientes ? JSON.parse(fileIngredientes) : [];

        var newId = dataIngredientes?.[dataIngredientes.length-1]?.id + 1;

        dataIngredientes.push({
            nombre, id: newId ? newId : 1,
        });

        await writeFile("./json/ingredientes.json", JSON.stringify(dataIngredientes, null, 2));

        res.status(201).json({ message: "Ingrediente agregado correctamente", ingrediente: dataIngredientes });
    } catch (error) {
        console.error("Error al agregar el ingrediente:", error);
        res.status(500).send("Error interno del servidor");
    }
});

IngredientesRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const fileIngredientes = await readFile("./json/ingredientes.json", "utf-8");
        let dataIngredientes = fileIngredientes ? JSON.parse(fileIngredientes) : [];

        const index = dataIngredientes.findIndex(ingrediente => ingrediente.id === parseInt(id));

        if (index !== -1) {
            dataIngredientes[index].nombre = nombre;
            await writeFile("./json/ingredientes.json", JSON.stringify(dataIngredientes, null, 2));
            res.status(200).json({ message: `Ingrediente con ID ${id} actualizado correctamente`, ingrediente: dataIngredientes[index] });
        } else {
            res.status(404).json({ message: `No se encontró un ingrediente con ID ${id}` });
        }
    } catch (error) {
        console.error("Error al actualizar el ingrediente:", error);
        res.status(500).send("Error interno del servidor");
    }
});


export default IngredientesRouter;
