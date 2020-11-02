const { inspect } = require("util");

const soupTemplate = (soup) => {
  return `

            <a href="{{item.url}}" target="_blank" class="p-5 border rounded border-gray-200 hover:border-purple-400">
                <h3>${soup.data.title}                    </h3>
                    <div class="flex flex-row">
                                    <p>${soup.data.description}</p>
                                    

  </div>
            </a>

  `;
};

module.exports = {
  data() {
    return {
      layout: "default",
      title: "Kenwick Soup Wagon",
      path: "home",
    };
  },
  render(data) {
    const thisWeeksSoups = data.collections.soups.filter(
      (v) => !!v.data.this_week
    );
    return `
    <div
  class="container mx-auto lg:h-screen flex flex-col justify-center items-center"
>
  <h1 class="bg-white">
    <strong
      class="bg-clip-text text-transparent bg-gradient-to-r from-brown to-green"
    >
      ${data.title}
    </strong>
  </h1>
  <!--    LOGO -->
  
  <h3>This Week's Soups</h3>
  <div class="w-full max-w-2xl grid grid-cols-1 lg:grid-cols-2 gap-4 my-8 px-4 lg:mx-0">

  ${thisWeeksSoups.map(soupTemplate).join("")}
  
  </div>
    `;
  },
};
