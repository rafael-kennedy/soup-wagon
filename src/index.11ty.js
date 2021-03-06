const format = require("date-fns/format");
const soupTemplate = (soup) => {
  return /* HTML */ `
    <a
      href="${soup.url}"
      target="_blank"
      class="p-5 border rounded border-gray-200 hover:border-purple-400"
    >
      <h3 class="text-center">${soup.data.title}</h3>
      <div class="flex flex-start md:flex-column sm:flex-row justify-center">
        <img
          src="${soup.data.thumbnail}"
          class="w-auto sm:h-40 md:h-40 lg:h-20 rounded-md"
        />
      </div>
    </a>
  `;
};

function conditionalPluralize(str, list = []) {
  return str + (list.length > 1 ? "s" : "");
}

module.exports = {
  data() {
    return {
      layout: "default",
      title: "Kenwick Soup Wagon",
      path: "home",
    };
  },
  render(data) {
    const nextWeeksSoups = data.collections.soups.filter(
      (v) => !!v.data.next_week
    );
    const thisWeeksSoups = data.collections.soups.filter(
      (v) => !!v.data.this_week
    );
    const { nextDeliveryDate } = data.settings;
    const deliveryDateString = nextDeliveryDate
      ? `
<h4>
The next delivery is on:
    <em>${format(nextDeliveryDate, "MMMM do")}</em>
</h4>
    `
      : "";
    return `
    <div
  class="container mx-auto flex flex-col justify-center items-center"
>
  <h1 class="bg-white lg:max-w-lg lg:mt-20">
   <img src="/static/img/logo.jpg" alt="${data.title}">

  </h1>
  <!--    LOGO -->
  
  <h3>${conditionalPluralize("This Week's Soup", thisWeeksSoups)}</h3>
  ${deliveryDateString}
  <div class="w-full max-w-2xl grid grid-cols-1 lg:grid-cols-2 gap-4 my-8 px-4 lg:mx-0">
  ${thisWeeksSoups.map(soupTemplate).join("")}
  </div>
  <hr/>
  
  <h3>${conditionalPluralize("Next Week's Soup", nextWeeksSoups)}</h3>
  <div class="w-full max-w-2xl grid grid-cols-1 lg:grid-cols-2 gap-4 my-8 px-4 lg:mx-0">

    ${nextWeeksSoups.map(soupTemplate).join("")}
  </div>
 </div>
    `;
  },
};
