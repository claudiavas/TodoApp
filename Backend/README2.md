# Introducción a Mongoose
Con este ejemplo trabajaremos la conexión de nuestro backend con mongoose. 

## Instalación de mongoose
```shell
$ npm init -y
$ npm install express
$ npm install mongoose
$ npm install nodemon --save-dev
```

## Preparar .env

Para no guardar datos sensibles en el repositorio, utilizaremos las variables de entorno. Nos permitirán que cada desarrollador o cada entorno pueda tener sus propios datos y ser utilizados dentro del código. Estas variables de entorno se almacenan en un fichero `.env`

`.env`
```
DB_USER="user"
DB_PASSWORD="password"
DB_NAME="db"
DB_SERVER="server"
```

Para acceder a las variables de entorno desde nodeJS, deberemos instalar el módulo `dotenv` y cargar la configuración (en este caso vacía ya que no necesitamos ninguna configuración especial)

```shell
$ npm install dotenv
```

`app.js`
```js
require('dotenv').config();
```

Las variables de entorno quedarán accesibles a través de la variable `process.env`

## Preparar conexión con MongoDB Atlas
`app.js`
```js
const mongoose = require("mongoose");
const mongoDB = "mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@"+process.env.DB_SERVER+"/"+process.env.DB_NAME+"?retryWrites=true&w=majority";
async function main() {
  await mongoose.connect(mongoDB);
}
main().catch(err => console.log(err));
```

## Crear estructura de ficheros (scaffolding)
Estructuraremos los directorios de la siguiente forma:

```
├── app.js
├── models
├── controllers
└── routes
```
## Iteraciones

### Iteración #1
Crear un modelo en `models` para alumnos en un fichero `student.model.js`. Este modelo tendrá los siguientes campos

| Field       | Type        |
| ----------- | ----------- |
| first_name  | String      |
| last_name   | String      |
| birthyear   | Number      |

`models\student.model.js`

```js
const mongoose = require('mongoose');

// here we are getting access to Schema class from mongoose
const Schema = mongoose.Schema;

// Schema defines the STRUCTURE of documents in the collection
// this is the BLUEPRINT for all instances
const studentSchema = new Schema({
  first_name: String,
  last_name: String,
  birthyear: Number,
});

// Student is our mongoose model class
// all students in students collection will share these properties
// Mongoose turns models name to a collection name (Student --> students)
module.exports = mongoose.model("Student", studentSchema);
```

### Iteración #2
Insertar vuestros datos (o inventados) en nuestra base de datos

```js
Student.create({ first_name: 'Pepe', last_name: 'López', birthyear: 1978 })
  .then(studentDoc => console.log(`Student create worked well: ${studentDoc}`))
  .catch(error =>
    console.log(`Creating a new student went wrong! Try again 😞 ${err}`)
  );
```

### Iteración #3
Insertar varios alumnos a la vez

```js
Student.create([
    { first_name: 'Pepe', last_name: 'López', birthyear: 1978 },
    { first_name: 'Marta', last_name: 'Fernández', birthyear: 1982 }
])
  .then(studentDocs => console.log(`Multiple students created: ${studentDocs}`))
  .catch(error =>
    console.log(`Creating a new student went wrong! Try again 😞 ${err}`)
  );
```

### Iteración #4
Obtener la lista de alumnos

```js
Student.find()
  .then(studentDocs => console.log('Found this: ', studentDocs))
  .catch(err => console.log('Error while getting the students: ', err));
```

### Iteración #5
Obtener la lista de alumnos filtrado por nacidos después de 1980

```js
Student.find({ birthyear: { $gt: 1980 } })
  .then(studentDocs => console.log('Found this 🐈: ', studentDocs))
  .catch(err => console.log('Error while getting the students: ', err));
```

### Iteración #6
Obtener un alumno por Id
```js
Student.findById('123456789abcdef')
  .then(studentDoc => console.log('Found this student by their ID: ', studentDoc))
  .catch(err => console.log('Error while getting the students: ', err));
```

