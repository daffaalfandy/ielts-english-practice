export interface BarVisualData {
  type: "bar";
  title: string;
  yAxisLabel: string;
  xAxisLabel?: string;
  series: string[];
  stacked?: boolean;
  data: Array<{ category: string } & Record<string, number | string>>;
}

export interface LineVisualData {
  type: "line";
  title: string;
  yAxisLabel: string;
  xAxisLabel?: string;
  series: string[];
  data: Array<{ period: string } & Record<string, number | string>>;
}

export interface PieVisualData {
  type: "pie";
  title: string;
  /**
   * One or more pies. Single-pie charts use a one-entry series;
   * multi-pie charts (e.g. "2000 vs 2020") supply one entry per pie.
   * All pies should share the same category names so the legend is consistent.
   */
  series: Array<{
    label: string;
    data: Array<{ name: string; value: number }>;
  }>;
}

export interface TableVisualData {
  type: "table";
  title: string;
  columns: string[];
  rows: Array<Array<string | number>>;
}

// ─── Process diagram ─────────────────────────────────────────────
// Linear, ordered flow of stages. The array order IS the flow — no explicit
// edges. Cyclical variant is a follow-up.

export interface ProcessStep {
  label: string;
  description?: string;
  /** Optional lucide-react icon name. Falls back to the step number. */
  icon?: string;
}

export interface ProcessVisualData {
  type: "process";
  title: string;
  layout?: "linear"; // "cyclical" reserved for a later iteration
  steps: ProcessStep[]; // 2–8 steps
}

// ─── Map ─────────────────────────────────────────────────────────
// Authored against a coarse cell grid. The renderer multiplies cells by a
// base pixel size to produce SVG coordinates. One view = single map;
// two views = before/after comparison.

export type MapAreaFill = "park" | "water" | "parking" | "plaza";

export type MapFeature =
  | {
      kind: "building";
      id: string;
      cells: { x: number; y: number; w: number; h: number };
      label: string;
    }
  | {
      kind: "road";
      id: string;
      /** Grid-coordinate waypoints. Rendered as a thick polyline. */
      path: Array<[number, number]>;
      label?: string;
    }
  | {
      kind: "area";
      id: string;
      cells: { x: number; y: number; w: number; h: number };
      label: string;
      fill: MapAreaFill;
    }
  | {
      kind: "marker";
      id: string;
      cell: { x: number; y: number };
      label: string;
      /** Optional lucide-react icon name. */
      icon?: string;
    };

export interface MapView {
  label: string;
  features: MapFeature[];
}

export interface MapVisualData {
  type: "map";
  title: string;
  grid: { cols: number; rows: number };
  views: MapView[]; // 1 or 2 views
}

export type Task1VisualData =
  | BarVisualData
  | LineVisualData
  | PieVisualData
  | TableVisualData
  | ProcessVisualData
  | MapVisualData;

export interface WritingPrompt {
  id: string;
  task: 1 | 2;
  prompt: string;
  minWords: number;
  visualData?: Task1VisualData;
}

export type SpeakingTheme =
  | "place"
  | "person"
  | "object"
  | "event"
  | "experience"
  | "skill"
  | "activity"
  | "media"
  | "food"
  | "goal";

export interface SpeakingCueCard {
  id: string;
  topic: string;
  bulletPoints: string[];
  theme: SpeakingTheme;
}

export interface SpeakingPart1TopicSet {
  id: string;
  topic: string;
  questions: string[];
}

