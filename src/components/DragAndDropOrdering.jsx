import React, { Fragment } from "react";
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
        } catch (error) {
          // Swal.fire("خطا", "حذف آیتم با خطا مواجه شد", "error");
          // console.error("Error deleting item:", error);
        }
      }
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {categories &&
        Object.entries(categories).map(([categoryUid, categoryData], idx) => (
          <Fragment key={idx}>
            {categoryUid === sub && (
              <div
                key={categoryUid}
                style={{ marginBottom: "20px" }}
                className="mt-4"
              >
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
                      {categoryData?.items?.map((item, index) => (
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
                              <div className="d-flex align-items-center justify-content-between gap-3 w-100">
                                <span>{item.name}</span>

                                <div className="d-flex align-items-center gap-2">
                                  <div className="d-flex align-items-center gap-2 bg-primary rounded-3 p-2">
                                    <span className=" text-white px-2 py-1 border-round">
                                      {" "}
                                      ترتیب :
                                    </span>
                                    <span
                                      className=" bg-warning text-dark px-2 py-1 rounded-3"
                                      style={{
                                        minWidth: "30px",
                                        textAlign: "center",
                                      }}
                                    >
                                      {item.ordering}
                                    </span>
                                  </div>
                                  <FaTrash
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleDelete(item.uid)}
                                  />
                                </div>
                              </div>
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
          </Fragment>
        ))}

      <div>
        {categories?.length > 0 &&
          categories?.map((categoryData, idx) => (
            <Fragment key={idx} className="my-2">
              {/* {categoryData?.name} */}
              {/* {categoryData?.items?.map((item, index) => ( */}

              <div
                style={{
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
                <div className="d-flex align-items-center gap-3">
                  <span>{categoryData.name}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center gap-2 bg-primary rounded-3 p-2">
                    <span className=" text-white px-2 py-1 border-round">
                      {" "}
                      ترتیب :
                    </span>
                    <span
                      className=" bg-warning text-dark px-2 py-1 rounded-3"
                      style={{ minWidth: "30px", textAlign: "center" }}
                    >
                      {categoryData.ordering}
                    </span>
                  </div>
                  <FaTrash
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => handleDelete(categoryData.uid)}
                  />
                </div>
              </div>
            </Fragment>
          ))}
      </div>
    </DragDropContext>
  );
};

export default DragAndDropOrdering;
