const template = /* HTML */ `
  <script src="/static/js/ordering.js"></script>
  <div class="container mx-2" x-data="orderForm()">
    <form class="mb-6" action="#" id="orderFormComponent">
      <div class="flex flex-col mb-4">
        <label
          class="mb-2 font-bold text-lg text-grey-darkest"
          for="first_name"
        >
          Are you in the Kenwick or Mentelle Park neighborhoods?
        </label>
        <label class="mb-2 text-md text-grey-darkest link" for="first_name">
          Not sure? You can find a map here:
          <a
            class="text-green hover:text-brown"
            href="http://maps.lexingtonky.gov/mapit"
            >http://maps.lexingtonky.gov/mapit</a
          >
        </label>

        <div class="inline-flex">
          <input
            type="radio"
            id="yes"
            name="kenwick"
            value="yes"
            x-model="isInKenwick"
          />
          <label for="yes" class="ml-4">Yes -- Go ahead and order!</label>
        </div>
        <div class="inline-flex">
          <input
            type="radio"
            id="no"
            name="kenwick"
            value="no"
            x-model="isInKenwick"
            @changed="setupPayPal"
          />
          <label for="no" class="ml-4">
            No -- I'm sorry delivery not available -- but watch for pop-up soup
            wagon!
          </label>
        </div>
      </div>
      <template x-if="isInKenwick === 'yes'">
        <div>
          <div class="flex flex-col mb-4">
            <label class="mb-2 font-bold text-lg text-grey-darkest" for="email">
              How can I reach you? (email or phone that can receive texts)
            </label>
            <input
              class="border py-2 px-3 text-grey-darkest w-full mr-3"
              type="text"
              name="email"
              id="email"
              x-model="email[1]"
            />
          </div>
          <div class="flex flex-col mb-4">
            <label class="mb-2 font-bold text-lg text-grey-darkest" for="email">
              What is your address?
            </label>
            <input
              class="border py-2 px-3 text-grey-darkest w-full mr-3"
              type="text"
              name="address"
              id="address"
              x-model="address[1]"
            />
          </div>

          <h4 class="font-bold text-xl text-grey-darkest text-center">Soup</h4>
          <table class="table-auto w-full">
            <thead>
              <tr>
                <th>Soup</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <template x-for="(orderSoup, index) in soups" :key="index">
                <tr :class="{'bg-gray-200': !(index % 2)}">
                  <th class="text-right">
                    <span x-text="orderSoup.title" class="mr-6"></span>
                  </th>
                  <td>
                    <input
                      type="number"
                      x-model="orderSoup.quantity"
                      placeholder="0"
                    />
                  </td>
                  <td
                    class="text-left"
                    x-text="'@ $' + orderSoup.price + ' per quart'"
                  ></td>
                </tr>
              </template>
            </tbody>
          </table>

          <h4 class="font-bold text-xl text-grey-darkest text-center">
            Containers
          </h4>
          <table class="table-auto w-full">
            <thead>
              <tr>
                <th></th>
                <th>Quantity</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-gray-200">
                <th>Reusable Containers</th>
                <th>
                  <input
                    type="number"
                    x-model="reusableContainers[1]"
                    placeholder="0"
                  />
                </th>
                <th>@ $3.00 deposit each</th>
              </tr>
              <tr>
                <th>Disposable Containers</th>
                <th>
                  <input
                    type="number"
                    x-model="disposableContainers[1]"
                    placeholder="0"
                  />
                </th>
                <th>@ $1.00 each</th>
              </tr>
              <tr>
                <th>Returning Reusable Containers</th>
                <th>
                  <input
                    type="number"
                    x-model="returningContainers[1]"
                    placeholder="0"
                  />
                </th>
                <th>$3.00 deposit refunded</th>
              </tr>
            </tbody>
          </table>

          <h4 class="text-center text-xl">
            Total Price: <span x-text="computedPrice"></span>
          </h4>
          <div id="smart-button-container">
            <div style="text-align: center;">
              <div id="paypal-button-container"></div>
            </div>
          </div>
          <div class="flex justify-center mt-6">
            <button
              type="button"
              class="border border-brown-500 bg-brown text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-green focus:outline-none focus:shadow-outline"
              @click.prevent="submit()"
            >
              Submit
            </button>
          </div>
        </div>
      </template>
    </form>
  </div>
`;

module.exports = {
  render: (data) => {
    const soups = data.collections.soups
      .filter((v) => v.data.this_week)
      .map((v) => ({ url: v.url, title: v.data.title, price: v.data.price }));
    return (
      `<script>window.currentSoups = ${JSON.stringify(soups)}</script>` +
      template
    );
  },
  data: () => ({
    title: "Place An Order (Beta)",
    layout: "default",
    permalink: "place-order-beta/",
  }),
};
