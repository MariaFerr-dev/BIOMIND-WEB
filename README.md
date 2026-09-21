
# 🌱 BIOMIND WEB

### Trazabilidad para avanzar

BIOMIND WEB es la versión web del proyecto BIOMIND, una solución tecnológica orientada al seguimiento formativo de las prácticas desarrolladas en el laboratorio de biotecnología vegetal.

La plataforma complementa el ecosistema BIOMIND proporcionando acceso a información académica, seguimiento de proyectos y funcionalidades asociadas a los diferentes roles del sistema.

---

## 📌 Sobre BIOMIND

BIOMIND nace a partir de una necesidad identificada en el laboratorio de biotecnología vegetal.

Durante las prácticas es necesario registrar actividades, avances, dificultades, evidencias y observaciones. Al mismo tiempo, la información generada necesita mantenerse organizada para permitir su consulta y seguimiento posterior.

El proyecto busca centralizar este proceso y conservar la trazabilidad de las actividades realizadas por aprendices, instructores, pasantes y administradores.

---

## 🎯 Objetivo

Facilitar el seguimiento de los procesos formativos relacionados con las prácticas de biotecnología vegetal mediante una plataforma que permita consultar y gestionar información académica de forma organizada, manteniendo la relación entre usuarios, proyectos, bitácoras, evidencias y retroalimentación.

---

## 🧭 Trazabilidad para avanzar

La trazabilidad constituye uno de los principios centrales del proyecto.

BIOMIND permite mantener relaciones entre los diferentes elementos del proceso formativo:

```text
Usuario
   ↓
Rol
   ↓
Ficha
   ↓
Proyecto
   ↓
Bitácora
   ↓
Evidencias
   ↓
Seguimiento
```

Esto permite conservar un historial organizado de las actividades desarrolladas.

---

## 👥 Roles del sistema

BIOMIND contempla cuatro roles principales.

### 👩‍🎓 Aprendiz

Participa en el registro y consulta de su proceso formativo, proyectos, bitácoras y evidencias.

### 👩‍🏫 Instructor

Realiza gestión y seguimiento de proyectos, grupos, bitácoras y procesos académicos asociados.

### 🧑‍🔬 Pasante

Apoya las actividades de seguimiento asignadas dentro del proceso formativo.

### ⚙️ Administrador

Gestiona usuarios, roles y elementos de la estructura académica del sistema.

---

## 💻 Versión web

BIOMIND WEB proporciona acceso desde navegador a funcionalidades del ecosistema BIOMIND.

La versión web utiliza los servicios en la nube del proyecto para acceder a la información correspondiente, permitiendo mantener coherencia entre los datos utilizados por las diferentes interfaces.

Conceptualmente:

```text
       BIOMIND MÓVIL
              │
              │
              ▼
       SERVICIOS EN LA NUBE
        Firebase / Storage
              ▲
              │
              │
        BIOMIND WEB
```

Esto permite que la información no dependa exclusivamente del dispositivo desde el cual se consulta.

---

## ✨ Funcionalidades

Según el rol y los permisos correspondientes, BIOMIND WEB permite trabajar con funcionalidades relacionadas con:

- Autenticación de usuarios.
- Consulta de información académica.
- Gestión de usuarios.
- Gestión de roles.
- Gestión de fichas.
- Gestión de proyectos.
- Consulta y seguimiento de información.
- Acceso a los módulos habilitados para cada tipo de usuario.

---

## 🔥 Firebase

Firebase forma parte de los servicios principales utilizados por BIOMIND WEB.

### Firebase Authentication

Se utiliza para procesos relacionados con la identidad y autenticación de los usuarios.

### Cloud Firestore

Se utiliza como base de datos para almacenar y consultar información estructurada del sistema.

Entre los datos manejados por el ecosistema BIOMIND se encuentran:

- Usuarios.
- Roles.
- Programas.
- Fichas.
- Proyectos.
- Grupos.
- Competencias.
- Resultados de aprendizaje.
- Bitácoras.
- Observaciones.
- Tareas.

---

## 🏗️ Arquitectura general

La versión web funciona como una interfaz cliente conectada a los servicios utilizados por BIOMIND.

```text
                     USUARIO
                        │
                        ▼
                   BIOMIND WEB
                        │
                        ▼
                 SERVICIOS BIOMIND
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
           FIREBASE            STORAGE
              │                   │
       Auth + Firestore      Archivos asociados
```

La información almacenada en los servicios compartidos permite mantener continuidad entre los diferentes puntos de acceso al sistema.

