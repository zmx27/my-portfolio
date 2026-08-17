const buttons = document.querySelectorAll<HTMLButtonElement>("[data-filter]");
const cards = document.querySelectorAll<HTMLElement>("#project-grid [data-category]");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    buttons.forEach((b) => {
      b.classList.toggle("bg-accent", b === button);
      b.classList.toggle("text-bg", b === button);
      b.classList.toggle("border-accent", b === button);
      b.classList.toggle("text-text-secondary", b !== button);
    });

    cards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !matches);
    });
  });
});
