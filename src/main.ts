import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app container");
}

let personCounter = 1;
let petCounter = 1;
let bookCounter = 1;
let genreCounter = 1;

const people: IPerson[] = [];
const pets: IPet[] = [];
const books: IBook[] = [];
const genres: IGenre[] = [];
const relBookToGenre: TypeBookToGenre = [];

function createPerson(name: string): IPerson {
  const person: IPerson = {
    name,
    pets: [],
    makeCacophany: () => {
      return person.pets.map((pet) => pet.makeNoise());
    },
  };

  return person;
}

function createPet(name: string, petType: PetType, noise: string): IPet {
  const pet: IPet = {
    name,
    petType,
    favoritePerson: null,
    noise,
    makeNoise: () => {
      return `${pet.name}: ${pet.noise}`;
    },
  };

  return pet;
}

function createBook(id: number, name: string): IBook {
  const book: IBook = {
    id,
    name,
    getGenres: () => {
      const relationIds = relBookToGenre
        .filter((rel) => rel.bookId === book.id)
        .map((rel) => rel.genreId);
      return genres.filter((genre) => relationIds.includes(genre.id));
    },
  };

  return book;
}

function createGenre(id: number, name: string): IGenre {
  const genre: IGenre = {
    id,
    name,
    getBooks: () => {
      const relationIds = relBookToGenre
        .filter((rel) => rel.genreId === genre.id)
        .map((rel) => rel.bookId);
      return books.filter((book) => relationIds.includes(book.id));
    },
  };

  return genre;
}

function seedData() {
  const alex = createPerson("Alex");
  const sam = createPerson("Sam");
  people.push(alex, sam);

  const pixel = createPet("Pixel", "cat", "meow");
  const barkley = createPet("Barkley", "dog", "woof");
  const nibble = createPet("Nibble", "hamster", "squeak");
  pets.push(pixel, barkley, nibble);

  pixel.favoritePerson = alex;
  barkley.favoritePerson = sam;
  nibble.favoritePerson = alex;

  alex.pets.push(pixel, nibble);
  sam.pets.push(barkley);

  const cleanCode = createBook(bookCounter++, "Clean Code");
  const pragmaticProgrammer = createBook(
    bookCounter++,
    "The Pragmatic Programmer",
  );
  books.push(cleanCode, pragmaticProgrammer);

  const software = createGenre(genreCounter++, "Software");
  const craftsmanship = createGenre(genreCounter++, "Craftsmanship");
  genres.push(software, craftsmanship);

  relBookToGenre.push(
    { bookId: cleanCode.id, genreId: software.id },
    { bookId: cleanCode.id, genreId: craftsmanship.id },
    { bookId: pragmaticProgrammer.id, genreId: software.id },
  );
}

function assignPetToPerson(
  personName: string,
  petName: string,
  shouldBelong: boolean,
) {
  const person = people.find((entry) => entry.name === personName);
  const pet = pets.find((entry) => entry.name === petName);

  if (!person || !pet) {
    return;
  }

  for (const currentPerson of people) {
    currentPerson.pets = currentPerson.pets.filter((p) => p.name !== petName);
  }

  if (shouldBelong) {
    person.pets.push(pet);
  }
}

function setFavoritePerson(petName: string, favoriteName: string) {
  const pet = pets.find((entry) => entry.name === petName);
  if (!pet) {
    return;
  }

  if (favoriteName === "") {
    pet.favoritePerson = null;
    return;
  }

  const person = people.find((entry) => entry.name === favoriteName) ?? null;
  pet.favoritePerson = person;
}

function toggleBookGenre(bookId: number, genreId: number) {
  const existing = relBookToGenre.find(
    (rel) => rel.bookId === bookId && rel.genreId === genreId,
  );

  if (existing) {
    const index = relBookToGenre.indexOf(existing);
    relBookToGenre.splice(index, 1);
    return;
  }

  relBookToGenre.push({ bookId, genreId });
}