export const writingPrompts: WritingPrompt[] = [
  {
    id: "t1-1",
    task: 1,
    prompt:
      "The graph below shows the average monthly temperatures in three cities over one year. Summarise the information by selecting and reporting the main features.",
    minWords: 150,
    visualData: {
      type: "line",
      title: "Average monthly temperatures (°C) in three cities",
      yAxisLabel: "Temperature (°C)",
      xAxisLabel: "Month",
      series: ["London", "Sydney", "Dubai"],
      data: [
        { period: "Jan", London: 5, Sydney: 23, Dubai: 19 },
        { period: "Feb", London: 6, Sydney: 23, Dubai: 20 },
        { period: "Mar", London: 8, Sydney: 21, Dubai: 23 },
        { period: "Apr", London: 11, Sydney: 18, Dubai: 27 },
        { period: "May", London: 14, Sydney: 15, Dubai: 32 },
        { period: "Jun", London: 17, Sydney: 12, Dubai: 35 },
        { period: "Jul", London: 19, Sydney: 11, Dubai: 37 },
        { period: "Aug", London: 19, Sydney: 13, Dubai: 37 },
        { period: "Sep", London: 16, Sydney: 16, Dubai: 34 },
        { period: "Oct", London: 12, Sydney: 18, Dubai: 30 },
        { period: "Nov", London: 8, Sydney: 20, Dubai: 25 },
        { period: "Dec", London: 6, Sydney: 22, Dubai: 21 },
      ],
    },
  },
  {
    id: "t1-2",
    task: 1,
    prompt:
      "The pie charts below show the percentage of household income spent on different categories in 2000 and 2020. Summarise the information and make comparisons.",
    minWords: 150,
    visualData: {
      type: "pie",
      title: "Household income spent by category — 2000 vs 2020",
      series: [
        {
          label: "2000",
          data: [
            { name: "Housing", value: 28 },
            { name: "Food", value: 22 },
            { name: "Transport", value: 15 },
            { name: "Healthcare", value: 8 },
            { name: "Leisure", value: 12 },
            { name: "Savings", value: 10 },
            { name: "Other", value: 5 },
          ],
        },
        {
          label: "2020",
          data: [
            { name: "Housing", value: 35 },
            { name: "Food", value: 16 },
            { name: "Transport", value: 14 },
            { name: "Healthcare", value: 12 },
            { name: "Leisure", value: 10 },
            { name: "Savings", value: 6 },
            { name: "Other", value: 7 },
          ],
        },
      ],
    },
  },
  {
    id: "t1-3",
    task: 1,
    prompt:
      "The bar chart below shows the number of international students enrolled in undergraduate and postgraduate programmes at a UK university between 2005 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "bar",
      title: "International students at a UK university (2005–2020)",
      yAxisLabel: "Number of students",
      series: ["Undergraduate", "Postgraduate"],
      data: [
        { category: "2005", Undergraduate: 1200, Postgraduate: 450 },
        { category: "2010", Undergraduate: 1800, Postgraduate: 620 },
        { category: "2015", Undergraduate: 2200, Postgraduate: 850 },
        { category: "2020", Undergraduate: 2500, Postgraduate: 1100 },
      ],
    },
  },
  {
    id: "t1-4",
    task: 1,
    prompt:
      "The line graph below illustrates the total amount of electricity generated from renewable sources in four European countries between 2000 and 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "line",
      title: "Renewable electricity generation (TWh) — 2000 to 2022",
      yAxisLabel: "Electricity (TWh)",
      xAxisLabel: "Year",
      series: ["Germany", "Spain", "UK", "France"],
      data: [
        { period: "2000", Germany: 35, Spain: 20, UK: 10, France: 70 },
        { period: "2005", Germany: 65, Spain: 40, UK: 15, France: 75 },
        { period: "2010", Germany: 105, Spain: 90, UK: 26, France: 80 },
        { period: "2015", Germany: 195, Spain: 105, UK: 85, France: 90 },
        { period: "2020", Germany: 250, Spain: 140, UK: 135, France: 110 },
        { period: "2022", Germany: 265, Spain: 160, UK: 150, France: 125 },
      ],
    },
  },
  {
    id: "t1-5",
    task: 1,
    prompt:
      "The table below provides information about the percentage of households with access to the internet in five different countries in 2005, 2012, and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "table",
      title: "Households with internet access (%)",
      columns: ["Country", "2005", "2012", "2020"],
      rows: [
        ["South Korea", 92, 97, 99],
        ["United Kingdom", 60, 83, 96],
        ["Brazil", 17, 41, 83],
        ["India", 3, 15, 60],
        ["Nigeria", 1, 11, 42],
      ],
    },
  },
  {
    id: "t1-8",
    task: 1,
    prompt:
      "The bar chart below shows the proportion of male and female workers employed in six different sectors of the economy in one country in 2021. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "bar",
      title: "Workforce by sector and gender (2021)",
      yAxisLabel: "Percentage of sector workforce (%)",
      series: ["Male", "Female"],
      data: [
        { category: "Construction", Male: 88, Female: 12 },
        { category: "Manufacturing", Male: 72, Female: 28 },
        { category: "Finance", Male: 55, Female: 45 },
        { category: "Retail", Male: 42, Female: 58 },
        { category: "Education", Male: 30, Female: 70 },
        { category: "Healthcare", Male: 22, Female: 78 },
      ],
    },
  },
  {
    id: "t1-9",
    task: 1,
    prompt:
      "The line graph below shows the average daily consumption of bottled water per person in four countries between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "line",
      title: "Daily bottled water consumption per person (litres)",
      yAxisLabel: "Litres per person per day",
      xAxisLabel: "Year",
      series: ["Mexico", "Italy", "USA", "Japan"],
      data: [
        { period: "2000", Mexico: 0.35, Italy: 0.42, USA: 0.2, Japan: 0.08 },
        { period: "2005", Mexico: 0.5, Italy: 0.5, USA: 0.32, Japan: 0.12 },
        { period: "2010", Mexico: 0.68, Italy: 0.54, USA: 0.4, Japan: 0.18 },
        { period: "2015", Mexico: 0.78, Italy: 0.51, USA: 0.45, Japan: 0.24 },
        { period: "2020", Mexico: 0.84, Italy: 0.49, USA: 0.5, Japan: 0.3 },
      ],
    },
  },
  {
    id: "t1-11",
    task: 1,
    prompt:
      "The table below gives information about the number of tourists visiting five major cities in Asia in 2010 and 2020, along with the average length of stay. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "table",
      title: "Tourist arrivals and average length of stay — 5 Asian cities",
      columns: [
        "City",
        "Tourists 2010 (millions)",
        "Tourists 2020 (millions)",
        "Avg. stay 2010 (nights)",
        "Avg. stay 2020 (nights)",
      ],
      rows: [
        ["Bangkok", 15.9, 21.5, 4.1, 4.8],
        ["Singapore", 11.6, 14.2, 3.6, 3.4],
        ["Tokyo", 8.6, 12.8, 5.2, 4.5],
        ["Hong Kong", 20.1, 17.0, 3.2, 2.8],
        ["Seoul", 8.7, 13.1, 4.0, 4.2],
      ],
    },
  },
  {
    id: "t1-12",
    task: 1,
    prompt:
      "The bar chart below shows the amount of money spent on five different leisure activities by men and women in one country in 2019. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "bar",
      title: "Monthly leisure spending by gender (2019)",
      yAxisLabel: "Average spending (USD)",
      series: ["Men", "Women"],
      data: [
        { category: "Dining out", Men: 180, Women: 150 },
        { category: "Sports & fitness", Men: 95, Women: 110 },
        { category: "Cinema & theatre", Men: 40, Women: 55 },
        { category: "Travel", Men: 210, Women: 240 },
        { category: "Hobbies", Men: 70, Women: 65 },
      ],
    },
  },
  {
    id: "t1-13",
    task: 1,
    prompt:
      "The line graph below shows the birth rates in Japan, Germany, and Brazil from 1970 to 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "line",
      title: "Birth rate per 1,000 population (1970–2020)",
      yAxisLabel: "Births per 1,000 people",
      xAxisLabel: "Year",
      series: ["Japan", "Germany", "Brazil"],
      data: [
        { period: "1970", Japan: 18.8, Germany: 13.4, Brazil: 35.2 },
        { period: "1980", Japan: 13.6, Germany: 11.1, Brazil: 30.1 },
        { period: "1990", Japan: 10, Germany: 11.3, Brazil: 23.8 },
        { period: "2000", Japan: 9.4, Germany: 9.3, Brazil: 20.9 },
        { period: "2010", Japan: 8.5, Germany: 8.3, Brazil: 15.3 },
        { period: "2020", Japan: 6.8, Germany: 9.3, Brazil: 13.5 },
      ],
    },
  },
  {
    id: "t1-15",
    task: 1,
    prompt:
      "The two pie charts below compare the sources of energy used in one country in 1990 and in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "pie",
      title: "Sources of energy — 1990 vs 2020",
      series: [
        {
          label: "1990",
          data: [
            { name: "Coal", value: 45 },
            { name: "Natural gas", value: 22 },
            { name: "Nuclear", value: 15 },
            { name: "Hydro", value: 10 },
            { name: "Wind & solar", value: 2 },
            { name: "Other renewables", value: 6 },
          ],
        },
        {
          label: "2020",
          data: [
            { name: "Coal", value: 18 },
            { name: "Natural gas", value: 32 },
            { name: "Nuclear", value: 14 },
            { name: "Hydro", value: 8 },
            { name: "Wind & solar", value: 22 },
            { name: "Other renewables", value: 6 },
          ],
        },
      ],
    },
  },
  {
    id: "t1-16",
    task: 1,
    prompt:
      "The bar chart below shows the percentage of adults in a European country who participated in various forms of physical exercise in 2000, 2010, and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "bar",
      title: "Adult participation in physical exercise (2000, 2010, 2020)",
      yAxisLabel: "Adults participating (%)",
      series: ["2000", "2010", "2020"],
      data: [
        { category: "Walking", "2000": 55, "2010": 62, "2020": 70 },
        { category: "Running", "2000": 12, "2010": 20, "2020": 28 },
        { category: "Cycling", "2000": 18, "2010": 22, "2020": 30 },
        { category: "Swimming", "2000": 25, "2010": 22, "2020": 18 },
        { category: "Gym / fitness", "2000": 15, "2010": 28, "2020": 38 },
        { category: "Team sports", "2000": 22, "2010": 18, "2020": 14 },
      ],
    },
  },
  {
    id: "t1-17",
    task: 1,
    prompt:
      "The diagram below illustrates the stages involved in recycling aluminium drink cans. Summarise the information by selecting and reporting the main features.",
    minWords: 150,
    visualData: {
      type: "process",
      title: "The aluminium-can recycling process",
      layout: "linear",
      steps: [
        {
          label: "Collection",
          description:
            "Used cans are collected from household recycling bins and public drop-off points.",
          icon: "Trash2",
        },
        {
          label: "Sorting",
          description:
            "Aluminium is separated from other metals using magnets and eddy-current systems.",
          icon: "Filter",
        },
        {
          label: "Shredding",
          description: "Sorted cans are shredded into small uniform flakes.",
          icon: "Scissors",
        },
        {
          label: "Melting",
          description:
            "Flakes are melted in a furnace at around 750°C to form molten aluminium.",
          icon: "Flame",
        },
        {
          label: "Casting",
          description:
            "The molten metal is cast into large ingots ready for rolling.",
          icon: "Package",
        },
        {
          label: "Rolling",
          description:
            "Ingots are rolled into thin sheets from which new cans are manufactured.",
          icon: "Layers",
        },
      ],
    },
  },
  {
    id: "t1-18",
    task: 1,
    prompt:
      "The two maps below show the centre of the town of Greenfield in 2000 and in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "map",
      title: "Greenfield town centre — 2000 and 2020",
      grid: { cols: 12, rows: 8 },
      views: [
        {
          label: "2000",
          features: [
            {
              kind: "road",
              id: "high-street",
              label: "High Street",
              path: [
                [0, 4],
                [12, 4],
              ],
            },
            {
              kind: "road",
              id: "mill-lane",
              label: "Mill Lane",
              path: [
                [6, 0],
                [6, 8],
              ],
            },
            {
              kind: "building",
              id: "school",
              label: "School",
              cells: { x: 1, y: 1, w: 4, h: 2 },
            },
            {
              kind: "building",
              id: "post-office",
              label: "Post Office",
              cells: { x: 7, y: 1, w: 2, h: 2 },
            },
            {
              kind: "area",
              id: "park",
              label: "Park",
              fill: "park",
              cells: { x: 1, y: 5, w: 4, h: 3 },
            },
            {
              kind: "area",
              id: "carpark",
              label: "Car Park",
              fill: "parking",
              cells: { x: 7, y: 5, w: 3, h: 2 },
            },
            {
              kind: "marker",
              id: "church",
              label: "Church",
              icon: "Church",
              cell: { x: 10, y: 2 },
            },
          ],
        },
        {
          label: "2020",
          features: [
            {
              kind: "road",
              id: "high-street",
              label: "High Street (pedestrianised)",
              path: [
                [0, 4],
                [12, 4],
              ],
            },
            {
              kind: "road",
              id: "mill-lane",
              label: "Mill Lane",
              path: [
                [6, 0],
                [6, 8],
              ],
            },
            {
              kind: "building",
              id: "apartments",
              label: "Apartments",
              cells: { x: 1, y: 1, w: 4, h: 2 },
            },
            {
              kind: "building",
              id: "post-office",
              label: "Post Office",
              cells: { x: 7, y: 1, w: 2, h: 2 },
            },
            {
              kind: "area",
              id: "park",
              label: "Park (expanded)",
              fill: "park",
              cells: { x: 1, y: 5, w: 6, h: 3 },
            },
            {
              kind: "building",
              id: "supermarket",
              label: "Supermarket",
              cells: { x: 8, y: 5, w: 4, h: 3 },
            },
            {
              kind: "marker",
              id: "church",
              label: "Church",
              icon: "Church",
              cell: { x: 10, y: 2 },
            },
          ],
        },
      ],
    },
  },
  {
    id: "t1-19",
    task: 1,
    prompt:
      "The diagram below illustrates the water cycle. Summarise the information by selecting and reporting the main features.",
    minWords: 150,
    visualData: {
      type: "process",
      title: "The natural water cycle",
      layout: "linear",
      steps: [
        {
          label: "Evaporation",
          description:
            "Heat from the sun causes water in oceans, lakes and rivers to evaporate, turning into water vapour.",
          icon: "Sun",
        },
        {
          label: "Transpiration",
          description:
            "Plants release water vapour into the atmosphere through their leaves.",
          icon: "Sprout",
        },
        {
          label: "Condensation",
          description:
            "Water vapour rises, cools in the upper atmosphere and condenses into tiny droplets, forming clouds.",
          icon: "Cloud",
        },
        {
          label: "Precipitation",
          description:
            "Droplets combine and fall back to earth as rain, snow or hail.",
          icon: "CloudRain",
        },
        {
          label: "Runoff & Collection",
          description:
            "Water flows across land into rivers and lakes, or seeps underground, eventually returning to the oceans.",
          icon: "Waves",
        },
      ],
    },
  },
  {
    id: "t1-20",
    task: 1,
    prompt:
      "The diagram below shows the main stages in the production of concrete for use in the construction industry. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "process",
      title: "How concrete is produced",
      layout: "linear",
      steps: [
        {
          label: "Raw Materials",
          description:
            "Limestone and clay are quarried as the primary raw inputs.",
          icon: "Mountain",
        },
        {
          label: "Crushing",
          description:
            "The raw materials are crushed into fine powder in a crusher.",
          icon: "Hammer",
        },
        {
          label: "Heating",
          description:
            "The powder is heated in a rotating kiln at around 1450°C to produce cement clinker.",
          icon: "Flame",
        },
        {
          label: "Grinding",
          description:
            "Cooled clinker is ground with gypsum to produce fine cement powder.",
          icon: "Cog",
        },
        {
          label: "Mixing",
          description:
            "Cement is combined with sand, gravel and water in a concrete mixer (typical ratio 1:2:4 plus water).",
          icon: "Blend",
        },
        {
          label: "Pouring",
          description:
            "The wet concrete is poured on site and left to cure into its final hardened form.",
          icon: "Container",
        },
      ],
    },
  },
  {
    id: "t1-21",
    task: 1,
    prompt:
      "The diagram below shows the stages involved in bringing coffee from the farm to the consumer's cup. Summarise the information by selecting and reporting the main features.",
    minWords: 150,
    visualData: {
      type: "process",
      title: "From coffee bean to cup",
      layout: "linear",
      steps: [
        {
          label: "Harvesting",
          description:
            "Ripe red coffee cherries are picked by hand from coffee plants, typically once a year.",
          icon: "Leaf",
        },
        {
          label: "Processing",
          description:
            "Cherries are washed and the outer flesh is removed to reveal the green beans inside.",
          icon: "Droplets",
        },
        {
          label: "Drying",
          description:
            "Green beans are sun-dried on patios for up to two weeks until their moisture content falls below 12%.",
          icon: "Sun",
        },
        {
          label: "Roasting",
          description:
            "Dried beans are roasted at 200–220°C, which develops their colour, aroma and flavour.",
          icon: "Flame",
        },
        {
          label: "Grinding & Packaging",
          description:
            "Roasted beans are ground to the desired coarseness and vacuum-sealed for distribution.",
          icon: "Package",
        },
        {
          label: "Brewing",
          description:
            "Ground coffee is brewed with hot water by the consumer to produce the final drink.",
          icon: "Coffee",
        },
      ],
    },
  },
  {
    id: "t1-22",
    task: 1,
    prompt:
      "The diagram below explains how electricity is generated at a hydroelectric power station. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "process",
      title: "How a hydroelectric power station generates electricity",
      layout: "linear",
      steps: [
        {
          label: "Reservoir",
          description:
            "A dam holds back a large body of water, storing potential energy at a high elevation.",
          icon: "Waves",
        },
        {
          label: "Intake",
          description:
            "Water is released through controlled intake gates into large pipes called penstocks.",
          icon: "DoorOpen",
        },
        {
          label: "Turbine",
          description:
            "The falling water gains kinetic energy and drives the blades of a turbine.",
          icon: "Fan",
        },
        {
          label: "Generator",
          description:
            "The rotating turbine spins a generator, converting mechanical energy into electrical energy.",
          icon: "Zap",
        },
        {
          label: "Transformer",
          description:
            "A transformer steps the voltage up to the level needed for long-distance transmission.",
          icon: "Plug",
        },
        {
          label: "Distribution",
          description:
            "Electricity is carried by high-voltage power lines to homes and businesses.",
          icon: "Cable",
        },
      ],
    },
  },
  {
    id: "t1-23",
    task: 1,
    prompt:
      "The diagram below illustrates the life cycle of a butterfly. Summarise the information by selecting and reporting the main features.",
    minWords: 150,
    visualData: {
      type: "process",
      title: "The life cycle of a butterfly",
      layout: "linear",
      steps: [
        {
          label: "Egg",
          description:
            "A female butterfly lays small eggs on the underside of a leaf, typically in clusters.",
          icon: "Circle",
        },
        {
          label: "Caterpillar",
          description:
            "After about a week, a caterpillar (larva) hatches and begins to feed on the host plant.",
          icon: "Bug",
        },
        {
          label: "Chrysalis",
          description:
            "Once fully grown, the caterpillar attaches to a branch and forms a protective chrysalis (pupa).",
          icon: "Shield",
        },
        {
          label: "Transformation",
          description:
            "Inside the chrysalis, the larva undergoes metamorphosis over 10–14 days.",
          icon: "Sparkles",
        },
        {
          label: "Adult Butterfly",
          description:
            "A fully-formed adult emerges, expands its wings, and after a short drying period flies away to mate.",
          icon: "Bird",
        },
      ],
    },
  },
  {
    id: "t1-24",
    task: 1,
    prompt:
      "The two plans below show the layout of a public library before and after a recent refurbishment. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "map",
      title: "Public library — before and after refurbishment",
      grid: { cols: 12, rows: 8 },
      views: [
        {
          label: "Before",
          features: [
            {
              kind: "building",
              id: "entrance",
              label: "Entrance",
              cells: { x: 5, y: 7, w: 2, h: 1 },
            },
            {
              kind: "building",
              id: "reception",
              label: "Reception",
              cells: { x: 5, y: 5, w: 2, h: 2 },
            },
            {
              kind: "area",
              id: "adult-books",
              label: "Adult Books",
              fill: "plaza",
              cells: { x: 0, y: 1, w: 5, h: 4 },
            },
            {
              kind: "area",
              id: "childrens-books",
              label: "Children's Books",
              fill: "plaza",
              cells: { x: 7, y: 1, w: 5, h: 4 },
            },
            {
              kind: "area",
              id: "reading-room",
              label: "Reading Room",
              fill: "parking",
              cells: { x: 0, y: 5, w: 5, h: 3 },
            },
            {
              kind: "area",
              id: "staff",
              label: "Staff Office",
              fill: "parking",
              cells: { x: 7, y: 5, w: 5, h: 3 },
            },
          ],
        },
        {
          label: "After",
          features: [
            {
              kind: "building",
              id: "entrance",
              label: "Entrance",
              cells: { x: 5, y: 7, w: 2, h: 1 },
            },
            {
              kind: "building",
              id: "reception",
              label: "Self-Service Kiosk",
              cells: { x: 5, y: 5, w: 2, h: 2 },
            },
            {
              kind: "area",
              id: "adult-books",
              label: "Adult Books",
              fill: "plaza",
              cells: { x: 0, y: 1, w: 4, h: 3 },
            },
            {
              kind: "area",
              id: "childrens-books",
              label: "Children's Zone",
              fill: "plaza",
              cells: { x: 8, y: 1, w: 4, h: 3 },
            },
            {
              kind: "area",
              id: "digital-hub",
              label: "Digital Hub",
              fill: "water",
              cells: { x: 4, y: 1, w: 4, h: 3 },
            },
            {
              kind: "area",
              id: "cafe",
              label: "Café",
              fill: "park",
              cells: { x: 0, y: 5, w: 5, h: 3 },
            },
            {
              kind: "area",
              id: "study-pods",
              label: "Study Pods",
              fill: "parking",
              cells: { x: 7, y: 5, w: 5, h: 3 },
            },
          ],
        },
      ],
    },
  },
  {
    id: "t1-25",
    task: 1,
    prompt:
      "The maps below show the campus of Hillcrest University in 2005 and today. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "map",
      title: "Hillcrest University campus — 2005 and today",
      grid: { cols: 12, rows: 8 },
      views: [
        {
          label: "2005",
          features: [
            {
              kind: "road",
              id: "main-road",
              label: "Campus Road",
              path: [
                [0, 4],
                [12, 4],
              ],
            },
            {
              kind: "building",
              id: "main-hall",
              label: "Main Hall",
              cells: { x: 1, y: 1, w: 3, h: 2 },
            },
            {
              kind: "building",
              id: "library",
              label: "Library",
              cells: { x: 8, y: 1, w: 3, h: 2 },
            },
            {
              kind: "area",
              id: "field",
              label: "Sports Field",
              fill: "park",
              cells: { x: 1, y: 5, w: 5, h: 3 },
            },
            {
              kind: "area",
              id: "carpark",
              label: "Car Park",
              fill: "parking",
              cells: { x: 7, y: 5, w: 4, h: 3 },
            },
          ],
        },
        {
          label: "Today",
          features: [
            {
              kind: "road",
              id: "main-road",
              label: "Campus Road",
              path: [
                [0, 4],
                [12, 4],
              ],
            },
            {
              kind: "building",
              id: "main-hall",
              label: "Main Hall",
              cells: { x: 1, y: 1, w: 3, h: 2 },
            },
            {
              kind: "building",
              id: "library",
              label: "Library (extended)",
              cells: { x: 7, y: 1, w: 4, h: 2 },
            },
            {
              kind: "building",
              id: "science-block",
              label: "Science Block",
              cells: { x: 5, y: 1, w: 2, h: 2 },
            },
            {
              kind: "building",
              id: "dorms",
              label: "Student Dorms",
              cells: { x: 1, y: 5, w: 3, h: 3 },
            },
            {
              kind: "area",
              id: "field",
              label: "Sports Field",
              fill: "park",
              cells: { x: 4, y: 5, w: 3, h: 3 },
            },
            {
              kind: "building",
              id: "gym",
              label: "Gym",
              cells: { x: 7, y: 5, w: 2, h: 3 },
            },
            {
              kind: "area",
              id: "carpark",
              label: "Car Park",
              fill: "parking",
              cells: { x: 9, y: 5, w: 2, h: 3 },
            },
          ],
        },
      ],
    },
  },
  {
    id: "t1-26",
    task: 1,
    prompt:
      "The maps below show the coastal village of Dunby in 1980 and in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "map",
      title: "Dunby village — 1980 and 2020",
      grid: { cols: 12, rows: 8 },
      views: [
        {
          label: "1980",
          features: [
            {
              kind: "area",
              id: "sea",
              label: "Sea",
              fill: "water",
              cells: { x: 0, y: 0, w: 12, h: 2 },
            },
            {
              kind: "area",
              id: "beach",
              label: "Beach",
              fill: "plaza",
              cells: { x: 0, y: 2, w: 12, h: 1 },
            },
            {
              kind: "road",
              id: "coast-road",
              label: "Coast Road",
              path: [
                [0, 4],
                [12, 4],
              ],
            },
            {
              kind: "building",
              id: "fishing-huts",
              label: "Fishing Huts",
              cells: { x: 1, y: 5, w: 3, h: 1 },
            },
            {
              kind: "building",
              id: "pub",
              label: "Village Pub",
              cells: { x: 6, y: 5, w: 2, h: 2 },
            },
            {
              kind: "area",
              id: "farmland",
              label: "Farmland",
              fill: "park",
              cells: { x: 0, y: 6, w: 5, h: 2 },
            },
            {
              kind: "area",
              id: "farmland-east",
              label: "Farmland",
              fill: "park",
              cells: { x: 9, y: 5, w: 3, h: 3 },
            },
          ],
        },
        {
          label: "2020",
          features: [
            {
              kind: "area",
              id: "sea",
              label: "Sea",
              fill: "water",
              cells: { x: 0, y: 0, w: 12, h: 2 },
            },
            {
              kind: "area",
              id: "beach",
              label: "Beach",
              fill: "plaza",
              cells: { x: 0, y: 2, w: 12, h: 1 },
            },
            {
              kind: "building",
              id: "marina",
              label: "Marina",
              cells: { x: 0, y: 3, w: 4, h: 1 },
            },
            {
              kind: "road",
              id: "coast-road",
              label: "Coast Road",
              path: [
                [0, 4],
                [12, 4],
              ],
            },
            {
              kind: "building",
              id: "hotels",
              label: "Hotel Complex",
              cells: { x: 1, y: 5, w: 3, h: 2 },
            },
            {
              kind: "building",
              id: "pub",
              label: "Restaurant",
              cells: { x: 6, y: 5, w: 2, h: 2 },
            },
            {
              kind: "building",
              id: "housing",
              label: "Holiday Housing",
              cells: { x: 0, y: 7, w: 5, h: 1 },
            },
            {
              kind: "area",
              id: "carpark",
              label: "Car Park",
              fill: "parking",
              cells: { x: 9, y: 5, w: 3, h: 3 },
            },
          ],
        },
      ],
    },
  },
  {
    id: "t1-27",
    task: 1,
    prompt:
      "The plans below show an office layout before and after a recent redesign. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "map",
      title: "Office floor — before and after redesign",
      grid: { cols: 12, rows: 8 },
      views: [
        {
          label: "Before",
          features: [
            {
              kind: "building",
              id: "reception",
              label: "Reception",
              cells: { x: 0, y: 0, w: 3, h: 2 },
            },
            {
              kind: "building",
              id: "office-1",
              label: "Manager's Office",
              cells: { x: 4, y: 0, w: 3, h: 2 },
            },
            {
              kind: "building",
              id: "office-2",
              label: "Manager's Office",
              cells: { x: 8, y: 0, w: 4, h: 2 },
            },
            {
              kind: "building",
              id: "cubicles",
              label: "Cubicles",
              cells: { x: 0, y: 3, w: 12, h: 3 },
            },
            {
              kind: "building",
              id: "kitchen",
              label: "Kitchen",
              cells: { x: 0, y: 7, w: 3, h: 1 },
            },
            {
              kind: "building",
              id: "meeting-room",
              label: "Meeting Room",
              cells: { x: 5, y: 7, w: 7, h: 1 },
            },
          ],
        },
        {
          label: "After",
          features: [
            {
              kind: "building",
              id: "reception",
              label: "Reception",
              cells: { x: 0, y: 0, w: 3, h: 2 },
            },
            {
              kind: "building",
              id: "phone-booths",
              label: "Phone Booths",
              cells: { x: 4, y: 0, w: 3, h: 2 },
            },
            {
              kind: "building",
              id: "meeting-rooms",
              label: "Meeting Rooms",
              cells: { x: 8, y: 0, w: 4, h: 2 },
            },
            {
              kind: "building",
              id: "open-desks",
              label: "Open-Plan Desks",
              cells: { x: 0, y: 3, w: 8, h: 3 },
            },
            {
              kind: "area",
              id: "breakout",
              label: "Breakout Lounge",
              fill: "park",
              cells: { x: 8, y: 3, w: 4, h: 3 },
            },
            {
              kind: "area",
              id: "kitchen",
              label: "Kitchen & Café",
              fill: "plaza",
              cells: { x: 0, y: 7, w: 5, h: 1 },
            },
            {
              kind: "building",
              id: "quiet-room",
              label: "Quiet Room",
              cells: { x: 6, y: 7, w: 2, h: 1 },
            },
            {
              kind: "building",
              id: "collab-zone",
              label: "Collaboration Zone",
              cells: { x: 9, y: 7, w: 3, h: 1 },
            },
          ],
        },
      ],
    },
  },
  {
    id: "t1-28",
    task: 1,
    prompt:
      "The maps below show a city park as it is today and as it will appear after a proposed redevelopment. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    minWords: 150,
    visualData: {
      type: "map",
      title: "Riverside City Park — current and proposed layout",
      grid: { cols: 12, rows: 8 },
      views: [
        {
          label: "Current",
          features: [
            {
              kind: "area",
              id: "river",
              label: "River",
              fill: "water",
              cells: { x: 0, y: 0, w: 12, h: 1 },
            },
            {
              kind: "area",
              id: "lawn",
              label: "Open Lawn",
              fill: "park",
              cells: { x: 0, y: 2, w: 8, h: 5 },
            },
            {
              kind: "road",
              id: "path",
              label: "Footpath",
              path: [
                [0, 5],
                [12, 5],
              ],
            },
            {
              kind: "building",
              id: "kiosk",
              label: "Kiosk",
              cells: { x: 9, y: 2, w: 2, h: 1 },
            },
            {
              kind: "area",
              id: "carpark",
              label: "Car Park",
              fill: "parking",
              cells: { x: 8, y: 6, w: 4, h: 2 },
            },
            {
              kind: "marker",
              id: "fountain",
              label: "Fountain",
              icon: "Droplets",
              cell: { x: 4, y: 4 },
            },
          ],
        },
        {
          label: "Proposed",
          features: [
            {
              kind: "area",
              id: "river",
              label: "River",
              fill: "water",
              cells: { x: 0, y: 0, w: 12, h: 1 },
            },
            {
              kind: "area",
              id: "lawn",
              label: "Open Lawn",
              fill: "park",
              cells: { x: 0, y: 2, w: 5, h: 3 },
            },
            {
              kind: "area",
              id: "playground",
              label: "Playground",
              fill: "plaza",
              cells: { x: 5, y: 2, w: 3, h: 3 },
            },
            {
              kind: "building",
              id: "cafe",
              label: "Café",
              cells: { x: 9, y: 2, w: 3, h: 2 },
            },
            {
              kind: "road",
              id: "path",
              label: "Footpath",
              path: [
                [0, 5],
                [12, 5],
              ],
            },
            {
              kind: "area",
              id: "garden",
              label: "Community Garden",
              fill: "park",
              cells: { x: 0, y: 6, w: 5, h: 2 },
            },
            {
              kind: "area",
              id: "amphitheatre",
              label: "Amphitheatre",
              fill: "plaza",
              cells: { x: 5, y: 6, w: 3, h: 2 },
            },
            {
              kind: "building",
              id: "bike-hub",
              label: "Bike Hub",
              cells: { x: 8, y: 6, w: 4, h: 2 },
            },
            {
              kind: "marker",
              id: "fountain",
              label: "Fountain",
              icon: "Droplets",
              cell: { x: 2, y: 4 },
            },
          ],
        },
      ],
    },
  },
  {
    id: "t2-1",
    task: 2,
    prompt:
      "Some people think that universities should focus on preparing students for employment. Others believe the purpose of university is broader than this. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-2",
    task: 2,
    prompt:
      "In many countries, the gap between the rich and the poor is increasing. What are the causes of this? What measures could be taken to reduce it?",
    minWords: 250,
  },
  {
    id: "t2-3",
    task: 2,
    prompt:
      "Technology has made it easier for people to work from home. What are the advantages and disadvantages of this trend?",
    minWords: 250,
  },
  {
    id: "t2-4",
    task: 2,
    prompt:
      "Some people believe that children should be taught how to manage money at primary school, while others think this is a subject better learned at home. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-5",
    task: 2,
    prompt:
      "In many countries today, people rely heavily on private cars as their main form of transport. What problems does this cause, and what measures could be taken to address them?",
    minWords: 250,
  },
  {
    id: "t2-6",
    task: 2,
    prompt:
      "Some people think that governments should invest more money in public libraries, while others argue that these funds would be better spent on digital services. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-7",
    task: 2,
    prompt:
      "The widespread use of social media has changed the way people communicate with one another. To what extent do you agree or disagree that this change has had a positive effect on society?",
    minWords: 250,
  },
  {
    id: "t2-8",
    task: 2,
    prompt:
      "In some countries, an increasing number of people are choosing to live alone rather than with family or partners. Why is this happening, and what effects does it have on society?",
    minWords: 250,
  },
  {
    id: "t2-9",
    task: 2,
    prompt:
      "Many young people today leave their hometowns to study or work in larger cities. What are the advantages and disadvantages of this trend?",
    minWords: 250,
  },
  {
    id: "t2-10",
    task: 2,
    prompt:
      "Some people believe that the best way to reduce crime is to give longer prison sentences, while others think there are more effective alternatives. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-11",
    task: 2,
    prompt:
      "In many countries, traditional festivals and customs are disappearing as a result of globalisation. What are the causes of this trend, and what can be done to preserve cultural traditions?",
    minWords: 250,
  },
  {
    id: "t2-12",
    task: 2,
    prompt:
      "Some people think that scientific research should be carried out and funded by governments, while others believe it is better left to private companies. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-13",
    task: 2,
    prompt:
      "It is often said that tourism brings economic benefits but damages the environment and local cultures. To what extent do you agree or disagree?",
    minWords: 250,
  },
  {
    id: "t2-14",
    task: 2,
    prompt:
      "In many countries, obesity rates among children are rising rapidly. What are the main causes of this problem, and what measures can be taken to tackle it?",
    minWords: 250,
  },
  {
    id: "t2-15",
    task: 2,
    prompt:
      "Some people believe that the news media has too much influence on public opinion in modern society. To what extent do you agree or disagree?",
    minWords: 250,
  },
  {
    id: "t2-16",
    task: 2,
    prompt:
      "More and more people are working past the traditional retirement age. What are the advantages and disadvantages of this development?",
    minWords: 250,
  },
  {
    id: "t2-17",
    task: 2,
    prompt:
      "Some people think that children should begin learning a foreign language at primary school, while others believe it is better to start in secondary school. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-18",
    task: 2,
    prompt:
      "In many large cities around the world, there is a shortage of affordable housing. What are the reasons for this, and what can governments do to solve the problem?",
    minWords: 250,
  },
  {
    id: "t2-19",
    task: 2,
    prompt:
      "Some people believe that zoos are cruel and should be closed down, while others argue that they play an important role in protecting endangered species. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-20",
    task: 2,
    prompt:
      "The use of artificial intelligence in the workplace is increasing rapidly. Do the advantages of this development outweigh the disadvantages?",
    minWords: 250,
  },
  {
    id: "t2-21",
    task: 2,
    prompt:
      "In some countries, governments are encouraging industries and businesses to move to rural areas rather than remain in city centres. Do the benefits of this policy outweigh the drawbacks?",
    minWords: 250,
  },
  {
    id: "t2-22",
    task: 2,
    prompt:
      "Many people today spend a significant amount of their free time looking at screens. Why is this the case, and what effects does it have on physical and mental health?",
    minWords: 250,
  },
  {
    id: "t2-23",
    task: 2,
    prompt:
      "Some people argue that the government should provide free healthcare to all citizens, while others believe individuals should be responsible for their own medical expenses. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-24",
    task: 2,
    prompt:
      "In many parts of the world, fewer people are reading books for pleasure. What are the reasons for this trend, and what can be done to encourage reading?",
    minWords: 250,
  },
  {
    id: "t2-25",
    task: 2,
    prompt:
      "Some people believe that space exploration is a waste of money and resources, while others argue that it is essential for the future of humanity. Discuss both views and give your own opinion.",
    minWords: 250,
  },
  {
    id: "t2-26",
    task: 2,
    prompt:
      "In many countries, people are choosing to have children later in life. What are the reasons for this, and what effects does it have on families and society?",
    minWords: 250,
  },
  {
    id: "t2-27",
    task: 2,
    prompt:
      "Advertising has become a powerful force in modern life, influencing what people buy and how they behave. To what extent do you agree or disagree that advertising has a harmful effect on society?",
    minWords: 250,
  },
  {
    id: "t2-28",
    task: 2,
    prompt:
      "Some people think that international sporting events help to promote peace and understanding between countries, while others believe they create tension and rivalry. Discuss both views and give your own opinion.",
    minWords: 250,
  },
];

