function irAlMapa() {
    document.getElementById("mapa").scrollIntoView({
        behavior: "smooth"
    });
}
function irAlSimulador() {
    document.getElementById("simulador").scrollIntoView({
        behavior: "smooth"
    });
}
function mostrarDemo() {
    alert(
        "NEXUS analiza una ubicación, simula escenarios de energía renovable y genera recomendaciones mediante su Copiloto Energético."
    );
}
document.addEventListener("DOMContentLoaded", function () {
    if (typeof L === "undefined") {
        console.error("NEXUS: Leaflet no se pudo cargar.");
        return;
    }
    const mapElement = document.getElementById("map");
    if (!mapElement) {
        console.error("NEXUS: No se encontró el elemento #map.");
        return;
    }
    const initialLocation = [10.9685, -74.7813];
    const nexusMap = L.map("map").setView(initialLocation, 12);
    L.tileLayer(
        "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        {
            attribution: 'Tiles courtesy of HOT &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
            subdomains: "abc",
            maxZoom: 19
        }
    ).addTo(nexusMap);
    let nexusMarker = L.marker(initialLocation).addTo(nexusMap);
    let latestRequestId = 0;
    nexusMarker.bindPopup("<strong>NEXUS</strong><br>Barranquilla, Atlántico").openPopup();
    function updateText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }
    function readAnnualValue(parameter) {
        const annual = parameter && (parameter.ANN ?? parameter.ann ?? parameter.ANNUAL);
        if (annual !== undefined && annual !== null && Number.isFinite(Number(annual)) && Number(annual) > -900) {
            return Number(annual);
        }
        const values = [];
        function collect(value) {
            if (typeof value === "number" || (typeof value === "string" && value.trim() !== "")) {
                const number = Number(value);
                if (Number.isFinite(number) && number > -900) values.push(number);
                return;
            }
            if (value && typeof value === "object") {
                Object.values(value).forEach(collect);
            }
        }
        collect(parameter);
        if (!values.length) throw new Error("NASA POWER no devolvió valores válidos para este punto.");
        return values.reduce((sum, value) => sum + value, 0) / values.length;
    }
    function classifySolarPotential(radiation) {
        if (radiation >= 5) {
            return { level: "ALTO", description: "Recurso solar promedio favorable" };
        }
        if (radiation >= 4) {
            return { level: "MEDIO", description: "Recurso solar promedio moderado" };
        }
        return { level: "BAJO", description: "Recurso solar promedio limitado" };
    }
    async function actualizarUbicacion(latitude, longitude) {
        const requestId = ++latestRequestId;
        updateText("locationName", `Lat ${latitude.toFixed(4)}, Lon ${longitude.toFixed(4)}`);
        updateText("solarRadiation", "…");
        updateText("temperature", "…");
        updateText("solarPotential", "…");
        updateText("potentialText", "Consultando NASA POWER…");
        updateText("nasaStatus", "Consultando datos para esta coordenada…");
        const params = new URLSearchParams({
            parameters: "ALLSKY_SFC_SW_DWN,T2M",
            community: "RE",
            longitude: longitude.toFixed(4),
            latitude: latitude.toFixed(4),
            format: "JSON"
        });
        const url = `https://power.larc.nasa.gov/api/temporal/climatology/point?${params.toString()}`;
        try {
            const response = await fetch(url, {
                headers: { Accept: "application/json" }
            });
            if (!response.ok) throw new Error(`NASA POWER respondió HTTP ${response.status}`);
            const payload = await response.json();
            const parameters = payload?.properties?.parameter;
            if (!parameters) {
                throw new Error(payload?.messages?.join?.(" ") || "La respuesta de NASA POWER no contiene los parámetros solicitados.");
            }
            const radiation = readAnnualValue(parameters.ALLSKY_SFC_SW_DWN);
            const temperature = readAnnualValue(parameters.T2M);
            if (requestId !== latestRequestId) return;
            const potential = classifySolarPotential(radiation);
            updateText("solarRadiation", radiation.toFixed(2));
            updateText("temperature", temperature.toFixed(1));
            updateText("solarPotential", potential.level);
            updateText("potentialText", potential.description);
            updateText("nasaStatus", "Promedio climatológico de NASA POWER para el punto seleccionado.");
        } catch (error) {
            if (requestId !== latestRequestId) return;
            console.error("NEXUS: error consultando NASA POWER:", error);
            updateText("solarRadiation", "—");
            updateText("temperature", "—");
            updateText("solarPotential", "—");
            updateText("potentialText", "No fue posible calcular el potencial.");
            updateText("nasaStatus", "Datos no disponibles. Verifica la conexión e inténtalo de nuevo.");
        }
    }
    nexusMap.on("click", function (event) {
        const { lat, lng } = event.latlng;
        if (nexusMarker) nexusMap.removeLayer(nexusMarker);
        nexusMarker = L.marker([lat, lng]).addTo(nexusMap);
        nexusMarker.bindPopup(
            `<strong>Ubicación seleccionada</strong><br><br>Latitud: ${lat.toFixed(4)}<br>Longitud: ${lng.toFixed(4)}`
        ).openPopup();
        actualizarUbicacion(lat, lng);
    });
    actualizarUbicacion(initialLocation[0], initialLocation[1]);
    setTimeout(() => nexusMap.invalidateSize(), 500);
});
function actualizarSimulacion() {
    const panelesElement =
        document.getElementById("paneles");
    const bateriaElement =
        document.getElementById("bateria");
    if (!panelesElement) {
        return;
    }
    const paneles =
        Number(
            panelesElement.value
        );
    const bateria =
        Number(
            bateriaElement.value
        );
    document.getElementById(
        "panelValue"
    ).textContent =
        `${paneles} paneles`;
    let generacion =
        paneles * 52;
    if (bateria === 1) {
        generacion *= 1.05;
    }
    if (bateria === 2) {
        generacion *= 1.10;
    }
    generacion =
        Math.round(
            generacion
        );
    const ahorro =
        generacion * 550;
    let retorno =
        7 -
        (
            paneles * 0.12
        );
    if (bateria === 1) {
        retorno += 0.5;
    }
    if (bateria === 2) {
        retorno += 1;
    }
    retorno =
        Math.max(
            3,
            retorno
        );
    document.getElementById(
        "generacion"
    ).textContent =
        generacion.toLocaleString(
            "es-CO"
        );
    document.getElementById(
        "ahorro"
    ).textContent =
        "$" +
        Math.round(
            ahorro
        ).toLocaleString(
            "es-CO"
        );
    document.getElementById(
        "retorno"
    ).textContent =
        retorno.toFixed(1);
}
function analizarEscenario() {
    actualizarSimulacion();
    document.getElementById(
        "copiloto"
    ).scrollIntoView({
        behavior: "smooth"
    });
}
function enviarPregunta() {
    const input =
        document.getElementById(
            "copilotQuestion"
        );
    if (!input) {
        return;
    }
    const pregunta =
        input.value.trim();
    if (
        pregunta === ""
    ) {
        return;
    }
    const conversation =
        document.querySelector(
            ".conversation"
        );
    const userMessage =
        document.createElement(
            "div"
        );
    userMessage.className =
        "user-message";
    userMessage.textContent =
        pregunta;
    conversation.appendChild(
        userMessage
    );
    const aiMessage =
        document.createElement(
            "div"
        );
    aiMessage.className =
        "ai-message";
    aiMessage.innerHTML = `
        <strong>
            ✦ NEXUS
        </strong>
        <p>
            He analizado tu consulta
            dentro del escenario actual.
        </p>
        <p>
            ☀️ El potencial solar de la
            ubicación seleccionada es
            <b>favorable</b>.
        </p>
        <p>
            Te recomiendo comparar
            diferentes configuraciones
            de paneles antes de realizar
            una inversión.
        </p>
        <div class="recommendation">
            <span>
                RECOMENDACIÓN
            </span>
            <strong>
                Analizar diferentes escenarios
            </strong>
        </div>
    `;
    conversation.appendChild(
        aiMessage
    );
    input.value = "";
    conversation.scrollTop =
        conversation.scrollHeight;
}
document.addEventListener(
    "DOMContentLoaded",
    function () {
        actualizarSimulacion();
    }
);
/* NEXUS interaction polish: scroll reveals, header state and gentle 3D parallax */
document.addEventListener("DOMContentLoaded", function () {
    const reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealTargets = document.querySelectorAll(
        ".section-title, .map-container, .simulator, .copilot, .pricing-card, .payment-method"
    );
    revealTargets.forEach(function (element, index) {
        element.classList.add("nx-reveal");
        if (element.classList.contains("pricing-card")) {
            element.dataset.nxDelay = String((index % 4) + 1);
        }
    });
    if ("IntersectionObserver" in window && !reduceMotion) {
        const revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("nx-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -45px 0px" });
        revealTargets.forEach(function (element) {
            revealObserver.observe(element);
        });
    } else {
        revealTargets.forEach(function (element) {
            element.classList.add("nx-visible");
        });
    }
    const navbar = document.querySelector(".navbar");
    function updateNavbar() {
        if (navbar) navbar.classList.toggle("nx-scrolled", window.scrollY > 24);
    }
    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
    const scene = document.querySelector(".nexus-scene");
    if (scene && !reduceMotion && window.matchMedia("(pointer:fine)").matches) {
        const hero = document.querySelector(".hero-reimagined");
        if (hero) {
            hero.addEventListener("pointermove", function (event) {
                const bounds = hero.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                scene.style.transform =
                    "perspective(1200px) rotateY(" + (x * 2.4).toFixed(2) +
                    "deg) rotateX(" + (-y * 1.8).toFixed(2) + "deg)";
            });
            hero.addEventListener("pointerleave", function () {
                scene.style.transform = "";
            });
        }
    }
});
/* React Bits-inspired interactions, implemented without a React dependency */
document.addEventListener("DOMContentLoaded", function () {
    const reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const spotlightTargets = document.querySelectorAll(
        ".data-card, .result-card, .pricing-card, .map-data, .controls, .copilot"
    );
    spotlightTargets.forEach(function (card) {
        card.classList.add("nx-spotlight");
        if (reduceMotion || !window.matchMedia("(pointer:fine)").matches) return;
        card.addEventListener("pointermove", function (event) {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--nx-pointer-x", (event.clientX - rect.left) + "px");
            card.style.setProperty("--nx-pointer-y", (event.clientY - rect.top) + "px");
        });
    });
    /* Subtle count-up-style feedback whenever simulator metrics recalculate. */
    const metricTargets = document.querySelectorAll(".result-card strong, .data-card strong");
    if (!reduceMotion && "MutationObserver" in window) {
        const metricObserver = new MutationObserver(function (entries) {
            entries.forEach(function (entry) {
                const metric = entry.target;
                metric.classList.remove("nx-metric-pop");
                void metric.offsetWidth;
                metric.classList.add("nx-metric-pop");
            });
        });
        metricTargets.forEach(function (metric) {
            metricObserver.observe(metric, { childList: true, characterData: true, subtree: true });
        });
    }
});
/* Branched navigation interaction and Tech Text wordmark */
document.addEventListener("DOMContentLoaded", function () {
    const branchNav = document.querySelector(".nx-branch-nav");
    const branchToggle = document.querySelector(".nx-branch-toggle");
    if (branchNav && branchToggle) {
        const closeMenu = function () {
            branchNav.classList.remove("is-open");
            branchToggle.setAttribute("aria-expanded", "false");
        };
        branchToggle.addEventListener("click", function () {
            const opening = !branchNav.classList.contains("is-open");
            branchNav.classList.toggle("is-open", opening);
            branchToggle.setAttribute("aria-expanded", String(opening));
        });
        branchNav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });
        document.addEventListener("pointerdown", function (event) {
            if (!branchNav.contains(event.target)) closeMenu();
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
                branchToggle.focus();
            }
        });
    }
    const techWordmark = document.querySelector(".nx-tech-wordmark");
    if (techWordmark) {
        techWordmark.setAttribute("tabindex", "0");
        techWordmark.addEventListener("pointerenter", function () {
            techWordmark.classList.add("is-tech-active");
        });
        techWordmark.addEventListener("pointerleave", function () {
            techWordmark.classList.remove("is-tech-active");
        });
        techWordmark.addEventListener("focus", function () {
            techWordmark.classList.add("is-tech-active");
        });
        techWordmark.addEventListener("blur", function () {
            techWordmark.classList.remove("is-tech-active");
        });
    }
    document.querySelectorAll(".controls,.results,.result-card,.copilot,.pricing-card").forEach(function (panel) {
        panel.classList.add("nx-glass-surface");
    });
});
/* Active section state for the fixed icon rail. */
document.addEventListener("DOMContentLoaded", function () {
    const railLinks = Array.from(document.querySelectorAll(".nx-rail-link"));
    const sections = railLinks
        .map(link => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);
    if (!railLinks.length || !("IntersectionObserver" in window)) return;
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            railLinks.forEach(link => {
                const active = link.getAttribute("href") === "#" + entry.target.id;
                link.classList.toggle("is-active", active);
                if (active) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
            });
        });
    }, { rootMargin: "-35% 0px -50% 0px", threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
});
// Trigger the masked hero title after its initial hidden state has painted.
(function initNexusMaskedHeading() {
    const reveal = () => {
        const heading = document.querySelector(".nx-masked-heading");
        if (!heading) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            heading.classList.add("nx-mask-ready");
            return;
        }
        requestAnimationFrame(() => requestAnimationFrame(() => {
            heading.classList.add("nx-mask-ready");
        }));
    };
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", reveal, { once: true });
    } else {
        reveal();
    }
})();
// Pointer-following spotlight and gentle parallax inside the masked metallic hero title.
(function initMaskedHeadingSpotlight() {
    const setup = () => {
        const heading = document.querySelector(".nx-masked-heading");
        if (!heading || heading.dataset.spotlightReady) return;
        heading.dataset.spotlightReady = "true";
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        let frame = 0;
        let targetX = 50, targetY = 50;
        let currentX = 50, currentY = 50;
        let active = false;
        const paint = () => {
            frame = 0;
            currentX += (targetX - currentX) * 0.16;
            currentY += (targetY - currentY) * 0.16;
            heading.style.setProperty("--mh-x", currentX.toFixed(2) + "%");
            heading.style.setProperty("--mh-y", currentY.toFixed(2) + "%");
            if (Math.abs(targetX-currentX)>.15 || Math.abs(targetY-currentY)>.15) {
                frame = requestAnimationFrame(paint);
            }
        };
        heading.addEventListener("pointermove", event => {
            const rect = heading.getBoundingClientRect();
            targetX = Math.max(0,Math.min(100,((event.clientX-rect.left)/rect.width)*100));
            targetY = Math.max(0,Math.min(100,((event.clientY-rect.top)/rect.height)*100));
            if (!active) { active = true; heading.classList.add("nx-mask-pointer"); }
            if (!frame) frame = requestAnimationFrame(paint);
        });
        heading.addEventListener("pointerleave", () => {
            active = false;
            heading.classList.remove("nx-mask-pointer");
            targetX = 50; targetY = 50;
            if (!frame) frame = requestAnimationFrame(paint);
        });
    };
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setup, { once:true });
    } else setup();
})();