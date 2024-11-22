import React, { useEffect, useState } from "react";
import Navbar from "../components/Sidebar/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const MenuDescription = () => {
  const { date } = useParams();
  const [menus, setMenus] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  const navigate = useNavigate();
  const fetchDataValid = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/auth/validateToken`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.isValid) {
        return;
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during token validation:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchDataValid();
  }, []);
  const [isAddMenuModalOpen, setAddMenuModalOpen] = useState(false);
  const [menuData, setMenuData] = useState({
    date: "",
    name: "",
    price: "",
    description: "",
    menuType: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/menu/add-single`,
        menuData
      );
      fetchMenus();
      toast.success("Menu added successfully!");
      setAddMenuModalOpen(false);
      setMenuData({
        date: "",
        name: "",
        price: "",
        description: "",
        menuType: "",
      });
    } catch (error) {
      console.error("Error adding menu:", error);
      toast.error("Failed to add menu. Please try again.");
    }
  };
  const fetchMenus = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER}/api/menu/${date}`
      );

      if (response.data && response.data.items) {
        const categorizedMenus = {
          breakfast: [],
          lunch: [],
          dinner: [],
        };

        if (response.data.items.length > 0) {
          response.data.items.forEach((item) => {
            if (item.menuType.toLowerCase() === "breakfast") {
              categorizedMenus.breakfast.push(item);
            } else if (item.menuType.toLowerCase() === "lunch") {
              categorizedMenus.lunch.push(item);
            } else if (item.menuType.toLowerCase() === "dinner") {
              categorizedMenus.dinner.push(item);
            }
          });
        }

        setMenus(categorizedMenus);
      }
    } catch (err) {
      console.error("Failed to fetch menu data:", err);
    }
  };
  useEffect(() => {
    setMenuData((prev) => ({
      ...prev,
      date: date,
    }));

    fetchMenus();
  }, [date]);

  const handleDelete = async (data) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER}/api/menu/delete/${data._id}/${date}`
      );
      toast.success(`${data.name} has been deleted successfully.`);
      fetchMenus();
    } catch (error) {
      console.error("Error deleting menu:", error);
      toast.error("Failed to delete the menu.");
    }
  };

  const [isEditMenuModalOpen, setEditMenuModalOpen] = useState(false);
  const [editmenuData, editsetMenuData] = useState({
    name: "",
    price: "",
    description: "",
    menuType: "",
  });
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    editsetMenuData((prev) => ({ ...prev, [name]: value }));
  };
  const [editValue, setEditValue] = useState({});
  const handleEdit = (item) => {
    setEditValue(item);
    editsetMenuData(item);
    setEditMenuModalOpen(true);
  };
  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER}/api/menu/edit/${date}/${editValue._id}`,
        editmenuData
      );
      toast.success("Menu updated successfully!");
      fetchMenus();
      setEditMenuModalOpen(false);
    } catch (error) {
      console.error("Error updating menu:", error);
      toast.error("Failed to update menu!");
    }
  };

  const [addPreviousMenuModalOpen, setAddPreviousMenuModalOpen] =
    useState(false);
  const [formData, setFormData] = useState({
    date: "",
    menuType: "new",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmitPrevMenu = async (e) => {
    e.preventDefault();
    try {
      const editmenuData = {
        date: formData.date,
        menuType: formData.menuType,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_SERVER}/api/menu/prev/${date}`,
        editmenuData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 202);
      {
        toast.info(response.data.message);
      }
      if (response.status == 200) {
        setAddPreviousMenuModalOpen(false);
        fetchMenus();
        toast.success("Added Sucessfully");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    }
  };
  const renderTable = (type, data) => (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 capitalize">{type} Menu</h2>
      <div className="overflow-x-auto relative">
        <table className="w-full text-sm text-left text-black-500 dark:text-black-400">
          <thead className="text-xs text-black-700 uppercase bg-gray-50 dark:bg-gray-200 dark:text-black-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Name
              </th>
              <th scope="col" className="py-3 px-6">
                Price
              </th>
              <th scope="col" className="py-3 px-6">
                Description
              </th>
              <th scope="col" className="py-3 px-6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item._id}
                  className="bg-white border-b dark:bg-white-800 dark:border-white-700"
                >
                  <td className="py-4 px-6">{item.name}</td>
                  <td className="py-4 px-6">{item.price}</td>
                  <td className="py-4 px-6">{item.description}</td>
                  <td className="py-4 px-6 flex gap-2">
                    <FaEdit
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 cursor-pointer hover:text-blue-800"
                      title="Edit"
                      size={20}
                    />
                    <FaTrash
                      onClick={() => handleDelete(item)}
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      title="Delete"
                      size={20} // Icon size
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  <span className="text-gray-500 text-lg font-semibold italic">
                    No data found
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Menu Description</h1>
            <div className="flex space-x-2">
              {" "}
              {/* Reduced space between buttons */}
              <button
                onClick={() => setAddMenuModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Menu
              </button>
              <button
                onClick={() => setAddPreviousMenuModalOpen(true)}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Add Previous Menu
              </button>
            </div>
          </div>
          {renderTable("breakfast", menus.breakfast)}
          {renderTable("lunch", menus.lunch)}
          {renderTable("dinner", menus.dinner)}
        </div>
      </div>

      {isAddMenuModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl sm:max-w-8xl md:max-w-9xl lg:max-w-10xl xl:max-w-screen-xl p-10">
            <h2 className="text-xl font-bold mb-4">Add Daily Menu</h2>
            <form onSubmit={handleSubmit}>
              {/* Date Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Enter date
                </label>
                <input
                  type="date"
                  name="date"
                  value={menuData.date}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Menu Type
                </label>
                <select
                  name="menuType"
                  value={menuData.menuType}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                  required
                >
                  <option value="" disabled>
                    Select menu type
                  </option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              {/* Menu Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Menu Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={menuData.name}
                  onChange={handleChange}
                  placeholder="Enter menu name"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                  required
                />
              </div>

              {/* Menu Price */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Menu Price
                </label>
                <input
                  type="text"
                  name="price"
                  value={menuData.price}
                  onChange={handleChange}
                  placeholder="Enter menu price"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={menuData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                  required
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white rounded-md mr-2 hover:bg-red-700"
                  onClick={() => setAddMenuModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditMenuModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 w-4/5 max-w-3xl rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Menu</h2>
            <form>
              <div className="mb-6">
                <label className="block text-gray-700 text-lg mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editmenuData.name}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-lg mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={editmenuData.price}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-lg mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editmenuData.description}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                ></textarea>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-lg mb-2">
                  Menu Type
                </label>
                <select
                  name="menuType"
                  value={editmenuData.menuType}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditMenuModalOpen(false)}
                  className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition mr-4"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditSubmit}
                  className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {addPreviousMenuModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 max-w-lg">
            <h2 className="text-2xl font-bold mb-6">Add/Edit Previous Menu</h2>
            <form onSubmit={handleSubmitPrevMenu}>
              {/* Date Field */}
              <div className="mb-6">
                <label className="block text-gray-700 text-lg">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full border p-3 rounded-md text-lg"
                />
              </div>

              {/* Menu Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 text-lg">
                  Select Menu
                </label>
                <select
                  name="menuType"
                  onChange={handleInputChange}
                  className="w-full border p-3 rounded-md text-lg"
                >
                  <option value="new">Add Previous Menu</option>
                  <option value="exist">Add with existing menu</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setAddPreviousMenuModalOpen(false)}
                  className="bg-gray-500 text-white px-6 py-3 rounded-md mr-3 text-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuDescription;