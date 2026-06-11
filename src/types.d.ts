interface APILibrary {
  books: APIBook[];
  count: number;
}

interface APIBook {
  id: number;
  title: string;
  author: string | null;
  cover_url: string | null;
  number_pages: number | null;
  year_published: number | null;
  isbn10: string | null;
  isbn13: string | null;
  have_read: boolean;
  is_awesome: boolean;
}
