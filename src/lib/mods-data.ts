export interface Mod {
  author: string;
  category: string;
  description: string;
  downloads: number;
  gameVersions: string[];
  id: string;
  loaders: string[];
  name: string;
  tags: string[];
  updatedAt: string;
  version: string;
}

export const MOD_CATEGORIES = [
  "performance",
  "technology",
  "utility",
  "adventure",
  "magic",
  "building",
] as const;

export const MOD_GAME_VERSIONS = [
  "1.21",
  "1.20.4",
  "1.20.1",
  "1.19.4",
  "1.18.2",
] as const;

export const MOD_LOADERS = ["fabric", "forge", "neoforge"] as const;

export const MODS: Mod[] = [
  {
    author: "JellySquid",
    category: "performance",
    description:
      "A rendering engine replacement that greatly improves frame rates and reduces micro-stutter.",
    downloads: 14_200_000,
    gameVersions: ["1.21", "1.20.4", "1.20.1", "1.19.4", "1.18.2"],
    id: "sodium",
    loaders: ["fabric", "neoforge"],
    name: "Sodium",
    tags: ["rendering", "optimization", "fps"],
    updatedAt: "2026-08-14",
    version: "0.6.12",
  },
  {
    author: "coderbot",
    category: "performance",
    description:
      "A modern shaders mod for Minecraft that aims to provide compatibility and performance.",
    downloads: 9_800_000,
    gameVersions: ["1.21", "1.20.4", "1.20.1", "1.19.4"],
    id: "iris-shaders",
    loaders: ["fabric", "neoforge"],
    name: "Iris Shaders",
    tags: ["shaders", "graphics", "rendering"],
    updatedAt: "2026-07-30",
    version: "1.8.3",
  },
  {
    author: "simibubi",
    category: "technology",
    description:
      "Build intricate mechanical systems, automated factories, and moving contraptions.",
    downloads: 21_000_000,
    gameVersions: ["1.21", "1.20.4", "1.20.1", "1.19.4", "1.18.2"],
    id: "create",
    loaders: ["forge", "neoforge", "fabric"],
    name: "Create",
    tags: ["machines", "automation", "kinetics"],
    updatedAt: "2026-08-02",
    version: "6.0.1",
  },
  {
    author: "mezz",
    category: "utility",
    description:
      "View items and recipes in-game with a simple and powerful item and recipe viewer.",
    downloads: 31_000_000,
    gameVersions: ["1.21", "1.20.4", "1.20.1", "1.19.4", "1.18.2"],
    id: "jei",
    loaders: ["forge", "neoforge", "fabric"],
    name: "Just Enough Items",
    tags: ["recipes", "items", "interface"],
    updatedAt: "2026-06-18",
    version: "19.21.0",
  },
  {
    author: "Mysticdrew",
    category: "utility",
    description:
      "A real-time minimap and full-screen map with waypoints, markers, and death points.",
    downloads: 8_700_000,
    gameVersions: ["1.21", "1.20.4", "1.20.1", "1.19.4", "1.18.2"],
    id: "journeymap",
    loaders: ["forge", "fabric", "neoforge"],
    name: "JourneyMap",
    tags: ["minimap", "waypoints", "exploration"],
    updatedAt: "2026-05-22",
    version: "5.10.3",
  },
  {
    author: "TheBossMagnus",
    category: "adventure",
    description:
      "Adds over 90 new mobs to the game, from friendly critters to fearsome bosses.",
    downloads: 6_400_000,
    gameVersions: ["1.21", "1.20.4", "1.20.1", "1.19.4"],
    id: "alexs-mobs",
    loaders: ["forge", "fabric"],
    name: "Alex's Mobs",
    tags: ["mobs", "creatures", "wildlife"],
    updatedAt: "2026-04-11",
    version: "1.22.9",
  },
  {
    author: "Vazkii",
    category: "magic",
    description:
      "A tech-magic mod inspired by nature, with flowers that generate mana and powerful tools.",
    downloads: 5_200_000,
    gameVersions: ["1.21", "1.20.4", "1.20.1", "1.19.4", "1.18.2"],
    id: "botania",
    loaders: ["forge", "fabric"],
    name: "Botania",
    tags: ["magic", "flowers", "mana"],
    updatedAt: "2026-03-27",
    version: "1.21.1-446",
  },
  {
    author: "Benimatic",
    category: "adventure",
    description:
      "Explore a magical forest dimension filled with new bosses, dungeons, and treasures.",
    downloads: 7_800_000,
    gameVersions: ["1.21", "1.20.4", "1.20.1", "1.19.4"],
    id: "twilight-forest",
    loaders: ["forge", "neoforge"],
    name: "The Twilight Forest",
    tags: ["dimension", "bosses", "dungeons"],
    updatedAt: "2026-02-09",
    version: "4.5.1",
  },
  {
    author: "vectorwing",
    category: "building",
    description:
      "Expands farming and cooking with new crops, meals, and a cozy rustic aesthetic.",
    downloads: 4_300_000,
    gameVersions: ["1.21", "1.20.4", "1.20.1", "1.19.4", "1.18.2"],
    id: "farmers-delight",
    loaders: ["forge", "fabric", "neoforge"],
    name: "Farmer's Delight",
    tags: ["food", "farming", "cooking"],
    updatedAt: "2026-01-15",
    version: "1.20.1-1.2.4",
  },
  {
    author: "mDiyo",
    category: "technology",
    description:
      "A modding toolkit that lets you build custom tools and weapons from many materials.",
    downloads: 3_900_000,
    gameVersions: ["1.20.1", "1.19.4", "1.18.2"],
    id: "tinkers-construct",
    loaders: ["forge"],
    name: "Tinkers' Construct",
    tags: ["tools", "materials", "crafting"],
    updatedAt: "2025-12-05",
    version: "3.8.3",
  },
  {
    author: "Vazkii",
    category: "building",
    description:
      "A vanilla-plus mod that adds new blocks, tweaks, and quality-of-life features.",
    downloads: 6_100_000,
    gameVersions: ["1.21", "1.20.4", "1.20.1", "1.19.4", "1.18.2"],
    id: "quark",
    loaders: ["forge", "fabric", "neoforge"],
    name: "Quark",
    tags: ["vanilla-plus", "blocks", "quality-of-life"],
    updatedAt: "2025-11-20",
    version: "4.0.1",
  },
  {
    author: "JellySquid",
    category: "performance",
    description:
      "A general-purpose optimization mod that improves game physics and mob AI performance.",
    downloads: 11_000_000,
    gameVersions: ["1.21", "1.20.4", "1.20.1", "1.19.4", "1.18.2"],
    id: "lithium",
    loaders: ["fabric"],
    name: "Lithium",
    tags: ["optimization", "server", "tick-rate"],
    updatedAt: "2025-10-30",
    version: "0.14.1",
  },
];
