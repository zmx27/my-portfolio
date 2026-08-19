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
    slug: "fpga-audio-synthesizer",
    title: "FPGA Digital Audio Synthesizer",
    tagline: "A hardware synthesizer and automated player piano, built entirely in VHDL on a Xilinx Artix-7 FPGA.",
    category: "embedded",
    overview:
      "A two-part FPGA project. It started as a manual electric piano that drives a piezo speaker directly from a chain of hardware clock dividers, then grew into an automated \"player piano\" that plays a 32-beat version of \"Mary Had a Little Lamb\" from a hardware state machine. There's no microprocessor anywhere in the signal path, just hardware logic.",
    bullets: [
      "Built a chain of custom clock-divider components in VHDL to get precise note frequencies out of the Basys 3's 100MHz system clock, routed through a Mixed-Mode Clock Manager and Xilinx's global clock buffers for deskew.",
      "Designed a note-lookup table and a time-multiplexed 4-digit 7-segment display driver as synchronous VHDL processes. The divider constants were pre-computed with a small Perl script instead of by hand.",
      "Extended the manual piano into an automated player piano: a tempo generator and 32-step sequencer (a hardware FSM, not a microprocessor) step through a hard-coded \"Mary Had a Little Lamb.\" Every beat gets muted for its final 20%, so back-to-back repeated notes sound distinct instead of blurring together. The tradeoff is that held notes, like a half note spanning two beats, get those same tiny gaps too, since the hardware has no way to tell a held note apart from a repeated one.",
    ],
    tags: ["VHDL", "Xilinx Artix-7", "Vivado", "Clock Dividers", "FSM"],
    sourceUrl: "https://github.com/zmx27/FPGA-Audio-Synthesizer",
    sourceLabel: "Source",
    image: "/images/fpga-audio-synthesizer.jpg",
    video: "/videos/fpga-audio-synthesizer.mp4",
    codeSnippet: {
      filename: "piano_auto.vhd",
      lang: "vhdl",
      description: "Without this fix, two beats in a row on the same note just sound like one continuous tone. Muting the output for the last 20% of every beat window recreates the little gap you'd get from an actual key release.",
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
  {
    slug: "stm32-environmental-monitor",
    title: "STM32 Environmental Monitor",
    tagline: "Reading temperature and humidity with a DHT11 sensor on an STM32, all in bare-metal C off the HAL.",
    category: "embedded",
    overview:
      "A bare-metal environmental monitor built around an STM32F401RE microcontroller (STM32CubeIDE plus HAL). It talks to a DHT11 temperature and humidity sensor over its single-wire protocol and shows live readings on an I2C 16x2 LCD.",
    bullets: [
      "Built bare-metal C firmware on an STM32F401RE (STM32CubeIDE plus HAL) to drive a DHT11 sensor over its single-wire protocol. It reads and checksum-validates a 40-bit data packet directly through GPIO bit-banging.",
      "Set up a hardware timer (TIM10) for 1µs delays by tuning the 50MHz APB2 timer clock with a 50-1 prescaler. HAL_Delay's millisecond resolution is way too coarse for the DHT11's timing-critical handshake, so this was needed.",
      "Wrote a custom I2C LCD driver (100kHz I2C1) to show live readings, working out the RS/RW/EN and backlight bitmasks for the PCF8574 I2C expander by hand.",
    ],
    tags: ["C", "STM32 HAL", "Bare-metal", "I2C", "Timers"],
    sourceUrl: "https://github.com/zmx27/STM32-as-Sensor",
    sourceLabel: "Source",
    image: "/images/stm32-environmental-monitor.png",
    video: "/videos/stm32-environmental-monitor.mp4",
    codeSnippet: {
      filename: "main.c",
      lang: "c",
      description: "Bit-bangs one byte off the DHT11's single-wire line by timing how long the pin stays high after each 40µs window. No UART or SPI peripheral involved, just a hardware timer and GPIO reads.",
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
    slug: "stm32-gps-tracker",
    title: "STM32 GPS Position Tracker",
    tagline: "Hooking up a GY-NEO6MV2 GPS module to an STM32 Nucleo board to show live coordinates.",
    category: "embedded",
    overview:
      "GPS gives you the latitude and longitude of pretty much anywhere on Earth. This project hooks a GY-NEO6MV2 GPS module up to an STM32F401RE Nucleo board over UART, parses the NMEA sentences it sends, and shows the coordinates on a 16x2 LCD in real time.",
    bullets: [
      "Hooked up a GY-NEO6MV2 GPS module to an STM32F401RE Nucleo board (using the Arduino/STM32duino framework) and used the TinyGPSPlus library to parse live NMEA sentences over a 9600-baud UART connection.",
      "Showed real-time latitude and longitude on a 16x2 I2C LCD. The polling loop keeps feeding incoming serial bytes to the GPS parser during each display interval, so no NMEA data gets dropped.",
      'Added a "Waiting..." fallback for when the module hasn\'t gotten a satellite fix yet. Consumer GPS modules like this one take a little while to get their first fix and are accurate to around 2.5 meters.',
    ],
    tags: ["C++", "Arduino/STM32duino", "TinyGPSPlus", "UART", "I2C"],
    sourceUrl: "https://github.com/zmx27/STM32-as-GPS",
    sourceLabel: "Source",
    image: "/images/stm32-gps-tracker.png",
    video: "/videos/stm32-gps-tracker.mp4",
    codeSnippet: {
      filename: "gps.ino",
      lang: "cpp",
      description: "Waits out the display interval while still feeding every incoming byte to the NMEA parser, so the slow 4-second LCD refresh never drops GPS data that shows up in between.",
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
    slug: "fruit-ninja",
    title: "Fruit Ninja",
    tagline: "A from-scratch recreation of Fruit Ninja's slicing physics, built in Java with Processing.",
    category: "software",
    overview:
      'A recreation of the 2010 mobile game "Fruit Ninja," built in Java with Processing, with two full game modes, combo scoring, and persistent high scores. Fruits launch under gravity, spin as they fly, and split into two halves that keep moving independently when you slice them.',
    bullets: [
      "Recreated Fruit Ninja's core mechanics in Java with Processing: gravity-driven trajectories, continuous 2D rotation, and a slicing mechanic where each half keeps its own velocity and spin after the cut.",
      "Built the object model around a Fruit base class (position, velocity, and acceleration as PVectors, its own rotation, a bomb flag), with a Power class that extends Fruit for collectible power-ups, plus separate classes for combo tracking, splatter stains, and UI buttons.",
      "Built two modes: Arcade (3-life limit, bombs, spawn rate that ramps up over time) and a timed Zen mode with keyboard-triggered Frenzy and Bonus power-ups. Added combo multipliers for slicing multiple fruits at once, plus persistent high-score tracking.",
    ],
    tags: ["Java", "Processing", "OOP", "Game Development"],
    sourceUrl: "https://github.com/zmx27/Fruit_Ninja",
    sourceLabel: "Source (with Kevin Zhou)",
    image: "/images/fruit-ninja.png",
    video: "/videos/fruit-ninja.mp4",
    codeSnippet: {
      filename: "FruitNinja.pde",
      lang: "java",
      description: "The slice check: the cursor has to be within the fruit's radius, and it has to have moved far enough between frames to count as a slice instead of a graze. (Trimmed down here. The full handler also branches on bombs, power-ups, and menu selection.)",
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
      "A physics simulation built in Web VPython (GlowScript), not your typical web app. An electron moves through an obstacle course, and you don't control it directly. Instead you shape the electric and magnetic fields acting on it. The sim computes the Lorentz force every frame and updates the electron's motion in real time.",
    bullets: [
      "Built a 2D physics sandbox in Web VPython that simulates an electron moving through combined electric and magnetic fields, computing the Lorentz force (F = -q(E + v×B)) every frame and updating velocity and position with an Euler step.",
      "Mapped keyboard input to the field settings in real time: arrow keys adjust the electric field's strength and direction, WASD adjusts the magnetic field's. You end up steering the electron indirectly, by shaping the forces acting on it.",
      "Designed a 3-level obstacle course with randomized gap positions and levels that unlock one at a time, plus a full UI flow (title screen, tutorial, level select, pause, reset, return home) built entirely from VPython canvas primitives.",
    ],
    tags: ["Python", "Web VPython (GlowScript)", "Physics Simulation"],
    sourceUrl: "https://www.glowscript.org/#/user/zhin9897/folder/MyPrograms/",
    sourceLabel: "Source",
    image: "/images/flappy-electron.png",
    video: "/videos/flappy-electron.mp4",
    note: "A simulation and physics project, not a typical frontend/backend web app.",
    codeSnippet: {
      filename: "flappyElectron.py",
      lang: "python",
      description: "The two force calculations that run every frame: the electric force from the field's strength and direction, and the magnetic force from the actual v×B cross product with the electron's current velocity.",
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
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
