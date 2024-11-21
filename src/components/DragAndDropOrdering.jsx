import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";

const DragAndDropOrdering = ({
  sub,
  categories,
  handleDragEnd,
  refreshSub,
  setRefreshSub,
  url,
  titles,
}) => {
  const handleDelete = async (uid) => {
    Swal.fire({
      title: "آیا از حذف این مورد مطمئن هستید؟",
      text: "این عمل قابل بازگشت نیست!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "حذف",
      cancelButtonText: "لغو",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://cancerreg.ir/api/v1/${url}/${uid}/`);
          Swal.fire("حذف شد", "آیتم مورد نظر با موفقیت حذف شد", "success");
          setRefreshSub(!refreshSub);
          // Optionally refresh the categories or handle state update
        } catch (error) {
          Swal.fire("خطا", "حذف آیتم با خطا مواجه شد", "error");
          console.error("Error deleting item:", error);
        }
      }
    });
  };

  // console.log("titles", titles);
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {categories &&
        Object.entries(categories).map(([categoryUid, categoryData]) => (
          <>
            {categoryUid === sub && (
              <div
                key={categoryUid}
                style={{ marginBottom: "20px" }}
                className="mt-4"
              >
                {/* <h3>{categoryData.categoryName}</h3> */}
                <Droppable droppableId={categoryUid}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        padding: "10px",
                        background: "#f9f9f9",
                      }}
                    >
                      {categoryData.items.map((item, index) => (
                        <Draggable
                          key={item.uid}
                          draggableId={item.uid}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                padding: "10px",
                                margin: "5px 0",
                                background: "#fff",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>{item.name}</span>
                              <FaTrash
                                style={{
                                  // color: "red",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleDelete(item.uid)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )}
          </>
        ))}
    </DragDropContext>
  );
};

export default DragAndDropOrdering;

// import React, { useState, useEffect } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { FaTrash } from "react-icons/fa";

// const DragAndDropOrdering = ({
//   categories,
//   sub,
//   refreshSub,
//   setRefreshSub,
//   url,
// }) => {
//   const [rows, setRows] = useState({});

//   // Initialize rows with categories[sub]?.items
//   useEffect(() => {
//     if (categories && sub) {
//       const filteredCategories = categories[sub]?.items || [];
//       setRows({ row1: filteredCategories }); // Initialize rows with a single row
//     }
//   }, [categories, sub]);

//   const handleDelete = async (uid) => {
//     Swal.fire({
//       title: "آیا از حذف این مورد مطمئن هستید؟",
//       text: "این عمل قابل بازگشت نیست!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "حذف",
//       cancelButtonText: "لغو",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await axios.delete(`https://cancerreg.ir/api/v1/${url}/${uid}/`);
//           Swal.fire("حذف شد", "آیتم مورد نظر با موفقیت حذف شد", "success");
//           setRefreshSub(!refreshSub);
//         } catch (error) {
//           Swal.fire("خطا", "حذف آیتم با خطا مواجه شد", "error");
//           console.error("Error deleting item:", error);
//         }
//       }
//     });
//   };

//   const handleRowDragEnd = (result) => {
//     if (!result.destination) {
//       // If dropped outside, create a new row
//       const newRowId = `row${Object.keys(rows).length + 1}`;
//       const updatedRows = { ...rows };

//       // Remove item from source row
//       const [movedItem] = updatedRows[result.source.droppableId].splice(
//         result.source.index,
//         1
//       );

//       // Add the item to the new row
//       updatedRows[newRowId] = [movedItem];

//       // Add an empty row to the end
//       const emptyRowId = `row${Object.keys(updatedRows).length + 1}`;
//       updatedRows[emptyRowId] = [];

//       setRows(updatedRows);
//       return;
//     }

//     const { source, destination } = result;

//     // Clone rows state
//     const updatedRows = { ...rows };

//     // Remove item from source row
//     const [movedItem] = updatedRows[source.droppableId].splice(source.index, 1);

//     // Add item to destination row
//     if (!updatedRows[destination.droppableId]) {
//       updatedRows[destination.droppableId] = [];
//     }
//     updatedRows[destination.droppableId].splice(
//       destination.index,
//       0,
//       movedItem
//     );

//     // Add a new empty row if the last row has items
//     const lastRowKey = Object.keys(updatedRows).slice(-1)[0];
//     if (updatedRows[lastRowKey].length > 0) {
//       const newRowId = `row${Object.keys(updatedRows).length + 1}`;
//       updatedRows[newRowId] = [];
//     }

//     setRows(updatedRows);

//     // Log rows for debugging
//     Object.entries(updatedRows).forEach(([rowId, items]) => {
//       console.log(
//         `Row: ${rowId}, Items: ${items.map((item) => item.uid).join(", ")}`
//       );
//     });
//   };

//   console.log("rows", rows?.row1);
//   return (
//     <DragDropContext onDragEnd={handleRowDragEnd}>
//       <div
//         style={{ display: "flex", flexDirection: "column", gap: "20px" }}
//         className="mt-5"
//       >
//         {Object.entries(rows).map(([rowId, rowItems]) => (
//           <Droppable key={rowId} droppableId={rowId} direction="horizontal">
//             {(provided) => (
//               <div
//                 ref={provided.innerRef}
//                 {...provided.droppableProps}
//                 style={{
//                   border: "1px solid #ccc",
//                   borderRadius: "5px",
//                   padding: "10px",
//                   minHeight: "100px",
//                   background: "#f9f9f9",
//                 }}
//               >
//                 <h4>{rowId}</h4>
//                 {rowItems.map((item, index) => (
//                   <Draggable
//                     key={item.uid}
//                     draggableId={item.uid}
//                     index={index}
//                   >
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         style={{
//                           ...provided.draggableProps.style,
//                           padding: "10px",
//                           margin: "5px",
//                           background: "#fff",
//                           border: "1px solid #ddd",
//                           borderRadius: "5px",
//                         }}
//                       >
//                         <span>{item.name}</span>
//                         <FaTrash
//                           style={{
//                             cursor: "pointer",
//                             marginLeft: "10px",
//                           }}
//                           onClick={() => handleDelete(item.uid)}
//                         />
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         ))}
//       </div>
//     </DragDropContext>
//   );
// };

// export default DragAndDropOrdering;
