window.onload = async () => {
  import("./style.css");

  const getBooks = async (): Promise<APILibrary> => {
    const resp = await fetch("https://library.dotlag.space/library");
    const data = await resp.json();
    return data;
  };

  const makeBookHtml = (books: APIBook[]): string[] => {
    let html: string[] = [];

    for (const book of books) {
      const bookHtml = `
        <article class="max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <header class="mb-4 flex items-start justify-between gap-3">
            <h2 class="text-lg font-semibold text-slate-900">
              ${book.title}
            </h2>
            <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
              book.is_awesome
                ? "bg-amber-100 text-amber-800"
                : "bg-slate-100 text-slate-600"
            }">
              ${book.is_awesome ? "Awesome" : "Sadly Not Awesome"}
            </span>
          </header>

          <dl class="space-y-2 text-sm text-slate-700">
            <div class="flex justify-between gap-4">
              <dt class="font-medium text-slate-500">ID</dt>
              <dd class="text-right">${book.id}</dd>
            </div>

            <div class="flex justify-between gap-4">
              <dt class="font-medium text-slate-500">Author</dt>
              <dd class="text-right">${book.author ?? "Unknown author"}</dd>
            </div>

            <div class="flex justify-between gap-4">
              <dt class="font-medium text-slate-500">Pages</dt>
              <dd class="text-right">${book.number_pages ?? "N/A"}</dd>
            </div>

            <div class="flex justify-between gap-4">
              <dt class="font-medium text-slate-500">Published</dt>
              <dd class="text-right">${book.year_published ?? "N/A"}</dd>
            </div>

            <div class="flex justify-between gap-4">
              <dt class="font-medium text-slate-500">ISBN-10</dt>
              <dd class="text-right">${book.isbn10 ?? "N/A"}</dd>
            </div>

            <div class="flex justify-between gap-4">
              <dt class="font-medium text-slate-500">ISBN-13</dt>
              <dd class="text-right">${book.isbn13 ?? "N/A"}</dd>
            </div>

            <div class="flex justify-between gap-4 pt-1">
              <dt class="font-medium text-slate-500">Read</dt>
              <dd>
                <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  book.have_read
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }">
                  ${book.have_read ? "Yes" : "No"}
                </span>
              </dd>
            </div>
          </dl>
        </article>
      `;

      html.push(bookHtml);
    }

    return html;
  };

  const displayBooks = (bookHtml: string[], appId: string = "app"): void => {
    const app = document.getElementById(appId);

    if (app === null) {
      return;
    }

    app.innerHTML = bookHtml.join("");
  };

  const library = await getBooks();
  const bookHtml = makeBookHtml(library.books);

  displayBooks(bookHtml, "app");
};
