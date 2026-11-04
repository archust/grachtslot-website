// Grachtslot Slotenmaker - statische website generator
// Gebruik: node build.mjs  ->  schrijft de complete site naar ./public
//
// PAS EERST DE GEGEVENS HIERONDER AAN (alles tussen [HAKEN] is nog in te vullen).

import { mkdirSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, 'public');

// ---------------------------------------------------------------------------
// 1. BEDRIJFSGEGEVENS: overal op de site gebruikt (NAP moet overal identiek zijn
//    aan je Google Bedrijfsprofiel)
// ---------------------------------------------------------------------------
const site = {
  naam: 'Grachtslot',
  volledigeNaam: 'Grachtslot Slotenmaker',
  url: 'https://www.grachtslot.nl',          // zonder slash aan het eind
  telefoonWeergave: '[020 - TELEFOONNUMMER]',
  telefoonLink: '+31200000000',              // internationaal formaat, zonder spaties
  email: '[info@grachtslot.nl]',
  straat: '[Straat + huisnummer]',
  postcode: '[1000 AA]',
  plaats: 'Amsterdam',
  kvk: '[KVK-NUMMER]',
  geo: { lat: 52.3676, lng: 4.9041 },        // vervang door je echte vestigingslocatie
  aankomsttijd: '[XX] minuten',              // alleen invullen wat je echt waarmaakt
  prijsIndicatie: '€€',
  bijgewerkt: '2026-11-03',
};

// ---------------------------------------------------------------------------
// 2. WERKGEBIED: plaatsen met een eigen pagina (unieke tekst per plaats)
// ---------------------------------------------------------------------------
const plaatsen = [
  {
    slug: 'amsterdam', naam: 'Amsterdam', afstand: null,
    wijken: ['Centrum', 'Jordaan', 'De Pijp', 'Oud-West', 'Oost', 'Noord', 'Nieuw-West', 'Zuid', 'Zuidoost', 'IJburg'],
    ook: ['Landsmeer', 'Oostzaan', 'Ouder-Amstel'],
    intro: 'Amsterdam is onze thuisbasis. Van een grachtenpand in de Jordaan tot een appartement op IJburg: wij openen dag en nacht uw voordeur als u buitengesloten bent.',
    wijkInfo: 'Rond de grachten en in de Jordaan staan onder meer oudere panden met eigen voordeuren; in buurten als IJburg en Amsterdam-Noord vindt u ook veel appartementencomplexen met een gezamenlijke entree. De uitvoering van deuren en sloten verschilt per woning. Vertel daarom wat voor deur u heeft en of er een centrale toegangsdeur is.',
    route: 'Amsterdam is onze thuisbasis. De ring A10 sluit aan op de verschillende stadsdelen; de handigste afslag hangt af van uw adres. Parkeerregels en beschikbare plekken verschillen per straat. Geef bij het bellen uw straat en huisnummer door, en in het centrum eventueel een herkenbare brug of kruising.',
    faqs: [
      { v: 'Welke locatiegegevens zijn handig bij een adres aan de Amsterdamse grachten?', a: 'Geef de straat, het huisnummer en zo nodig de dichtstbijzijnde brug of kruising door. Vertel ook hoe de voordeur vanaf de straat bereikbaar is.' },
      { v: 'Wat moet ik melden als mijn appartement in Amsterdam een gezamenlijke entree heeft?', a: 'Vermeld dat er een centrale toegangsdeur is en of u daar zelf toegang toe heeft. Voor een gezamenlijke entree is toestemming of hulp van een bewoner of beheerder nodig.' },
      { v: 'Is parkeren in Amsterdam overal hetzelfde geregeld?', a: 'Nee, parkeerregels en beschikbaarheid verschillen per buurt en straat. Geef uw exacte adres door, zodat we rekening kunnen houden met de locatie.' },
    ],
  },
  {
    slug: 'amstelveen', naam: 'Amstelveen', afstand: 9,
    wijken: ['Stadshart', 'Westwijk', 'Middenhoven', 'Bankras-Kostverloren', 'Elsrijk', 'Groenelaan', 'Randwijck', 'Waardhuizen'],
    ook: ['Ouderkerk aan de Amstel', 'Bovenkerk', 'Uithoorn'],
    intro: 'Buitengesloten in Amstelveen? Wij rijden direct vanuit Amsterdam naar u toe en openen uw deur, ook \'s avonds, \'s nachts en in het weekend.',
    wijkInfo: 'Amstelveen bestaat uit verschillende woonbuurten, van het Stadshart en Elsrijk tot Westwijk en Middenhoven. U vindt er zowel appartementen als grondgebonden woningen; de voordeur en het type slot kunnen per complex of woning verschillen. Beschrijf bij het bellen uw woning en wat u over het slot weet.',
    route: 'Amstelveen ligt op ongeveer 9 km van Amsterdam. De A9 en de ring A10 zijn belangrijke wegen in de omgeving; de route hangt af van uw wijk. Parkeerregels verschillen onder meer tussen het Stadshart en woonstraten. Geef uw straat en huisnummer door en vermeld eventuele toegangsinstructies.',
    faqs: [
      { v: 'Wat moet ik doorgeven als ik in een appartement in het Stadshart woon?', a: 'Noem het adres en vertel of uw woning een eigen voordeur heeft achter een gezamenlijke entree. Geef ook aan of u zelf toegang heeft tot die entree.' },
      { v: 'Maakt het uit of mijn woning in Westwijk een appartement of een eengezinswoning is?', a: 'Ja, het helpt om te weten om welk soort woning en deur het gaat. Vertel ook of de deur alleen is dichtgevallen of met de sleutel op slot is gedraaid.' },
      { v: 'Hoe vind ik de juiste ingang bij een complex in Amstelveen?', a: 'Geef de straat, het huisnummer en eventuele naam of ingang van het complex door. Zo is duidelijk bij welke entree u staat.' },
    ],
  },
  {
    slug: 'diemen', naam: 'Diemen', afstand: 7,
    wijken: ['Centrum', 'Diemen-Noord', 'Diemen-Zuid', 'Plantage de Sniep', 'Bergwijkpark'],
    ook: ['Duivendrecht', 'Weesp', 'Muiden'],
    intro: 'Diemen ligt direct naast Amsterdam-Oost, dus we zijn er snel. Sleutel kwijt, afgebroken of de deur dichtgevallen? Bel ons en we komen meteen.',
    wijkInfo: 'In Diemen-Zuid en Plantage de Sniep staan appartementencomplexen naast andere woningtypen; ook Diemen-Noord en het centrum hebben elk hun eigen mix van woningen. Bij een appartement kan er naast de eigen voordeur een gezamenlijke entree zijn. Vertel welke deur niet open gaat en of u toegang heeft tot de centrale ingang.',
    route: 'Diemen ligt op ongeveer 7 km van Amsterdam. De A1 en A10 lopen in de omgeving; welke route passend is, hangt af van uw adres in Diemen. Parkeerregels en toegang tot wooncomplexen verschillen per locatie. Geef daarom de wijk, straat en eventuele ingang van het gebouw door.',
    faqs: [
      { v: 'Wat als ik in Plantage de Sniep voor een gesloten centrale entree sta?', a: 'Vertel dat het om de gezamenlijke entree gaat en of u een bewoner of beheerder kunt bereiken. Voor toegang tot gemeenschappelijke delen is toestemming nodig.' },
      { v: 'Welke gegevens helpen om een adres in Diemen-Zuid te vinden?', a: 'Geef de straat en het huisnummer door, plus de naam van het complex of de ingang als die relevant is. Vermeld ook of het om een appartement of een woning met eigen entree gaat.' },
      { v: 'Geldt dezelfde route voor Diemen-Noord en Diemen-Zuid?', a: 'Niet altijd. De A1 en A10 bieden verbindingen in de omgeving, maar de passende afslag en laatste straten hangen af van uw wijk en adres.' },
    ],
  },
  {
    slug: 'zaandam', naam: 'Zaandam', afstand: 11,
    wijken: ['Centrum (Inverdan)', 'Rosmolenwijk', 'Kogerveld', 'Poelenburg', 'Peldersveld', 'Westerwatering'],
    ook: ['Koog aan de Zaan', 'Zaandijk', 'Wormerveer', 'Krommenie', 'Assendelft', 'Oostzaan'],
    intro: 'Voor een spoedslotenmaker in Zaandam en de rest van de Zaanstreek kunt u ons 24 uur per dag bellen. Wij openen uw deur zo netjes mogelijk.',
    wijkInfo: 'Rond het centrum van Zaandam en Inverdan staan appartementen en andere stedelijke woningen; elders in de stad vindt u onder meer eengezinswoningen en flats. Oudere panden kunnen andere deuren hebben dan nieuwere woningen. Noem bij het bellen de wijk en beschrijf de deur en het slot zo goed mogelijk.',
    route: 'Zaandam ligt op ongeveer 11 km van Amsterdam. De A8 verbindt Zaandam met de ring A10; de laatste route hangt af van uw wijk en adres. Parkeren en de bereikbaarheid van de ingang verschillen per straat. Geef bij appartementen ook door aan welke kant of bij welke entree u staat.',
    faqs: [
      { v: 'Wat moet ik vertellen over een oudere houten voordeur in Zaandam?', a: 'Noem uw wijk en vertel dat het om een houten deur gaat. Beschrijf ook of de deur is dichtgevallen of met de sleutel is afgesloten en wat u over het slot weet.' },
      { v: 'Hoe geef ik mijn adres rond Inverdan duidelijk door?', a: 'Vermeld straat en huisnummer, en zo nodig de naam of ingang van het gebouw. In een complex helpt het ook te weten of er een gezamenlijke entree is.' },
      { v: 'Welke snelweg ligt in de route tussen Amsterdam en Zaandam?', a: 'De A8 sluit Zaandam aan op de ring A10. De beste afslag en route door de stad zijn afhankelijk van uw precieze adres.' },
    ],
  },
  {
    slug: 'haarlem', naam: 'Haarlem', afstand: 18,
    wijken: ['Centrum', 'Haarlem-Noord', 'Haarlem-Oost', 'Schalkwijk', 'Zuidwest', 'Haarlem-Zuid'],
    ook: ['Heemstede', 'Bloemendaal', 'Spaarndam', 'Zandvoort'],
    intro: 'Ook in Haarlem helpen wij u snel als u buitengesloten bent. We komen vanuit de regio Amsterdam en zijn dag en nacht bereikbaar.',
    wijkInfo: 'De Haarlemse binnenstad heeft historische straten en panden, terwijl Schalkwijk en Haarlem-Noord ook veel appartementen en woningen uit latere bouwperioden hebben. Daardoor verschillen voordeuren en sloten per buurt en adres. Geef aan in welke wijk u bent en beschrijf uw deur en slot.',
    route: 'Haarlem ligt op ongeveer 18 km van Amsterdam. De A9 en A5 vormen verbindingen tussen de regio en Haarlem; de laatste route hangt af van uw wijk. In en rond de binnenstad kunnen parkeerregels en beschikbare plekken per straat verschillen. Deel uw adres en eventuele bijzonderheden over de ingang.',
    faqs: [
      { v: 'Welke adresgegevens zijn handig voor een woning in de Haarlemse binnenstad?', a: 'Geef straat en huisnummer door en noem een herkenbare kruising als de straat lastig te vinden is. Vertel ook of de voordeur direct aan de straat ligt of achter een portiek.' },
      { v: 'Verschillen deuren in Schalkwijk en de Haarlemse binnenstad?', a: 'Woningen verschillen per bouwperiode en adres. Vertel in welke wijk u bent en of u een appartement, portiekwoning of woning met een eigen ingang heeft.' },
      { v: 'Kan ik voor elk adres in Haarlem dezelfde parkeerplek verwachten?', a: 'Nee, parkeerregels en beschikbare plekken verschillen per buurt en straat. Geef het exacte adres en eventuele aanwijzingen voor de ingang door.' },
    ],
  },
  {
    slug: 'hoofddorp', naam: 'Hoofddorp', afstand: 17,
    wijken: ['Centrum', 'Floriande', 'Toolenburg', 'Overbos', 'Pax', 'Graan voor Visch', 'Bornholm'],
    ook: ['Nieuw-Vennep', 'Badhoevedorp', 'Zwanenburg', 'Schiphol-Rijk'],
    intro: 'Slotenmaker nodig in Hoofddorp of elders in de Haarlemmermeer? Wij komen met spoed om uw deur te openen, ook midden in de nacht.',
    wijkInfo: 'In wijken als Floriande, Toolenburg en Bornholm staan verschillende soorten eengezinswoningen en appartementen. Ook in het centrum en Graan voor Visch is het woningaanbod niet overal hetzelfde. De deur en het slot verschillen per adres; geef daarom de wijk door en omschrijf wat voor deur u heeft.',
    route: 'Hoofddorp ligt op ongeveer 17 km van Amsterdam. De A4 en A5 verbinden de Haarlemmermeer met de regio; de passende route hangt af van uw wijk en adres. Parkeren en toegang tot woon- of bedrijfsgebouwen verschillen per locatie. Vermeld bij het bellen de ingang en eventuele toegangsinstructies.',
    faqs: [
      { v: 'Welke informatie is nuttig voor een adres in Floriande of Toolenburg?', a: 'Noem de wijk, straat en het huisnummer. Vertel of het om een appartement of eengezinswoning gaat en of de deur alleen is dichtgevallen of op slot is gedraaid.' },
      { v: 'Wat moet ik doorgeven als ik in Hoofddorp bij een bedrijfsgebouw sta?', a: 'Vermeld de naam van het terrein of gebouw, het adres en welke ingang u bedoelt. Geef ook aan of er toegangsinstructies of een contactpersoon zijn.' },
      { v: 'Via welke snelwegen is Hoofddorp vanuit Amsterdam bereikbaar?', a: 'De A4 en A5 zijn belangrijke verbindingen in de omgeving van Hoofddorp. Welke route geschikt is, hangt af van het adres in de Haarlemmermeer.' },
    ],
  },
  {
    slug: 'almere', naam: 'Almere', afstand: 25,
    wijken: ['Almere Stad', 'Almere Haven', 'Almere Buiten', 'Almere Poort', 'Almere Hout', 'Almere Pampus'],
    ook: ['Muiden', 'Huizen'],
    intro: 'Ook in Almere kunt u voor spoed bij ons terecht. Buitengesloten, sleutel kwijt of slot kapot? Bel ons en we komen naar u toe.',
    wijkInfo: 'Almere bestaat uit verschillende stadsdelen, waaronder Almere Stad, Haven, Buiten en Poort, met zowel appartementen als grondgebonden woningen. Het type voordeur en slot verschilt per woning en bouwperiode. Vertel in welk stadsdeel u bent en beschrijf het slot voor zover u dat kunt zien.',
    route: 'Almere ligt op ongeveer 25 km van Amsterdam. De A1 en A6 zijn belangrijke verbindingen naar de stad; de laatste route hangt af van het stadsdeel en uw adres. Parkeerregels verschillen per straat en complex. Geef naast uw adres ook de wijk en de juiste ingang door.',
    faqs: [
      { v: 'Waarom is het stadsdeel belangrijk voor een adres in Almere?', a: 'Almere is verdeeld over stadsdelen zoals Haven, Stad, Buiten en Poort. Noem het stadsdeel samen met straat en huisnummer, zodat duidelijk is waar u bent.' },
      { v: 'Wat moet ik melden over een appartement in Almere Poort?', a: 'Vertel of het gebouw een gezamenlijke entree heeft en of u daar zelf toegang toe heeft. Geef ook de naam of ingang van het complex door als die van uw adres afwijkt.' },
      { v: 'Welke wegen verbinden Amsterdam met Almere?', a: 'De A1 en A6 zijn belangrijke verbindingen tussen de regio en Almere. De meest geschikte route en afslag zijn afhankelijk van uw stadsdeel en adres.' },
    ],
  },
  {
    slug: 'purmerend', naam: 'Purmerend', afstand: 16,
    wijken: ['Centrum', 'Weidevenne', 'Overwhere', 'Gors', 'Wheermolen', 'Purmer-Noord', 'Purmer-Zuid'],
    ook: ['Ilpendam', 'Monnickendam', 'Edam-Volendam', 'Beemster'],
    intro: 'Bent u buitengesloten in Purmerend of omgeving? Wij openen uw deur met spoed, 24 uur per dag en 7 dagen per week.',
    wijkInfo: 'In het centrum van Purmerend en in buurten als Overwhere, Wheermolen en Weidevenne staan uiteenlopende typen woningen. Appartementen kunnen een gezamenlijke entree hebben; andere woningen hebben een eigen ingang. De deuren en sloten verschillen per adres, dus beschrijf ze bij het bellen.',
    route: 'Purmerend ligt op ongeveer 16 km van Amsterdam. De A7 is een belangrijke verbinding naar Purmerend; de laatste route hangt af van uw wijk en adres. Parkeerregels en toegang tot wooncomplexen verschillen per locatie. Geef uw straat, huisnummer en eventuele ingangsinformatie door.',
    faqs: [
      { v: 'Wat moet ik doorgeven voor een adres in Weidevenne?', a: 'Noem de wijk, straat en het huisnummer. Vertel of u bij een appartement met gezamenlijke entree staat of bij een woning met een eigen ingang.' },
      { v: 'Is de route naar het centrum van Purmerend dezelfde als naar Purmer-Zuid?', a: 'Niet per se. De A7 is een belangrijke verbinding, maar de laatste route door Purmerend is afhankelijk van uw wijk en exacte adres.' },
      { v: 'Wat helpt om een portiek of entree in Purmerend te vinden?', a: 'Geef naast het adres ook de naam van het gebouw, het portiek of de ingang door. Vermeld of er een gezamenlijke toegangsdeur is.' },
    ],
  },
];

