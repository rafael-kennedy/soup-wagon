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
                      min="0"
                      max="10"
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
                    min="0"
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
                    min="0"
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
                    min="0"
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
          <div x-show="computedValid === false" class="text-center text-xl">
            Please select enough containers to hold your soup.
          </div>
          <div x-show="computedValid === true">
            <div class="flex flex-col mb-4">
              <label
                class="mb-2 font-bold text-lg text-grey-darkest"
                for="payment-method"
              >
                How Would you like to pay?
              </label>
              <div class="inline-flex">
                <input
                  type="radio"
                  id="paypal-payment-method"
                  name="paypal-payment-method"
                  value="paypal"
                  x-model="paymentMethod"
                />
                <label for="paypal-payment-method" class="ml-4"
                  >Pay now with PayPal</label
                >
              </div>
              <div class="inline-flex">
                <input
                  type="radio"
                  id="inperson-payment-method"
                  name="inperson-payment-method"
                  value="inperson"
                  x-model="paymentMethod"
                />
                <label for="inperson-payment-method" class="ml-4"
                  >Pay in person with cash, check, Zelle, or Venmo</label
                >
              </div>
            </div>

            <div
              id="smart-button-container"
              x-show="paymentMethod === 'paypal'"
            >
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
        </div>
      </template>
      <template x-if="submitted === true">
        <div class="modal-wrapper">
          <div class="modal-card">
            <template x-if="orderFailed">
              <h3>
                Sorry, there was an error processing your order. Please call 859
                - 412 - 4341 and we'll sort it out!
              </h3>
            </template>
            <template x-if="orderSuccessful">
              <div>
                <h3>We've got your order!</h3>

                <a href="/" class="text-green hover:text-brown">OK</a>
              </div>
            </template>
            <template x-if="!(orderFailed || orderSuccessful)">
              <div>
                <i class="fa fa-spinner spinning"></i>
                LOADING
              </div>
            </template>
          </div>
        </div>
      </template>
    </form>
  </div>
`;

module.exports = {
  render: (data) => {
    const soups = data.collections.soups
      .filter((v) => v.data.this_week && !v.data.sold_out)
      .map((v) => ({ url: v.url, title: v.data.title, price: v.data.price }));
    return (
      `<script>window.currentSoups = ${JSON.stringify(soups)}</script>` +
      template
    );
  },
  data: () => ({
    title: "Place An Order (Beta)",
    layout: "default",
    permalink: "place-order/",
  }),
};
