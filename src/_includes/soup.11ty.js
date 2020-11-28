class SoupPage {
  data() {
    return {
      title: "Soup",
      layout: "default",
    };
  }

  render(data) {
    const priceString = data.price
      ? `
        <div class="text-center ">Price: ${data.price} per quart, plus container.</div>

    `
      : "";

    return /* HTML */ `
      <div class="container max-w-3xl mt-6 px-6">
        <h1 class="font-bold text-5xl">${data.title}</h1>
        <div class="flex h-auto w-50 justify-center">
          <img
            src="${data.thumbnail}"
            alt="image of soup"
            class="h-auto w-80 rounded-md "
          />
        </div>
                ${priceString}

                <div class="flex justify-center mt-6">
          <button
           type="button" style="transition: all .15s ease"
            class="snipcart-add-item block bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1""
            data-item-id="${this.tokenize(data.title)}"
            data-item-price="${data.price}"
            data-item-url="${data.page.url}"
            data-item-description="1 Quart of delicious soup: ${data.title}"
            data-item-image="${data.thumbnail}"
            data-item-name="${data.title}"
            data-item-custom1-name="Container Type"
            data-item-custom1-options="Disposable ($1.00)[+1.00]|Reusable ($3.00)[+3.00]|Reusable with Return (Free)"
          >
             Add to cart
          </button>
        </div>

        <h3 class="text-center mt-10">Description</h3>
        <div class="text-center ">${data.content}</div>
        <h3 class="text-center mt-10">Ingredients</h3>
        <div class="text-center ">
          ${this.linesToBullets(data.ingredients.replace(/\\\n/gm, "\n"))}
        </div>
      </div>
    `;
  }
}

module.exports = SoupPage;
