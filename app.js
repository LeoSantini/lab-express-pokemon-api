const express = require("express");
const req = require("express/lib/request");

const PORT = 4000;

// Importing all the pokemon for our data file
const allPokemon = require("./data");

const app = express();

app.use(express.json()); // Prepara o server para receber JSON

// -- Define your route listeners here! --

// 1.0 A GET /pokemon route, that serves an array of objects containing data about all the Pokemons
app.get("/pokemon", (request, response) => {
  return response.status(200).json(allPokemon);
});

// 2.0 An GET /pokemon/:id route, that serves an object of a specific Pokemon (search in the array using the provided id)
app.get("/pokemon/:id", (request, response) => {
  const { id } = request.params;
  const pokemonId = allPokemon.find(
    currentElement => currentElement.id === Number(id)
  );

  return response.status(200).json(pokemonId);
});

// 3.0 A GET /search route, where the user can search Pokemons by name or type (when searching by type, should return all the pokemon found with that type)
app.get("/search", (request, response) => {
  if (Object.keys(request.query)[0] === "name") {
    const foundedPokemon = allPokemon.filter(currentPokemon => {
      return currentPokemon.name.includes(request.query.name);
    });
    return response.status(200).json(foundedPokemon);
  } else if (Object.keys(request.query)[0] === "types") {
    const foundedPokemon = allPokemon.filter(currentPokemon => {
      return currentPokemon.types.includes(request.query.types);
    });

    return response.status(200).json(foundedPokemon);
  }

  return response.status(400).json({ msg: "Mande a query direito, fdp!" });
});

// 4.0 A POST /pokemon route, that inserts the new Pokemon into the existing list of all Pokemons (don't worry about persisting the data to the disk, we're gonan learn that later)
app.post("/addPokemon", (request, response) => {
  const idGenerator = Math.floor(Math.random() * (1000 - 2000 + 1) + 2000);

  const newDocument = {
    id: idGenerator,
    ...request.body,
  };

  allPokemon.push(newDocument);

  return response.status(201).json(allPokemon[allPokemon.indexOf(newDocument)]);
});

// 5.0 A PUT /pokemon/:id route, that updates an existing Pokemon with the provided data
app.patch("/editPokemon/:id", (request, response) => {
  const { id } = request.params;
  const pokemonToEdit = allPokemon.find(
    currentElement => currentElement.id === Number(id)
  );

  allPokemon[allPokemon.indexOf(pokemonToEdit)] = {
    ...pokemonToEdit,
    ...request.body,
  };

  return response
    .status(200)
    .json(allPokemon.find(Element => Element.id === Number(id)));
});

// 6.0 A DELETE /pokemon/:id route, that deletes an existing Pokemon and returns a success message
app.delete("/deletePokemon/:id", (request, response) => {
  const { id } = request.params;

  const pokemonDelete = allPokemon.find(element => element.id === Number(id));

  allPokemon.splice(allPokemon.indexOf(pokemonDelete), 1);

  return response.status(200).json(pokemonDelete);
});

app.listen(PORT, () => console.log(`Server up and running at port ${PORT}`));
