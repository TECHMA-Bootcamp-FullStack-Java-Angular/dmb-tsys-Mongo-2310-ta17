const db = db.getSiblingDB('proveedores_piezas');

db.createCollection("piezas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre"],
      properties: {
        nombre: {
          bsonType: "string",
          description: "It must be a string and is required."
        }
      }
    }
  }
})


db.createCollection("proveedores", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre"],
      properties: {
        nombre: {
          bsonType: "string",
          description: "It must be a string and is required."
        }
      }
    }
  }
})

db.createCollection("suministra", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["codigoPieza", "idProveedor", "precio"],
      properties: {
        codigoPieza: {
          bsonType: 	 "objectId",
          description: "It must be an objectId that references the piezas objectId is required."
        },
        idProveedor: {
          bsonType: "objectId",
          description: "It must be an objectId that references the proovedores objectId is required."
        },
        precio: {
          bsonType: "int" ,
          description: "It must be an integer (INT) and is required."
        }
      }
    }
  }
});


const proovedoresIDs = [
  ObjectId("6537b927f6738c545926f831"),
  ObjectId("6537b927f6738c545926f832"),
  ObjectId("6537b927f6738c545926f833"),
  ObjectId("6537b927f6738c545926f834"),
  ObjectId("6537b927f6738c545926f835"),
  ObjectId("6537b927f6738c545926f836"),
  ObjectId("6537b927f6738c545926f837"),
  ObjectId("6537b927f6738c545926f838"),
  ObjectId("6537b927f6738c545926f839"),
  ObjectId("6537b927f6738c545926f83a")
];

const piezasIDs = [
  ObjectId("6537b922f6738c545926f827"),
  ObjectId("6537b922f6738c545926f828"),
  ObjectId("6537b922f6738c545926f829"),
  ObjectId("6537b922f6738c545926f82a"),
  ObjectId("6537b922f6738c545926f82b"),
  ObjectId("6537b922f6738c545926f82c"),
  ObjectId("6537b922f6738c545926f82d"),
  ObjectId("6537b922f6738c545926f82e"),
  ObjectId("6537b922f6738c545926f82f"),
  ObjectId("6537b922f6738c545926f830")
];

// Generamos las 10 inserciones paca cada coleccón
["Cuadro", "Ruedas", "Cubierta", "Frenos", "Transmisión", "Biela", "Sillín", "Pedal", "Horquilla", "Potencia"].forEach((e ,i)=> db.piezas.insertOne({_id : pieezasIDs[i] , nombre: e }));
[...new Array(10).keys()].forEach((e) => db.proveedores.insertOne({ _id: proovedoresIDs[e] , nombre: `Proveedor ${e+1}` }));


// codigoPieza referencia a piezas._id y idProveedor referencia a proveedores._id
[...new Array(10).keys()].forEach((e) => db.suministra.insertOne({ codigoPieza: piezasIDs[e] , idProveedor: proovedoresIDs[e], precio: 100*(e+1) }));


/**
 * Testamos la integridad de nuetra base de datos
 *  ESTOS DATO NO SE INSERTARÁ AL NO CUMPLIR LAS VALIDACIONES
 * 
 * @returns Document failed validation con un JSON "information"
 */
db.piezas.insertOne({ nombre: 1 })    // nombre deberia ser string
db.proveedores.insertOne({ nombre: 1 })  // nombre deberia ser string
db.suministra.insertOne({ codigoPieza: "1232556klñjjkl" , idProveedor: "1254444fkljsklf", precio: 100*(e+1) }); // codigoPieza y idProveedor deberian ser ObjetcId


/**
 * Testamos los datos referenciados 
 * @returns JSON con el objeto solicitado
 */
// Queremos saber que proovedor suministra una pieza 
let {_id} = db.piezas.findOne({ nombre : "Pedal" })
let  { idProveedor }  =  db.suministra.findOne({  "codigoPieza" : _id})
db.proveedores.findOne({ _id: idProveedor })

// Queremos saber que precio tiene determinada pieza
let pieza = db.piezas.findOne({ nombre: "Sillín" }) 
db.suministra.findOne({ "codigoPieza": pieza._id })

// Notraemos todas las piezas por orden alfabetico
db.piezas.find().sort({ nombre: 1 });

// Notreamos los productos mas baratos de 500 eruos y los ordenamos de manera ascendente
db.suministra.find({ precio: { $lte: 500 } }).sort({ precio: -1 });