const fields = {
  email: ["entry.159832721", ""],
  address: ["entry.1179605958", ""],
  soup: ["entry.2097007970", ""],
  disposableContainers: ["entry.2015699820", ""],
  reusableContainers: ["entry.1501295403", ""],
  returningContainers: ["entry.145362684", ""],
  totalPrice: ["entry.447434343", ""],
};
const corsPrefix = "https://cors-anywhere.herokuapp.com/";
const target =
  corsPrefix +
  "https://docs.google.com/forms/u/0/d/e/1FAIpQLSevQCDaUAtbCpJmdlJFMbnMtREiXiVdQeG47R9B7MKaZiWUug/formResponse?embedded=true";
const soups = window.currentSoups.map((v) => ({ ...v, quantity: "" }));
function orderForm() {
  return {
    ...fields,
    isInKenwick: false,
    soups,
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

      return price;
    },
    submit() {
      const soupString = this.soups
        .map((v) => (v.quantity ? v.title + "x" + v.quantity : ""))
        .join("\n");

      const formData = new FormData();
      formData.append(fields.email[0], fields.email[1]);
      formData.append(fields.address[0], fields.address[1]);
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

      debugger;

      // event handler
      function reqListener() {
        if (this.status === 200) {
          alert(
            "Hey, We got your Order! Thank you so much! We will reach out to you and get payment when we deliver your soup."
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
}

window.orderForm = orderForm;