// Plaatsen zonder eigen pagina (wel in werkgebied genoemd)
const overigePlaatsen = ['Landsmeer', 'Oostzaan', 'Weesp', 'Duivendrecht', 'Ouderkerk aan de Amstel', 'Uithoorn',
  'Badhoevedorp', 'Heemstede', 'Bloemendaal', 'Zandvoort', 'Koog aan de Zaan', 'Wormerveer', 'Krommenie',
  'Nieuw-Vennep', 'Muiden', 'Abcoude', 'Monnickendam', 'Volendam'];

// ---------------------------------------------------------------------------
// 3. HULPFUNCTIES
// ---------------------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const icon = {
  phone: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  clock: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  shield: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
  euro: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h12M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/></svg>',
  door: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 4h3a2 2 0 0 1 2 2v14M2 20h3M13 20h9M10 12v.01"/><path d="M13 4.6v16.3a1 1 0 0 1-1.2 1L5 20V5.6a2 2 0 0 1 1.5-2l4-1A2 2 0 0 1 13 4.6z"/></svg>',
  lock: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="16" height="11" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  key: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3 21 2M16 7l3 3M19 4l2 2"/></svg>',
  pin: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
};

const belKnop = (cls = 'btn btn-call') => `<a class="${cls}" href="tel:${site.telefoonLink}">${icon.phone}<span>Bel direct: ${esc(site.telefoonWeergave)}</span></a>`;

const bedrijfSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Locksmith',
  '@id': `${site.url}/#bedrijf`,
  name: site.volledigeNaam,
  url: `${site.url}/`,
  logo: `${site.url}/logo.svg`,
  image: `${site.url}/logo.svg`,
  telephone: site.telefoonLink,
  email: site.email,
  priceRange: site.prijsIndicatie,
  address: { '@type': 'PostalAddress', streetAddress: site.straat, postalCode: site.postcode, addressLocality: site.plaats, addressCountry: 'NL' },
  geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00', closes: '23:59',
  }],
  areaServed: [
    { '@type': 'GeoCircle', geoMidpoint: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng }, geoRadius: 30000 },
    ...plaatsen.map((p) => ({ '@type': 'City', name: p.naam })),
  ],
});

const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.naam, item: `${site.url}${it.pad}` })),
});

const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.v, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

const serviceSchema = (naam, beschrijving, pad) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: naam,
  serviceType: naam,
  description: beschrijving,
  url: `${site.url}${pad}`,
  provider: { '@id': `${site.url}/#bedrijf` },
  areaServed: plaatsen.map((p) => ({ '@type': 'City', name: p.naam })),
});

const kruimelpad = (items) => `<nav class="crumbs" aria-label="Kruimelpad"><ol>${items.map((it, i) =>
  i === items.length - 1 ? `<li aria-current="page">${esc(it.naam)}</li>` : `<li><a href="${it.pad}">${esc(it.naam)}</a></li>`).join('')}</ol></nav>`;

const faqBlok = (faqs, titel = 'Veelgestelde vragen') => `
<section class="section" aria-labelledby="faq-titel">
  <div class="wrap narrow">
    <h2 id="faq-titel">${titel}</h2>
    <div class="faq">
      ${faqs.map((f) => `<details><summary>${esc(f.v)}</summary><p>${esc(f.a)}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>`;

const stappenBlok = () => `
<section class="section alt" aria-labelledby="stappen-titel">
  <div class="wrap">
    <h2 id="stappen-titel">Zo werkt het</h2>
    <ol class="steps">
      <li><strong>Bel ons</strong><span>Vertel waar u bent en wat voor deur of slot het is. U hoort direct de prijs en verwachte aankomsttijd.</span></li>
      <li><strong>Wij komen naar u toe</strong><span>Een slotenmaker rijdt met spoed naar uw adres in Amsterdam of omgeving.</span></li>
      <li><strong>Deur open</strong><span>We openen de deur, waar mogelijk zonder schade. Daarna vragen we u om aan te tonen dat u er woont.</span></li>
      <li><strong>Veilig afsluiten</strong><span>Is het slot beschadigd of verouderd? Dan kunnen we het direct vervangen.</span></li>
    </ol>
  </div>
</section>`;

const ctaBlok = (tekst = 'Buitengesloten? Wij helpen u nu.') => `
<section class="cta-band">
  <div class="wrap cta-inner">
    <p class="cta-title">${esc(tekst)}</p>
    ${belKnop('btn btn-dark')}
  </div>
</section>`;

// ---------------------------------------------------------------------------
// 4. LAYOUT
// ---------------------------------------------------------------------------
const nav = [
  { naam: 'Deur openen', pad: '/deur-openen/' },
  { naam: 'Slot vervangen', pad: '/slot-vervangen/' },
  { naam: 'Werkgebied', pad: '/werkgebied/' },
  { naam: 'Tarieven', pad: '/tarieven/' },
  { naam: 'Contact', pad: '/contact/' },
];

function layout({ pad, titel, beschrijving, inhoud, schemas = [], noindex = false }) {
  const canonical = `${site.url}${pad}`;
  const ld = [bedrijfSchema(), ...schemas].map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titel)}</title>
<meta name="description" content="${esc(beschrijving)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<meta property="og:type" content="website">
<meta property="og:locale" content="nl_NL">
<meta property="og:site_name" content="${esc(site.volledigeNaam)}">
<meta property="og:title" content="${esc(titel)}">
<meta property="og:description" content="${esc(beschrijving)}">
<meta property="og:url" content="${canonical}">
<meta name="theme-color" content="#12161c">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/styles.css">
${ld}
</head>
<body>
<a class="skip" href="#inhoud">Naar de inhoud</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="logo" href="/" aria-label="${esc(site.volledigeNaam)}, naar de homepage">${icon.key}<span>${esc(site.naam)}</span></a>
    <nav class="main-nav" aria-label="Hoofdmenu">
      <ul>${nav.map((n) => `<li><a href="${n.pad}"${pad === n.pad ? ' aria-current="page"' : ''}>${n.naam}</a></li>`).join('')}</ul>
    </nav>
    <a class="btn btn-call btn-sm" href="tel:${site.telefoonLink}">${icon.phone}<span>24/7 spoed</span></a>
  </div>
</header>
<main id="inhoud">
${inhoud}
</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <p class="footer-logo">${icon.key}<span>${esc(site.volledigeNaam)}</span></p>
      <address>
        ${esc(site.straat)}<br>${esc(site.postcode)} ${esc(site.plaats)}<br>
        <a href="tel:${site.telefoonLink}">${esc(site.telefoonWeergave)}</a><br>
        <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>
      </address>
      <p class="small">24 uur per dag, 7 dagen per week bereikbaar<br>KvK ${esc(site.kvk)}</p>
    </div>
    <div>
      <p class="footer-kop">Diensten</p>
      <ul>
        <li><a href="/deur-openen/">Spoed deur openen</a></li>
        <li><a href="/slot-vervangen/">Slot vervangen</a></li>
        <li><a href="/tarieven/">Tarieven</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
    </div>
    <div>
      <p class="footer-kop">Werkgebied</p>
      <ul>${plaatsen.map((p) => `<li><a href="/slotenmaker-${p.slug}/">Slotenmaker ${p.naam}</a></li>`).join('')}</ul>
    </div>
  </div>
  <div class="wrap small copyright">© ${site.bijgewerkt.slice(0, 4)} ${esc(site.volledigeNaam)}. Alle rechten voorbehouden.</div>
</footer>
<a class="mobile-call" href="tel:${site.telefoonLink}">${icon.phone}<span>Bel 24/7: ${esc(site.telefoonWeergave)}</span></a>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// 5. PAGINA'S
// ---------------------------------------------------------------------------
const algemeneFaqs = [
  { v: 'Hoe snel is de slotenmaker bij mij?', a: `In Amsterdam streven we ernaar binnen ${site.aankomsttijd} bij u te zijn. In de rest van ons werkgebied (tot ongeveer 30 km rond Amsterdam) kan het iets langer duren. Bij het bellen hoort u de verwachte aankomsttijd.` },
  { v: 'Wat kost een deur openen?', a: 'U hoort de prijs altijd vooraf aan de telefoon, dus u weet waar u aan toe bent voordat we komen. Bekijk onze tarievenpagina voor een overzicht.' },
  { v: 'Kunnen jullie de deur openen zonder schade?', a: 'In veel gevallen wel. Een deur die alleen in het nachtslot is gevallen, openen we meestal zonder schade. Zit de deur op slot met een veiligheidscilinder, dan moet de cilinder soms worden vervangen. We vertellen u vooraf welke methode we gebruiken.' },
  { v: 'Zijn jullie ook \'s nachts en in het weekend bereikbaar?', a: 'Ja. We zijn 24 uur per dag en 7 dagen per week bereikbaar, ook op feestdagen.' },
  { v: 'Moet ik aantonen dat ik in de woning woon?', a: 'Ja. Na het openen vragen we om een legitimatiebewijs en bijvoorbeeld post op uw naam en adres. Zo voorkomen we dat we iemand binnenlaten die daar niet hoort.' },
  { v: 'In welke plaatsen werken jullie?', a: 'We werken in Amsterdam en tot ongeveer 30 km daaromheen, waaronder Amstelveen, Diemen, Zaandam, Haarlem, Hoofddorp, Purmerend en Almere.' },
];

const paginas = [];

// --- Home ---
paginas.push({
  pad: '/',
  titel: 'Grachtslot Slotenmaker | 24/7 spoedservice Amsterdam en omgeving',
  beschrijving: `Buitengesloten in Amsterdam of omgeving? Grachtslot opent uw deur met spoed, dag en nacht. Prijs vooraf bekend. Bel direct ${site.telefoonWeergave}.`,
  schemas: [faqSchema(algemeneFaqs)],
  inhoud: `
