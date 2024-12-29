const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");

// module.exports.index = async (req, res) => {
//   const products = await Product
//     .find({
//       status: "active",
//       deleted: false
//     })
//     .sort({
//       position: "desc"
//     });

//   for (const item of products) {
//     item.priceNew = item.price*(100 - item.discountPercentage)/100;
//     item.priceNew = (item.priceNew).toFixed(0);
//   }

//   res.render("client/pages/products/index", {
//     pageTitle: "Danh sách sản phẩm",
//     products: products
//   });
// }



function getPagination(currentPage, totalPages, maxVisibleMiddlePages = 3) {
  let pages = [];

  // Luôn hiển thị trang đầu
  pages.push(1);

  // Hiển thị các trang giữa
  const start = Math.max(2, currentPage - Math.floor(maxVisibleMiddlePages / 2));
  const end = Math.min(totalPages - 1, currentPage + Math.floor(maxVisibleMiddlePages / 2));

  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (end < totalPages - 1) pages.push("...");

  // Luôn hiển thị trang cuối
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

// module.exports.index = async (req, res) => {
//   console.log('load data');
//   const find = { deleted: false };

//   // Phân trang
//   let limitItems = 20;
//   let page = 1;
//   if (req.query.page) {
//     page = parseInt(req.query.page);
//   }
//   if (req.query.limit) {
//     limitItems = parseInt(req.query.limit);
//   }
//   const skip = (page - 1) * limitItems;
//   const totalProduct = await Product.countDocuments(find);
//   const totalPage = Math.ceil(totalProduct / limitItems);

//   // Tạo danh sách trang cần hiển thị
//   const pagination = getPagination(page, totalPage);

//   // Lấy sản phẩm
//   const products = await Product.find(find).limit(limitItems).skip(skip);
//   console.log("Products Count:", products.length);

//   for (const item of products) {
//     item.priceNew = item.price * (100 - item.discountPercentage) / 100;
//     item.priceNew = (item.priceNew).toFixed(0);
//   }

//   res.render("client/pages/products/index", {
//     pageTitle: "Danh sách sản phẩm",
//     products: products,
//     totalPage: totalPage,
//     currentPage: page,
//     pagination: pagination // Gửi danh sách trang về frontend
//   });
// };

module.exports.index = async (req, res) => {
  console.log('load data');
  
  // Điều kiện tìm kiếm sản phẩm
  const find = { deleted: false };

  // Phân trang
  let limitItems = 20;
  let page = 1;
  if (req.query.page) {
    page = parseInt(req.query.page);
  }
  if (req.query.limit) {
    limitItems = parseInt(req.query.limit);
  }
  const skip = (page - 1) * limitItems;

  // Sử dụng Aggregation để phân trang
  const aggregation = [
    // Lọc theo deleted
    {
      $match: find
    },
    // Đếm tổng số sản phẩm (tính tổng số sản phẩm phù hợp)
    {
      $facet: {
        metadata: [
          { $count: "total" } // Đếm tổng số sản phẩm phù hợp
        ],
        data: [
          { $skip: skip }, // Bỏ qua các sản phẩm cũ để phân trang
          { $limit: limitItems } // Giới hạn số lượng sản phẩm trên mỗi trang
        ]
      }
    }
  ];

  // Chạy Aggregation
  const result = await Product.aggregate(aggregation);

  // Lấy tổng số sản phẩm và các sản phẩm của trang hiện tại
  const totalProduct = result[0].metadata[0]?.total || 0;
  const totalPage = Math.ceil(totalProduct / limitItems);

  // Lấy sản phẩm
  const products = result[0].data;

  // Tính giá mới cho sản phẩm
  products.forEach(product => {
    product.priceNew = product.price * (100 - product.discountPercentage) / 100;
    product.priceNew = (product.priceNew).toFixed(0);
  });

  // Tạo danh sách trang cần hiển thị
  const pagination = getPagination(page, totalPage);

  // Truyền thông tin sang view
  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    totalPage: totalPage,
    currentPage: page,
    pagination: pagination // Gửi danh sách trang về frontend
  });
};



module.exports.detail = async (req, res) => {
  const slug = req.params.slug;

  const product = await Product.findOne({
    slug: slug,
    status: "active",
    deleted: false
  });

  if(product.category_id) {
    const category = await ProductCategory.findOne({
      _id: product.category_id,
      deleted: false,
      status: "active"
    });

    product.category = category;
  }

  product.priceNew = product.price*(100 - product.discountPercentage)/100;
  product.priceNew = (product.priceNew).toFixed(0);

  res.render("client/pages/products/detail", {
    pageTitle: product.title,
    product: product
  });
}

// module.exports.category = async (req, res) => {
//   const slugCategory = req.params.slugCategory;
  
//   const category = await ProductCategory.findOne({
//     slug: slugCategory,
//     deleted: false,
//     status: "active"
//   });

//   const allCategoryChildren = [];

//   // Lấy danh mục con (nếu có)
//   const getCategoryChildren = async (parentId) => {
//     const childs = await ProductCategory.find({
//       parent_id: parentId,
//       status: "active",
//       deleted: false
//     });
//     for (const child of childs) {
//       allCategoryChildren.push(child.id);
//       await getCategoryChildren(child.id);
//     }
//   };

//   await getCategoryChildren(category.id);

//   // Phân trang
//   let limitItems = 20; // Số sản phẩm mỗi trang
//   let page = 1;
//   if (req.query.page) {
//     page = parseInt(req.query.page);
//   }
//   const skip = (page - 1) * limitItems;

