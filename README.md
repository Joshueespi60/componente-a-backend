# BackendNetflix

Backend RESTful con Node.js, Express y MongoDB para administrar registros relacionados con Netflix, acompañado por un frontend responsive en HTML, CSS y JavaScript puro.

## Tecnologías usadas

- Node.js
- Express
- MongoDB
- Mongoose
- HTML
- CSS
- JavaScript
- Bootstrap por CDN

## Estructura de carpetas

```txt
BackendNetflix/
├── config/
│   └── database.js
├── controllers/
│   └── netflix.controllers.js
├── models/
│   └── netflix.model.js
├── public/
│   ├── assets/
│   │   └── stream-grid.svg
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── routes/
│   ├── index.routes.js
│   └── netflix.routes.js
├── .env
├── app.js
├── package.json
├── README.md
├── REPORTE_FRONTEND_NETFLIX.md
└── server.js
```

## Instalación

```bash
npm install
```

## Configuración del entorno

Crear o actualizar el archivo `.env` sin exponer credenciales reales:

```txt
PORT=3000
MONGO_URI=tu_uri_de_mongodb_con_base_Netflix_backend
```

El proyecto debe usar la base de datos:

```txt
Netflix_backend
```

## Ejecución

```bash
npm start
```

Servidor local:

```txt
http://localhost:3000
```

## Frontend

El frontend está en `public/` y puede abrirse desde:

```txt
http://localhost:3000/index.html
http://localhost:3000/frontend
```

La interfaz permite listar, crear, editar y eliminar registros consumiendo `/api/netflix` con `fetch` y `async/await`.

## Rutas de la API

```txt
GET    /api/netflix
GET    /api/netflix/:id
POST   /api/netflix
PUT    /api/netflix/:id
DELETE /api/netflix/:id
GET    /api/netflix/pais/:pais
```

## Ejemplo de body JSON

```json
{
  "nombreEmpresa": "Netflix",
  "industria": "Entretenimiento y streaming",
  "sede": "Los Gatos, California",
  "pais": "Estados Unidos",
  "descripcion": "Empresa dedicada a servicios de streaming y produccion de contenido audiovisual.",
  "sitioWeb": "https://www.netflix.com",
  "numeroEmpleados": 13000,
  "ingresosAnuales": 33700000000,
  "estado": "Activa",
  "fechaFundacion": "1997-08-29"
}
```

## CRUD

- `GET /api/netflix`: lista todos los registros.
- `POST /api/netflix`: crea un registro nuevo.
- `PUT /api/netflix/:id`: actualiza un registro existente.
- `DELETE /api/netflix/:id`: elimina un registro existente.

El frontend actualiza el DOM después de cada operación para reflejar el estado más reciente de la API.
