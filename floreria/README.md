# 🌸 Proyecto Florería

## 👥 Integrantes
* **Pier Villacorta**
* **Elizabeth Troncoso**

## 🛠️ Tecnologías Utilizadas
* **React** + **Vite**
* **TypeScript** / **JavaScript**
* **TailwindCSS**

---

## 🏗️ Arquitectura Actual del Estado Global

El sistema gestiona el estado global del **Carrito de compras** y del **Usuario** mediante la combinación de **`useContext`** y una función **`reducer`** (`useReducer`).

* **`useContext`:** Centraliza el acceso al estado en toda la aplicación, eliminando el *prop drilling*.
* **`useReducer`:** Controla las mutaciones de estado complejas (agregar productos, modificar cantidades, autenticación) a través de acciones puras e inmutables.


### 1. Migración a Zustand 🐻
Se reemplazará la arquitectura de `useContext` + `reducer` por **Zustand** para optimizar el desarrollo:
* **Mayor rendimiento:** Evita re-renders innecesarios en componentes que no consumen propiedades específicas.
* **Menos Boilerplate:** Reduce las líneas de código al eliminar la necesidad de envolver la aplicación en múltiples *Providers*.
* **Sintaxis limpia:** Integración nativa y simplificada con TypeScript.

### 2. Integración de Base de Datos 🗄️
Se añadirá una capa de persistencia para transformar la aplicación de estática a dinámica:
* **Persistencia de sesiones:** Registro y login de usuarios real.
* **Sincronización del carrito:** Guardado automático de productos en la cuenta del usuario.
* **Gestión de inventario:** Control de stock de flores y procesamiento de pedidos en tiempo real.




This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
