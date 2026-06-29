import Head from 'next/head';
import { useState, useEffect } from 'react';
import { getCakes } from '../lib/notion';

const FALLBACK_CAKES = [
  { id:'1',  name:'オペラ',          fr_name:'Opéra',             description:'コーヒーとチョコの饗宴。フランスの古典。',        price:680,  category:['Pâtisserie'],        image_url:null, shop_url:null },
  { id:'2',  name:'タルト フレーズ', fr_name:'Tarte aux Fraises', description:'旬の苺とクレームパティシエールのタルト。',         price:750,  category:['Pâtisserie'],        image_url:null, shop_url:null },
  { id:'3',  name:'サントノーレ',    fr_name:'Saint-Honoré',      description:'シャンティイとカラメルシューのサントノーレ。',      price:880,  category:['Pâtisserie'],        image_url:null, shop_url:null },
  { id:'4',  name:'ミルフィーユ',    fr_name:'Mille-Feuille',     description:'バニラの香るクレームディプロマット。',             price:700,  category:['Pâtisserie'],        image_url:null, shop_url:null },
  { id:'5',  name:'パリブレスト',    fr_name:'Paris-Brest',       description:'プラリネムースリーヌのシュー菓子。',               price:780,  category:['Pâtisserie'],        image_url:null, shop_url:null },
  { id:'6',  name:'エクレア',        fr_name:'Éclair Chocolat',   description:'深煎りカカオのガナッシュと艶やかなフォンダン。',   price:580,  category:['Pâtisserie'],        image_url:null, shop_url:null },
  { id:'7',  name:'クロワッサン',    fr_name:'Croissant',         description:'バターを幾層にも折り込んだクロワッサン。',         price:320,  category:['Viennoiserie'],      image_url:null, shop_url:null },
  { id:'8',  name:'フィナンシェ',    fr_name:'Financier',         description:'焦がしバターとヘーゼルナッツのフィナンシェ。',     price:280,  category:['Viennoiserie'],      image_url:null, shop_url:null },
  { id:'9',  name:'マドレーヌ',      fr_name:'Madeleine',         description:'レモン風味のしっとりマドレーヌ。',                price:180,  category:['Viennoiserie'],      image_url:null, shop_url:null },
  { id:'10', name:'エスプレッソ',    fr_name:'Espresso',          description:'スペシャルティコーヒーの深い風味。',              price:480,  category:['Café'],              image_url:null, shop_url:null },
  { id:'11', name:'カフェオレ',      fr_name:'Café au Lait',      description:'温かいフォームミルクと深煎りエスプレッソ。',       price:580,  category:['Café'],              image_url:null, shop_url:null },
  { id:'12', name:'アソルティマン',  fr_name:'Box Assortiment',   description:'フィナンシェ・マドレーヌ・サブレの詰め合わせ。',  price:2800, category:['Gift','Pâtisserie'], image_url:null, shop_url:null },
];

const TABS = ['Pâtisserie', 'Viennoiserie', 'Café', 'Gift'];
const PT   = ['pt1','pt2','pt3','pt4','pt5','pt6'];

function groupByCategory(cakes) {
  const inCat = (c, n) => Array.isArray(c.category) ? c.category.includes(n) : c.category === n;
  return {
    'Pâtisserie':   cakes.filter(c => inCat(c, 'Pâtisserie')),
    'Viennoiserie': cakes.filter(c => inCat(c, 'Viennoiserie')),
    'Café':         cakes.filter(c => inCat(c, 'Café')),
    'Gift':         cakes.filter(c => inCat(c, 'Gift')),
  };
}

// グリッド用プレースホルダー定義
const GRID_PH = ['ph-1','ph-2','ph-3','ph-4'];

