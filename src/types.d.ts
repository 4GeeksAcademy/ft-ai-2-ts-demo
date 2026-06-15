type PetType =
  | "dog"
  | "cat"
  | "bird"
  | "hamster"
  | "fish"
  | "rabbit"
  | "snake"
  | "lizard"
  | "turtle"
  | "other";

interface IPerson {
  name: string;
  pets: IPet[]; // <-- This defines a 1-to-many relationship
  makeCacophany: () => string[];
}

interface IPet {
  name: string;
  petType: PetType;
  favoritePerson: IPerson | null; //  <-- This defines a 1-to-1 relationship
  noise: string;
  makeNoise: () => string;
}

interface IBook {
  id: number;
  name: string;
  getGenres: () => IGenre[];
}

// This defines a many-to-many relationship between books and genres
interface IRelBookToGenre {
  bookId: number;
  genreId: number;
}

type TypeBookToGenre = IRelBookToGenre[];

interface IGenre {
  id: number;
  name: string;
  getBooks: () => IBook[];
}
