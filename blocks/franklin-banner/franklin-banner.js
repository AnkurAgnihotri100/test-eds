document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".franklin-banner-container");
  const rows = document.querySelectorAll("table tr");

  rows.forEach((row, index) => {
    if (index === 0) return; // Skip the header row

    const columns = row.querySelectorAll("td");
    if (columns.length === 2) {
      const imageSrc = columns[0].textContent.trim();
      const titleText = columns[1].textContent.trim();

      // Create card
      const card = document.createElement("div");
      card.classList.add("franklin-banner-card");

      card.innerHTML = `
        <img src="${imageSrc}" alt="Banner Image" />
        <h2>${titleText}</h2>
      `;

      container.appendChild(card);
    }
  });
});