export default function Home({ cakes }) {
  const [activeTab, setActiveTab] = useState('Pâtisserie');

  const all     = cakes.length ? cakes : FALLBACK_CAKES;
  const grouped = groupByCategory(all);

  // スポットライト：画像を持つ最初のケーキ、なければ先頭
  const spotlight = all.find(c => c.image_url) || all[0];

  return (
    <>
      <Head>
        <title>BAiN DE CAFE | Pâtisserie Française — 湖西市</title>
        <meta name="description" content="静岡県湖西市の本格フランス菓子店。素材と時間にこだわった一皿をお届けします。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400&display=swap" rel="stylesheet" />
      </Head>

      {/* ── NAV（mix-blend-mode: difference） ── */}
      <nav className="nav">
        <a className="nav-logo" href="#">BAiN DE CAFE</a>
        <div className="nav-r">
          <a href="#gallery">Gallery</a>
          <a href="#menu">Menu</a>
          <a href="https://www.rakuten.co.jp/" target="_blank" rel="noopener">Online</a>
          <a href="#info">Access</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-bottom">
          <p className="hero-caption">
            <em>Pâtisserie Française</em>
            BAiN DE CAFE — Kosai, Shizuoka
          </p>
          <p className="hero-scroll">SCROLL</p>
        </div>
      </section>

      {/* ── PHOTO GRID（concept-E, 隙間なし） ── */}
      <div id="gallery">
        <div className="photo-grid-1">
          {[0, 1].map((i) => (
            <div key={i} className="p-cell">
              {all[i]?.image_url
                ? <img src={all[i].image_url} alt={all[i].fr_name || all[i].name} />
                : <div className={`ph ${GRID_PH[i]}`} />}
              <span className={`p-num ${i === 0 ? 'dk' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
              <span className="p-name">{all[i]?.fr_name || all[i]?.name}</span>
            </div>
          ))}
        </div>
        <div className="photo-grid-2">
          {[2, 3].map((i) => (
            <div key={i} className="p-cell">
              {all[i]?.image_url
                ? <img src={all[i].image_url} alt={all[i].fr_name || all[i].name} />
                : <div className={`ph ${GRID_PH[i]}`} />}
              <span className="p-num dk">{String(i + 1).padStart(2, '0')}</span>
              <span className="p-name">{all[i]?.fr_name || all[i]?.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── STATEMENT（エディトリアル） ── */}
      <section className="statement">
        <div className="statement-left">
          <p className="statement-eyebrow">Notre Histoire</p>
          <h2 className="statement-quote">
            素材と、時間と、<br />静けさ。
          </h2>
          <p className="statement-body">
            湖西市の小さな工房で、ひとつずつ丁寧に。<br />
            フランスの技術と、日本の四季と。
          </p>
          <a href="#menu" className="statement-link">メニューを見る →</a>
        </div>
        <div className="statement-right">
          <p className="statement-large">Pâtis&shy;serie</p>
          <p className="statement-sub">Française — Kosai</p>
        </div>
      </section>

      {/* ── GALLERY TICKER（ダーク背景） ── */}
      <div className="ticker-section">
        <div className="ticker">
          {[...all, ...all].map((cake, i) => (
            <div key={`${cake.id}-${i}`} className="t-item">
              {cake.image_url
                ? <img src={cake.image_url} alt={cake.fr_name || cake.name} />
                : <div className={`ph ${PT[i % PT.length]}`} />}
              <span className="t-label">{cake.fr_name || cake.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SPOTLIGHT（特選ケーキ） ── */}
      {spotlight && (
        <div className="spotlight">
          <div className="spot-img">
            {spotlight.image_url
              ? <img src={spotlight.image_url} alt={spotlight.fr_name || spotlight.name} />
              : <div className="ph" style={{ width:'100%', minHeight:'600px', background:'linear-gradient(135deg,#E4D4C0,#C4A070)' }} />}
          </div>
          <div className="spot-body">
            <span className="spot-num">01</span>
            <p className="spot-eyebrow">Pâtisserie — Featured</p>
            <div className="spot-rule" />
            <h3 className="spot-name">{spotlight.fr_name || spotlight.name}</h3>
            <p className="spot-desc">{spotlight.description}</p>
            {spotlight.price > 0 && (
              <p className="spot-price">¥ {spotlight.price.toLocaleString()}</p>
            )}
            <a
              href={spotlight.shop_url || 'https://www.rakuten.co.jp/'}
              target="_blank" rel="noopener"
              className="spot-link"
            >
              楽天市場で購入 →
            </a>
          </div>
        </div>
      )}

      {/* ── MENU ── */}
      <section className="menu-section" id="menu">
        <div className="menu-inner">
          <h2 className="menu-heading">Our Menu</h2>
          <div className="tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          {TABS.map(tab => (
            <div key={tab} className={`tab-pane ${activeTab === tab ? 'active' : ''}`}>
              {(grouped[tab] || []).map(cake => (
                <div key={cake.id} className="menu-row">
                  <div>
                    <p className="menu-name">{cake.fr_name || cake.name}</p>
                    <p className="menu-desc">{cake.description}</p>
                  </div>
                  <div className="menu-right">
                    {cake.price > 0 && <span className="menu-price">¥ {cake.price.toLocaleString()}</span>}
                    {cake.shop_url && (
                      <a href={cake.shop_url} target="_blank" rel="noopener" className="menu-buy">購入 →</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── INFO ── */}
      <div className="info-section" id="info">
        <div className="info-grid">
          <div>
            <p className="info-label">Hours</p>
            <p className="info-body">
              <strong>金〜月</strong> 10:00–17:00<br />
              定休日：火・水・木曜日
            </p>
          </div>
          <div>
            <p className="info-label">Location</p>
            <p className="info-body">
              静岡県湖西市<br />
              <strong>Instagram</strong> @bain_6679
            </p>
          </div>
          <div>
            <p className="info-label">Online</p>
            <p className="info-body">
              <a href="https://www.rakuten.co.jp/" target="_blank" rel="noopener">楽天市場でご購入</a><br />
              全国配送・ギフトボックス対応
            </p>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <a className="footer-logo" href="#">BAiN DE CAFE</a>
        <span className="footer-mid">Pâtisserie Française — 湖西市</span>
        <div className="footer-sns">
          <a href="https://www.instagram.com/bain_6679/" target="_blank" rel="noopener" aria-label="Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="https://www.rakuten.co.jp/" target="_blank" rel="noopener" aria-label="楽天市場">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </a>
        </div>
      </footer>
    </>
  );
}

export async function getStaticProps() {
  const cakes = await getCakes();
  return { props: { cakes }, revalidate: 60 };
}
