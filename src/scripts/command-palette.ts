interface Command {
  label: string;
  keywords: string;
  href: string;
  group: string;
  external?: boolean;
}

const root = document.getElementById("command-palette");
const backdrop = document.getElementById("command-palette-backdrop");
const input = document.getElementById("command-palette-input") as HTMLInputElement | null;
const resultsEl = document.getElementById("command-palette-results");
const emptyEl = document.getElementById("command-palette-empty");
const trigger = document.getElementById("command-palette-trigger");

if (root && input && resultsEl && emptyEl) {
  const commands: Command[] = JSON.parse(root.dataset.commands || "[]");
  let activeIndex = 0;
  let filtered: Command[] = commands;
  let lastFocused: HTMLElement | null = null;

  function render() {
    resultsEl!.innerHTML = "";

    if (filtered.length === 0) {
      emptyEl!.classList.remove("hidden");
      input!.removeAttribute("aria-activedescendant");
      return;
    }
    emptyEl!.classList.add("hidden");

    let currentGroup = "";
    filtered.forEach((cmd, i) => {
      if (cmd.group !== currentGroup) {
        currentGroup = cmd.group;
        const heading = document.createElement("li");
        heading.className = "px-4 pt-2 pb-1 font-mono text-[10px] uppercase tracking-wide text-text-secondary";
        heading.textContent = currentGroup;
        resultsEl!.appendChild(heading);
      }

      const li = document.createElement("li");
      li.id = `cmd-item-${i}`;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", String(i === activeIndex));
      li.className =
        "px-4 py-2 text-sm cursor-pointer flex items-center justify-between gap-2 " +
        (i === activeIndex ? "bg-accent text-bg" : "text-text hover:bg-surface");

      const label = document.createElement("span");
      label.textContent = cmd.label;
      li.appendChild(label);

      if (cmd.external) {
        const ext = document.createElement("span");
        ext.className = "font-mono text-[10px] opacity-70";
        ext.textContent = "↗";
        li.appendChild(ext);
      }

      li.addEventListener("mouseenter", () => {
        activeIndex = i;
        render();
      });
      li.addEventListener("click", () => activate(cmd));
      resultsEl!.appendChild(li);
    });

    input!.setAttribute("aria-activedescendant", `cmd-item-${activeIndex}`);
  }

  function activate(cmd: Command) {
    close();
    if (cmd.external) {
      window.open(cmd.href, "_blank", "noopener");
    } else {
      window.location.href = cmd.href;
    }
  }

  function filterCommands(query: string) {
    const q = query.trim().toLowerCase();
    filtered = q === "" ? commands : commands.filter((c) => c.keywords.includes(q) || c.label.toLowerCase().includes(q));
    activeIndex = 0;
    render();
  }

  function scrollActiveIntoView() {
    document.getElementById(`cmd-item-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }

  function isOpen() {
    return root!.classList.contains("is-open");
  }

  function open() {
    lastFocused = document.activeElement as HTMLElement;
    root!.classList.add("is-open");
    input!.value = "";
    filterCommands("");
    input!.focus();
    document.body.style.overflow = "hidden";
  }

  function close() {
    root!.classList.remove("is-open");
    document.body.style.overflow = "";
    lastFocused?.focus();
  }

  input.addEventListener("input", () => filterCommands(input!.value));

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
      render();
      scrollActiveIntoView();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      render();
      scrollActiveIntoView();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[activeIndex];
      if (cmd) activate(cmd);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      // Only one focusable control while open (the input), so just keep focus there.
      e.preventDefault();
    }
  });

  backdrop?.addEventListener("click", close);
  trigger?.addEventListener("click", () => (isOpen() ? close() : open()));

  document.addEventListener("keydown", (e) => {
    const isMod = e.metaKey || e.ctrlKey;
    if (isMod && e.key.toLowerCase() === "k") {
      e.preventDefault();
      isOpen() ? close() : open();
    } else if (e.key === "Escape" && isOpen()) {
      close();
    }
  });
}
