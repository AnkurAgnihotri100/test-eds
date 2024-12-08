import { fetchPlaceholders, getMetadata } from "../../scripts/aem.js";

// Fetch placeholders based on locale
const placeholders = await fetchPlaceholders(getMetadata("locale"));

// Extract placeholders for Marks Table
const { allEntries, name, roll, marks, serialNo } = placeholders;

// Create the table header dynamically
async function createTableHeader(table) {
  let tr = document.createElement("tr");

  // Add table header cells
  let snoHeader = document.createElement("th");
  snoHeader.appendChild(document.createTextNode(serialNo));

  let nameHeader = document.createElement("th");
  nameHeader.appendChild(document.createTextNode(name));

  let rollHeader = document.createElement("th");
  rollHeader.appendChild(document.createTextNode(roll));

  let marksHeader = document.createElement("th");
  marksHeader.appendChild(document.createTextNode(marks));

  // Append header cells to the header row
  tr.append(snoHeader, nameHeader, rollHeader, marksHeader);
  table.append(tr);
}

// Create a single row for marks data
async function createTableRow(table, row, index) {
  let tr = document.createElement("tr");

  // Add table cells for the row data
  let snoCell = document.createElement("td");
  snoCell.appendChild(document.createTextNode(index));

  let nameCell = document.createElement("td");
  nameCell.appendChild(document.createTextNode(row.Name));

  let rollCell = document.createElement("td");
  rollCell.appendChild(document.createTextNode(row.Roll));

  let marksCell = document.createElement("td");
  marksCell.appendChild(document.createTextNode(row.Marks));

  // Append cells to the row
  tr.append(snoCell, nameCell, rollCell, marksCell);
  table.append(tr);
}

// Create the main table with all rows
async function createTable(jsonURL) {
  const { pathname } = new URL(jsonURL);

  // Fetch the JSON data
  const resp = await fetch(pathname);
  const json = await resp.json();

  console.log("JSON Response: ", json);

  // Create the table and add a header
  const table = document.createElement("table");
  createTableHeader(table);

  // Add rows for each entry in the JSON data
  json.data.forEach((row, i) => {
    createTableRow(table, row, i + 1); // Index starts from 1 for serial numbers
  });

  return table;
}

// Create a dropdown for filtering or selecting marks data
async function createSelectMap(jsonURL) {
  const optionsMap = new Map();
  const { pathname } = new URL(jsonURL);

  // Define filter options for regions (or categories, if applicable)
  optionsMap.set("all", allEntries); // Default: Show all entries

  // Add more options if applicable
  const select = document.createElement("select");
  select.id = "filter";
  select.name = "filter";

  // Populate dropdown with options
  optionsMap.forEach((val, key) => {
    const option = document.createElement("option");
    option.textContent = val;
    option.value = key;
    select.append(option);
  });

  const div = document.createElement("div");
  div.classList.add("filter-select");
  div.append(select);

  return div;
}

// Decorate the block and initialize the table rendering
export default async function decorate(block) {
  // const marksDataLink = block.querySelector('a[href$=".json"]');
  const marksDataLink = {
    href: "https://main--test-eds--ankuragnihotri100.aem.page/marks.json",
  }; // Replace with your actual URL

  const parentDiv = document.createElement("div");
  parentDiv.classList.add("marks-block");

  if (marksDataLink) {
    // Add dropdown for filtering
    parentDiv.append(await createSelectMap(marksDataLink.href));

    // Add the table with marks data
    parentDiv.append(await createTable(marksDataLink.href));

    marksDataLink.replaceWith(parentDiv);
  }

  // Handle dropdown changes
  const dropdown = document.getElementById("filter");
  dropdown.addEventListener("change", () => {
    let url = marksDataLink.href;
    if (dropdown.value !== "all") {
      url = `${marksDataLink.href}?filter=${dropdown.value}`;
    }

    const existingTable = parentDiv.querySelector(":scope > table");

    // Replace the current table with a new filtered table
    let promise = Promise.resolve(createTable(url));
    promise.then((newTable) => {
      existingTable.replaceWith(newTable);
    });
  });
}
