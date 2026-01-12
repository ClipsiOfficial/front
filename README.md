# Clipsi - Frontend

App para gestión y análisis de noticias recopiladas via clipping con búsqueda inteligente y estadísticas.

## 🚀 Stack Técnico

- **Angular 20** - Framework principal (standalone components)
- **TailwindCSS v4** - Estilos y temas (light/dark)
- **Angular Material 20** - Componentes y iconos
- **TypeScript** - Tipado estricto
- **Angular Signals** - Gestión de estado

## 📦 Instalación

Instalar dependencias con **pnpm**
```bash
pnpm install
```

## 🏃 Desarrollo

```bash
pnpm start
```
Abre http://localhost:4200/ - La app se recarga automáticamente al guardar cambios.

## 🏗️ Arquitectura

```
src/app/
├── pages/              # Rutas principales
│   ├── results/        # Búsqueda y resultados
│   ├── my-news/        # Noticias seleccionadas
│   └── statistics/     # Análisis y estadísticas
├── components/         # Componentes reutilizables
│   ├── header/
│   ├── news-card/
│   ├── news-table/
│   └── news-filters/
├── services/           # Lógica de negocio
├── models/             # Interfaces TypeScript
└── app.routes.ts       # Configuración de rutas
```

## 🏢 Características

- ✅ Búsqueda de noticias por palabras clave
- ✅ Filtrado por categoría y fuente
- ✅ Vista de tabla y cards
- ✅ Edición de noticias con IA
- ✅ Estadísticas y análisis
- ✅ Exportación CSV
- ✅ Temas claro/oscuro
- ✅ Diseño responsive

## 📊 Build & Despliegue

```bash
pnpm run build

# Output: dist/
```

## 📝 Configuración

- `angular.json` - Configuración Angular
- `tsconfig.json` - Configuración TypeScript
- `tailwind.config.js` - Temas y variables
- `custom-theme.scss` - Tema Material Design

## Equipo

El equipo esta compuesto por:
- Ariadna Mantilla
- Eulalia Peiret
- Ivan Moreno
- Laura Apolzan
