# NEXUS — Inteligencia y planificación energética

NEXUS ayuda a hogares y empresas a explorar condiciones ambientales, evaluar escenarios energéticos y recibir orientación para tomar decisiones antes de invertir.

## Stack

- Frontend: HTML, CSS y JavaScript.
- Mapa: Leaflet + OpenStreetMap.
- Backend: Node.js 20+ y Express.
- Datos ambientales: NASA POWER Daily Point API.
- Copiloto: adaptador de servidor para un proveedor compatible con OpenAI Chat Completions.

## Ejecutar localmente

1. Instala Node.js 20 o superior.
2. Copia `.env.example` a `.env`.
3. Ejecuta `npm install`.
4. Ejecuta `npm run dev`.
5. Abre http://localhost:3000.

## API

### Estado del servicio

`GET /api/health`

### Datos NASA POWER

`GET /api/energy-data?latitude=10.9685&longitude=-74.7813`

Opcionalmente acepta `start` y `end` en formato YYYYMMDD. Si no se envían, consulta una ventana reciente de aproximadamente 30 días, terminando dos días antes de la fecha actual para reducir el riesgo de solicitar datos aún no publicados.

Variables incluidas:

- `ALLSKY_SFC_SW_DWN`: radiación solar diaria, kWh/m²/day.
- `T2M`: temperatura del aire a 2 metros, °C.

La API devuelve series diarias, promedios, coordenadas, periodo, unidades y metadatos. Los datos NASA POWER son estimaciones de rejilla/modelo para la ubicación, no mediciones de un sensor instalado en el inmueble.

### Copiloto

`POST /api/copilot`

Body JSON:

```json
{
  "question": "¿Qué significa la radiación solar de esta ubicación?",
  "context": {
    "coordinates": { "latitude": 10.9685, "longitude": -74.7813 },
    "solarRadiationAverage": 5.1
  }
}
```

El endpoint requiere `AI_API_URL`, `AI_API_KEY` y `AI_MODEL` configurados como variables secretas en el servidor. No pongas claves privadas en archivos JavaScript del navegador.

## Despliegue

La aplicación puede desplegarse en un servicio Node.js como Render, Railway o similar:

- Build command: `npm install`
- Start command: `npm start`
- Runtime: Node.js 20+
- Añade las variables del proveedor de IA desde el panel de secretos del hosting.
- No subas el archivo `.env`.

## Estado del desarrollo

Esta rama incorpora la base del backend, la consulta NASA POWER y el adaptador seguro del Copiloto. La siguiente etapa es conectar el frontend actual a estos endpoints y reemplazar las fórmulas demostrativas del mapa y simulador por flujos de datos identificados y cálculos transparentes.
