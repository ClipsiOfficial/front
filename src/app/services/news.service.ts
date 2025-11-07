import { Injectable, signal, computed } from '@angular/core';
import { NewsItem, FilterState } from '../models/news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  // All available news
  private readonly allNews: NewsItem[] = [
    {
      id: 1,
      title: 'Innovación tecnológica en el sector empresarial',
      source: 'El Economista',
      date: '2025-10-10',
      excerpt:
        'Las empresas españolas apuestan por la transformación digital para mejorar su competitividad en el mercado global...',
      category: 'Tecnología',
      link: 'https://example.com/noticia-1',
      views: 1250,
      exportDate: '2025-10-20',
    },
    {
      id: 2,
      title: 'Nuevas regulaciones en el mercado financiero',
      source: 'Expansión',
      date: '2025-10-09',
      excerpt:
        'El gobierno anuncia cambios en la normativa que afectará a las entidades bancarias y de inversión durante el próximo año fiscal...',
      category: 'Finanzas',
      link: 'https://example.com/noticia-2',
      views: 2100,
      exportDate: '2025-10-20',
    },
    {
      id: 3,
      title: 'El sector turístico muestra señales de recuperación',
      source: 'La Vanguardia',
      date: '2025-10-08',
      excerpt:
        'Los datos del tercer trimestre reflejan un aumento del 15% en la ocupación hotelera respecto al mismo período del año anterior...',
      category: 'Turismo',
      link: 'https://example.com/noticia-3',
      views: 890,
      exportDate: '2025-10-19',
    },
    {
      id: 4,
      title: 'Sostenibilidad empresarial: más que una tendencia',
      source: 'Cinco Días',
      date: '2025-10-07',
      excerpt:
        'Las compañías integran criterios ESG en sus estrategias de negocio como respuesta a las demandas de inversores y consumidores...',
      category: 'Sostenibilidad',
      link: 'https://example.com/noticia-4',
      views: 1540,
      exportDate: '2025-10-19',
    },
    {
      id: 5,
      title: 'La inteligencia artificial revoluciona el sector sanitario',
      source: 'El País',
      date: '2025-10-06',
      excerpt:
        'Nuevas herramientas de IA permiten diagnósticos más precisos y tratamientos personalizados para los pacientes...',
      category: 'Tecnología',
      link: 'https://example.com/noticia-5',
      views: 3200,
      exportDate: '2025-10-18',
    },
    {
      id: 6,
      title: 'Crecimiento del comercio electrónico en España',
      source: 'Expansión',
      date: '2025-10-05',
      excerpt:
        'El comercio online registra un incremento del 20% interanual, impulsado por la mejora de la logística y las pasarelas de pago...',
      category: 'Economía',
      link: 'https://example.com/noticia-6',
      views: 1780,
      exportDate: '2025-10-18',
    },
    {
      id: 7,
      title: 'Nuevas políticas de teletrabajo en las empresas',
      source: 'El Economista',
      date: '2025-10-04',
      excerpt:
        'Las organizaciones adaptan sus modelos de trabajo híbrido para atraer y retener talento en un mercado laboral competitivo...',
      category: 'Recursos Humanos',
      link: 'https://example.com/noticia-7',
      views: 1420,
      exportDate: '2025-10-17',
    },
    {
      id: 8,
      title: 'Inversiones en energías renovables alcanzan récord histórico',
      source: 'Cinco Días',
      date: '2025-10-03',
      excerpt:
        'España lidera en Europa la inversión en proyectos solares y eólicos, con más de 15.000 millones de euros comprometidos...',
      category: 'Sostenibilidad',
      link: 'https://example.com/noticia-8',
      views: 2350,
      exportDate: '2025-10-17',
    },
    {
      id: 9,
      title: 'El mercado inmobiliario muestra signos de estabilización',
      source: 'La Vanguardia',
      date: '2025-10-02',
      excerpt:
        'Los precios de la vivienda se mantienen estables tras dos años de subidas continuas, según datos del último trimestre...',
      category: 'Inmobiliario',
      link: 'https://example.com/noticia-9',
      views: 960,
      exportDate: '2025-10-16',
    },
    {
      id: 10,
      title: 'Blockchain aplicado a la cadena de suministro',
      source: 'El País',
      date: '2025-10-01',
      excerpt:
        'Empresas logísticas implementan tecnología blockchain para mejorar la trazabilidad y transparencia en sus operaciones...',
      category: 'Tecnología',
      link: 'https://example.com/noticia-10',
      views: 1890,
      exportDate: '2025-10-16',
    },
    {
      id: 11,
      title: 'Startups españolas captan récord de inversión en 2025',
      source: 'El Economista',
      date: '2025-09-30',
      excerpt:
        'El ecosistema emprendedor español alcanza cifras históricas con más de 2.000 millones de euros captados en el primer semestre...',
      category: 'Economía',
      link: 'https://example.com/noticia-11',
      views: 1650,
      exportDate: '2025-10-15',
    },
    {
      id: 12,
      title: 'Cambios en la legislación laboral para 2026',
      source: 'Cinco Días',
      date: '2025-09-29',
      excerpt:
        'El Congreso aprueba reformas que afectarán a contratos temporales y convenios colectivos desde enero del próximo año...',
      category: 'Recursos Humanos',
      link: 'https://example.com/noticia-12',
      views: 2450,
      exportDate: '2025-10-15',
    },
    {
      id: 13,
      title: 'La inflación se modera por tercer mes consecutivo',
      source: 'Expansión',
      date: '2025-09-28',
      excerpt:
        'Los datos del INE muestran una desaceleración en los precios al consumidor, situándose en el 2.8% interanual...',
      category: 'Finanzas',
      link: 'https://example.com/noticia-13',
      views: 1980,
      exportDate: '2025-10-14',
    },
    {
      id: 14,
      title: 'Nuevas rutas aéreas conectan España con América Latina',
      source: 'La Vanguardia',
      date: '2025-09-27',
      excerpt:
        'Tres aerolíneas anuncian vuelos directos que potenciarán el turismo y comercio entre ambos continentes...',
      category: 'Turismo',
      link: 'https://example.com/noticia-14',
      views: 1120,
      exportDate: '2025-10-14',
    },
    {
      id: 15,
      title: 'Ciberseguridad: prioridad en la agenda empresarial',
      source: 'El País',
      date: '2025-09-26',
      excerpt:
        'Los ataques informáticos aumentan un 40% y las compañías duplican su inversión en protección de datos...',
      category: 'Tecnología',
      link: 'https://example.com/noticia-15',
      views: 2890,
      exportDate: '2025-10-13',
    },
    {
      id: 16,
      title: 'El precio de la vivienda sube un 6% en ciudades principales',
      source: 'La Vanguardia',
      date: '2025-09-25',
      excerpt:
        'Madrid y Barcelona lideran el incremento de precios mientras la oferta de vivienda nueva sigue siendo limitada...',
      category: 'Inmobiliario',
      link: 'https://example.com/noticia-16',
      views: 1740,
      exportDate: '2025-10-13',
    },
    {
      id: 17,
      title: 'Economía circular: empresas reducen residuos un 30%',
      source: 'Cinco Días',
      date: '2025-09-24',
      excerpt:
        'Iniciativas de reciclaje y reutilización muestran resultados positivos en sectores industriales clave...',
      category: 'Sostenibilidad',
      link: 'https://example.com/noticia-17',
      views: 1350,
      exportDate: '2025-10-12',
    },
    {
      id: 18,
      title: 'Bancos centrales mantienen tipos de interés estables',
      source: 'Expansión',
      date: '2025-09-23',
      excerpt:
        'El BCE decide no modificar su política monetaria a la espera de más datos sobre la economía europea...',
      category: 'Finanzas',
      link: 'https://example.com/noticia-18',
      views: 2230,
      exportDate: '2025-10-12',
    },
    {
      id: 19,
      title: 'Automatización y empleo: el debate continúa',
      source: 'El Economista',
      date: '2025-09-22',
      excerpt:
        'Expertos analizan el impacto de la robotización en el mercado laboral español y las medidas de adaptación necesarias...',
      category: 'Recursos Humanos',
      link: 'https://example.com/noticia-19',
      views: 1590,
      exportDate: '2025-10-11',
    },
    {
      id: 20,
      title: 'Movilidad eléctrica: ventas de coches EV crecen un 45%',
      source: 'El País',
      date: '2025-09-21',
      excerpt:
        'Las matriculaciones de vehículos eléctricos baten récords gracias a nuevos incentivos y ampliación de infraestructura de carga...',
      category: 'Tecnología',
      link: 'https://example.com/noticia-20',
      views: 2560,
      exportDate: '2025-10-11',
    },
    {
      id: 21,
      title: 'Exportaciones españolas alcanzan máximo histórico',
      source: 'Expansión',
      date: '2025-09-20',
      excerpt:
        'Las ventas al exterior superan los 350.000 millones de euros anuales, impulsadas por el sector agroalimentario y tecnológico...',
      category: 'Economía',
      link: 'https://example.com/noticia-21',
      views: 1820,
      exportDate: '2025-10-10',
    },
    {
      id: 22,
      title: 'Turismo rural: crece un 25% en temporada baja',
      source: 'La Vanguardia',
      date: '2025-09-19',
      excerpt:
        'Las reservas en casas rurales y hoteles de interior se disparan gracias a la promoción de destinos alternativos...',
      category: 'Turismo',
      link: 'https://example.com/noticia-22',
      views: 1290,
      exportDate: '2025-10-10',
    },
    {
      id: 23,
      title: 'Fondos de pensiones: rentabilidad media del 8%',
      source: 'Cinco Días',
      date: '2025-09-18',
      excerpt:
        'Los planes de pensiones privados registran buenos resultados en el último ejercicio fiscal gracias a la diversificación...',
      category: 'Finanzas',
      link: 'https://example.com/noticia-23',
      views: 1970,
      exportDate: '2025-10-09',
    },
    {
      id: 24,
      title: 'Formación continua: las empresas invierten más en talento',
      source: 'El Economista',
      date: '2025-09-17',
      excerpt:
        'Los programas de capacitación y upskilling aumentan un 35% como estrategia de retención de empleados cualificados...',
      category: 'Recursos Humanos',
      link: 'https://example.com/noticia-24',
      views: 1460,
      exportDate: '2025-10-09',
    },
    {
      id: 25,
      title: 'Energía solar: España instala 5GW en nuevo parque fotovoltaico',
      source: 'El País',
      date: '2025-09-16',
      excerpt:
        'El mayor complejo solar de Europa comienza operaciones en Extremadura, generando energía para 2 millones de hogares...',
      category: 'Sostenibilidad',
      link: 'https://example.com/noticia-25',
      views: 3150,
      exportDate: '2025-10-08',
    },
  ];

  // State signals
  filters = signal<FilterState>({
    searchTerm: '',
    keywords: '',
    sources: [],
    categories: [],
    dateFrom: '',
    dateTo: '',
  });

  keywords = signal<string[]>([]);
  selectedNewsIds = signal<number[]>([]);

  // Computed signals
  filteredNews = computed(() => {
    const currentFilters = this.filters();
    const currentKeywords = this.keywords();

    return this.allNews.filter((news) => {
      // Filter by search term
      if (currentFilters.searchTerm) {
        const searchTerm = currentFilters.searchTerm.toLowerCase();
        const matchesSearch =
          news.title.toLowerCase().includes(searchTerm) ||
          news.excerpt.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Filter by keywords from input (deprecated, keeping for backwards compatibility)
      if (currentFilters.keywords) {
        const keywords = currentFilters.keywords.toLowerCase();
        const matchesKeywords =
          news.title.toLowerCase().includes(keywords) ||
          news.excerpt.toLowerCase().includes(keywords);
        if (!matchesKeywords) return false;
      }

      // Filter by saved keywords (only if there are keywords)
      if (currentKeywords.length > 0) {
        const matchesAnyKeyword = currentKeywords.some(
          (keyword) =>
            news.title.toLowerCase().includes(keyword.toLowerCase()) ||
            news.excerpt.toLowerCase().includes(keyword.toLowerCase())
        );
        if (!matchesAnyKeyword) return false;
      }

      // Filter by source
      if (currentFilters.sources.length > 0 && !currentFilters.sources.includes(news.source)) {
        return false;
      }

      // Filter by category
      if (
        currentFilters.categories.length > 0 &&
        !currentFilters.categories.includes(news.category)
      ) {
        return false;
      }

      // Filter by date from
      if (currentFilters.dateFrom && news.date < currentFilters.dateFrom) {
        return false;
      }

      // Filter by date to
      if (currentFilters.dateTo && news.date > currentFilters.dateTo) {
        return false;
      }

      return true;
    });
  });

  selectedNews = computed(() => {
    const selectedIds = this.selectedNewsIds();
    return this.allNews.filter((news) => selectedIds.includes(news.id));
  });

  // Methods
  toggleNewsSelection(id: number): void {
    this.selectedNewsIds.update((ids) =>
      ids.includes(id) ? ids.filter((newsId) => newsId !== id) : [...ids, id]
    );
  }

  updateFilters(filters: FilterState): void {
    this.filters.set(filters);
  }

  addKeyword(keyword: string): void {
    const trimmed = keyword.trim();
    if (trimmed && !this.keywords().includes(trimmed)) {
      this.keywords.update((keywords) => [...keywords, trimmed]);
    }
  }

  removeKeyword(keyword: string): void {
    this.keywords.update((keywords) => keywords.filter((k) => k !== keyword));
  }

  setKeywords(keywords: string[]): void {
    this.keywords.set(keywords);
  }

  removeFromSelected(id: number): void {
    this.selectedNewsIds.update((ids) => ids.filter((newsId) => newsId !== id));
  }

  getAllNews(): NewsItem[] {
    return [...this.allNews];
  }
}
