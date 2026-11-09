export type Destination = {
  id: string
  city: string
  country: string
  lat: number
  lon: number
  tagline: string
  blurb: string
  days: string
  price: string
  /** Existing page from the original travel site (one level up). */
  href: string
}

export const destinations: Destination[] = [
  {
    id: "paris",
    city: "Paris",
    country: "France",
    lat: 48.8566,
    lon: 2.3522,
    tagline: "Light, stone & late dinners",
    blurb: "Seine sunrises, Haussmann boulevards and a private after-hours walk through the Louvre's sculpture wing.",
    days: "6 days",
    price: "€1,890",
    href: "../paris.html",
  },
  {
    id: "london",
    city: "London",
    country: "United Kingdom",
    lat: 51.5072,
    lon: -0.1276,
    tagline: "Old crowns, new skylines",
    blurb: "Thames by night, markets by morning, and theatre seats you would never find on your own.",
    days: "5 days",
    price: "€1,640",
    href: "../london.html",
  },
  {
    id: "berlin",
    city: "Berlin",
    country: "Germany",
    lat: 52.52,
    lon: 13.405,
    tagline: "History in high contrast",
    blurb: "Concrete, culture and courtyards — a city that rebuilds itself every decade, guided by locals.",
    days: "4 days",
    price: "€1,120",
    href: "../berlin.html",
  },
  {
    id: "suisse",
    city: "Zermatt",
    country: "Switzerland",
    lat: 46.0207,
    lon: 7.7491,
    tagline: "Thin air, clear heads",
    blurb: "Glacier trains, alpine lodges and the Matterhorn turning gold before anyone else is awake.",
    days: "7 days",
    price: "€2,760",
    href: "../suisse.html",
  },
  {
    id: "tunisie",
    city: "Sidi Bou Said",
    country: "Tunisia",
    lat: 36.8708,
    lon: 10.3417,
    tagline: "Blue doors, white light",
    blurb: "Cliffside cafés over the Gulf of Tunis, Carthage ruins and the medina's quiet workshops.",
    days: "6 days",
    price: "€980",
    href: "../tunise.html",
  },
  {
    id: "omra",
    city: "Makkah",
    country: "Saudi Arabia",
    lat: 21.3891,
    lon: 39.8579,
    tagline: "A journey of the heart",
    blurb: "Fully guided Omra with hotels steps from the Haram, transfers and a dedicated spiritual guide.",
    days: "14 days",
    price: "€2,350",
    href: "../omra.html",
  },
  {
    id: "maldive",
    city: "Malé Atoll",
    country: "Maldives",
    lat: 4.1755,
    lon: 73.5093,
    tagline: "Where the map runs out",
    blurb: "Over-water villas, reef dives at dawn and nights so dark the Milky Way casts a reflection.",
    days: "8 days",
    price: "€3,480",
    href: "../maldive.html",
  },
  {
    id: "brazil",
    city: "Rio de Janeiro",
    country: "Brazil",
    lat: -22.9068,
    lon: -43.1729,
    tagline: "Rhythm at every altitude",
    blurb: "Sugarloaf at golden hour, samba in Lapa and a day in the Atlantic rainforest above the city.",
    days: "9 days",
    price: "€2,190",
    href: "../brazil.html",
  },
]

export const formatCoord = (lat: number, lon: number) => {
  const ns = lat >= 0 ? "N" : "S"
  const ew = lon >= 0 ? "E" : "W"
  return `${Math.abs(lat).toFixed(4)}° ${ns}  ${Math.abs(lon).toFixed(4)}° ${ew}`
}