<section class="hero">
  <div class="wrap hero-inner">
    <p class="eyebrow">${icon.clock}<span>24/7 spoedservice in Amsterdam en tot 30 km rondom</span></p>
    <h1>Slotenmaker Amsterdam: buitengesloten? Wij openen uw deur met spoed.</h1>
    <p class="lead">Sleutel kwijt, deur dichtgevallen of sleutel afgebroken in het slot? Bel Grachtslot. We komen dag en nacht naar u toe en openen uw deur, waar mogelijk zonder schade.</p>
    <div class="hero-actions">
      ${belKnop()}
      <a class="btn btn-ghost" href="/tarieven/">Bekijk tarieven</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2 class="visually-hidden">Waarom Grachtslot</h2>
    <ul class="usp-grid">
      <li>${icon.clock}<strong>Dag en nacht bereikbaar</strong><span>Ook in het weekend en op feestdagen.</span></li>
      <li>${icon.euro}<strong>Prijs vooraf bekend</strong><span>U hoort de prijs aan de telefoon, vóórdat we komen.</span></li>
      <li>${icon.door}<strong>Zo min mogelijk schade</strong><span>We kiezen altijd eerst de methode met de minste schade.</span></li>
      <li>${icon.pin}<strong>Snel bij u</strong><span>Amsterdam en tot ongeveer 30 km daaromheen.</span></li>
    </ul>
  </div>
</section>

<section class="section alt">
  <div class="wrap">
    <h2>Onze spoeddiensten</h2>
    <div class="cards">
      <a class="card" href="/deur-openen/">${icon.door}<h3>Deur openen</h3><p>Buitengesloten van uw woning, bedrijfspand, berging of garage? Wij openen de deur met spoed.</p><span class="more">Meer over deur openen</span></a>
      <a class="card" href="/slot-vervangen/">${icon.lock}<h3>Slot vervangen</h3><p>Na een noodopening, een inbraak of verloren sleutels plaatsen we direct een nieuw, veilig slot.</p><span class="more">Meer over slot vervangen</span></a>
      <a class="card" href="/deur-openen/#sleutel-afgebroken">${icon.key}<h3>Sleutel afgebroken</h3><p>Sleutel afgebroken of vastgedraaid in het slot? We halen hem eruit en zorgen dat u weer binnen kunt.</p><span class="more">Wat kunnen we doen</span></a>
    </div>
  </div>
</section>

${stappenBlok()}

<section class="section">
  <div class="wrap">
    <h2>Slotenmaker in Amsterdam en omgeving</h2>
    <p class="max">Grachtslot is gespecialiseerd in spoedopeningen in Amsterdam en de omliggende gemeenten, tot ongeveer 30 km rondom de stad. Kies uw plaats voor meer informatie:</p>
    <ul class="city-grid">
      ${plaatsen.map((p) => `<li><a href="/slotenmaker-${p.slug}/">${icon.pin}<span>Slotenmaker ${p.naam}</span></a></li>`).join('\n      ')}
    </ul>
    <p><a href="/werkgebied/">Bekijk het volledige werkgebied</a></p>
  </div>
</section>

${faqBlok(algemeneFaqs)}
${ctaBlok()}`,
});

// --- Deur openen ---
const deurFaqs = [
  { v: 'Mijn deur is dichtgevallen maar niet op slot. Is dat sneller?', a: 'Meestal wel. Een deur die alleen in de dagschoot (het nachtslot) is gevallen, kunnen we vaak snel en zonder schade openen. Meld dit bij het bellen.' },
  { v: 'Wat als mijn sleutel aan de binnenkant in het slot zit?', a: 'Dat komt vaak voor. Sommige cilinders hebben een noodfunctie waarmee ze ook met een sleutel aan de binnenkant van buiten open kunnen. Zo niet, dan openen we de deur op een andere manier.' },
  { v: 'Kunnen jullie ook een auto openen?', a: 'Wij richten ons op deuren van woningen en bedrijfspanden. Voor auto\'s verwijzen we u door naar een gespecialiseerde autoslotenmaker.' },
  ...algemeneFaqs.slice(0, 2),
];
paginas.push({
  pad: '/deur-openen/',
  titel: 'Spoed deur openen Amsterdam | 24/7 slotenmaker | Grachtslot',
  beschrijving: 'Buitengesloten? Grachtslot opent uw voordeur in Amsterdam en omgeving met spoed, dag en nacht, waar mogelijk zonder schade. Prijs vooraf bekend.',
  schemas: [
    breadcrumbSchema([{ naam: 'Home', pad: '/' }, { naam: 'Deur openen', pad: '/deur-openen/' }]),
    serviceSchema('Deur openen', 'Spoedopening van woning- en bedrijfsdeuren bij buitensluiting, 24/7 in Amsterdam en omgeving.', '/deur-openen/'),
    faqSchema(deurFaqs),
  ],
  inhoud: `