export const speakingCueCards: SpeakingCueCard[] = [
  {
    id: "s1",
    topic: "Describe a place you have visited that you found very interesting.",
    bulletPoints: [
      "Where it is",
      "When you went there",
      "What you did there",
      "Explain why you found it interesting",
    ],
    theme: "place",
  },
  {
    id: "s2",
    topic: "Describe a person who has had a great influence on your life.",
    bulletPoints: [
      "Who this person is",
      "How long you have known them",
      "What qualities they have",
      "Explain how they have influenced you",
    ],
    theme: "person",
  },
  {
    id: "s3",
    topic: "Describe a skill you would like to learn.",
    bulletPoints: [
      "What the skill is",
      "Why you want to learn it",
      "How you would learn it",
      "Explain how it would be useful to you",
    ],
    theme: "skill",
  },
  {
    id: "s4",
    topic: "Describe a book that you have recently read and enjoyed.",
    bulletPoints: [
      "What the book was about",
      "When and where you read it",
      "Who recommended it to you, or how you came across it",
      "Explain why you enjoyed reading this book",
    ],
    theme: "media",
  },
  {
    id: "s5",
    topic: "Describe a piece of technology that you find useful in your daily life.",
    bulletPoints: [
      "What it is",
      "How often you use it",
      "What you use it for",
      "Explain why you find it so useful",
    ],
    theme: "object",
  },
  {
    id: "s6",
    topic: "Describe a time when you had to wake up very early in the morning.",
    bulletPoints: [
      "When it was",
      "Why you had to wake up early",
      "What you did that day",
      "Explain how you felt about waking up so early",
    ],
    theme: "event",
  },
  {
    id: "s7",
    topic: "Describe an event from your childhood that you remember well.",
    bulletPoints: [
      "When it happened",
      "Where it took place",
      "Who was with you",
      "Explain why you still remember this event",
    ],
    theme: "event",
  },
  {
    id: "s8",
    topic: "Describe a healthy habit that you have.",
    bulletPoints: [
      "What the habit is",
      "When you started doing it",
      "How often you do it",
      "Explain why this habit is important to you",
    ],
    theme: "goal",
  },
  {
    id: "s9",
    topic: "Describe a goal that you hope to achieve in the future.",
    bulletPoints: [
      "What the goal is",
      "When you started thinking about it",
      "What you are doing to achieve it",
      "Explain why this goal is important to you",
    ],
    theme: "goal",
  },
  {
    id: "s10",
    topic: "Describe a restaurant that you enjoy going to.",
    bulletPoints: [
      "Where it is",
      "What kind of food it serves",
      "How often you go there",
      "Explain why you enjoy eating at this restaurant",
    ],
    theme: "place",
  },
  {
    id: "s11",
    topic: "Describe a teacher who has influenced you.",
    bulletPoints: [
      "Who the teacher was",
      "What subject they taught",
      "When you were taught by them",
      "Explain how this teacher influenced you",
    ],
    theme: "person",
  },
  {
    id: "s12",
    topic: "Describe a piece of clothing that you often wear.",
    bulletPoints: [
      "What it is",
      "Where you got it from",
      "When you usually wear it",
      "Explain why you like wearing this item of clothing",
    ],
    theme: "object",
  },
  {
    id: "s13",
    topic: "Describe a foreign country you would like to visit.",
    bulletPoints: [
      "Which country it is",
      "How you first heard about it",
      "What you would like to do there",
      "Explain why you want to visit this country",
    ],
    theme: "place",
  },
  {
    id: "s14",
    topic: "Describe a time when you helped someone.",
    bulletPoints: [
      "Who you helped",
      "When it was",
      "What you did to help them",
      "Explain how you felt about helping this person",
    ],
    theme: "experience",
  },
  {
    id: "s15",
    topic: "Describe a hobby that you enjoy doing in your free time.",
    bulletPoints: [
      "What the hobby is",
      "When you started doing it",
      "How often you do it",
      "Explain why you enjoy this hobby",
    ],
    theme: "activity",
  },
  {
    id: "s16",
    topic: "Describe a family member you are close to.",
    bulletPoints: [
      "Who the person is",
      "What they are like",
      "What you usually do together",
      "Explain why you are close to this family member",
    ],
    theme: "person",
  },
  {
    id: "s17",
    topic: "Describe a gift that you gave to someone.",
    bulletPoints: [
      "What the gift was",
      "Who you gave it to",
      "Why you chose that gift",
      "Explain how the person reacted when they received it",
    ],
    theme: "event",
  },
  {
    id: "s18",
    topic: "Describe a song or piece of music that you like.",
    bulletPoints: [
      "What the song is",
      "When you first heard it",
      "How often you listen to it",
      "Explain why you like this song",
    ],
    theme: "media",
  },
  {
    id: "s19",
    topic: "Describe a time when you were very busy.",
    bulletPoints: [
      "When it was",
      "Why you were so busy",
      "What you had to do",
      "Explain how you managed your time during this period",
    ],
    theme: "experience",
  },
  {
    id: "s20",
    topic: "Describe a park or garden that you like to visit.",
    bulletPoints: [
      "Where it is",
      "What it looks like",
      "What you usually do there",
      "Explain why you enjoy visiting this place",
    ],
    theme: "place",
  },
  {
    id: "s21",
    topic: "Describe a sport that you enjoy watching or playing.",
    bulletPoints: [
      "What the sport is",
      "When you first became interested in it",
      "Where you watch or play it",
      "Explain why you enjoy this sport",
    ],
    theme: "activity",
  },
  {
    id: "s22",
    topic: "Describe a challenging decision that you had to make.",
    bulletPoints: [
      "What the decision was about",
      "When you had to make it",
      "What options you considered",
      "Explain why this decision was difficult for you",
    ],
    theme: "experience",
  },
  {
    id: "s23",
    topic: "Describe a traditional food from your country.",
    bulletPoints: [
      "What the food is",
      "What ingredients are used to make it",
      "When people usually eat it",
      "Explain why this food is important in your culture",
    ],
    theme: "food",
  },
  {
    id: "s24",
    topic: "Describe a website that you often visit.",
    bulletPoints: [
      "What the website is",
      "How you discovered it",
      "What kind of information it provides",
      "Explain why you visit this website so often",
    ],
    theme: "object",
  },
  {
    id: "s25",
    topic: "Describe a time when you received good news.",
    bulletPoints: [
      "What the news was",
      "When you received it",
      "Who told you the news",
      "Explain how you felt when you heard it",
    ],
    theme: "event",
  },
  {
    id: "s26",
    topic: "Describe a long journey that you remember well.",
    bulletPoints: [
      "Where you went",
      "How you travelled",
      "Who you were with",
      "Explain why you remember this journey so well",
    ],
    theme: "place",
  },
  {
    id: "s27",
    topic: "Describe a small business that you would like to start.",
    bulletPoints: [
      "What kind of business it would be",
      "Where you would open it",
      "Who would be your customers",
      "Explain why you would like to start this type of business",
    ],
    theme: "goal",
  },
  {
    id: "s28",
    topic: "Describe a photograph that is important to you.",
    bulletPoints: [
      "What is in the photograph",
      "When it was taken",
      "Who took it",
      "Explain why this photograph is important to you",
    ],
    theme: "object",
  },
  {
    id: "s29",
    topic: "Describe a public building that you find interesting.",
    bulletPoints: [
      "Where it is located",
      "What it looks like",
      "What it is used for",
      "Explain why you find this building interesting",
    ],
    theme: "place",
  },
  {
    id: "s30",
    topic: "Describe an occasion when you tried something for the first time.",
    bulletPoints: [
      "What you tried",
      "When and where it was",
      "Who you were with",
      "Explain how you felt about trying it",
    ],
    theme: "experience",
  },
  {
    id: "s31",
    topic: "Describe an interesting conversation you had with a stranger.",
    bulletPoints: [
      "Where you were",
      "Who the person was",
      "What you talked about",
      "Explain why you found the conversation interesting",
    ],
    theme: "person",
  },
  {
    id: "s32",
    topic: "Describe an activity that you enjoy doing outdoors.",
    bulletPoints: [
      "What the activity is",
      "Where you usually do it",
      "Who you do it with",
      "Explain why you enjoy doing this activity outdoors",
    ],
    theme: "activity",
  },
  {
    id: "s33",
    topic: "Describe a language, other than English, that you would like to learn.",
    bulletPoints: [
      "Which language it is",
      "Where this language is spoken",
      "How you would learn it",
      "Explain why you would like to learn this language",
    ],
    theme: "skill",
  },
];

