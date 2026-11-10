# 🌸 Proyecto Florería

¡Bienvenidos al repositorio de **Proyecto Florería**! Este es un proyecto full-stack estructurado en módulos para separar la lógica del backend (API) 
y la interfaz de usuario (Frontend), optimizado para trabajar con contenedores.

---

## 👥 Integrantes
* **Pier Villacorta** 
* **Elizabeth Troncoso**

---

## 🚀 Tecnologías Utilizadas

### Frontend
* **React** + **Vite**
* **TypeScript** / **JavaScript**
* **pnpm** (Gestor de paquetes)
* **ESLint** (Linter de código)

### Backend
* **Spring Boot** (Java)
* Base de Datos (PostgreSQL)

### DevOps & Despliegue
* **Docker** & **Docker Compose**

---

## 📂 Estructura del Proyecto

El repositorio está dividido en las siguientes carpetas principales:

* `floreria/`: Aplicación de cliente desarrollada en React + Vite + TypeScript.
* `floreria-api/`: API REST desarrollada en Spring Boot que maneja la base de datos, autenticación (register/login) y lógica de negocio.

---

## ⚙️ Cómo Ejecutar el Proyecto

### Requisitos Previos
Asegúrate de tener instalado en tu máquina:
* [Node.js](https://nodejs.org) & [pnpm](https://pnpm.io) (Para el Frontend)
* [Java JDK 17+](https://adoptium.net) (Para el Backend)
* [Docker & Docker Compose](https://docker.com) (Para la base de datos y contenedores)

### 1. Clonar el repositorio y entrar a la rama correcta
```bash
git clone https://github.com
cd floreria-v1
git checkout spring/react
```

### 2. Levantar la Base de Datos (Docker)
Desde la raíz del proyecto (donde está tu archivo `docker-compose.yml`), ejecuta el siguiente comando para encender la base de datos en segundo plano:
```bash
docker compose up -d
```
*(Nota: Si usas una versión antigua de Docker, el comando puede ser `docker-compose up -d`).*

### 3. Levantar el Backend (Spring Boot)
Una vez que el contenedor de la base de datos esté corriendo, abre una terminal en la carpeta de la API y arranca el servidor:
```bash
cd floreria-api
./mvnw spring-boot:run
```

### 4. Levantar el Frontend (React + Vite)
En otra terminal, ve a la carpeta del frontend, instala los paquetes con pnpm y arranca el entorno de desarrollo:
```bash
cd floreria
pnpm install
pnpm dev
```
### para el front
crea  el .env y agrega = VITE_API_URL=http://localhost:8080/api

###Para el backend 
En el archivo .env.example estan las indicaciones
