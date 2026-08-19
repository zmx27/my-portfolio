export type ProjectCategory = "embedded" | "software";

export interface CodeSnippet {
  code: string;
  lang: string;
  filename: string;
  description: string;
}

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
  codeSnippet?: CodeSnippet;
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
    codeSnippet: {
      filename: "gps.ino",
      lang: "cpp",
      description: "Busy-waits for the display interval while continuing to feed every incoming byte to the NMEA parser, so a slow 4-second LCD refresh never drops GPS data arriving in between.",
      code: `static void GPSDelay(unsigned long ms)
{
  unsigned long start = millis();
  do
  {
    // The GPS module is connected to Serial1
    while (Serial1.available())
      gps.encode(Serial1.read());
  } while (millis() - start < ms);
}`,
    },
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
    codeSnippet: {
      filename: "main.c",
      lang: "c",
      description: "Bit-bangs one byte off the DHT11's single-wire line by timing how long the pin stays high after each 40µs window — no UART/SPI peripheral involved, just a hardware timer and GPIO reads.",
      code: `uint8_t DHT11_Read (void)
{
	uint8_t i,j;
	for (j=0; j<8; j++) // Reads a 8 bit data byte
	{
		while ((!HAL_GPIO_ReadPin(DHT11_PORT, DHT11_PIN))); // Wait for pin to go high
		delay(40); // Wait for 40us
		if ((!HAL_GPIO_ReadPin(DHT11_PORT, DHT11_PIN))) // Pin is low
		{
			i &= ~(1 << (7-j)); // Write 0 (bit at the jth position will be forced to 0 by & operator)
		}
		else i |= (1<< (7-j)); // Write 1 when pin is high (bit is forced to 1 by | operator)
		while ((HAL_GPIO_ReadPin(DHT11_PORT, DHT11_PIN))); // Wait for pin to go back low
	}
	return i;
}`,
    },
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
    codeSnippet: {
      filename: "FruitNinja.pde",
      lang: "java",
      description: "The slice check: cursor distance to the fruit's center must be inside its radius, and the cursor must have moved far enough between frames to count as a slice rather than a graze. (Trimmed — the full handler also branches on bombs, power-ups, and menu selection.)",
      code: `void mouseDragged() {
  for (int i = 0; i < fruitBox.size(); i++) {
    Fruit curr = fruitBox.get(i);
    //Slicing detection
    if (dist(curr.getX(), curr.getY(), mouseX, mouseY) < curr.getRadius()
      && dist(mouseX, mouseY, pmouseX, pmouseY) > curr.getRadius()/48
      ) {
      // ...

      //slicing fruit produces two new images of sliced fruit: top and bottom
      PImage topSprite = loadImage(fruitTop);
      PImage bottomSprite = loadImage(fruitBottom);
      Fruit fruit1 = new Fruit(xCoor, yCoor, 5, 0, 0.05, direction, topSprite);
      Fruit fruit2 = new Fruit(xCoor, yCoor, -5, 0, 0.05, -direction, bottomSprite);
      fruit1.setSliced();
      fruit2.setSliced();
    }
  }
}`,
    },
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
    codeSnippet: {
      filename: "flappyElectron.py",
      lang: "python",
      description: "The two force calculations recomputed every frame: the electric force from field strength/direction, and the magnetic force via the actual v×B cross product with the electron's current velocity.",
      code: `#positive = upwards, negative = downwards
def eField(strength, direction):
    field = strength*direction*e_field
    force = -q*field
    return force

#positive = out of the page, negative = into the page
def bField(strength, direction):
    field = strength*direction*b_field
    force = -q*cross(obj.vel, field)
    return force`,
    },
  },
  {
    slug: "fpga-audio-synthesizer",
    title: "FPGA Digital Audio Synthesizer",
    tagline: "A hardware synthesizer and automated player piano built entirely in VHDL on a Xilinx Artix-7 FPGA.",
    category: "embedded",
    overview:
      "A two-phase FPGA project: a manual electric piano that drives a piezo speaker directly from cascaded hardware clock dividers, then extended into an automated \"player piano\" that sequences a 32-beat rendition of \"Mary Had a Little Lamb\" from a hardware finite-state machine — no microprocessor anywhere in the signal path.",
    bullets: [
      "Built a chain of custom loadable clock-divider components in VHDL (clk_dvd.vhd) to derive precise note frequencies from the Basys 3's 100MHz system clock, routed through a Mixed-Mode Clock Manager (MMCME2_BASE) and Xilinx global clock buffers for deskew.",
      "Designed a note-lookup ROM and a time-multiplexed 4-digit 7-segment display driver as synchronous VHDL processes; divider constants were pre-computed with a small Perl script rather than hand-calculated.",
      "Extended the manual piano into an automated player piano: a tempo generator and 32-step sequencer (a hardware FSM, not a microprocessor) step through a hard-coded \"Mary Had a Little Lamb,\" muting each note for the final 20% of its beat window so repeated notes don't bleed into one continuous tone.",
    ],
    tags: ["VHDL", "Xilinx Artix-7", "Vivado", "Clock Dividers", "FSM"],
    sourceUrl: "https://github.com/zmx27/FPGA-Audio-Synthesizer",
    sourceLabel: "Source",
    image: "/images/fpga-audio-synthesizer.jpg",
    video: "/videos/fpga-audio-synthesizer.mp4",
    codeSnippet: {
      filename: "piano_auto.vhd",
      lang: "vhdl",
      description: "The articulation fix: without this, two consecutive beats on the same note play as one continuous tone. Muting the output for the last 20% of every beat window recreates the gap of a real key-release.",
      code: `audio_output:
process (CLK,RST) begin
    if (RST = '1') then
        note_next <= (others => '0');
    elsif (CLK'event and CLK = '1') then
        if (playing = '1') then
            -- Articulation: Create a small gap of silence between beats
            if (beat_counter > 4000) then
                note_next <= "00000";   -- Mute for the last 20% of the beat
            else
                note_next <= auto_note; -- Play the note from the ROM
            end if;
        else
            -- If we haven't pressed Play yet, remain completely silent
            note_next <= "00000";
        end if;
    end if;
end process;`,
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
