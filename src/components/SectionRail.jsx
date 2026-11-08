const markup = `<nav class="nx-section-rail" aria-label="Navegación por secciones">
<span class="nx-rail-track" aria-hidden="true"></span>
<a class="nx-rail-link is-active" href="#inicio" aria-label="Inicio" title="Inicio">
<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg><span>Inicio</span>
</a>
<a class="nx-rail-link" href="#mapa" aria-label="Mapa energético" title="Mapa energético">
<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><span>Mapa energético</span>
</a>
<a class="nx-rail-link" href="#simulador" aria-label="Simulador" title="Simulador">
<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5m0 14h16M8 15l3-4 3 2 5-7"/><path d="M16 6h3v3"/></svg><span>Simulador</span>
</a>
<a class="nx-rail-link" href="#copiloto" aria-label="Copiloto IA" title="Copiloto IA">
<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1"/><circle cx="12" cy="12" r="4"/></svg><span>Copiloto IA</span>
</a>
<a class="nx-rail-link" href="#planes" aria-label="Planes" title="Planes">
<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/><circle cx="18" cy="17" r="2"/></svg><span>Planes</span>
</a>
</nav>`;

export default function SectionRail() {
  return <div className="react-fragment" dangerouslySetInnerHTML={{ __html: markup }} />;
}
