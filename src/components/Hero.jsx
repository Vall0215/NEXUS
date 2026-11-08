const markup = `<section id="inicio" class="hero hero-reimagined">
            <div class="hero-backdrop"></div>
            <div class="hero-orbit hero-orbit-one"></div>
            <div class="hero-orbit hero-orbit-two"></div>

            <div class="hero-copy">
                <div class="badge"><span class="badge-pulse"></span> INTELIGENCIA ENERGÉTICA · NEXUS</div>
                <h1 class="nx-masked-heading" aria-label="El futuro energético se decide hoy.">
                    <span class="nx-mask-line"><span class="nx-mask-word">El futuro</span></span>
                    <span class="nx-mask-line"><span class="nx-mask-word nx-mask-word-2">energético</span></span>
                    <span class="nx-mask-line"><span class="nx-mask-word nx-mask-accent">se decide hoy.</span></span>
                </h1>
                <p class="hero-description">
                    Descubre el potencial de tu ubicación, explora escenarios renovables
                    y convierte información ambiental en decisiones de inversión más inteligentes.
                </p>
                <div class="hero-buttons">
                    <button class="primary-button" onclick="irAlMapa()">Explorar mi potencial <span>↗</span></button>
                    <button class="secondary-button" onclick="mostrarDemo()">Conocer NEXUS <span>▶</span></button>
                </div>
            </div>

            <div class="hero-art nexus-scene nx-energy-core" aria-label="Visualización tridimensional de un núcleo de energía solar con anillos orbitales">
                <div class="scene-halo"></div>

            </div>

            <div class="hero-bottomline">
                <span>UNA NUEVA FORMA DE PLANIFICAR LA ENERGÍA</span>
                <span class="scroll-cue">DESLIZA PARA EXPLORAR <b>↓</b></span>
            </div>
        </section>

        <div class="nx-energy-marquee" aria-label="NEXUS: energía, datos e inteligencia">
            <div class="nx-marquee-track">
                <div class="nx-marquee-group">
                    <span class="nx-marquee-item nx-marquee-brand">NEXUS <i>✳</i></span>
                    <span class="nx-marquee-item">ENERGÍA <b>✦</b></span>
                    <span class="nx-marquee-item">DATOS <b>✳</b></span>
                    <span class="nx-marquee-item">FUTURO <b>✦</b></span>
                    <span class="nx-marquee-item">ENERGY CORE <b>✳</b></span>
                    <span class="nx-marquee-item">SOLAR INTELLIGENCE <b>✦</b></span>
                    <span class="nx-marquee-item">ENERGY IN MOTION <b>✳</b></span>
                </div>
                <div class="nx-marquee-group" aria-hidden="true">
                    <span class="nx-marquee-item nx-marquee-brand">NEXUS <i>✳</i></span>
                    <span class="nx-marquee-item">ENERGÍA <b>✦</b></span>
                    <span class="nx-marquee-item">DATOS <b>✳</b></span>
                    <span class="nx-marquee-item">FUTURO <b>✦</b></span>
                    <span class="nx-marquee-item">ENERGY CORE <b>✳</b></span>
                    <span class="nx-marquee-item">SOLAR INTELLIGENCE <b>✦</b></span>
                    <span class="nx-marquee-item">ENERGY IN MOTION <b>✳</b></span>
                </div>
            </div>
        </div>

        <div class="nx-section-transition" aria-hidden="true"><span></span><i></i></div>`;
export default function Hero(){return <div className="react-fragment" dangerouslySetInnerHTML={{__html:markup}}/>;}