### Iteración #7
Contar documentos
```js
Student.countDocuments({ first_name: 'Pepe' })
  .then(total =>
    console.log('Total number of students with name Pepe: ', total)
  )
  .catch(err => console.log('Error while counting the students: ', err));
```

### Iteración #8
Modificar un documento a partir de su Id
```js
Student.findByIdAndUpdate(
  '123456789abcdef',
  {
    $set: { first_name: 'Pablo', birthyear: 1986 }
  },
  { 
    new: true  //You should set the new option to true to return the document after update was applied.
  }
)
  .then(updatedStudent => console.log('Updated student: ', updatedStudent))
  .catch(err => console.log('Error while updating the student: ', err));
```

### Iteración #9
Modificar varios documentos a partir de su nombre

```js
// Update all students named Pepe
Student.updateMany({ first_name: 'Pepe' }, { $inc: { birthyear: 1 } }) // birthyear = birthyear + 1
  .then(updatedStudents => console.log('Updated students: ', updatedStudents))
  .catch(err => console.log('Error while updating students: ', err));
```

### Iteración #10
Buscar un documento para modificar, si no lo encuentra, insertar uno nuevo
Modificar un documento a partir de su Id
```js
const filter = { first_name: 'Pepe' };
const update = { first_name: 'Anna', last_name: 'Martínez', birthday: 2001 };

Student.findOneAndUpdate(
  filter,
  update,
  { 
    new: true  //You should set the new option to true to return the document after update was applied.
    upsert: true // Make this update into an upsert. If no document matches filter, MongoDB will insert one by combining filter and update as shown below.
  }
)
  .then(updatedStudents => console.log('Updated students: ', updatedStudents))
  .catch(err => console.log('Error while updating the students: ', err));
```

Si por alguna razón se desea reemplazar todos los datos, existe el método `findOneAndReplace`, que mantendrá la id.

### Iteración #11
Eliminar un documento a partir de su Id
```js
Student.findByIdAndDelete('123456789abcdef') // .findByIdAndRemove() works the same as .findByIdAndDelete()
  .then(deletedStudent => console.log(`Deleted student with id: ${deletedStudent._id}`))
  .catch(err => console.log('Error while deleting one student: ', err));
```

### Iteración #12
Eliminar varios documentos a partir de su nombre
```js
Student.deleteMany({ name: 'Pepe' })
  .then(deletedStudents => {
    console.log('deleted: ', deletedStudents);
    // deletedStudents.forEach(oneStudent =>  console.log(`Deleted student with id: ${oneStudent._id}`));
  })
  .catch(err => console.log('Error while deleting one student: ', err));
```

### Iteración #13
Definir validación de datos en el modelo

| Field       | Type        | Validación                      |
| ----------- | ----------- | ------------------------------- |
| first_name  | String      | Requerido. Min 2 carácteres     |
| last_name   | String      | Requerido. Min 2 carácteres     |
| birthyear   | Number      | Requerido. Min: 1900. Max: 2020 |


`models\student.model.js`

```js
const studentSchema = new Schema({
  first_name: { 
    type: String, 
    required: true,
    minLength: 2,
    },
  last_name: { 
    type: String, 
    required: true,
    minLength: 2,
    },
  birthyear: { 
    type: Number, 
    required: true,
    min: 1900,
    max: 1900,
    },
});
```


Validaciones: https://mongoosejs.com/docs/validation.html

- required: boolean or function, if true adds a required validator for this property
- default: Any or function, sets a default value for the path. If the value is a function, the return value of the function is used as the default.
- validate: function, adds a validator function for this property

String

- lowercase: boolean, whether to always call .toLowerCase() on the value
- uppercase: boolean, whether to always call .toUpperCase() on the value
- trim: boolean, whether to always call .trim() on the value
- match: RegExp, creates a validator that checks if the value matches the given regular expression
- enum: Array, creates a validator that checks if the value is in the given array.
- minLength: Number, creates a validator that checks if the value length is not less than the given number
- maxLength: Number, creates a validator that checks if the value length is not greater than the given number

Number

