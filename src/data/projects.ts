export type ProjectCategory = "embedded" | "software";

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  overview: string;
  bullets: string[];
  tags: string[];
  sourceUrl: string;
  sourceLabel: string;
  image: string;
  video?: string;
  note?: string;
}

export const projects: Project[] = [
  {
    slug: "stm32-gps-tracker",
    title: "STM32 GPS Position Tracker",
    tagline: "Interfacing a GY-NEO6MV2 GPS module with an STM32 Nucleo board to display live coordinates.",
    category: "embedded",
    overview:
      "GPS is used to detect the latitude and longitude of any location on Earth. This project interfaces a GY-NEO6MV2 GPS module with an STM32F401RE Nucleo board over UART, parses the incoming NMEA sentences, and displays the resulting coordinates on a 16x2 LCD in real time.",
    bullets: [
      "Interfaced a GY-NEO6MV2 GPS module with an STM32F401RE Nucleo board (Arduino/STM32duino framework), using the TinyGPSPlus library to parse live NMEA sentences over a 9600-baud hardware UART connection.",
      "Displayed real-time latitude/longitude on a 16x2 I2C LCD, with a polling loop that keeps feeding incoming serial bytes to the GPS parser throughout each display interval so no NMEA data is dropped.",
      'Added a "Waiting..." fallback state for when the module hasn\'t yet acquired a satellite fix, reflecting the initial-fix delay and ~2.5m accuracy typical of consumer GPS modules.',
    ],
    tags: ["C++", "Arduino/STM32duino", "TinyGPSPlus", "UART", "I2C"],
    sourceUrl: "https://github.com/zmx27/STM32-as-GPS",
    sourceLabel: "Source",
    image: "/images/stm32-gps-tracker.png",
    video: "/videos/stm32-gps-tracker.mp4",
  },
  {
    slug: "stm32-environmental-monitor",
    title: "STM32 Environmental Monitor",
    tagline: "Bare-metal DHT11 temperature/humidity sensing on an STM32, driven straight off the HAL.",
    category: "embedded",
    overview:
      "A bare-metal environmental monitor built around an STM32F401RE microcontroller (STM32CubeIDE + HAL), interfacing a DHT11 temperature/humidity sensor over its single-wire protocol and rendering live readings on an I2C 16x2 LCD.",
    bullets: [
      "Built bare-metal C firmware on an STM32F401RE (STM32CubeIDE + HAL) to drive a DHT11 sensor over its single-wire protocol, reading and checksum-validating a 40-bit data packet directly via GPIO bit-banging.",
      "Configured a hardware timer (TIM10) for 1µs-resolution delays — HAL_Delay's millisecond resolution is too coarse for DHT11's timing-critical handshake — by tuning the 50MHz APB2 timer clock with a 50-1 prescaler.",
      "Wrote a custom I2C LCD driver (100kHz I2C1) to render live readings, working out the RS/RW/EN and backlight bitmasks for the PCF8574 I2C expander by hand.",
    ],
    tags: ["C", "STM32 HAL", "Bare-metal", "I2C", "Timers"],
    sourceUrl: "https://github.com/zmx27/STM32-as-Sensor",
    sourceLabel: "Source",
    image: "/images/stm32-environmental-monitor.png",
    video: "/videos/stm32-environmental-monitor.mp4",
  },
  {
    slug: "fruit-ninja",
    title: "Fruit Ninja",
    tagline: "A from-scratch recreation of Fruit Ninja's slicing physics in Java (Processing).",
    category: "software",
    overview:
      'A recreation of the 2010 mobile game "Fruit Ninja," built in Java with Processing. Fruits launch under gravity, spin continuously, and split into two independently-moving halves when sliced — across two full game modes with combo scoring and persistent high scores.',
    bullets: [
      "Recreated Fruit Ninja's core mechanics in Java (Processing): gravity-driven trajectories, continuous 2D rotation, and a slicing mechanic where sliced halves independently retain their pre-slice velocity and spin.",
      "Built the object model around a Fruit base class (position/velocity/acceleration as PVectors, per-instance rotation, a bomb flag) with Power extends Fruit for collectible power-ups, plus separate classes for combo tracking, splatter stains, and UI buttons.",
      "Implemented two modes — Arcade (3-life limit, bombs, escalating spawn rate) and a timed Zen mode with keyboard-triggered Frenzy/Bonus power-ups — with combo multipliers for simultaneous slices and persistent high-score tracking.",
    ],
    tags: ["Java", "Processing", "OOP", "Game Development"],
    sourceUrl: "https://github.com/zmx27/Fruit_Ninja",
    sourceLabel: "Source (with Kevin Zhou)",
    image: "/images/fruit-ninja.png",
    video: "/videos/fruit-ninja.mp4",
  },
  {
    slug: "flappy-electron",
    title: "Flappy Electron",
    tagline: "A Flappy Bird-inspired physics sandbox where you steer an electron with E and B fields.",
    category: "software",
    overview:
      "A physics simulation built in Web VPython (GlowScript), not a typical web app. An electron moves through an obstacle course; the player doesn't control it directly, but instead shapes the electric and magnetic fields acting on it — computing the Lorentz force each frame and integrating its motion in real time.",
    bullets: [
      "Built a 2D physics sandbox in Web VPython simulating an electron's motion under combined electric and magnetic fields, computing the Lorentz force (F = -q(E + v×B)) each frame and integrating velocity/position with an Euler step.",
      "Mapped real-time keyboard input to field parameters — arrow keys adjust the electric field's magnitude/direction, WASD adjusts the magnetic field's — so the player steers the electron indirectly, by shaping the forces acting on it.",
      "Designed a 3-level obstacle course with randomized gap positions, sequential level-unlock progression, and a full UI flow (title, tutorial, level select, pause/reset/return-home) built entirely from VPython canvas primitives.",
    ],
    tags: ["Python", "Web VPython (GlowScript)", "Physics Simulation"],
    sourceUrl: "https://www.glowscript.org/#/user/zhin9897/folder/MyPrograms/",
    sourceLabel: "Source",
    image: "/images/flappy-electron.png",
    video: "/videos/flappy-electron.mp4",
    note: "Simulation/physics project — not a typical frontend/backend web app.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