<section class="page-head">
  <div class="wrap">
    ${kruimelpad([{ naam: 'Home', pad: '/' }, { naam: 'Deur openen', pad: '/deur-openen/' }])}
    <h1>Spoed deur openen in Amsterdam</h1>
    <p class="lead">Buitengesloten? Wij openen uw deur met spoed, 24 uur per dag. U hoort de prijs vooraf en we werken waar mogelijk zonder schade.</p>
    ${belKnop()}
  </div>
</section>

<section class="section">
  <div class="wrap narrow prose">
    <h2>Wanneer belt u ons?</h2>
    <ul class="checks">
      <li>U bent buitengesloten omdat de deur is dichtgevallen</li>
      <li>U bent uw sleutels kwijt of ze zijn gestolen</li>
      <li>Uw sleutel is afgebroken in het slot</li>
      <li>Het slot is defect en draait niet meer</li>
      <li>De sleutel zit aan de binnenkant in het slot</li>
      <li>U kunt niet in uw berging, garage of bedrijfspand</li>
    </ul>

    <h2>Hoe openen we uw deur?</h2>
    <p>Elke deur is anders. Daarom vragen we aan de telefoon wat voor deur en slot u heeft. Ter plekke kiezen we altijd eerst de methode met de minste schade:</p>
    <ol>
      <li><strong>Deur in het nachtslot:</strong> staat de deur alleen op de klink, dan openen we hem meestal zonder schade.</li>
      <li><strong>Deur op slot:</strong> we proberen de cilinder te openen zonder te boren. Lukt dat niet, bijvoorbeeld bij een veiligheidscilinder met kerntrekbeveiliging, dan vervangen we de cilinder.</li>
      <li><strong>Na het openen:</strong> u laat zien dat u er woont. Daarna kunnen we het slot direct vervangen, zodat uw woning weer goed afsluit.</li>
    </ol>

    <h2 id="sleutel-afgebroken">Sleutel afgebroken in het slot</h2>
    <p>Is uw sleutel afgebroken? Probeer het stukje niet zelf met een schroevendraaier of pincet eruit te halen. Dan duwt u het vaak dieper in de cilinder. Wij hebben speciaal gereedschap om afgebroken sleutels te verwijderen. Is de cilinder daarna beschadigd, dan vervangen we hem ter plekke.</p>

    <h2>Wat kunt u zelf alvast doen?</h2>
    <ul>
      <li>Kijk of er nog een achterdeur of raam op de begane grond open staat.</li>
      <li>Vraag of een huisgenoot, buur of verhuurder een reservesleutel heeft.</li>
      <li>Heeft u een slim slot of slimme deurbel? Kijk of u de deur via de app kunt openen.</li>
      <li>Lukt dat niet, bel ons dan. Klim nooit via een raam op hoogte naar binnen.</li>
    </ul>
  </div>
</section>

${stappenBlok()}
${faqBlok(deurFaqs, 'Vragen over deur openen')}
${ctaBlok('Nu buitengesloten? Bel ons direct.')}`,
});

// --- Slot vervangen ---
paginas.push({
  pad: '/slot-vervangen/',
  titel: 'Slot vervangen Amsterdam | Direct een veilig slot | Grachtslot',
  beschrijving: 'Slot kapot, sleutels kwijt of na een inbraak? Grachtslot vervangt uw slot direct in Amsterdam en omgeving met een veilige cilinder. 24/7 bereikbaar.',
  schemas: [
    breadcrumbSchema([{ naam: 'Home', pad: '/' }, { naam: 'Slot vervangen', pad: '/slot-vervangen/' }]),
    serviceSchema('Slot vervangen', 'Direct vervangen van cilindersloten na noodopening, inbraak of verloren sleutels in Amsterdam en omgeving.', '/slot-vervangen/'),
  ],
  inhoud: `
<section class="page-head">
  <div class="wrap">
    ${kruimelpad([{ naam: 'Home', pad: '/' }, { naam: 'Slot vervangen', pad: '/slot-vervangen/' }])}
    <h1>Slot vervangen in Amsterdam</h1>
    <p class="lead">Na een noodopening, een inbraak of verloren sleutels wilt u snel weer een deur die goed afsluit. Wij vervangen uw slot direct, ook buiten kantoortijd.</p>
    ${belKnop()}
  </div>
</section>

<section class="section">
  <div class="wrap narrow prose">
    <h2>Wanneer uw slot vervangen?</h2>
    <ul class="checks">
      <li>Na een noodopening waarbij de cilinder is beschadigd</li>
      <li>Na een inbraak of poging tot inbraak</li>
      <li>Als uw sleutels verloren of gestolen zijn</li>
      <li>Als u een woning betrekt en niet weet wie er nog sleutels heeft</li>
      <li>Als uw slot stroef draait of verouderd is</li>
    </ul>

    <h2>Een veilig slot</h2>
    <p>Voor uw voordeur adviseren we een cilinder met kerntrekbeveiliging en een SKG-keurmerk. Veel verzekeraars stellen bepaalde eisen aan het hang- en sluitwerk. Vraag dat na bij uw verzekeraar, wij adviseren u graag welk slot daaraan voldoet.</p>

    <h2>Na een inbraak</h2>
    <p>Doe na een inbraak eerst aangifte bij de politie en neem contact op met uw verzekeraar. Wij zorgen dat uw woning dezelfde dag weer goed afsluit, en u krijgt een factuur die u bij uw verzekering kunt indienen.</p>
  </div>
</section>
${ctaBlok('Slot kapot of sleutels kwijt? Bel ons.')}`,
});

// --- Tarieven ---
const tarievenFaqs = [
  { v: 'Wat kost het om een deur te laten openen?', a: 'Deur openen overdag kost vanaf €89. De prijs hangt af van uw deur, het slot en het tijdstip. U hoort het exacte bedrag aan de telefoon, voordat u de opdracht geeft.' },
  { v: 'Betaal ik voorrijkosten?', a: 'Ja, de voorrijkosten zijn €35. We noemen deze kosten samen met de overige kosten vooraf aan de telefoon.' },
  { v: 'Waarom verschilt de prijs per situatie?', a: 'Niet elke deur of elk slot is hetzelfde. Ook het tijdstip kan verschil maken. Als u vertelt wat er aan de hand is, bespreken we de prijs voordat we langskomen.' },
  { v: 'Wat kost annuleren?', a: 'U kunt kosteloos annuleren binnen 5 minuten nadat u de opdracht heeft gegeven. Daarna zijn de annuleringskosten €50 overdag (09:00–21:00) en €75 ’s nachts (21:00–09:00).' },
];
paginas.push({
  pad: '/tarieven/',
  titel: 'Tarieven slotenmaker Amsterdam | Prijs vooraf | Grachtslot',
  beschrijving: 'Wat kost een slotenmaker in Amsterdam? Bekijk de tarieven van Grachtslot voor deur openen en slot vervangen. Altijd een prijs vooraf, geen verrassingen.',
  schemas: [
    breadcrumbSchema([{ naam: 'Home', pad: '/' }, { naam: 'Tarieven', pad: '/tarieven/' }]),
    faqSchema(tarievenFaqs),
  ],
  inhoud: `
