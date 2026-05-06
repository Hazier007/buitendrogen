export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type GuideFaq = {
  question: string;
  answer: string;
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  intro: string[];
  sections: GuideSection[];
  faq: GuideFaq[];
  relatedGemeentes: { slug: string; name: string }[];
};

export const guides: Guide[] = [
  {
    slug: "was-buiten-drogen-winter",
    title: "Was buiten drogen in de winter: zo werkt het echt",
    description:
      "Kan je was buiten drogen in de winter? Ja. Ontdek wanneer het werkt, welke fouten je moet vermijden en hoe je droogtijd realistisch inschat.",
    keyword: "was buiten drogen winter",
    intro: [
      "Veel mensen denken dat buiten drogen in de winter onmogelijk is. Dat klopt niet. Ook op koude dagen kan je was drogen, zolang de lucht droog is en er voldoende beweging in de lucht zit.",
      "De temperatuur is maar een deel van het verhaal. Luchtvochtigheid, wind en neerslag bepalen samen of je was echt droog wordt of juist klam blijft aanvoelen.",
    ],
    sections: [
      {
        heading: "Kan was drogen bij vorst?",
        paragraphs: [
          "Bij lichte vorst kan was nog steeds drogen. Het vocht bevriest eerst in de stof, maar kan daarna langzaam verdwijnen als de lucht droog genoeg is.",
          "Dit proces duurt langer dan in de lente of zomer. Daarom is planning belangrijk: begin vroeg op de dag en voorzie extra tijd voor dikke stukken zoals handdoeken of jeans.",
        ],
        bullets: [
          "Beste kans: droge lucht, weinig mist, matige wind.",
          "Slecht moment: natte sneeuw, mistige dag, hoge luchtvochtigheid.",
          "Controleer niet alleen temperatuur maar ook dauwpunt en regenkans.",
        ],
      },
      {
        heading: "Winter-checklist voor sneller drogen",
        paragraphs: [
          "Met een korte checklist vermijd je de meest voorkomende winterfouten. De grootste winst komt van goed centrifugeren en slim ophangen.",
          "Laat kledingstukken niet op elkaar hangen. In de winter is luchtcirculatie nog belangrijker omdat verdamping trager gaat.",
        ],
        bullets: [
          "Centrifugeer op hoge stand zodat minder restvocht achterblijft.",
          "Hang stukken met ruimte tussenin, liefst op een winderige plek.",
          "Draai dikke was halverwege om voor gelijkmatige droging.",
          "Haal de was binnen zodra ze droog is om dauw in de avond te vermijden.",
        ],
      },
      {
        heading: "Wanneer schakel je beter over op binnen drogen?",
        paragraphs: [
          "Soms is binnen drogen rationeel beter. Dat geldt vooral bij dagen met hoge luchtvochtigheid en nauwelijks wind. Dan lijkt de was na uren buiten nog steeds vochtig.",
          "Gebruik op zulke dagen de calculator voor je eigen gemeente en kies een hybride aanpak: eerst buiten voor ventilatie, daarna binnen uitlaten drogen.",
        ],
      },
    ],
    faq: [
      {
        question: "Vanaf welke temperatuur heeft buiten drogen nog zin?",
        answer:
          "Er is geen harde grens, maar onder 0 graden werkt het alleen goed bij droge lucht en wat wind. Bij vochtige winterlucht is het effect beperkt.",
      },
      {
        question: "Waarom voelt winterwas soms droog maar toch koud en klam?",
        answer:
          "Koude stof voelt sneller vochtig aan. Laat de was na binnenhalen 10 tot 20 minuten op kamertemperatuur komen voor je beslist of ze echt droog is.",
      },
    ],
    relatedGemeentes: [
      { slug: "antwerpen", name: "Antwerpen" },
      { slug: "gent", name: "Gent" },
      { slug: "leuven", name: "Leuven" },
      { slug: "brussel", name: "Brussel" },
    ],
  },
  {
    slug: "was-buiten-drogen-bij-hoge-luchtvochtigheid",
    title: "Was buiten drogen bij hoge luchtvochtigheid",
    description:
      "Hoge luchtvochtigheid maakt buiten drogen moeilijk. Leer welke grenswaarden belangrijk zijn en hoe je toch sneller resultaat haalt.",
    keyword: "was buiten drogen luchtvochtigheid",
    intro: [
      "Luchtvochtigheid is de stille killer van droogtijd. Zelfs bij zachte temperaturen kan je was traag drogen als de buitenlucht al veel vocht bevat.",
      "Wie alleen naar de thermometer kijkt, mist vaak de echte oorzaak van trage droging. Daarom is relatieve luchtvochtigheid een kernfactor in onze droogtijdschatting.",
    ],
    sections: [
      {
        heading: "Welke luchtvochtigheid is nog werkbaar?",
        paragraphs: [
          "Onder 55 procent droogt was meestal vlot, zeker met wat wind. Tussen 55 en 70 procent wordt het trager maar nog haalbaar. Boven 70 procent moet je rekening houden met lange droogtijd.",
          "Bij 80 procent of meer wordt het risico groot dat was klam blijft. Op zulke dagen heb je extra maatregelen nodig of kies je beter voor een binnenoplossing.",
        ],
        bullets: [
          "Onder 55 procent: gunstig venster.",
          "55 tot 70 procent: bruikbaar met wind en goede opstelling.",
          "70 procent of meer: alleen dunne was buiten, dik textiel uitstellen.",
        ],
      },
      {
        heading: "Praktische trucen om vochtige dagen te winnen",
        paragraphs: [
          "Je kan luchtvochtigheid niet sturen, maar je opstelling wel. Hang op de plek met meeste luchtbeweging, niet noodzakelijk de warmste plek.",
          "Gebruik dunne hangvolgorde: lichte stukken buitenkant, zwaardere stukken in het midden. Zo benut je wind en ruimte beter.",
        ],
        bullets: [
          "Gebruik extra knijpers zodat was niet dichtklapt door wind.",
          "Kies een hoger rek of lijn weg van muren en hagen.",
          "Plan dikke was op drogere dagdelen, vaak laat in de ochtend.",
        ],
      },
      {
        heading: "Combineer gemeentegegevens met weerswindow",
        paragraphs: [
          "In Belgie kan luchtvochtigheid sterk verschillen per regio. Kustzones en valleien gedragen zich anders dan open stedelijke zones.",
          "Check daarom steeds je lokale pagina en vergelijk het namiddagvenster met de avond. Vaak is het verschil in droogtijd groter dan je verwacht.",
        ],
      },
    ],
    faq: [
      {
        question: "Droogt was beter in zon of in wind?",
        answer:
          "Bij hoge luchtvochtigheid is wind meestal belangrijker dan zon. Luchtverplaatsing voert vocht af en versnelt zo het proces.",
      },
      {
        question: "Heeft het zin om later op de dag pas op te hangen?",
        answer:
          "Soms wel, maar vaak is de ochtend tot vroege namiddag beter. In de avond stijgt de luchtvochtigheid meestal opnieuw.",
      },
    ],
    relatedGemeentes: [
      { slug: "brugge", name: "Brugge" },
      { slug: "antwerpen", name: "Antwerpen" },
      { slug: "mechelen", name: "Mechelen" },
      { slug: "gent", name: "Gent" },
    ],
  },
  {
    slug: "was-buiten-drogen-15-graden",
    title: "Was buiten drogen bij 15 graden: realistische droogtijd",
    description:
      "Bij 15 graden kan was prima buiten drogen. Lees welke factoren de doorslag geven en hoe je droogtijd met uren kunt verkorten.",
    keyword: "was buiten drogen 15 graden",
    intro: [
      "15 graden is typisch Belgisch voor- en najaarsweer. Veel gebruikers twijfelen dan: buiten hangen of toch binnen houden? In de meeste gevallen is buiten drogen een goede keuze.",
      "De sleutel zit in combinatie: 15 graden met wind en lage luchtvochtigheid droogt veel sneller dan 15 graden met natte lucht en bewolking.",
    ],
    sections: [
      {
        heading: "Wat mag je verwachten bij 15 graden?",
        paragraphs: [
          "Voor normale was ligt de droogtijd vaak tussen 3 en 6 uur. Dunne stukken gaan sneller, dikke stukken duidelijk trager.",
          "Door je wasgoedtype vooraf te kiezen in de calculator, krijg je een bruikbare range in plaats van een te optimistische schatting.",
        ],
        bullets: [
          "T-shirts en sportkleding: meestal 2 tot 4 uur.",
          "Gemengde was: vaak 3 tot 6 uur.",
          "Handdoeken en jeans: eerder 5 tot 8 uur.",
        ],
      },
      {
        heading: "Drie factoren die meer wegen dan temperatuur",
        paragraphs: [
          "Wind maakt vaak het grootste verschil. Een stevige bries kan uren schelen tegenover windstil weer.",
          "Ook wolkendek speelt mee. Bij gesloten bewolking blijft de stof koeler en verdampt water trager.",
        ],
        bullets: [
          "Wind boven 10 km/u versnelt droging merkbaar.",
          "Luchtvochtigheid onder 60 procent is een sterk voordeel.",
          "Open ophanging met ruimte tussen stukken blijft cruciaal.",
        ],
      },
      {
        heading: "Zo haal je een betrouwbaar droogvenster",
        paragraphs: [
          "Gebruik een lokaal tijdvenster van minimaal vier droge uren. Plan je buitenwas liefst wanneer wind en temperatuur tegelijk gunstig zijn.",
          "Koppel je planning aan de gemeente waar je woont. Microklimaat tussen stad en randgemeente kan voldoende verschillen om de droogtijd te verdubbelen.",
        ],
      },
    ],
    faq: [
      {
        question: "Kan ik beddengoed buiten drogen bij 15 graden?",
        answer:
          "Ja, maar geef voldoende ruimte en reken extra tijd. Laken en dekbedovertrek drogen beter als ze niet dubbel hangen.",
      },
      {
        question: "Is 15 graden beter dan 20 graden zonder wind?",
        answer:
          "In sommige situaties wel. Een koelere dag met droge lucht en wind kan sneller zijn dan warme maar vochtige windstille lucht.",
      },
    ],
    relatedGemeentes: [
      { slug: "leuven", name: "Leuven" },
      { slug: "gent", name: "Gent" },
      { slug: "turnhout", name: "Turnhout" },
      { slug: "antwerpen", name: "Antwerpen" },
    ],
  },
  {
    slug: "beste-moment-om-was-buiten-te-hangen",
    title: "Beste moment om was buiten te hangen in Belgie",
    description:
      "Wat is het beste uur om was buiten te hangen? Gebruik deze timinggids voor ochtend, namiddag en seizoenswissels in Belgie.",
    keyword: "beste moment was buiten hangen",
    intro: [
      "Het juiste moment kiezen levert vaak meer op dan een extra uur wachten. Veel droogproblemen komen niet door slechte techniek, maar door een verkeerd startmoment.",
      "In Belgie verandert de luchtvochtigheid binnen een dag sterk. Daarom helpt een simpele tijdsstrategie om consequenter snel droog te krijgen.",
    ],
    sections: [
      {
        heading: "Ochtendstart: waarom dit meestal wint",
        paragraphs: [
          "In veel situaties is starten tussen 8:00 en 10:30 het beste compromis. Je benut dan het langste droge venster overdag.",
          "Begin je pas laat, dan loop je vaker tegen oplopende avondvochtigheid aan en moet je alsnog binnen afwerken.",
        ],
      },
      {
        heading: "Uurkeuze op basis van weertype",
        paragraphs: [
          "Op heldere dagen met wind mag je vroeger starten. Bij wisselvallig weer kies je beter het stabielste blok met lage regenkans.",
          "Let op dat de goedkoopste tijd voor energieverbruik niet altijd gelijk loopt met het beste droogmoment buiten.",
        ],
        bullets: [
          "Zonnig en droog: vroeg ophangen, vroeg binnenhalen.",
          "Wisselvallig: korte wascycli en snelle controle om de 60 minuten.",
          "Hoge avondvochtigheid: plan afronding voor 18:00.",
        ],
      },
      {
        heading: "Seizoensritme voor Vlaanderen en Brussel",
        paragraphs: [
          "In de lente en zomer werken ochtend- en middagvensters meestal goed. In herfst en winter wordt het nog belangrijker om lokale wind en vocht te checken.",
          "Gebruik onze gemeentepagina om te zien of jouw lokale omstandigheden afwijken. Vooral stedelijke zones kunnen een ander patroon tonen dan landelijke gemeenten.",
        ],
      },
    ],
    faq: [
      {
        question: "Heeft het zin om was de hele nacht buiten te laten?",
        answer:
          "Meestal niet. Nachten in Belgie zijn vaak vochtiger, waardoor was opnieuw klam wordt. Binnenhalen voor de avond is betrouwbaarder.",
      },
      {
        question: "Hoe lang op voorhand moet ik het weer checken?",
        answer:
          "Idealiter de avond voordien en opnieuw in de ochtend. Zo kan je nog schuiven met het startmoment bij veranderende wind of neerslag.",
      },
    ],
    relatedGemeentes: [
      { slug: "brussel", name: "Brussel" },
      { slug: "antwerpen", name: "Antwerpen" },
      { slug: "gent", name: "Gent" },
      { slug: "mechelen", name: "Mechelen" },
    ],
  },
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