export const speakingPart1Topics: SpeakingPart1TopicSet[] = [
  {
    id: "p1-hometown",
    topic: "Hometown",
    questions: [
      "Where is your hometown?",
      "What do you like most about your hometown?",
      "Has your hometown changed much in recent years?",
      "Would you recommend it as a place to visit? Why?",
    ],
  },
  {
    id: "p1-work-study",
    topic: "Work or study",
    questions: [
      "Do you work or are you a student?",
      "What do you enjoy most about it?",
      "What is a typical day like for you?",
      "What are your plans for the future?",
    ],
  },
  {
    id: "p1-hobbies",
    topic: "Hobbies & free time",
    questions: [
      "What do you like to do in your free time?",
      "How did you become interested in this?",
      "Do you prefer doing hobbies alone or with others?",
      "Would you like to try any new hobbies?",
    ],
  },
  {
    id: "p1-food",
    topic: "Food",
    questions: [
      "What kind of food do you usually eat?",
      "Do you prefer cooking at home or eating out?",
      "Is there a traditional dish you especially enjoy?",
      "Have your eating habits changed since you were a child?",
    ],
  },
  {
    id: "p1-weather",
    topic: "Weather",
    questions: [
      "What kind of weather do you like?",
      "What is the weather usually like in your country?",
      "Does the weather affect your mood?",
      "Would you prefer to live somewhere with a different climate?",
    ],
  },
  {
    id: "p1-technology",
    topic: "Technology",
    questions: [
      "How often do you use a smartphone?",
      "What apps do you use most?",
      "Has technology made your life easier or harder?",
      "Do you think people rely too much on technology?",
    ],
  },
  {
    id: "p1-travel",
    topic: "Travel",
    questions: [
      "Do you enjoy travelling?",
      "Where was the last place you travelled to?",
      "Do you prefer travelling alone or with others?",
      "Is there somewhere you would really like to visit?",
    ],
  },
  {
    id: "p1-music",
    topic: "Music",
    questions: [
      "What kind of music do you listen to?",
      "When do you usually listen to music?",
      "Have your music tastes changed over the years?",
      "Do you play any musical instruments?",
    ],
  },
  {
    id: "p1-reading",
    topic: "Reading",
    questions: [
      "Do you enjoy reading?",
      "What kind of books do you like?",
      "Do you prefer paper books or ebooks?",
      "How important do you think reading is for children?",
    ],
  },
  {
    id: "p1-clothes",
    topic: "Clothes",
    questions: [
      "What kind of clothes do you usually wear?",
      "Do you enjoy shopping for clothes?",
      "How important is fashion to you?",
      "Do people in your country dress differently on special occasions?",
    ],
  },
  {
    id: "p1-weekend",
    topic: "Weekends",
    questions: [
      "What do you usually do at weekends?",
      "Do you prefer a quiet weekend or a busy one?",
      "Is your weekend different from your weekdays?",
      "Would you like to change how you spend your weekends?",
    ],
  },
  {
    id: "p1-sleep",
    topic: "Sleep",
    questions: [
      "How many hours of sleep do you usually get?",
      "Do you take naps during the day?",
      "What do you do if you can't sleep?",
      "Do you think sleep is important for health?",
    ],
  },
];