<section class="page-head">
  <div class="wrap">
    ${kruimelpad([{ naam: 'Home', pad: '/' }, { naam: 'Tarieven', pad: '/tarieven/' }])}
    <h1>Tarieven slotenmaker Amsterdam: altijd vooraf duidelijk</h1>
    <p class="lead">U hoort de prijs altijd vooraf aan de telefoon. Zo weet u waar u aan toe bent voordat u beslist of u ons de opdracht geeft.</p>
    ${belKnop()}
  </div>
</section>
<section class="section">
  <div class="wrap narrow">
    <div class="tip">
      <h2>Deur openen vanaf €89</h2>
      <p>Deur openen overdag kost vanaf €89. De exacte prijs bespreken we vooraf met u.</p>
    </div>
    <div class="table-wrap">
      <table>
        <caption>Tarieven slotenmaker Amsterdam — alle genoemde bedragen zijn inclusief btw</caption>
        <thead><tr><th scope="col">Dienst</th><th scope="col">Prijs</th></tr></thead>
        <tbody>
          <tr><td>Deur openen overdag</td><td>vanaf €89</td></tr>
          <tr><td>Voorrijkosten</td><td>€35</td></tr>
          <tr><td>Deur openen ’s avonds/’s nachts</td><td>[€ PRIJS]</td></tr>
          <tr><td>Cilinder vervangen</td><td>vanaf [€ PRIJS]</td></tr>
        </tbody>
      </table>
    </div>
    <p class="small">De genoemde prijzen zijn inclusief btw. Waar een bedrag nog als [€ PRIJS] staat, moet het tarief nog worden ingevuld. U hoort de definitieve prijs altijd vooraf.</p>

    <h2>Annuleren</h2>
    <p>Annuleren kan kosteloos binnen 5 minuten nadat u de opdracht heeft gegeven. Daarna rekenen we €50 overdag (09:00–21:00) en €75 ’s nachts (21:00–09:00).</p>

    <h2>Zo gaan wij om met prijzen</h2>
    <ul class="checks">
      <li><strong>Prijs vooraf:</strong> u hoort het bedrag voordat u de opdracht geeft.</li>
      <li><strong>Geen verborgen kosten:</strong> we bespreken de kosten vooraf met u.</li>
      <li><strong>Avond- en nachttoeslag:</strong> we leggen uit welk tarief geldt op het tijdstip waarop u hulp vraagt.</li>
      <li><strong>Factuur achteraf:</strong> na de werkzaamheden ontvangt u een factuur met de kosten.</li>
    </ul>

    <h2>Voorbeelden van situaties</h2>
    <ul>
      <li>Buitengesloten en moet uw deur open? Lees meer over <a href="/deur-openen/">deur openen</a>.</li>
      <li>Is uw slot kapot of is uw sleutel afgebroken? Bekijk onze informatie over <a href="/slot-vervangen/">een slot vervangen</a>.</li>
      <li>Heeft u ’s nachts spoedhulp nodig? Bekijk <a href="/deur-openen/">hoe we helpen bij een deur die open moet</a>; u hoort het toepasselijke tarief vooraf.</li>
    </ul>
  </div>
</section>
${faqBlok(tarievenFaqs)}
${ctaBlok('Vraag direct de prijs voor uw situatie')}`,
});

// --- Werkgebied ---
paginas.push({
  pad: '/werkgebied/',
  titel: 'Werkgebied: slotenmaker Amsterdam en 30 km rondom | Grachtslot',
  beschrijving: 'Grachtslot werkt in Amsterdam en tot 30 km rondom: Amstelveen, Diemen, Zaandam, Haarlem, Hoofddorp, Purmerend, Almere en meer. 24/7 spoed.',
  schemas: [breadcrumbSchema([{ naam: 'Home', pad: '/' }, { naam: 'Werkgebied', pad: '/werkgebied/' }])],
  inhoud: `
<section class="page-head">
  <div class="wrap">
    ${kruimelpad([{ naam: 'Home', pad: '/' }, { naam: 'Werkgebied', pad: '/werkgebied/' }])}
    <h1>Ons werkgebied: Amsterdam en tot 30 km rondom</h1>
    <p class="lead">We zijn gevestigd in Amsterdam en rijden voor spoedopeningen naar alle plaatsen binnen ongeveer 30 km van de stad.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <h2>Plaatsen</h2>
    <ul class="city-grid">
      ${plaatsen.map((p) => `<li><a href="/slotenmaker-${p.slug}/">${icon.pin}<span>Slotenmaker ${p.naam}</span>${p.afstand ? `<small>ca. ${p.afstand} km</small>` : '<small>thuisbasis</small>'}</a></li>`).join('\n      ')}
    </ul>
    <h2>Ook actief in</h2>
    <p class="max">${overigePlaatsen.join(', ')} en andere plaatsen in de regio. Staat uw plaats er niet bij? Bel ons gerust, dan horen we samen of we u kunnen helpen.</p>
  </div>
</section>
${ctaBlok()}`,
});

// --- Contact ---
paginas.push({
  pad: '/contact/',
  titel: 'Contact | Grachtslot Slotenmaker Amsterdam | 24/7 bereikbaar',
  beschrijving: `Neem contact op met Grachtslot Slotenmaker in Amsterdam. Voor spoed belt u ${site.telefoonWeergave}, 24 uur per dag bereikbaar.`,
  schemas: [breadcrumbSchema([{ naam: 'Home', pad: '/' }, { naam: 'Contact', pad: '/contact/' }])],
  inhoud: `
<section class="page-head">
  <div class="wrap">
    ${kruimelpad([{ naam: 'Home', pad: '/' }, { naam: 'Contact', pad: '/contact/' }])}
    <h1>Contact</h1>
    <p class="lead">Voor spoed kunt u ons het beste bellen. We nemen dag en nacht op.</p>
    ${belKnop()}
  </div>
