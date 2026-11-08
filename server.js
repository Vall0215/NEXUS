const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(express.json({ limit: "30kb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes. Intenta nuevamente más tarde." }
});
app.use("/api", apiLimiter);

const validCoordinate = (value, min, max) =>
  Number.isFinite(value) && value >= min && value <= max;

function dateString(date) {
  return date.toISOString().slice(0, 10).replaceAll("-", "");
}

function parsePowerSeries(series) {
  return Object.entries(series || {})
    .filter(([, value]) => Number.isFinite(Number(value)) && Number(value) > -900)
    .map(([date, value]) => ({ date, value: Number(value) }));
}

function summarize(values) {
  if (!values.length) return null;
  const total = values.reduce((sum, item) => sum + item.value, 0);
  return Number((total / values.length).toFixed(2));
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "NEXUS API",
    timestamp: new Date().toISOString()
  });
});

/**
 * Daily NASA POWER point data.
 * Solar radiation: ALLSKY_SFC_SW_DWN (kWh/m²/day)
 * Air temperature: T2M (°C)
 */
app.get("/api/energy-data", async (req, res) => {
  const latitude = Number(req.query.latitude);
  const longitude = Number(req.query.longitude);

  if (
    !validCoordinate(latitude, -90, 90) ||
    !validCoordinate(longitude, -180, 180)
  ) {
    return res.status(400).json({
      error: "Debes proporcionar latitud y longitud válidas."
    });
  }

  const endDate = req.query.end || dateString(new Date(Date.now() - 2 * 86400000));
  const defaultStart = new Date();
  defaultStart.setUTCDate(defaultStart.getUTCDate() - 31);
  const startDate = req.query.start || dateString(defaultStart);

  if (!/^\d{8}$/.test(startDate) || !/^\d{8}$/.test(endDate) || startDate > endDate) {
    return res.status(400).json({
      error: "El rango de fechas debe usar YYYYMMDD y tener un inicio anterior al final."
    });
  }

  const url = new URL("https://power.larc.nasa.gov/api/temporal/daily/point");
  url.search = new URLSearchParams({
    parameters: "ALLSKY_SFC_SW_DWN,T2M",
    community: "RE",
    longitude: String(longitude),
    latitude: String(latitude),
    start: startDate,
    end: endDate,
    "time-standard": "UTC",
    format: "JSON"
  }).toString();

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) {
      throw new Error(`NASA POWER respondió con HTTP ${response.status}`);
    }

    const payload = await response.json();
    const parameters = payload?.properties?.parameter || {};
    const solar = parsePowerSeries(parameters.ALLSKY_SFC_SW_DWN);
    const temperature = parsePowerSeries(parameters.T2M);

    if (!solar.length && !temperature.length) {
      return res.status(502).json({
        error: "NASA POWER no devolvió datos para la ubicación y el periodo seleccionados."
      });
    }

    res.json({
      source: "NASA POWER",
      community: "RE",
      coordinates: { latitude, longitude },
      period: { start: startDate, end: endDate, timeStandard: "UTC" },
      units: {
        solarRadiation: "kWh/m²/day",
        temperature: "°C"
      },
      summary: {
        averageDailySolarRadiation: summarize(solar),
        averageTemperature: summarize(temperature)
      },
      daily: {
        solarRadiation: solar,
        temperature
      },
      metadata: {
        title: payload?.header?.title || "NASA POWER Daily Point API",
        apiVersion: payload?.header?.api_version || null,
        messages: payload?.messages || []
      }
    });
  } catch (error) {
    console.error("NASA POWER request failed:", error.message);
    res.status(502).json({
      error: "No fue posible consultar NASA POWER en este momento.",
      detail: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

/**
 * AI provider adapter.
 * Configure an OpenAI-compatible Chat Completions endpoint through environment variables.
 * No API key is ever sent to the browser.
 */
app.post("/api/copilot", async (req, res) => {
  const { question, context = {} } = req.body || {};

  if (typeof question !== "string" || !question.trim() || question.length > 2000) {
    return res.status(400).json({
      error: "Escribe una pregunta de máximo 2.000 caracteres."
    });
  }

  const { AI_API_URL, AI_API_KEY, AI_MODEL } = process.env;
  if (!AI_API_URL || !AI_API_KEY || !AI_MODEL) {
    return res.status(503).json({
      error: "El Copiloto IA todavía no está configurado. Falta definir el proveedor y sus credenciales."
    });
  }

  try {
    const aiResponse = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`
      },
      body: JSON.stringify({
        model: AI_MODEL,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: "Eres NEXUS, un asistente de inteligencia y planificación energética. Explica los datos con claridad, distingue datos observados de estimaciones y nunca inventes mediciones, ahorros ni retornos. NASA POWER aporta datos ambientales, no mide el consumo eléctrico del usuario. Si falta información, solicítala. No presentes una simulación preliminar como cotización o estudio de ingeniería definitivo."
          },
          {
            role: "user",
            content: `Contexto energético disponible:\n${JSON.stringify(context).slice(0, 10000)}\n\nPregunta del usuario:\n${question.trim()}`
          }
        ]
      }),
      signal: AbortSignal.timeout(45000)
    });

    if (!aiResponse.ok) {
      throw new Error(`El proveedor de IA respondió con HTTP ${aiResponse.status}`);
    }

    const data = await aiResponse.json();
    const answer = data?.choices?.[0]?.message?.content;

    if (!answer) throw new Error("El proveedor de IA no devolvió una respuesta válida.");

    res.json({ answer, model: AI_MODEL });
  } catch (error) {
    console.error("Copilot request failed:", error.message);
    res.status(502).json({
      error: "No fue posible obtener una respuesta del Copiloto.",
      detail: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Serve the existing frontend from the same application.
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "Ruta API no encontrada." });
  }
  res.sendFile(path.join(__dirname, "dist", "index.html"), (error) => {
    if (error) next(error);
  });
});

app.listen(PORT, () => {
  console.log(`NEXUS server running on port ${PORT}`);
});