- min: Number, creates a validator that checks if the value is greater than or equal to the given minimum.
- max: Number, creates a validator that checks if the value is less than or equal to the given maximum.
- enum: Array, creates a validator that checks if the value is strictly equal to one of the values in the given array.

Date

- min: Date, creates a validator that checks if the value is greater than or equal to the given minimum.
- max: Date, creates a validator that checks if the value is less than or equal to the given maximum.

### Iteración #14
Cerrar conexión con base de datos

```js
mongoose.connection.close()
```

### Iteración #15
Asociar alumnos con un master

Primero de todo necesitaremos crear un modelo para los masters

| Field       | Type        |
| ----------- | ----------- |
| name        | String      |
| year        | Number      |
| description | String      |

`models\master.model.js`

```js
const mongoose = require('mongoose');

// here we are getting access to Schema class from mongoose
const Schema = mongoose.Schema;

// Schema defines the STRUCTURE of documents in the collection
// this is the BLUEPRINT for all instances
const masterSchema = new Schema({
  name: String,
  year: Number,
  description: String,
});

// Student is our mongoose model class
// all students in students collection will share these properties
// Mongoose turns models name to a collection name (Student --> students)
module.exports = mongoose.module("Master", masterSchema);
```

`models\student.model.js`

```js
...
masterId: {type: mongoose.Schema.Types.ObjectId, ref: 'Master'},
...
```

### Iteración #16
Obtener lista alumnos con información del master

```js
Student.find()
  .populate('regionId')
  .then(studentDocs => console.log('Found this: ', studentDocs))
  .catch(err => console.log('Error while getting the students: ', err));
```

## FAQs


<details>
  <summary>Estoy atascado y no sé cómo resolver el problema o por dónde empezar. ¿Qué tengo que hacer?</summary>

<br>
  
Si te encuentras atascado en el código y no sabse cómo resolver el problema o por dónde empezar, debes dar un paso atrás e intentar formular una pregunta clara sobre el problema específico al que se enfrenta. Esto te ayudará a reducir el problema y encontrar posibles soluciones.

Por ejemplo, ¿es un concepto que no comprendes o recibe un mensaje de error que no sabes cómo solucionar? Por lo general, es útil tratar de exponer el problema lo más claramente posible, incluidos los mensajes de error que estés recibiendo. Esto puede ayudarte a comunicar el problema a otros y potencialmente obtener ayuda de compañeros de clase o recursos en línea.

Una vez que tengas una comprensión clara del problema, podrás comenzar a trabajar hacia la solución.

