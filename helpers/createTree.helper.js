// const createTree = (array, parentId = "") => {
//   const newArray = [];
//   for (const item of array) {
//     if(item.parent_id == parentId) {
//       const children = createTree(array, item.id);
//       if(children.length > 0) {
//         item.children = children;
//       }
//       newArray.push(item);
//     }
//   }
//   return newArray;
// }
// module.exports.getAllCategory = (array, parentId = "") => {
//   const tree = createTree(array, parentId);
//   return tree;
// }


// Hàm tạo cây từ một mảng
const createTree = (array, parentId = "") => {
  const newArray = [];
  const map = {}; // Map lưu trữ tất cả các danh mục theo ID

  // Duyệt qua tất cả các danh mục và phân loại chúng vào map
  for (const item of array) {
    if (!map[item.id]) {
      map[item.id] = item;
      map[item.id].children = []; // Tạo mảng con rỗng cho mỗi danh mục
    }

    if (item.parent_id === parentId) {
      newArray.push(map[item.id]); // Nếu là danh mục con trực tiếp, thêm vào mảng kết quả
    } else if (map[item.parent_id]) {
      map[item.parent_id].children.push(map[item.id]); // Nếu là danh mục con của một danh mục đã có trong map
    }
  }

  return newArray;
};

// Hàm lấy tất cả danh mục từ mảng và tạo cấu trúc cây
module.exports.getAllCategory = (array, parentId = "") => {
  return createTree(array, parentId);
}


