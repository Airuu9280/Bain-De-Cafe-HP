import Head from 'next/head';
import { getCakes } from '../lib/notion';

const FALLBACK_CAKES = [
  { id:'1', name:'オペラ',          fr_name:'Opéra',             image_url: null },
  { id:'2', name:'タルト フレーズ', fr_name:'Tarte aux Fraises', image_url: null },
  { id:'3', name:'サントノーレ',    fr_name:'Saint-Honoré',      image_url: null },
  { id:'4', name:'ミルフィーユ',    fr_name:'Mille-Feuille',     image_url: null },
];

const PH = ['p1', 'p2', 'p3', 'p4'];

export default function Home({ cakes }) {
  const all = cakes.length ? cakes : FALLBACK_CAKES;

  return (
    <>
      <Head>
        <title>BAiN DE CAFE</title>
        <meta name="description" content="Pâtisserie Française — 湖西市" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400&display=swap" rel="stylesheet" />
      </Head>

      {/* NAV */}
      <nav>
        <a className="logo" href="#">BAiN DE CAFE</a>
        <span className="menu">MENU</span>
      </nav>

      {/* HERO */}
      <section className="hero">
        <p className="hero-caption">BAiN DE CAFE — Kosai</p>
        <p className="scrolldown">SCROLL</p>
      </section>

      {/* PHOTO GRID — 上段 1.3fr:1fr */}
      <div className="grid">
        {[0, 1].map(i => (
          <div key={i} className="cell">
            {all[i]?.image_url
              ? <img src={all[i].image_url} alt={all[i].fr_name || all[i].name} />
              : <div className={PH[i]} />}
            <span className={`cap${i === 0 ? ' dark' : ''}`}>
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>

      {/* PHOTO GRID — 下段 1fr:1fr */}
      <div className="row3">
        {[2, 3].map(i => (
          <div key={i} className="cell">
            {all[i]?.image_url
              ? <img src={all[i].image_url} alt={all[i].fr_name || all[i].name} />
              : <div className={PH[i]} />}
            <span className="cap dark">
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>

      {/* QUIET */}
      <div className="quiet">
        <p>素材と、時間と、静けさ。</p>
        <span>Pâtisserie Française</span>
      </div>

      {/* FOOTER */}
      <footer>
        <span>BAiN DE CAFE</span>
        <span>静岡県湖西市</span>
        <span>@bain_6679</span>
      </footer>
    </>
  );
}

export async function getStaticProps() {
  const cakes = await getCakes();
  return { props: { cakes }, revalidate: 60 };
}
