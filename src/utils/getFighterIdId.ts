const map: { [key in string]:string} = {
  "Banjo&Kazooie":"banjo",
  Bayonetta:"bayonetta",
  Byleth:"beleth",
  CaptainFalcon:"captain_falcon",
  Chrom:"chrom",
  Cloud:"cloud",
  Daisy:"daisy",
  DarkPit: "dark_pit",
  DarkSamus:"dark_samus",
  KingDedede:"dedede",
  DiddyKong:"diddy",
  DonkeyKong:"donkey",
  DrMario:"drmario",
  DuckHunt:"duckhunt",
  Falco:"falco",
  Fox:"fox",
  "MrGame&Watch":"gamewatch",
  Ganondorf:"ganon",
  Incineroar:"gaogaen",
  Greninja:"gekkouga",
  Hero:"hero",
  PyraMythra:"homura",
  IceClimbers:"iceclimber",
  Ike: "ike",
  lke: "ike",
  Inkling:"inkling",
  Joker:"joker",
  Corrin:"kamui",
  Kazuya:"kazuya",
  Ken:"ken",
  Kirby:"kirby",
  Bowser:"koopa",
  BowserJr:"koopajr",
  KingKRool:"krool",
  Link:"link",
  LittleMac:"littlemac",
  Lucario:"lucario",
  Lucas:"lucas",
  Lucina:"lucina",
  Luigi:"luigi",
  Mario:"mario",
  Marth:"marth",
  MetaKnight:"metaknight",
  Mewtwo:"mewtwo",
  MiiBrawler :"miifighter",
  MiiGunner:"miigunner",
  MiiSwordfighter:"miiswordman",
  MinMin:"minmin",
  Villager:"murabito",
  Ness:"ness",
  Olimar:"olimar",
  PiranhaPlant:"packun",
  PACMAN:"pacman",
  Palutena:"palutena",
  Peach:"peach",
  Pichu:"pichu",
  Pikachu:"pikachu",
  Pit:"pit",
  PokémonTrainer: "ptrainer",
  PokemonTrainer:"ptrainer",
  Jigglypuff:"purin",
  Robin:"reflet",
  Richter:"richter",
  Ridley:"ridley",
  ROB: "robot",
  R0B:"robot",
  MegaMan:"rockman",
  "Rosalina&Luma":"rosetta",
  Roy:"roy",
  Ryu:"ryu",
  Samus:"samus",
  Sephiroth:"sephiroth",
  Sheik:"sheik",
  Isabelle:"shizue",
  Shulk:"shulk",
  Simon:"simon",
  Snake:"snake",
  Sonic:"sonic",
  Sora:"sora",
  Steve:"steve",
  Terry:"terry",
  ToonLink:"toonlink",
  Wario:"wario",
  WiiFitTrainer:"wiifit",
  Wolf:"wolf",
  Yoshi:"yoshi",
  YoungLink:"younglink",
  Zelda:"zelda",
  ZeroSuitSamus:"zerosuit_samus", 
} as const

const normalize = (name: string) => {
  return name.trim().replaceAll(" ", "").replaceAll(".", "").replaceAll(",", "").replaceAll("-", "").replaceAll("/", "");
}

export function getFighterId(name: string): string | undefined {
  return map[normalize(name)]
}