[Volver arriba](#faqs)

</details>

<details>
    <summary>¿Cómo utilizar <code>then()</code> y <code>catch()</code> with Promises?</summary>

<br>

Cuando trabajes con Promesas o una *función que devuelve una promesa*, puedes adjuntar el método `.then()` para manejar el valor resuelto y un método `catch()` para manejar el posible valor de rechazo.

Aquí hay un ejemplo de cómo usar `.then()` y `.catch()` para manejar una promesa simple:

```js
myPromise
    .then((result) => {
    console.log(result);
    })
    .catch((error) => {
    console.log(error);
    })
```

Aquí hay un ejemplo del uso de `.then()` y `.catch()` para manejar una promesa devuelta por una función/método:

```js
someAPI.getData()
    .then((result) => {
    console.log(result);
    })
    .catch((error) => {
    console.log(error);
    })
```

Si estás intentando ejecutar varias promesas en una secuencia, puedes hacerlo devolviendo una promesa desde un bloque `.then()`. Ejemplo:

```js
someAPI.getData()
    .then((result1) => {
        console.log(result1
        return someAPI.getData( // Return another pending promise
    .then((result2) => { // Handle the returned promise
        console.log(result2
    })
    .catch((error) => {
        console.log(error
    })
```

La primera línea `someAPI.getData()` inicia una operación asíncrona, que devuelve una promesa. Luego se llama al método `.then()` con la promesa de manejar el valor resuelto.

El primer `then()` devuelve otra promesa con otra llamada a `someAPI.getData()`, que permite encadenar otra función `then()` que maneja el segundo valor resuelto, registrándolo en la consola.

[Volver arriba](#faqs)

</details>

<details>
  <summary>¿Cómo utilizar una función con <code>async</code> y <code>await</code>?</summary>

<br>

Una función asincrónica se crea utilizando la palabra clave `async` antes de la definición de la función.

Una función `async` te permite usar la palabra clave `await` dentro del cuerpo de la función para esperar a que se resuelva una promesa.

Cuando usamos una función `async` para manejar código asíncrono (por ejemplo, una llamada a la API) que potencialmente puede generar un error, tenemos que agregar un bloque `try`/`catch` para poder manejar cualquier error potencial.

##### Syntax

```js
async function doSomething() {
    try {
    // Code that will be executed asynchronously
    // that might throw an error
    }
    catch (error) {
    // Handle the error
    }
}
```

##### Utilizando `await` dentro de una función `async`

Aquí hay un ejemplo del uso de `await` dentro de una función `async` para esperar a que se resuelva una promesa:

```js
async function getData() {
try {
    let response = await fetch('https://api.github.com/search/repositories?q=js');
    let data = await response.json();
    console.log(data);
}
catch (error) {
    // error handling
} 
}
```

En el ejemplo anterior, el primer `await` se usa para esperar a que se resuelva la promesa devuelta por `fetch()`. El valor de la promesa resuelta se asigna entonces a la variable `respuesta`.

El segundo `await` se usa para analizar la respuesta como un objeto json y se usa para esperar la promesa devuelta por `response.json()`. El valor resuelto se asigna luego a la variable `data`.

La función usa la palabra clave `return` para devolver los `datos` para permitir consumir el valor fuera de la función.

##### Una función `async` siempre devuelve una Promise

La diferencia entre una *función regular* y una función `async` es que la función **`async` siempre devuelve una Promesa**.

Una vez definida, puede invocar una función `async` como una función normal y **manejar la Promesa que devuelve usando `.then()` y `.catch()` o `await`**.

Aquí hay un ejemplo del uso de `then` y `catch` para manejar una Promesa devuelta por una función `async`:

```js
async function greeting() {
// An `async` function always returns a promise
// This value will be returned as a Promise
return "HELLO IRONHACKERS!";
}

greeting()
.then((result) => {
    console.log(result);
})
.catch((error) => {
    console.log("Error:", error);
})
```

Aquí hay un ejemplo del manejo de la misma función `async` pero esta vez usando `await`:

```js
async function greeting() {
// Async function always returns a promise
// This value will be returned as a Promise
return "HELLO WORLD!";
}

// We need another wrapper `async` function so that we can use `await`
async function wrapperFunction() {
try {
    const result = await greeting()
    console.log(result);
}
catch (error) {
    console.log("Error:", error);
}
}
```

Ten en cuenta que necesitábamos otra función contenedora `async` para poder usar `await`.

[Volver arriba](#faqs)

</details>

<details>
  <summary>¿Cómo utilizar un bloque <code>try</code> / <code>catch</code>?</summary>

<br>

El bloque `try`/`catch` se usa para manejar los errores que ocurren durante la ejecución de un programa.

El bloque `try` contiene el código que podría arrojar un error, y el bloque `catch` contiene el código que manejará el error.

Aquí hay un ejemplo del uso de un bloque `try`/`catch`:

```js
try {
// Code that might throw an error
} catch (error) {
// Handle the error
}
```

El bloque `try`/`catch` se usa típicamente en funciones `asincrónicas` cuando se maneja código asíncrono que potencialmente puede arrojar un error.

Aquí hay un ejemplo del uso de un bloque `try`/`catch` en una función `async` al manejar una promesa:

```js
async function doSomething() {

try {
    // Code that might throw an error
    const result = await someAsyncFunction();
}
catch (error) {
    // Handle the error
    console.error(error);
}

}
```

En el ejemplo anterior, el bloque `try` contiene una operación asíncrona que podría arrojar un error: `await someAsyncFunction()`. Si se arroja un error, la ejecución saltará automáticamente al bloque `catch`.

[Volver arriba](#faqs)

</details>

<details>
  <summary>Recibí el error: "Cannot find module" Node.js". ¿Cómo puedo resolverlo?</summary>

<br>

El error "Cannot find module" en una aplicación de Node.js significa que el módulo que intenta importar o usar no existe en su proyecto o Node.js no puede encontrarlo.

Hay algunas cosas que puedes intentar para resolver el problema:

1. **Las dependencias no están instaladas**: asegúrate de que todas las dependencias estén instaladas.
Para hacer esto, ejecuta el comando `npm install` en la carpeta raíz de su proyecto.
Esto instalará todas las dependencias enumeradas en el archivo `package.json` del proyecto y garantizará que todos los módulos que requiere su aplicación Node'js estén disponibles.
2. **El módulo no está instalado**: asegúrate de que el *paquete* que está tratando de usar esté incluido en el `paquete.json` del proyecto y que esté instalado.
Para hacer esto, ejecuta el comando `npm install <package_name>`, reemplazando `<package_name>` con el nombre del paquete.
Esto agregará el paquete a la lista de dependencias en el archivo `package.json` y lo instalará en el proyecto.
3. **El módulo no está importado:** Asegúrate de haber importado el módulo/paquete correctamente y de que la instrucción `require` esté escrita correctamente y disponible en el lugar correcto en su código.
4. **Ruta de archivo incorrecta:** Si está importando otro archivo como un módulo, asegúrate de que el archivo que está tratando de solicitar esté ubicado en la carpeta correcta y que estés utilizando la ruta de archivo correcta.
5. **Nombre de módulo/paquete incorrecto:** Verifica la ortografía del nombre del paquete que estás tratando de importar.

[Volver arriba](#faqs)

</details>

<details>
  <summary>Recibí el error "Error: listen EADDRINUSE: Address already in use". ¿Cómo lo soluciono?</summary>

<br>

Este error significa que el puerto lo toma otro proceso que todavía se está ejecutando en ese puerto.
Para solucionar el problema, debe eliminar el proceso usando el puerto y luego ejecutar el comando nuevamente. Aquí está cómo hacerlo:

#### En Mac/Linux

Para eliminar el proceso que se ejecuta en el puerto `3000`, ejecuta el siguiente comando en la terminal:

```bash
sudo kill -9 $(lsof -t -i:3000)
```

**Importante:** Reemplaza el puerto de ejemplo anterior *3000* con el número de puerto del proceso que estás tratando de eliminar.

#### En Windows

##### 1. Usando el Administrador de tareas

Para eliminar el proceso en ejecución en Windows usando el Administrador de tareas, haz lo siguiente:

1. Abre el **Administrador de tareas** presionando: **<kbd>Ctrl</kbd>** + **<kbd>Shift</kbd>** + **<kbd>Esc</kbd>* *
2. Busca el proceso de Nodo que deseas finalizar.
3. Haz clic derecho y seleccione **Finalizar tarea**

##### 2. Usando el símbolo del sistema

Para eliminar el proceso en ejecución en Windows mediante el símbolo del sistema, haz lo siguiente:

1. Abre el menú **Inicio** de Windows
2. Busca **CMD** en la barra de búsqueda
3. En los resultados de la búsqueda, haz clic derecho en **Símbolo del sistema** y selecciona **Ejecutar como administrador**. Esto abrirá la terminal del símbolo del sistema.
4. En la terminal del símbolo del sistema, ejecuta el siguiente comando para encontrar el ID del proceso:

```bash
netstat -ano|findstr "PID :3000"
```

> Si el proceso se está ejecutando en otro puerto, simplemente reemplaza `3000` con el número del puerto en el que se está ejecutando el proceso.

Esto devolverá la identificación del proceso (PID). Luego debes ejecutar el siguiente comando usando la identificación del proceso (PID) que obtuviste en el paso anterior para finalizar el proceso:

```bash
taskkill /PID 12345 /f
```

**Importante:** Reemplaza el PID de ejemplo anterior *12345*, con el ID de proceso (PID) que obtuviste en el paso anterior.

[Volver arriba](#faqs)

</details>

<details>
  <summary>Recibí el error "Port is already in use". ¿Cómo lo soluciono?</summary>

<br>

Este error significa que el puerto lo toma otro proceso que todavía se está ejecutando en ese puerto.
Para solucionar el problema, debes eliminar el proceso usando el puerto y luego ejecutar el comando nuevamente. Aquí te explicamos cómo hacerlo:

#### En Mac/Linux

Para eliminar el proceso que se ejecuta en el puerto `3000`, ejecuta el siguiente comando en la terminal:

```bash
sudo kill -9 $(lsof -t -i:3000)   
```

**Importante:** Reemplaza el puerto de ejemplo anterior *3000* con el número de puerto del proceso que estás tratando de eliminar.

#### En Windows

##### 1. Usando el Administrador de tareas

Para eliminar el proceso en ejecución en Windows usando el Administrador de tareas, haz lo siguiente:

1. Abre el **Administrador de tareas** presionando: **<kbd>Ctrl</kbd>** + **<kbd>Shift</kbd>** + **<kbd>Esc</kbd>* *
2. Busca el proceso de Nodo que desea finalizar.
3. Haz clic derecho y seleccione **Finalizar tarea**

##### 2. Usando el símbolo del sistema

Para eliminar el proceso en ejecución en Windows mediante el símbolo del sistema, haz lo siguiente:

1. Abre el menú **Inicio** de Windows
2. Busca **CMD** en la barra de búsqueda
3. En los resultados de la búsqueda, haz clic derecho en **Símbolo del sistema** y selecciona **Ejecutar como administrador**. Esto abrirá la terminal del símbolo del sistema.
4. En la terminal del símbolo del sistema, ejecuta el siguiente comando para encontrar el ID del proceso:

```bash
netstat -ano|findstr "PID :3000"
```

> Si el proceso se está ejecutando en otro puerto, simplemente reemplaza `3000` con el número del puerto en el que se está ejecutando el proceso.

Esto devolverá la identificación del proceso (PID). Luego debes ejecutar el siguiente comando usando la identificación del proceso (PID) que obtuviste en el paso anterior para finalizar el proceso:

```bash
taskkill /PID 12345 /f
```

**Importante:** Reemplaza el PID de ejemplo anterior *12345*, con el ID de proceso (PID) que obtuviste en el paso anterior.

[Volver arriba](#faqs)

</details>

<details>
  <summary>Recibí el error: "Error: connect ECONNREFUSED ::1:27017". ¿Qué tengo que hacer?</summary>

<br>

Este error significa que la aplicación Node.js no puede conectarse a una instancia de MongoDB que se ejecuta en la (misma) máquina local.
Hay algunas cosas que debes tener en cuenta para solucionar este problema:

1. **Verifica la cadena de conexión de la base de datos**: Verifica que la cadena de conexión sea correcta. La cadena de conexión de la base de datos debe tener el formato:

```python
mongodb://127.0.0.1:27017/databaseName
```

2. **Verifica que MongoDB se esté ejecutando en su máquina**: Verifica que MongoDB se está ejecutando en tu máquina. Si no se está ejecutando, reinicia el servicio de acuerdo con las siguientes instrucciones:

**En Mac:**

Comprueba si MongoDB se está ejecutando en su máquina ejecutando el comando:

```bash
brew services list
```

Deberías ver el servicio 'mongodb-community' listado como 'iniciado'. De lo contrario, ejecuta el siguiente comando para iniciarlo:

```bash
brew services start mongodb-community
```

**En Ubuntu:**
Puedes iniciar el proceso [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) escribiendo el siguiente comando:

```bash
sudo systemctl start mongod
```

Si recibes un error similar al siguiente al iniciar [`mongod`:](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

> ```
> Failed to start mongod.service: Unit mongod.service not found.
> ```

Ejecute primero el siguiente comando:

```bash
sudo systemctl daemon-reload
```

Luego ejecute el comando de inicio anterior nuevamente.

**En Windows:**

Para abrir el proceso *MongoDB* en Windows, deberás seguir estos pasos:

- Ve a tus *Archivos de programa* en tu unidad *C:* - el disco local
- En *Archivos de programa* ve a la carpeta *MongoDB*
- Dentro de la carpeta *MongoDB*, sigue esta ruta `Server/4.4/bin`. El número de versión de su sistema (`4.4`) puede ser ligeramente diferente para las instalaciones más nuevas.
- Haz doble clic en el archivo llamado **mongod.exe**.

    <details style="font-size: 14px; cursor: pointer; outline: none;">
    <summary> Check the image inside </summary>

<br>

    ![](https://education-team-2020.s3.eu-west-1.amazonaws.com/web-dev/prework/installations/win-installations-bootcamp-mongo-03.png)

    </details>
   
[Volver arriba](#faqs)

</details>

<details>
  <summary>¿Por qué mi base de datos está vacía aunque puedo conectarme?</summary>

<br>

Es normal que la base de datos esté vacía si no ha insertado ningún dato en ella. Si desea confirmar que su conexión a la base de datos funciona correctamente, puede intentar insertar un documento simple en una colección y luego consultar la colección o verificar la base de datos para ver si se agregó el documento.

[Volver arriba](#faqs)

</details>

<details>
  <summary>Recibo el error "MongoDB no se está ejecutando en el host y el puerto proporcionados" cuando intento conectarme con MongoDB Compass. ¿Qué tengo que hacer?</summary>

<br>

Si estás intentando conectarse a una instancia de MongoDB que se ejecuta localmente, primero debes verificar que MongoDB se esté ejecutando en su máquina. Si no se está ejecutando, reinicia el servicio de acuerdo con las siguientes instrucciones:

**En Mac:**

Comprueba si MongoDB se está ejecutando en su máquina ejecutando el comando:

```bash
brew services list
```

Deberías ver el servicio 'mongodb-community' listado como 'iniciado'. De lo contrario, ejecute el siguiente comando para iniciarlo:

```bash
brew services start mongodb-community
```

**En Ubuntu:**

Puedes iniciar el proceso [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) escribiendo el siguiente comando:

```bash
sudo systemctl start mongod
```

Si recibes un error similar al siguiente al iniciar [`mongod`:](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

> ```
> Failed to start mongod.service: Unit mongod.service not found.
> ```

Ejecuta primero el siguiente comando:

```bash
sudo systemctl daemon-reload
```

Luego ejecuta el comando de inicio anterior nuevamente.

**En Windows:**

Para abrir el proceso *MongoDB* en Windows, deberás seguir estos pasos:

- Ve a tus *Archivos de programa* en tu unidad *C:* - el disco local
- En *Archivos de programa* ve a la carpeta *MongoDB*
- Dentro de la carpeta *MongoDB*, sigue esta ruta `Server/4.4/bin`. El número de versión de su sistema (`4.4`) puede ser ligeramente diferente para las instalaciones más nuevas.
- Haz doble clic en el archivo llamado **mongod.exe**.

    <details style="font-size: 14px; cursor: pointer; outline: none;">
    <summary> Check the image inside </summary>

<br>

    ![](https://education-team-2020.s3.eu-west-1.amazonaws.com/web-dev/prework/installations/win-installations-bootcamp-mongo-03.png)

    </details>

[Volver arriba](#faqs)

</details>

<details>
<summary>¿Cómo crear un modelo de Mongoose?</summary>
<br>

El modelo Mongoose sirve como modelo para crear y administrar documentos dentro de las colecciones de MongoDB. El modelo de Mongoose es una superposición sobre una colección de MongoDB, que usamos para consultar e interactuar con esa colección de base de datos.

Aquí hay un ejemplo de cómo crear un modelo de `Usuario` para administrar documentos en la colección de `usuarios`:

```js
// IMPORT MONGOOSE
const mongoose = require("mongoose");

// CREATE A SCHEMA - defines the shape of the documents
const userSchema = new mongoose.Schema({ 
firstName: String,
lastName: String 
});

// CREATE THE MODEL
const User = mongoose.model("User", schema);

// EXPORT THE MODEL
module.exports = User;
```

En el ejemplo anterior, creamos y exportamos un modelo de 'Usuario', para que pueda importarse y usarse en cualquier parte de la aplicación para administrar la colección de 'usuarios' de la base de datos.

Analicemos el ejemplo anterior y los pasos para crear un modelo de mangosta:

1. **Importar Mongoose:** El primer paso es importar la biblioteca `mongoose`.
2. **Crear un esquema:** El siguiente paso es crear un esquema, que define la forma de los documentos que se almacenarán en la colección `users`. En el ejemplo anterior, el esquema tiene dos campos `firstName` y `lastName` que son cadenas.
3. **Crear el modelo**: El último paso es crear el modelo. Esto se hace usando el método `mongoose.model()` , que toma dos argumentos: el nombre del modelo, en este caso `'Usuario'` y el esquema que debería usar.
Mongoose automáticamente pluraliza y convierte a minúsculas el nombre del modelo provisto y lo usa como el nombre de la colección. En este caso, la cadena `'Usuario'` se convierte automáticamente en un nombre de colección -> `usuarios`.
4. **Exportar el modelo:** Después de crear el modelo, debe exportarse para poder usarlo en otras partes de la aplicación.

[Volver arriba](#faqs)

</details>

<details>
  <summary>¿Cómo resuelvo el error de Mongoose "ValidationError: Path ... is required."?</summary>

<br>

Este error ocurre cuando intenta guardar un documento en la base de datos sin un valor para un campo que está marcado como obligatorio en el modelo.

Para corregir este error, asegúrate de proporcionar un valor para todos los campos obligatorios al crear o actualizar un documento. Puedes verificar que está proporcionando los valores correctos utilizando console.log para inspeccionar los datos antes de guardarlos en la base de datos.

[Volver arriba](#faqs)

</details>

<details>
  <summary>Recibo un error: "not defined". ¿Cómo lo soluciono?</summary>

<br>


El error "ReferenceError: la variable no está definida" en JavaScript ocurre cuando intenta acceder a una variable o una función que aún no se ha definido o está fuera del alcance.
Para solucionar el problema, verifique que haya definido la variable o función que está tratando de usar y vuelva a verificar la ortografía para asegurarse de que está usando el nombre correcto.
En caso de que la variable o una función esté definida en otro archivo, asegúrese de que el archivo se haya importado o cargado correctamente.

[Volver arriba](#faqs)

</details>

<details>
  <summary>Cuando intento ejecutar la aplicación, aparece el error "command not found: nodemon"</summary>

<br>

Asegúrate de tener `nodemon` instalado globalmente:


```bash
npm install -g nodemon
```

Esto instalará nodemon globalmente en su sistema, haciéndolo disponible para todos sus proyectos.

[Volver arriba](#faqs)

</details>

<details>
  <summary>No puedo hacer push al repositorio. ¿Qué tengo que hacer?</summary>

<br>

Hay un par de razones posibles por las que es posible que no puedas hacer *push* a un repositorio de Git:

1. **No has confirmado sus cambios:** Antes de que pueda enviar sus cambios al repositorio, debes confirmarlos con el comando `git commit`. Asegúrate de haber confirmado sus cambios e intente presionar nuevamente. Para hacer esto, ejecuta los siguientes comandos de terminal desde la carpeta del proyecto:

```bash
git add .
git commit -m "Your commit message"
git push
```

2. **No tienes permiso para subir al repositorio:** Si has clonado el repositorio directamente desde el repositorio principal de Ironhack sin hacer un *Fork* primero, no tienes acceso de escritura al repositorio.
Para verificar qué repositorio remoto ha clonado, ejecuta el siguiente comando de terminal desde la carpeta del proyecto:

```bash
git remote -v
```

Si el enlace que se muestra es el mismo que el del repositorio principal, primero deberás bifurcar hacer un fork en tu cuenta de GitHub y luego clonar tu fork en tu máquina local para poder aplicar los cambios.

[Volver arriba](#faqs)

</details>