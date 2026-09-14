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
  {
    slug: "droogtijd-per-kledingstuk",
    title: "Droogtijd per kledingstuk: van sokken tot spijkerbroek",
    description:
      "Niet alle was droogt even snel. Ontdek de realistische droogtijd per kledingstuk, van sokken tot spijkerbroeken, en plan je wasdag slimmer.",
    keyword: "droogtijd was per kledingstuk",
    intro: [
      "Niet alle was droogt even snel — een dunne blouse wappert in twee uur droog terwijl een spijkerbroek op dezelfde lijn een halve dag hangt. Wie weet welk kledingstuk hoeveel tijd vraagt, plant zijn wasdag slimmer: het dikke werk 's ochtends buiten, het dunne spul erbij als de zon al zakt.",
      "Hieronder de realistische droogtijden per soort, gemeten bij gemiddeld droogweer (18 graden, matige wind, halfbewolkt). Onze calculator verrekent het actuele weer voor je eigen gemeente.",
    ],
    sections: [
      {
        heading: "Snel droog (1 tot 3 uur)",
        paragraphs: ["Dun en licht textiel geeft zijn vocht makkelijk af:"],
        bullets: [
          "Sokken en ondergoed: 1 à 2 uur — hang sokken per paar aan de tenen, niet dubbelgevouwen",
          "Dunne T-shirts en blouses: 2 à 3 uur — aan een hangertje drogen ze nog sneller én kreukvrij",
          "Sportkleding (synthetisch): 1 à 2 uur — polyester houdt amper vocht vast",
          "Theedoeken en zakdoeken: 2 uur",
        ],
      },
      {
        heading: "Gemiddeld (3 tot 5 uur)",
        paragraphs: [],
        bullets: [
          "Overhemden en jurken: 3 à 4 uur, afhankelijk van de stof",
          "Lakens en dekbedovertrekken: 3 à 5 uur — dubbel over de lijn kost een uur extra; hang ze als een tent open",
          "Truien (katoen): 4 à 5 uur — liggend drogen voorkomt uitrekken, maar duurt langer",
          "Broeken (chino, jogging): 3 à 4 uur — binnenstebuiten en aan de band opgehangen",
        ],
      },
      {
        heading: "Traag (5 uur en meer)",
        paragraphs: [],
        bullets: [
          "Spijkerbroeken: 5 à 7 uur — de dikke naden houden het langst vocht vast; voel altijd aan de tailleband en de zomen",
          "Handdoeken en badjassen: 5 à 6 uur — badstof is een spons; stevig uitschudden voor het ophangen scheelt een uur",
          "Hoodies en dikke truien: 5 à 7 uur — de capuchon is de valkuil: hang hem over een tweede lijn of kleerhanger",
          "Dekbedden en dekens: een volle droogdag — alleen buiten drogen bij echt goed weer, en halverwege draaien",
        ],
      },
      {
        heading: "Zo versnel je elke droogtijd",
        paragraphs: [],
        bullets: [
          "Centrifugeer op het hoogste toerental dat de stof verdraagt: elke minuut centrifuge is tien minuten lijn",
          "Schud elk stuk stevig uit voor het ophangen — platgeslagen stof droogt trager",
          "Hang met ruimte tussen de stukken: aanrakende was droogt op de raakvlakken niet",
          "Wind doet meer dan zon: een winderige bewolkte dag verslaat een windstille zonnige dag",
        ],
      },
    ],
    faq: [
      {
        question: "Waarom droogt mijn spijkerbroek zo traag?",
        answer:
          "Denim is dik geweven katoen en de dubbele naden werken als sponzen. Hang de broek binnenstebuiten aan de tailleband, zo vangen de zakken en naden de meeste wind.",
      },
      {
        question: "Droogt was aan een hangertje sneller?",
        answer:
          "Ja — hemden, blouses en jurken drogen aan een hanger rondom, in plaats van dubbelgevouwen over de lijn. Bonus: minder strijkwerk.",
      },
      {
        question: "Kan ik dikke was buiten vóórdrogen en binnen afdrogen?",
        answer:
          "Dat is zelfs de slimste aanpak in de tussenseizoenen: twee à drie uur buitenwind haalt het meeste vocht eruit, de laatste restvochtigheid verdwijnt binnen zonder condensprobleem.",
      },
    ],
    relatedGemeentes: [
      { slug: "kortrijk", name: "Kortrijk" },
      { slug: "hasselt", name: "Hasselt" },
      { slug: "sint-niklaas", name: "Sint-Niklaas" },
      { slug: "roeselare", name: "Roeselare" },
    ],
  },
  {
    slug: "was-binnen-drogen-zonder-condens",
    title: "Was binnen drogen zonder condens- en schimmelproblemen",
    description:
      "Binnen drogen hoeft geen condens of schimmel te veroorzaken. Ontdek hoe je vocht afvoert, het droogrek slim plaatst en wanneer buiten toch de betere keuze is.",
    keyword: "was binnen drogen condens",
    intro: [
      "Van november tot februari is binnen drogen voor veel gezinnen de enige optie — maar een rek nat wasgoed dumpt twee tot drie liter water in je huiskamerlucht. Zonder plan betekent dat beslagen ramen, muffe geuren en op termijn schimmel in de koudste hoeken.",
      "Met de juiste aanpak droogt je was binnen prima én blijft je huis gezond. Zo doe je het goed.",
    ],
    sections: [
      {
        heading: "De gouden regels voor binnen drogen",
        paragraphs: [],
        bullets: [
          "Kies de warmste, best geventileerde kamer — niet de slaapkamer (daar hangt 's nachts al de meeste vochtigheid)",
          "Zet een raam op kier of laat de ventilatie op de hoogste stand draaien zolang de was hangt",
          "Ruimte tussen de stukken is binnen nóg belangrijker dan buiten: binnen is er geen wind die het overneemt",
          "Centrifugeer extra goed — elke druppel die niet mee naar binnen komt, hoeft er ook niet uit je lucht",
        ],
      },
      {
        heading: "Condens en schimmel voorkomen",
        paragraphs: [
          "Vocht zoekt altijd het koudste oppervlak op: enkel glas, buitenmuren, de hoek achter de kast. Daar condenseert het en daar begint schimmel. De remedie is drieledig: beperk de vochtproductie (goed centrifugeren), voer het vocht af (ventileren, ook als het buiten koud is — koude buitenlucht is dróge lucht die binnen opwarmt en vocht opneemt), en verwarm de ruimte licht door: lucht van 20 graden houdt dubbel zoveel vocht vast als lucht van 10 graden. Zie je toch beslagen ramen, dan hangt er meer vocht in de lucht dan je afvoert — meer ventileren of minder was tegelijk.",
        ],
      },
      {
        heading: "Helpt een droogrek boven de verwarming?",
        paragraphs: [
          "Deels. De stijgende warme lucht versnelt het drogen merkbaar, maar de radiator zelf afdekken met wasgoed is een slecht idee: je blokkeert de warmteafgifte, jaagt je energiefactuur op en de kamer koelt af terwijl het vocht blijft. Beter: het rek op een halve meter náást de radiator, zodat de warme luchtstroom er langs kan. Een ventilator op de laagste stand richting het rek doet overigens meer dan de radiator — bewegende lucht is het halve werk.",
        ],
      },
      {
        heading: "Wanneer is buiten tóch beter?",
        paragraphs: [
          "Vaker dan je denkt. Een droge winterdag met wind droogt beter dan een vochtige kamer: bij 5 graden en een stevige bries is dunne was in drie uur klaar. Zelfs bij lichte vorst werkt het — de was vriest eerst stijf, maar het ijs verdampt rechtstreeks (vriesdrogen). Check onze calculator: die zegt per gemeente of vandaag een buitendag is.",
        ],
      },
    ],
    faq: [
      {
        question: "Hoeveel vocht komt er vrij bij binnen drogen?",
        answer:
          "Een volle trommel van 7 kilo brengt na het centrifugeren nog zo'n twee à drie liter water mee naar binnen. Al dat vocht moet via ventilatie naar buiten — anders slaat het neer op ramen en muren.",
      },
      {
        question: "Is een luchtontvochtiger de moeite waard?",
        answer:
          "Voor wie structureel binnen droogt: ja. Een compact toestel naast het droogrek halveert de droogtijd en vangt het vocht op in een reservoir in plaats van in je muren. Het verbruik ligt ver onder dat van een droogkast.",
      },
      {
        question: "Waarom ruikt binnen gedroogde was soms muf?",
        answer:
          "Te traag gedroogd: als was langer dan een dag vochtig hangt, krijgen geurbacteriën vrij spel. Sneller drogen (centrifuge, ventilatie, ruimte tussen de stukken) is de oplossing — niet meer wasparfum.",
      },
    ],
    relatedGemeentes: [
      { slug: "genk", name: "Genk" },
      { slug: "oostende", name: "Oostende" },
      { slug: "aalst", name: "Aalst" },
      { slug: "dendermonde", name: "Dendermonde" },
    ],
  },
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
