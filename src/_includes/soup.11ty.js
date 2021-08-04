class SoupPage {
  data() {
    return {
      title: "Soup",
      layout: "default",
    };
  }

  render(data) {
    const priceString = data.price
      ? `<div class="text-center ">Price: ${data.price} per quart, plus container.</div>`
      : "";

    return /* HTML */ `
      <div class="container max-w-3xl mt-6 px-6">
        <h1 class="font-bold text-5xl">${data.title}</h1>
        ${data.sold_out
          ? `
        <h2 class="sold-out-banner">SOLD OUT!</h2>
        `
          : ""}
        <div class="flex h-auto w-50 justify-center">
          ${this.image(
            "src/" + data.thumbnail,
            "h-auto w-80 rounded-md ",
            data.title,
            "(min-width: 30em) 50vw, 100vw"
          )}
        </div>
        <h3 class="text-center mt-10">Description</h3>
        <div class="text-center ">${data.content}</div>
        <h3 class="text-center mt-10">Ingredients</h3>
        <div class="text-center ">
          ${this.linesToBullets(data.ingredients.replace(/\\\n/gm, "\n"))}
        </div>
        ${priceString}
      </div>
    `;
  }
}

module.exports = SoupPage;