function logRelationshipTable() {
  const rows: Array<{
    relationshipType: string;
    source: string;
    target: string;
  }> = [];

  for (const pet of pets) {
    rows.push({
      relationshipType: "1-to-1 (favorite person)",
      source: `Pet:${pet.name}`,
      target: pet.favoritePerson ? `Person:${pet.favoritePerson.name}` : "None",
    });
  }

  for (const person of people) {
    for (const pet of person.pets) {
      rows.push({
        relationshipType: "1-to-many (person owns pets)",
        source: `Person:${person.name}`,
        target: `Pet:${pet.name}`,
      });
    }
  }

  for (const rel of relBookToGenre) {
    rows.push({
      relationshipType: "many-to-many (book-genre)",
      source: `Book:${books.find((book) => book.id === rel.bookId)?.name ?? "Unknown"}`,
      target: `Genre:${genres.find((genre) => genre.id === rel.genreId)?.name ?? "Unknown"}`,
    });
  }

  console.table(rows);
}

function logPetNoise(petName: string) {
  const pet = pets.find((entry) => entry.name === petName);
  if (!pet) {
    return;
  }

  console.log(pet.makeNoise());
}

function logPersonCacophany(personName: string) {
  const person = people.find((entry) => entry.name === personName);
  if (!person) {
    return;
  }

  console.table(
    person.makeCacophany().map((noise, index) => ({
      person: person.name,
      pet: person.pets[index]?.name ?? "Unknown",
      noise,
    })),
  );
}

function render() {
  app!.innerHTML = `
		<div class="canvas">
			<header class="hero">
				<p class="kicker">Data Modeling Playground</p>
				<h1>Relationship Editor</h1>
				<p class="subtitle">Edit 1-to-1, 1-to-many, and many-to-many records using your TypeScript interfaces.</p>
			</header>

			<section class="grid two-up">
				<article class="panel">
					<h2>Add Person</h2>
					<form id="person-form" class="stack">
						<input name="name" placeholder="Person name" required />
						<button type="submit">Create person</button>
					</form>
				</article>

				<article class="panel">
					<h2>Add Pet</h2>
					<form id="pet-form" class="stack">
						<input name="name" placeholder="Pet name" required />
						<input name="noise" placeholder="Noise (e.g. meow)" required />
						<select name="petType" required>
							<option value="dog">Dog</option>
							<option value="cat">Cat</option>
							<option value="bird">Bird</option>
							<option value="hamster">Hamster</option>
							<option value="fish">Fish</option>
							<option value="rabbit">Rabbit</option>
							<option value="snake">Snake</option>
							<option value="lizard">Lizard</option>
							<option value="turtle">Turtle</option>
							<option value="other">Other</option>
						</select>
						<button type="submit">Create pet</button>
					</form>
				</article>
			</section>

			<section class="grid two-up">
				<article class="panel">
					<h2>1-to-1: Favorite Person per Pet</h2>
					<p class="hint">A pet has exactly one favorite person or none.</p>
					<div class="stack" id="favorite-editor">
						${pets
              .map(
                (pet) => `
							<label class="row">
								<span>${pet.name} (${pet.petType})</span>
								<select data-action="favorite-person" data-pet-name="${pet.name}">
									<option value="" ${pet.favoritePerson === null ? "selected" : ""}>None</option>
									${people
                    .map(
                      (person) =>
                        `<option value="${person.name}" ${pet.favoritePerson?.name === person.name ? "selected" : ""}>${person.name}</option>`,
                    )
                    .join("")}
								</select>
							</label>
						`,
              )
              .join("")}
					</div>
				</article>

				<article class="panel">
					<h2>1-to-many: Pets Owned by Person</h2>
					<p class="hint">Each pet can belong to one person, and each person can have many pets.</p>
					<div class="stack" id="ownership-editor">
						${people
              .map(
                (person) => `
							<fieldset>
								<legend>${person.name}</legend>
								${pets
                  .map(
                    (pet) => `
                  <label class="row ownership-row">
										<span>${pet.name}</span>
										<input
											type="checkbox"
											data-action="pet-owner"
											data-person-name="${person.name}"
											data-pet-name="${pet.name}"
											${person.pets.some((entry) => entry.name === pet.name) ? "checked" : ""}
										/>
									</label>
								`,
                  )
                  .join("")}
							</fieldset>
						`,
              )
              .join("")}
					</div>
				</article>
			</section>

      <section class="panel">
        <h2>Console Runner</h2>
        <p class="hint">Use these controls to run makeNoise and makeCacophany and view the output in your browser console.</p>
        <div class="grid two-up">
          <article class="stack">
            <h3>Run makeNoise</h3>
            <select id="noise-pet-select">
              ${pets.map((pet) => `<option value="${pet.name}">${pet.name}</option>`).join("")}
            </select>
            <button type="button" id="run-make-noise">Log selected pet noise</button>
            <button type="button" id="run-all-noises">Log all pet noises</button>
          </article>
          <article class="stack">
            <h3>Run makeCacophany</h3>
            <select id="cacophany-person-select">
              ${people.map((person) => `<option value="${person.name}">${person.name}</option>`).join("")}
            </select>
            <button type="button" id="run-make-cacophany">Log selected person cacophany</button>
            <button type="button" id="run-all-cacophanies">Log all person cacophanies</button>
          </article>
        </div>
      </section>

      <section class="panel">
        <h2>Live Output</h2>
        <div class="grid two-up">
          <article>
            <h3>Pet Noises</h3>
            <ul>
              ${pets.map((pet) => `<li>${pet.makeNoise()}</li>`).join("")}
            </ul>
          </article>
          <article>
            <h3>Person Cacophany</h3>
            <ul>
              ${people
                .map(
                  (person) =>
                    `<li><strong>${person.name}</strong>: ${person.makeCacophany().join(" | ") || "(no pets)"}</li>`,
                )
                .join("")}
            </ul>
          </article>
        </div>
      </section>

      <section class="grid two-up">
				<article class="panel">
					<h2>Books & Genres</h2>
					<form id="book-form" class="stack compact">
						<input name="name" placeholder="New book" required />
						<button type="submit">Add book</button>
					</form>
					<form id="genre-form" class="stack compact">
						<input name="name" placeholder="New genre" required />
						<button type="submit">Add genre</button>
					</form>
				</article>

				<article class="panel">
					<h2>Many-to-many: Book ↔ Genre</h2>
					<p class="hint">Books can have many genres, and genres can contain many books.</p>
					<div class="stack" id="book-genre-editor">
						${books
              .map(
                (book) => `
							<fieldset>
								<legend>${book.name}</legend>
								${genres
                  .map(
                    (genre) => `
                  <label class="row ownership-row">
										<span>${genre.name}</span>
										<input
											type="checkbox"
											data-action="book-genre"
											data-book-id="${book.id}"
											data-genre-id="${genre.id}"
											${book.getGenres().some((entry) => entry.id === genre.id) ? "checked" : ""}
										/>
									</label>
								`,
                  )
                  .join("")}
							</fieldset>
						`,
              )
              .join("")}
					</div>
				</article>
			</section>

		</div>
	`;

  bindEvents();
}