</section>
<section class="section">
  <div class="wrap narrow">
    <div class="contact-grid">
      <div class="contact-card">
        <h2>Gegevens</h2>
        <address>
          <strong>${esc(site.volledigeNaam)}</strong><br>
          ${esc(site.straat)}<br>${esc(site.postcode)} ${esc(site.plaats)}
        </address>
        <p>Telefoon: <a href="tel:${site.telefoonLink}">${esc(site.telefoonWeergave)}</a><br>
        E-mail: <a href="mailto:${esc(site.email)}">${esc(site.email)}</a><br>
        KvK: ${esc(site.kvk)}</p>
      </div>
      <div class="contact-card">
        <h2>Bereikbaarheid</h2>
        <p>Telefonisch: 24 uur per dag, 7 dagen per week, ook op feestdagen.</p>
        <p>Voor vragen die geen spoed hebben, zoals advies over een nieuw slot, kunt u ons ook mailen.</p>
      </div>
    </div>
  </div>
</section>`,
});

// --- Plaatspagina's ---
for (const p of plaatsen) {
  const pad = `/slotenmaker-${p.slug}/`;
  const crumbs = [{ naam: 'Home', pad: '/' }, { naam: 'Werkgebied', pad: '/werkgebied/' }, { naam: `Slotenmaker ${p.naam}`, pad }];
  const anderen = plaatsen.filter((x) => x.slug !== p.slug);
  paginas.push({
    pad,
    titel: p.slug === 'amsterdam'
      ? 'Slotenmaker Amsterdam | 24/7 spoedservice | Grachtslot'
      : `Slotenmaker ${p.naam} 24/7 | Spoed deur openen | Grachtslot`,
    beschrijving: `Buitengesloten in ${p.naam}? Grachtslot opent uw deur met spoed, dag en nacht. Prijs vooraf bekend. Bel ${site.telefoonWeergave}.`,
    schemas: [
      breadcrumbSchema(crumbs),
      { ...serviceSchema(`Deur openen ${p.naam}`, `Spoed deur openen en slot vervangen in ${p.naam}.`, pad), areaServed: { '@type': 'City', name: p.naam } },
      faqSchema(p.faqs),
    ],
    inhoud: `
<section class="page-head">
  <div class="wrap">
    ${kruimelpad(crumbs)}
    <h1>Slotenmaker ${p.naam}: spoed deur openen, 24/7</h1>
    <p class="lead">${esc(p.intro)}</p>
    ${belKnop()}
  </div>
</section>

<section class="section">
  <div class="wrap narrow prose">
    <h2>Onze diensten in ${p.naam}</h2>
    <ul class="checks">
      <li><a href="/deur-openen/">Deur openen bij buitensluiting</a></li>
      <li><a href="/deur-openen/#sleutel-afgebroken">Afgebroken sleutel verwijderen</a></li>
      <li><a href="/slot-vervangen/">Slot of cilinder vervangen</a></li>
      <li>Slot vervangen na inbraak</li>
    </ul>

    <h2>Wijken in ${p.naam}</h2>
    <p>We komen in heel ${p.naam}, onder andere in ${p.wijken.slice(0, -1).join(', ')} en ${p.wijken.at(-1)}.${p.ook.length ? ` Vanuit ${p.naam} helpen we ook in ${p.ook.slice(0, -1).join(', ')}${p.ook.length > 1 ? ' en ' : ''}${p.ook.at(-1)}.` : ''}</p>

    <h2>Woningtypen en deuren in ${p.naam}</h2>
    <p>${esc(p.wijkInfo)}</p>

    <h2>Bereikbaarheid en parkeren in ${p.naam}</h2>
    <p>${esc(p.route)}</p>
  </div>
</section>

<section class="section alt">
  <div class="wrap narrow prose">
    <h2>Meer over deur openen</h2>
    <p>Bekijk de informatie over <a href="/deur-openen/">een deur laten openen</a>.</p>
  </div>
</section>
${faqBlok(p.faqs, `Vragen over onze slotenmaker in ${p.naam}`)}

<section class="section">
  <div class="wrap">
    <h2>Ook in de buurt van ${p.naam}</h2>
    <ul class="city-grid">
      ${anderen.map((x) => `<li><a href="/slotenmaker-${x.slug}/">${icon.pin}<span>Slotenmaker ${x.naam}</span></a></li>`).join('\n      ')}
    </ul>
  </div>
</section>
${ctaBlok(`Buitengesloten in ${p.naam}? Bel ons nu.`)}`,
  });
}

// --- 404 ---
const pagina404 = {
  pad: '/404.html', noindex: true,
  titel: 'Pagina niet gevonden | Grachtslot',
  beschrijving: 'Deze pagina bestaat niet.',
  inhoud: `
<section class="page-head">
  <div class="wrap">
    <h1>Deze pagina bestaat niet</h1>
    <p class="lead">Ga terug naar de <a href="/">homepage</a>. Bent u buitengesloten? Bel ons direct.</p>
    ${belKnop()}
  </div>
</section>`,
};

// ---------------------------------------------------------------------------
// 6. SCHRIJVEN
// ---------------------------------------------------------------------------
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const schrijf = (pad, html) => {
  const bestand = pad.endsWith('.html') ? join(OUT, pad) : join(OUT, pad, 'index.html');
  mkdirSync(dirname(bestand), { recursive: true });
  writeFileSync(bestand, html);
};

for (const p of paginas) schrijf(p.pad, layout(p));
schrijf(pagina404.pad, layout(pagina404));

copyFileSync(join(ROOT, 'src', 'styles.css'), join(OUT, 'styles.css'));
copyFileSync(join(ROOT, 'src', 'favicon.svg'), join(OUT, 'favicon.svg'));
copyFileSync(join(ROOT, 'src', 'favicon.svg'), join(OUT, 'logo.svg'));

const prioriteit = (pad) => (pad === '/' ? '1.0' : pad === '/deur-openen/' ? '0.9' : pad.startsWith('/slotenmaker-') ? '0.8' : '0.6');
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paginas.map((p) => `  <url><loc>${site.url}${p.pad}</loc><lastmod>${site.bijgewerkt}</lastmod><priority>${prioriteit(p.pad)}</priority></url>`).join('\n')}
</urlset>
`);

writeFileSync(join(OUT, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`);

console.log(`Klaar: ${paginas.length + 1} pagina's geschreven naar ${OUT}`);