---

## 📂 Estructura del repositorio

La estructura general del repositorio incluye:

```text
BIOMIND-WEB/
│
├── app/
├── assets/
├── scripts/
├── ui/
├── .env.example
├── .firebaserc
├── .gitignore
├── app.js
├── firebase.js
├── firebase.json
├── firestore.rules
├── index.html
└── README.md
```

### Carpetas principales

**`app/`**

Contiene elementos relacionados con la lógica y funcionamiento de la aplicación.

**`assets/`**

Contiene recursos utilizados por la interfaz.

**`ui/`**

Contiene elementos relacionados con la presentación e interfaz del sistema.

**`scripts/`**

Contiene scripts auxiliares utilizados por el proyecto.

---

## 🛠️ Tecnologías y servicios

| Tecnología / servicio | Uso |
|---|---|
| JavaScript | Lógica de la aplicación web |
| HTML | Estructura de la interfaz web |
| Firebase Authentication | Autenticación de usuarios |
| Cloud Firestore | Base de datos |
| Firebase | Configuración y servicios compartidos |
| Vercel | Despliegue de la versión web |

---

## 🚀 Ejecución local

### Requisitos

Se recomienda contar con:

- Git.
- Node.js y npm cuando sean requeridos por las herramientas del proyecto.
- Navegador web actualizado.
- Configuración correspondiente de Firebase.

### Clonar el repositorio

```bash
git clone https://github.com/MariaFerr-dev/BIOMIND-WEB.git
```

### Ingresar al proyecto

```bash
cd BIOMIND-WEB
```

### Configurar las variables de entorno

Configura las variables necesarias tomando como referencia el archivo:

```text
.env.example
```

Las credenciales reales no deben publicarse directamente en el repositorio.

---

## 🔐 Configuración

El repositorio contiene archivos relacionados con la configuración de Firebase, entre ellos:

```text
firebase.js
firebase.json
firestore.rules
.firebaserc
```

Estos permiten establecer la conexión y configuración correspondiente de los servicios utilizados por la aplicación.

---

## 🌐 Despliegue

La versión web de BIOMIND se encuentra desplegada mediante Vercel.

El despliegue permite acceder a la interfaz desde un navegador compatible sin necesidad de instalar la aplicación móvil.

La versión web complementa la aplicación Android y utiliza servicios compartidos del ecosistema BIOMIND.

---

## 🔄 Relación con BIOMIND móvil

BIOMIND WEB forma parte del mismo proyecto formativo que la aplicación móvil BIOMIND.

La aplicación móvil tiene especial importancia en el contexto de las prácticas de laboratorio debido a sus funciones de asistencia, inteligencia artificial y apoyo por voz.

La versión web proporciona un punto de acceso complementario para la consulta y gestión de información.

```text
                 BIOMIND
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
 APLICACIÓN MÓVIL          VERSIÓN WEB
 React Native + Expo       Navegador
        │                       │
        └───────────┬───────────┘
                    ▼
            DATOS COMPARTIDOS
```

---

## 🧪 Pruebas

Durante el desarrollo se realizaron validaciones relacionadas con:

- Inicio de sesión.
- Acceso según rol.
- Navegación.
- Visualización de información.
- Gestión de datos.
- Integración con Firebase.
- Comportamiento de la interfaz.

---

## 📚 Contexto académico

BIOMIND fue desarrollado como proyecto formativo del programa:

**Tecnólogo en Análisis y Desarrollo de Software (ADSO)**  
**Servicio Nacional de Aprendizaje — SENA**

El proyecto está orientado al apoyo de los procesos formativos desarrollados en el laboratorio de biotecnología vegetal.

---

## 👩‍💻 Equipo del proyecto

- **María Fernanda Rojas**
- **Aslhy Casteblanco**
- **Sarah Castro**

**Programa:** Análisis y Desarrollo de Software (ADSO)

---

## 📱 Repositorio principal

El desarrollo móvil y los componentes principales del proyecto BIOMIND se encuentran en el repositorio principal:

**GitHub:** `aslhyy/BIOMIND`

---

## ⚠️ Consideraciones

- Algunas funcionalidades requieren conexión a internet.
- El acceso depende de los permisos correspondientes al rol del usuario.
- La disponibilidad de información depende de los servicios en la nube utilizados por BIOMIND.
- La versión web complementa la aplicación móvil y forma parte del mismo ecosistema de información.

---

## 🌱 BIOMIND

### Trazabilidad para avanzar
