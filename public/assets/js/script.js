var swiper = new Swiper(".mySwiper", {
    pagination: {
      el: ".swiper-pagination",
      dynamicBullets: true,
    },
  });
//  end slide 

// Loc sp 
const category = document.querySelectorAll("[category]");
if(category.length > 0){
  let url = new URL(window.location.href);

  category.forEach(button => {
    button.addEventListener("click",() => {
      const categoryStatus = button.getAttribute("category");

      if(categoryStatus ){
        url.searchParams.set("category", categoryStatus );
      }
      else {
        url.searchParams.delete("category");
      }

      window.location.href = url.href;
    });
  });
}

// Search 
const formSearch = querySelector("#form-search");
if(formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    // console.log(e.target.elements.value);
    const keyword = e.target.elements.keyword.value;

    if(keyword){
      url.searchParams.set("keyword", keyword);
    }
    else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  });
}