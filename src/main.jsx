import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("No se encontró #root para montar NEXUS.");

flushSync(() => createRoot(rootElement).render(<App />));
