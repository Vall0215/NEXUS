const markup = `<header class="navbar">
        <div class="logo">
            <span class="logo-icon">
                N
            </span>
            <span class="nx-tech-wordmark" aria-label="NEXUS">
                <svg viewBox="0 0 156 32" role="img" aria-hidden="true"><text x="1" y="25">NEXUS</text></svg>
            </span>
        </div>
        <button
            class="nav-button"
            onclick="irAlMapa()"
        >
            Explorar
        </button>
    </header>`;
export default function Header(){return <div className="react-fragment" dangerouslySetInnerHTML={{__html:markup}}/>;}