function bindEvents() {
  const personForm = document.querySelector<HTMLFormElement>("#person-form");
  personForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(personForm);
    const name = String(formData.get("name") ?? "").trim();
    if (!name) {
      return;
    }
    people.push(createPerson(name || `Person ${personCounter++}`));
    personForm.reset();
    render();
  });

  const petForm = document.querySelector<HTMLFormElement>("#pet-form");
  petForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(petForm);
    const name = String(formData.get("name") ?? "").trim();
    const noise = String(formData.get("noise") ?? "").trim();
    const petType = String(formData.get("petType") ?? "other") as PetType;
    if (!name || !noise) {
      return;
    }
    pets.push(createPet(name || `Pet ${petCounter++}`, petType, noise));
    petForm.reset();
    render();
  });

  const bookForm = document.querySelector<HTMLFormElement>("#book-form");
  bookForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(bookForm);
    const name = String(formData.get("name") ?? "").trim();
    if (!name) {
      return;
    }
    books.push(createBook(bookCounter++, name));
    bookForm.reset();
    render();
  });

  const genreForm = document.querySelector<HTMLFormElement>("#genre-form");
  genreForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(genreForm);
    const name = String(formData.get("name") ?? "").trim();
    if (!name) {
      return;
    }
    genres.push(createGenre(genreCounter++, name));
    genreForm.reset();
    render();
  });

  const favoriteControls = document.querySelectorAll<HTMLSelectElement>(
    "select[data-action='favorite-person']",
  );
  for (const control of favoriteControls) {
    control.addEventListener("change", (event) => {
      const target = event.currentTarget as HTMLSelectElement;
      const petName = String(target.dataset.petName ?? "");
      const favoriteName = target.value;
      setFavoritePerson(petName, favoriteName);
      logRelationshipTable();
      render();
    });
  }

  const petOwnerControls = document.querySelectorAll<HTMLInputElement>(
    "input[data-action='pet-owner']",
  );
  for (const control of petOwnerControls) {
    control.addEventListener("change", (event) => {
      const target = event.currentTarget as HTMLInputElement;
      const personName = String(target.dataset.personName ?? "");
      const petName = String(target.dataset.petName ?? "");
      assignPetToPerson(personName, petName, target.checked);
      logRelationshipTable();
      render();
    });
  }

  const bookGenreControls = document.querySelectorAll<HTMLInputElement>(
    "input[data-action='book-genre']",
  );
  for (const control of bookGenreControls) {
    control.addEventListener("change", (event) => {
      const target = event.currentTarget as HTMLInputElement;
      const bookId = Number(target.dataset.bookId);
      const genreId = Number(target.dataset.genreId);
      if (!Number.isNaN(bookId) && !Number.isNaN(genreId)) {
        toggleBookGenre(bookId, genreId);
        logRelationshipTable();
      }
      render();
    });
  }

  const runMakeNoiseButton = document.querySelector<HTMLButtonElement>(
    "#run-make-noise",
  );
  runMakeNoiseButton?.addEventListener("click", () => {
    const petSelect = document.querySelector<HTMLSelectElement>("#noise-pet-select");
    const petName = petSelect?.value ?? "";
    if (!petName) {
      return;
    }
    logPetNoise(petName);
  });

  const runAllNoisesButton = document.querySelector<HTMLButtonElement>(
    "#run-all-noises",
  );
  runAllNoisesButton?.addEventListener("click", () => {
    console.table(
      pets.map((pet) => ({
        pet: pet.name,
        output: pet.makeNoise(),
      })),
    );
  });

  const runMakeCacophanyButton = document.querySelector<HTMLButtonElement>(
    "#run-make-cacophany",
  );
  runMakeCacophanyButton?.addEventListener("click", () => {
    const personSelect = document.querySelector<HTMLSelectElement>(
      "#cacophany-person-select",
    );
    const personName = personSelect?.value ?? "";
    if (!personName) {
      return;
    }
    logPersonCacophany(personName);
  });

  const runAllCacophaniesButton = document.querySelector<HTMLButtonElement>(
    "#run-all-cacophanies",
  );
  runAllCacophaniesButton?.addEventListener("click", () => {
    console.table(
      people.map((person) => ({
        person: person.name,
        outputs: person.makeCacophany().join(" | ") || "(no pets)",
      })),
    );
  });
}

seedData();
render();
