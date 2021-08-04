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
const corsPrefix = "https://cors-anywhere.herokuapp.com/";
const target =
  corsPrefix +
  "https://docs.google.com/forms/u/0/d/e/1FAIpQLSevQCDaUAtbCpJmdlJFMbnMtREiXiVdQeG47R9B7MKaZiWUug/formResponse?embedded=true";
const soups = window.currentSoups.map((v) => ({ ...v, quantity: "" }));

function orderForm() {
  const orderState = {
    ...fields,
    payPalInitiated: false,
    isInKenwick: false,
    paymentMethod: "inperson",
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
      const { soups, disposableContainers, reusableContainers } = this;
      const totalContainers =
        Number(disposableContainers[1]) + Number(reusableContainers[1]);
      const totalSoups = soups.reduce((acc, soup) => {
        return (acc += Number(soup.quantity || 0));
      }, 0);
      return totalSoups === totalContainers;
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

      const formData = new FormData();
      formData.append(fields.email[0], fields.email[1]);
      formData.append(fields.address[0], fields.address[1]);
      formData.append(fields.payment[0], fields.payment[1]);
      formData.append(
        fields.disposableContainers[0],
        fields.disposableContainers[1]
      );
      formData.append(
        fields.reusableContainers[0],
        fields.reusableContainers[1]
      );
      formData.append(
        fields.returningContainers[0],
        fields.returningContainers[1]
      );
      formData.append(fields.soup[0], soupString);
      formData.append(fields.totalPrice[0], this.computedPrice);

      // event handler
      function reqListener() {
        if (this.status === 200) {
          alert(
            `Hey, We got your Order! Thank you so much! We may contact you about delivery!`
          );
          window.location.href = "/";
        }
      }

      // get new XHR object
      var newXHR = new XMLHttpRequest();

      // bind our event listener to the "load" event.
      // "load" is fired when the response to our request is completed and without error.
      newXHR.addEventListener("load", reqListener);
      newXHR.onerror = reqListener;
      newXHR.open("POST", target);
      newXHR.send(formData);
    },
  };

  return orderState;
}

window.orderForm = orderForm;