export const speakingPart3Questions: Record<SpeakingTheme, string[]> = {
  place: [
    "Why do people enjoy visiting new places?",
    "How has tourism changed in your country in recent decades?",
    "What are the downsides of popular places becoming too crowded?",
    "Do you think people appreciate their own country less than foreign destinations?",
    "How can cities be made more attractive for both residents and visitors?",
  ],
  person: [
    "What qualities make someone a positive influence on others?",
    "Do you think role models are more or less important today than in the past?",
    "How does family influence a person's development compared with friends?",
    "Can someone famous still be a good role model if they make mistakes publicly?",
    "Is it better to have one strong mentor or many casual influences?",
  ],
  object: [
    "How have everyday objects changed in the last twenty years?",
    "Do people form genuine emotional attachments to objects?",
    "Is it better to own many things or live more simply?",
    "How is technology changing what we consider 'essential' possessions?",
    "Why do some old-fashioned objects remain popular despite newer alternatives?",
  ],
  event: [
    "Why do certain events stay in our memory for a long time?",
    "How important are public celebrations in bringing a community together?",
    "Do you think traditional events are losing their meaning?",
    "How has social media changed the way people experience events?",
    "Are private family events more meaningful than large public ones?",
  ],
  experience: [
    "Do difficult experiences teach us more than easy ones?",
    "How does a person's age affect what they learn from an experience?",
    "Is it better to try many different things or focus deeply on one area?",
    "How important is it to step outside your comfort zone?",
    "Can other people's experiences be as valuable as our own?",
  ],
  skill: [
    "Are practical skills more useful than academic knowledge in today's world?",
    "Who should be responsible for teaching children life skills — schools or parents?",
    "Is it easier or harder to learn new skills as we get older?",
    "How has the internet changed the way people learn skills?",
    "Are there any skills that will always be relevant regardless of technological change?",
  ],
  activity: [
    "Why do people need leisure activities in modern life?",
    "Are group activities more beneficial than solo ones?",
    "How has the way people spend their free time changed over the years?",
    "Should governments do more to encourage people to be active?",
    "Do children today have enough opportunities to be physically active?",
  ],
  media: [
    "How has the way people consume media changed in the past decade?",
    "Do you think traditional media (books, newspapers) still have a role today?",
    "Is it a problem that people spend so much time on screens?",
    "How does media influence public opinion?",
    "Should media content for young people be more tightly regulated?",
  ],
  food: [
    "How important is traditional food to a country's identity?",
    "Are fast-food chains damaging local food cultures?",
    "Do you think people eat more healthily today than in the past?",
    "Should schools teach cooking as a core subject?",
    "How does the way families share meals affect relationships?",
  ],
  goal: [
    "Why is it important for people to have long-term goals?",
    "Are short-term goals or long-term goals more motivating?",
    "How do cultural expectations shape the goals young people set?",
    "Is it a problem if someone changes their goals often?",
    "Should schools spend more time helping students set personal goals?",
  ],
};

export function getRandomWritingPrompt(task?: 1 | 2): WritingPrompt {
  const filtered = task
    ? writingPrompts.filter((p) => p.task === task)
    : writingPrompts;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getRandomCueCard(): SpeakingCueCard {
  return speakingCueCards[
    Math.floor(Math.random() * speakingCueCards.length)
  ];
}

export function getRandomCueCardByTheme(theme: SpeakingTheme): SpeakingCueCard {
  const filtered = speakingCueCards.filter((c) => c.theme === theme);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getRandomPart1Topics(n = 3): SpeakingPart1TopicSet[] {
  const shuffled = [...speakingPart1Topics].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function getPart3QuestionsForTheme(theme: SpeakingTheme): string[] {
  return speakingPart3Questions[theme];
}
