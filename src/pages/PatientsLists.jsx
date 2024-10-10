import React from "react";

const PatientsLists = () => {
  return (
    <div className="w-100">
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">ردیف</th>
            <th scope="col">نام</th>
            <th scope="col">نام خانوادگی</th>
            <th scope="col">کد ملی</th>
            <th scope="col">تاریخ اولین مراجعه</th>
            <th scope="col">تاریخ آخرین مراجعه</th>
            <th scope="col">نوع بدخیمی</th>
            <th scope="col">تشخیص</th>
            <th scope="col">جزئیات</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>Mark</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>Otto</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>Thornton</td>
            <td>@fat</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
            <td>@twitter</td>
            <td>Larry</td>
            <td>the Bird</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PatientsLists;