//   // Đếm tổng số sản phẩm trong danh mục (sử dụng filter phân trang)
//   const totalProduct = await Product.countDocuments({
//     category_id: { $in: [category.id, ...allCategoryChildren] },
//     status: "active",
//     deleted: false
//   });
//   const totalPage = Math.ceil(totalProduct / limitItems);

//   // Tạo danh sách trang cần hiển thị
//   const pagination = getPagination(page, totalPage);

//   // Lấy sản phẩm với phân trang (skip và limit)
//   const products = await Product.find({
//     category_id: { $in: [category.id, ...allCategoryChildren] },
//     status: "active",
//     deleted: false
//   }).skip(skip).limit(limitItems).sort({ position: "desc" });
//   console.log("Products Count:", products.length);

//   for (const product of products) {
//     product.priceNew = product.price * (100 - product.discountPercentage) / 100;
//     product.priceNew = (product.priceNew).toFixed(0);
//   }

//   res.render("client/pages/products/index", {
//     pageTitle: category.title,
//     products: products,
//     totalPage: totalPage,
//     currentPage: page,
//     pagination: pagination // Gửi danh sách trang về frontend
//   });
// };


module.exports.category = async (req, res) => {
  const slugCategory = req.params.slugCategory;

  // Tìm danh mục gốc
  const category = await ProductCategory.findOne({
    slug: slugCategory,
    deleted: false,
    status: "active"
  });

  console.log("Category found: ", category); // Debug log để kiểm tra danh mục đã được tìm thấy chưa

  // Hàm kiểm tra xem danh mục có phải là cha của nút lá không
  const isParentOfLeafNode = async (parentId) => {
    const children = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false
    });

    for (const child of children) {
      const grandChildren = await ProductCategory.find({
        parent_id: child.id,
        status: "active",
        deleted: false
      });

      if (grandChildren.length === 0) {
        console.log(`Category ${parentId} has leaf node child`); // Debug log để kiểm tra danh mục cha có con lá không
        return true; // Nếu có con lá, thì cha này có thể hiển thị sản phẩm
      }
    }

    console.log(`Category ${parentId} does not have leaf node child`); // Debug log nếu không có con lá
    return false; // Nếu không có con lá, không hiển thị sản phẩm
  };

  // Kiểm tra xem danh mục có phải là cha của nút lá không
  if (await isParentOfLeafNode(category.id)) {
    // Phân trang
    let limitItems = 10; // Số sản phẩm mỗi trang
    let page = 1;
    if (req.query.page) {
      page = parseInt(req.query.page);
    }
    const skip = (page - 1) * limitItems;

    // Đếm tổng số sản phẩm trong danh mục này
    const totalProduct = await Product.countDocuments({
      category_id: category.id,
      status: "active",
      deleted: false
    });
    const totalPage = Math.ceil(totalProduct / limitItems);

    // Tạo danh sách trang cần hiển thị
    const pagination = getPagination(page, totalPage);

    // Lấy sản phẩm với phân trang (skip và limit)
    const products = await Product.find({
      category_id: category.id,
      status: "active",
      deleted: false
    }).skip(skip).limit(limitItems).sort({ position: "desc" });

    // Tính giá mới cho sản phẩm
    for (const product of products) {
      product.priceNew = product.price * (100 - product.discountPercentage) / 100;
      product.priceNew = (product.priceNew).toFixed(0);
    }

    // Render trang sản phẩm
    res.render("client/pages/products/index", {
      pageTitle: category.title,
      products: products,
      totalPage: totalPage,
      currentPage: page,
      pagination: pagination // Gửi danh sách trang về frontend
    });

  } else {
    console.log(`Category ${category.title} is not a parent of leaf node`); // Debug log nếu không phải cha của nút lá
    // Nếu không phải là cha của nút lá, kiểm tra xem danh mục này có phải là danh mục trung gian
    const hasLeafNodeChild = await isParentOfLeafNode(category.id);
    
    if (hasLeafNodeChild) {
      console.log(`Category ${category.title} is a parent with a leaf node child`); // Debug log
      // Nếu là cha của nút lá, hiển thị thông báo yêu cầu chọn thể loại chi tiết hơn
      res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: [], // Không có sản phẩm hiển thị
        totalPage: 0,
        currentPage: 1,
        pagination: [],
        alertMessage: "Vui lòng chọn thể loại chi tiết hơn!" // Thêm alert message
      });
    } else {
      console.log(`Category ${category.title} has no leaf node child`); // Debug log
      // Nếu là danh mục trung gian, hiển thị thông báo yêu cầu chọn thể loại chi tiết hơn
      res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: [], // Không có sản phẩm hiển thị
        totalPage: 0,
        currentPage: 1,
        pagination: [],
        alertMessage: "Vui lòng chọn thể loại chi tiết hơn!" // Thêm alert message
      });
    }
  }
};

module.exports.search = async (req, res) => {
  const keyword = req.query.keyword;
  let products = [];
  // Tìm kiếm
  if(keyword) {
    const regex = new RegExp(keyword, "i");
    products = await Product
      .find({
        title: regex,
        deleted: false,
        status: "active"
      })
      // .sort({ position: "desc" });
    for (const item of products) {
      item.priceNew = (1 - item.discountPercentage/100) * item.price;
      item.priceNew = item.priceNew.toFixed(0);
    }
  }
  // Hết Tìm kiếm
  res.render("client/pages/products/search", {
    pageTitle: `Kết quả tìm kiếm: ${keyword}`,
    keyword: keyword,
    products: products
  });
}