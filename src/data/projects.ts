import type { ImageMetadata } from "astro";
import imageCensusVisualizer from "../images/projects/census-visualizer.png";
import imageUtahPublicData from "../images/projects/utah-public-data.jpg";
import imageIPIPWorkbench from "../images/projects/ipip-workbench.png";
import imageDaysAliveMenuBar from "../images/projects/days-alive-menu-bar.png";
import imageCS474 from "../images/projects/cs474-spotify-music.jpg";
import imageCS270 from "../images/projects/cs270-nba-predictive-model.jpg";
import imageStat230 from "../images/projects/stat230-figure-weights.png";
import imagePhotography from "../images/projects/photography-sample.jpg";
import imageIdleGameTools from "../images/projects/idle-game-tools.png";


export type Project = {
  title: string;
  mainPage: boolean;
  section: "personal" | "academic" | "other";
  description: string;
  href: string;
  githubUrl?: string;
  categories?: string[];
  img?: ImageMetadata;
  imgAlt?: string;
  imgLicense?: string;
  imgSrc?: string;
};


export const projects: Project[] = [
  {
    title: "Census Visualizer",
    mainPage: true,
    section: "personal",
    categories: ["Data Engineering", "Visualization", "GIS"],
    description:
      "A Python/SQL pipeline and interactive mapping application for exploring American Community Survey data across 400,000+ U.S. geographies.",
    href: "/projects/census-visualizer/",
    githubUrl: "https://github.com/darrenrs/census-visualizer",
    img: imageCensusVisualizer,
    imgAlt:
      "Sample screenshot of Census Visualizer showing Ohio's basic demographics.",
  },
  {
    title: "IPIP Workbench",
    mainPage: false,
    section: "personal",
    categories: ["Psychometrics", "Statistical Analysis"],
    description:
      "A psychometric analysis and interactive web application exploring personality assessments from the International Personality Item Pool through factor analysis.",
    href: "/projects/ipip-workbench/",
    githubUrl: "https://github.com/darrenrs/ipip-workbench",
    img: imageIPIPWorkbench,
    imgAlt:
      "A factor heatmap diagram of the Big Five personality domains from the IPIP Workbench project.",
  },
  {
    title: "Utah Home Values Explorer",
    mainPage: true,
    section: "personal",
    categories: ["Data Engineering", "Geospatial Analysis"],
    description:
      "A data pipeline combining five sources to explore 600,000+ Utah home values, with a web application for comparing cities, counties, ZIP codes, and regions.",
    href: "/projects/utah-home-values/",
    githubUrl: "https://github.com/darrenrs/utah-home-values",
    img: imageUtahPublicData,
    imgAlt: "A subdivision of single-family homes in Spanish Fork, Utah.",
    imgLicense: "public domain",
    imgSrc:
      "https://www.pexels.com/photo/aerial-view-of-houses-in-a-village-5587970/",
  },
  {
    title: "Days Alive Menu Bar",
    mainPage: false,
    section: "personal",
    categories: ["Swift", "macOS Development"],
    description:
      "A lightweight, native macOS app built in Swift that displays your age in the menu bar—a reminder that you're never getting any younger.",
    href: "https://github.com/darrenrs/days-alive-menu-bar",
    githubUrl: "https://github.com/darrenrs/days-alive-menu-bar",
    img: imageDaysAliveMenuBar,
    imgAlt:
      "Sample screenshot of Days Alive Menu Bar showing one billion seconds of life.",
  },
  {
    title: "CS 474: Spotify Playlist Track Predictor",
    mainPage: false,
    section: "academic",
    description:
      "BYU Fall 2023: An LSTM-based playlist continuation experiment combining Spotify audio features, sequence modeling, and a catalog of nearly 5 million songs.",
    href: "/files/cs474-spotify-playlist-track-predictor.pdf",
    img: imageCS474,
    imgAlt: "A closeup photo of a turntable, representing song prediction.",
    imgLicense: "Creative Commons Zero",
    imgSrc: "https://pxhere.com/en/photo/1622585",
  },
  {
    title: "CS 270: NBA Predictive Modeling",
    mainPage: false,
    section: "academic",
    description:
      "BYU Winter 2024: A team project comparing machine learning models for predicting NBA game outcomes and evaluating moneyline betting strategies.",
    href: "/files/cs270-nba-predictive-modeling.pdf",
    img: imageCS270,
    imgAlt: "An NBA game in Boston.",
    imgLicense: "Creative Commons Attribution 2.0 Generic",
    imgSrc: "https://www.flickr.com/photos/rene-germany/131710739/",
  },
  {
    title: "STAT 230: Figure Weights ANOVA Experiment",
    mainPage: false,
    section: "academic",
    description:
      "BYU Winter 2024: A team experiment using ANOVA to test how background noise and access to scratch paper affect performance on Figure Weights reasoning puzzles.",
    href: "/files/stat230-figure-weights-anova-experiment.pdf",
    img: imageStat230,
    imgAlt: "Sample screenshot of a Figure Weights problem.",
  },
  {
    title: "Photography",
    mainPage: false,
    section: "other",
    description:
      "A collection of my favorite photos I have taken over the years. Mainly landscapes, skylines, and liminal spaces.",
    href: "/photos/",
    img: imagePhotography,
    imgAlt:
      "Cypress Cove Scenic View in Monterey County, California (April 23, 2022).",
  },
  {
    title: "Idle Game Tools",
    mainPage: false,
    section: "other",
    description:
      "A collection of community-developed utilities that I have contributed to for selected idle/incremental games.",
    href: "https://idlegametools.com/",
    img: imageIdleGameTools,
    imgAlt:
      "Screenshot of exponential growth with upgrade symbols, representing idle game progress.",
  },
];
