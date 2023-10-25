const db = db.getSiblingDB('peliculas_salas');

// Reglas de valicación de la colección película
db.createCollection("peliculas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigo", "nombre", "calificacion_edad"],
      properties: {
        codigo: {
          bsonType: "int",
          description: "It must be an integer (INT) and is required."
        },
        nombre: {
          bsonType: "string",
          description: "nombre must be a string and is required"
        },
        calificacion_edad: {
          bsonType: "int",
          description: "calificacion must be a int and is required"
        }
      }
    }
  }
})

// Crea un índice único para el atrubuto "codigo",al ser PK no queremos duplicadad
db.almacen.createIndex({ codigo: 1 }, { unique: true });


// Reglas de valicación de la colección salas
db.createCollection("salas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigo","nombre"],
      properties: {
        codigo: {
          bsonType: "int",
          description: "codigo must be a int and is required"
        },
        nombre: {
          bsonType: "string",
          description: "nombre must be a string and is required"
        },
        pelicula: {
          bsonType: "int",
          description: "It must be an integer and must refer to the code of a movie in the collection 'peliculas'."
        }
      }
    }
  }
})


db.peliculas.insertMany([
  { codigo: 1, nombre: "Avatar", calificacion_edad: 12 },
  { codigo: 2, nombre: "Avengers: Endgame", calificacion_edad: 18 },
  { codigo: 3, nombre: "Titanic", calificacion_edad: 7 },
  { codigo: 4, nombre: "Star Wars: El despertar de la Fuerza", calificacion_edad: 15 },
  { codigo: 5, nombre: "Vengadores: Infinity War", calificacion_edad: 12 },
  { codigo: 6, nombre: "Jurassic World", calificacion_edad: 18 },
  { codigo: 7, nombre: "El Rey León", calificacion_edad: 7 },
  { codigo: 8, nombre: "PLos Vengadores ", calificacion_edad: 15 },
  { codigo: 9, nombre: "PFast & Furious 7", calificacion_edad: 12 },
  { codigo: 10, nombre: "Frozen: El reino del hielo", calificacion_edad: 18 }
]);

// pelicula referenca a peliculas.codigo
db.salas.insertMany([
  { codigo: 1, nombre: "Sala 1", pelicula: 1 },
  { codigo: 2, nombre: "Sala 2", pelicula: 2 },
  { codigo: 3, nombre: "Sala 3", pelicula: 3 },
  { codigo: 4, nombre: "Sala 4", pelicula: 4 },
  { codigo: 5, nombre: "Sala 5", pelicula: 5 },
  { codigo: 6, nombre: "Sala 6", pelicula: 6 },
  { codigo: 7, nombre: "Sala 7", pelicula: 7 },
  { codigo: 8, nombre: "Sala 8", pelicula: 8 },
  { codigo: 9, nombre: "Sala 9", pelicula: 9 },
  { codigo: 10, nombre: "Sala 10", pelicula: 10}
]);


/**
 * Testamos la integridad de nuetra base de datos
 *  ESTOS DATO NO SE INSERTARÁ AL NO CUMPLIR LAS VALIDACIONES
 * 
 * @returns Document failed validation con un JSON "information"
 */
db.salas.insertOne({ codigo: "1", nombre: "Sala 1", pelicula: 1 }) // codigo deberia ser number
db.salas.insertOne({ codigo: 20, nombre: "Sala 1", pelicula: 1 })  // el valor de codigo debe seguir un orden númerico  
db.peliculas.insertOne({ codigo: 10, nombre: 300, calificacion_edad: 18 })  // nombre debería ser String

/**
 * Testamos los datos referenciados 
 * @returns JSON con el objeto solicitado
 */

let { pelicula } = db.salas.findOne({ pelicula: 1 })
db.peliculas.findOne({ codigo: pelicula }); 

let codigo = db.salas.findOne({  nombre: "Sala 10" })
db.peliculas.findOne({ codigo: codigo.pelicula }); 