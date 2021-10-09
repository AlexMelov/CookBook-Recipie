const cardContainer = document.querySelector("#card-container");
const fullRecipeContainer = document.querySelector("#full-recipe-container");
const searchContainer = document.querySelector("#search-container");
const tagContainer = document.querySelector("#tag-container");
const filtersContainer = document.querySelector("#filters");
const header = document.querySelector("header");

const secInHour = 3600;

function fromSecondsToHHMM(seconds) {
  let hours = Math.floor(seconds / secInHour);
  hours = hours < 10 ? "0" + hours : hours;

  let min = Math.floor((seconds - hours * secInHour) / 60);
  min = min < 10 ? "0" + min : min;

  return `${hours}:${min}`; // 'HH:MM'
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createNeutritionsTable(neutritions) {
  // console.table(neutritions) //{...}

  // const propertyName = 'Riste'
  // const obj = {
  //   propertyName: propertyName,
  //   propertyName,
  // }

  // Destructuring from object
  const { fat: A, satfat: B, carbs: C, fiber, sugar, protein } = neutritions;

  const table = document.createElement("table");

  table.innerHTML = `
        <thead>
          <tr>
            <th>
              Neutritions
            </th>
            <th>
              Values
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>fat</td>
            <td>${A}</td>
          </tr>
          <tr>
            <td>satfat</td>
            <td>${B}</td>
          </tr>
          <tr>
            <td>carbs</td>
            <td>${C}</td>
          </tr>
          <tr>
            <td>fiber</td>
            <td>${fiber}</td>
          </tr>
          <tr>
            <td>sugar</td>
            <td>${sugar}</td>
          </tr>
          <tr>
            <td>protein</td>
            <td>${protein}</td>
          </tr>
        </tbody>`;

  return table;
}

function createCard(cardData) {
  let card = document.createElement("div");
  let cimage = document.createElement("div");
  let title = document.createElement("h5");
  let contents = document.createElement("div");
  let actions = document.createElement("div");

  card.classList.add("card");

  cimage.classList.add("card-image");
  let img = document.createElement("img");
  img.src = "./images/" + getRandomInt(1, 29) + ".jpg";
  cimage.appendChild(img);

  title.innerText = cardData.name;

  contents.classList.add("card-content");
  contents.appendChild(title);

  cardData.tags.forEach((tag) => {
    let tagLink = document.createElement("a");
    tagLink.innerText = "#" + tag;
    contents.appendChild(tagLink);

    tagLink.addEventListener("click", function () {
      console.log(tag);
      location.hash = "tags/" + tag;
    });
  });

  actions.classList.add("card-action");
  let link = document.createElement("a");
  link.innerText = "Open Recipe";
  link.classList.add("waves-effect", "waves-light", "btn", "orange");
  link.href = "#" + cardData.id;
  actions.appendChild(link);

  card.appendChild(cimage);
  card.appendChild(contents);
  card.appendChild(actions);

  return card;
}

function renderRecipe() {
  let id = location.hash.replace("#", ""); // #3 -> 3
  let recipe = recipeData.find((r) => r.id === id);
  fullRecipeContainer.innerHTML = "";

  let wrapper = document.createElement("div");
  let card = document.createElement("div");
  let cimage = document.createElement("div");
  let title = document.createElement("h3");
  let contents = document.createElement("div");

  wrapper.classList.add("full-recipe-wrapper");

  title.innerText = recipe.name;

  cimage.classList.add("card-image");
  let img = document.createElement("img");
  img.src = "./images/" + getRandomInt(1, 29) + ".jpg";
  cimage.appendChild(img);

  contents.classList.add("card-content");
  // Exercise 6 here - add ingredient list
  // !!
  const h4Ingredients = document.createElement("h4");
  h4Ingredients.innerText = "Ingredients";

  const ulIngredients = document.createElement("ul");

  recipe.ingredients.forEach((ingredient) => {
    const newLi = document.createElement("li");
    newLi.innerText = ingredient;
    ulIngredients.appendChild(newLi);
  });

  let p = document.createElement("p");
  p.innerText = recipe.instructions;
  let h4Instructions = document.createElement("h4");
  h4Instructions.innerText = "Instructions";
  // Exercise 6 - append the new elements here
  // !!

  // Render preptTime
  const pPrepTime = document.createElement("p");
  pPrepTime.innerText = "Prep time: " + fromSecondsToHHMM(recipe.preptime);

  // Render waitTime
  const pWaitTime = document.createElement("p");
  pWaitTime.innerText = "Wait time: " + fromSecondsToHHMM(recipe.waittime);

  let h4Neutritions = document.createElement("h4");
  h4Neutritions.innerText = "Neutritions";

  const recipeNeutritions = {
    fat: recipe.fat,
    satfat: recipe.satfat,
    carbs: recipe.carbs,
    fiber: recipe.fiber,
    sugar: recipe.sugar,
    protein: recipe.protein,
  };
  const tableNeutritions = createNeutritionsTable(recipeNeutritions);

  contents.append(
    pPrepTime,
    pWaitTime,
    h4Ingredients,
    ulIngredients,
    h4Neutritions,
    tableNeutritions
  );
  contents.appendChild(h4Instructions);
  contents.appendChild(p);

  card.classList.add("card");
  card.appendChild(cimage);
  card.appendChild(contents);

  wrapper.appendChild(title);
  wrapper.appendChild(card);

  fullRecipeContainer.appendChild(wrapper);

  // Exercise 5 here - add a back "button"
  // !!

  const backBtn = document.createElement("a");
  backBtn.classList.add("waves-effect", "waves-light", "btn", "orange");
  backBtn.href = "#";
  backBtn.innerText = "Back";

  wrapper.appendChild(backBtn);
}

// Exercise 1 - draw cards on screen using the
// createCard function.
recipeData.slice(0, 24).forEach((recipe) => {
  const cardHTML = createCard(recipe);
  cardContainer.appendChild(cardHTML);
});

// Exercise 2 - create a basic router

function handleRoute(e) {
  e.preventDefault();

  const hash = location.hash;
  console.log(hash);

  if (hash === "") {
    // Home
    searchContainer.style.display = "none";
    cardContainer.style.display = "flex";
    fullRecipeContainer.style.display = "none";
    tagContainer.style.display = "none";
  } else {
    const isTag = hash.includes("tags");
    const isSearch = hash.includes("search");
    if (isTag) {
      // Tags
      console.log(hash); // "#tags/main"

      const parts = hash.split("/"); // ["#tags","main"]
      const tag = parts[1];

      tagContainer.innerHTML = "";

      const filteredRecipeData = recipeData.filter(function (recipe) {
        return recipe.tags.includes(tag);
      });

      filteredRecipeData.forEach((recipe) => {
        const cardHTML = createCard(recipe);
        tagContainer.appendChild(cardHTML);
      });

      searchContainer.style.display = "none";
      cardContainer.style.display = "none";
      fullRecipeContainer.style.display = "none";
      tagContainer.style.display = "flex";
    } else if (isSearch) {
      // we are on search page

      const query = hash.split("/")[1].toLowerCase(); // 'search/queryValue'

      if (query === "vegetables") {
        debugger;
      }
      const filtered = recipeData.filter(
        (recipe) =>
          recipe.tags.map((t) => t.toLowerCase()).includes(query) ||
          recipe.name.toLowerCase().includes(query) ||
          recipe.instructions.toLowerCase().includes(query)
      );

      searchContainer.innerHTML = "";

      filtered.forEach((recipe) => {
        const cardHTML = createCard(recipe);
        searchContainer.appendChild(cardHTML);
      });

      console.log(filtered);

      searchContainer.style.display = "flex";
      cardContainer.style.display = "none";
      fullRecipeContainer.style.display = "none";
      tagContainer.style.display = "none";
    } else {
      // Recipe Details
      searchContainer.style.display = "none";
      cardContainer.style.display = "none";
      fullRecipeContainer.style.display = "flex";
      tagContainer.style.display = "none";

      renderRecipe();
    }
  }
}

// adding filters

function renderSearchForm() {
  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "search");

  const searchBtn = document.createElement("button");
  searchBtn.innerText = "Search";

  searchBtn.addEventListener("click", function (e) {
    const query = searchInput.value;

    location.hash = "search/" + query;
  });

  filtersContainer.append(searchInput, searchBtn);
}

renderSearchForm();

window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);

header.addEventListener("click", function () {
  location.hash = "";
});
