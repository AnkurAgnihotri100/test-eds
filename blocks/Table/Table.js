function buildCell(rowIndex) {
  const cell = rowIndex
    ? document.createElement("td")
    : document.createElement("th");
  if (!rowIndex) cell.setAttribute("scope", "col");
  return cell;
}

async function fetchSpreadsheetData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Parse rows from spreadsheet JSON
    const rows = data.feed.entry.map((entry) => ({
      name: entry.gsx$name.$t,
      description: entry.gsx$description.$t,
      price: entry.gsx$price.$t,
    }));

    return rows;
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error);
    return [];
  }
}

export default async function decorate(block) {
  const spreadsheetUrl =
    "https://main--test-eds--ankuragnihotri100.aem.page/marks.json"; // Replace with your actual URL

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  table.append(thead, tbody);

  // Fetch data from spreadsheet
  const rows = await fetchSpreadsheetData(spreadsheetUrl);

  if (rows.length === 0) {
    block.innerHTML =
      "<p>Failed to load table data. Please try again later.</p>";
    return;
  }

  // Build table header
  const headerRow = document.createElement("tr");
  ["Name", "Description", "Price"].forEach((header) => {
    const th = buildCell(0);
    th.textContent = header;
    headerRow.append(th);
  });
  thead.append(headerRow);

  // Build table rows
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    Object.values(row).forEach((value) => {
      const td = buildCell(1);
      td.textContent = value;
      tr.append(td);
    });
    tbody.append(tr);
  });

  // Clear block and append table
  block.innerHTML = "";
  block.append(table);
}
