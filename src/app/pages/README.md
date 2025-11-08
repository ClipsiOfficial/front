# Pages

Esta carpeta contiene las páginas principales de la aplicación, organizadas por rutas.

## Estructura

```
pages/
├── results/          # Página de resultados de búsqueda
│   ├── results.page.ts
│   └── results.page.html
├── my-news/          # Página de noticias guardadas
│   ├── my-news.page.ts
│   └── my-news.page.html
├── statistics/       # Página de estadísticas
│   ├── statistics.page.ts
│   └── statistics.page.html
└── index.ts          # Exports centralizados
```

## Rutas

Las rutas están definidas en `app.routes.ts`:

- `/` → Redirige a `/results`
- `/results` → Página de resultados con filtros y tabla de noticias
- `/my-news` → Página con las noticias seleccionadas por el usuario
- `/statistics` → Página de análisis y estadísticas de las noticias seleccionadas

## Características

- **Lazy Loading**: Cada página se carga bajo demanda usando `loadComponent`
- **Standalone Components**: No requieren NgModules
- **TypeScript Strict**: Tipado estricto para mayor seguridad
- **Signals**: Uso de Angular Signals para gestión de estado reactivo

## Convenciones de Nomenclatura

- Archivos de página: `*.page.ts`
- Templates: `*.page.html`
- Clases de componente: `*Page` (sin sufijo "Component")

Esto diferencia claramente las páginas de los componentes reutilizables ubicados en `/components`.
