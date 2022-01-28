const fields = {
  email: ["entry.159832721", ""],
  address: ["entry.1179605958", ""],
  soup: ["entry.2097007970", ""],
  disposableContainers: ["entry.2015699820", ""],
  reusableContainers: ["entry.1501295403", ""],
  returningContainers: ["entry.145362684", ""],
  totalPrice: ["entry.447434343", ""],
  payment: ["entry.899456984", "None"],
};
const soups = window.currentSoups.map((v) => ({ ...v, quantity: "" }));

function orderForm() {
  const orderState = {
    ...fields,
    payPalInitiated: false,
    isInKenwick: false,
    paymentMethod: "inperson",
    submitted: false,
    orderFailed: false,
    orderSuccessful: false,
    soups,
    get soupString() {
      return this.soups
        .map((v) => (v.quantity ? v.title + " x " + v.quantity : ""))
        .join("\n");
    },
    get computedPrice() {
      let price = 0;
      const {
        soups,
        disposableContainers,
        reusableContainers,
        returningContainers,
      } = this;
      soups.forEach((soup) => {
        price += Number(soup.quantity || 0) * Number(soup.price);
      });
      price += Number(disposableContainers[1]) || 0;
      price += (Number(reusableContainers[1]) || 0) * 3;
      price -= (Number(returningContainers[1]) || 0) * 3;

      if (price) {
        this.setupPayPal();
      }
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return formatter.format(price);
    },
    get computedValid() {
      const hasRequiredData =
        fields.email[1].length && fields.address[1].length;
      const { soups, disposableContainers, reusableContainers } = this;
      const totalContainers =
        Number(disposableContainers[1]) + Number(reusableContainers[1]);
      const totalSoups = soups.reduce((acc, soup) => {
        return (acc += Number(soup.quantity || 0));
      }, 0);
      return (
        hasRequiredData && totalSoups > 0 && totalSoups === totalContainers
      );
    },
    setupPayPal(data) {
      if (this.payPalInitiated) {
        return;
      }
      this.payPalInitiated = true;
      console.log(data);
      paypal
        .Buttons({
          style: {
            shape: "pill",
            color: "gold",
            layout: "vertical",
            label: "paypal",
          },

          createOrder: function (data, actions) {
            console.log("description", orderState.soupString);
            console.log("price", orderState.computedPrice);
            return actions.order.create({
              purchase_units: [
                {
                  description: orderState.soupString,
                  amount: {
                    currency_code: "USD",
                    value: orderState.computedPrice,
                  },
                },
              ],
            });
          },

          onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
              console.log(details);
              orderState.payment[1] = details && details.id;
              orderState.submit();
            });
          },

          onError: function (err) {
            console.log(err);
          },
        })
        .render("#paypal-button-container");
    },
    submit() {
      const soupString = this.soupString;

      const payload = JSON.stringify({
        email: fields.email[1],
        address: fields.address[1],
        payment: fields.payment[1],
        disposableContainers: fields.disposableContainers[1],
        reusableContainers: fields.reusableContainers[1],
        returningContainers: fields.returningContainers[1],
        soup: soupString,
        totalPrice: this.computedPrice,
      });
      this.submitted = true;
      fetch("/.netlify/functions/order", {
        method: "POST",
        body: payload,
      }).then((data) => {
        if (data.status === 200) {
          this.orderSuccessful = true;
        } else {
          this.orderFailed = true;
        }
        return data.json();
      });
    },
  };

  return orderState;
}

window.orderForm = orderForm;
