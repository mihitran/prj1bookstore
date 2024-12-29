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

// Phân trang
const listButtonPagination = document.querySelectorAll("[button-pagination]");
if(listButtonPagination.length > 0) {
  let url = new URL(location.href); // Nhân bản url
  listButtonPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      if(page) {
        url.searchParams.set("page", page);
      } else {
        url.searchParams.delete("page");
      }
  
      location.href = url.href;
    })
  })
  // Hiển thị trang mặc định
  const pageCurrent = url.searchParams.get("page") || 1;
  const buttonCurrent = document.querySelector(`[button-pagination="${pageCurrent}"]`);
  if(buttonCurrent) {
    buttonCurrent.parentNode.classList.add("active");
  }
}
// Hết Phân trang