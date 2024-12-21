// table-cart
const tableCart = document.querySelector("[table-cart]");
if(tableCart) {
  const listInputQuantity = tableCart.querySelectorAll("input[name='quantity']");
  listInputQuantity.forEach(input => {
    input.addEventListener("change", () => {
      const productId = input.getAttribute("item-id");
      const quantity = input.value;
      fetch("/cart/update", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          productId: productId,
          quantity: quantity
        })
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "success") {
            location.reload();
          }
        })
    })
  })
}
// End table-cart