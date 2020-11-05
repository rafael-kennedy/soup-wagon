class SoupPage {
  data() {
    return {
      title: "Soup",
      layout: "default",
    };
  }

  render(data) {
    console.log(data);
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
        <h3 class="text-center mt-10">Description</h3>
        <div class="text-center ">${data.content}</div>
        <h3 class="text-center mt-10">Ingredients</h3>
        <div class="text-center ">${data.ingredients}</div>
      </div>
    `;
  }
}

module.exports = SoupPage;