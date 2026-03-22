import { useState, useEffect } from "react";
import { createUser, updateUser } from "../../services/userService";

function UserForm({ user, onClose, reloadUsers }) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (user) {
        await updateUser(user.id, formData);
      } else {
        await createUser(formData);
      }

      reloadUsers();
      onClose();

    } catch (err) {
      console.log(err);
    }
  };

  return (

    <form onSubmit={handleSubmit} className="space-y-3">

      <input
        type="text"
        name="name"
        placeholder="Tên nhân viên"
        value={formData.name}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />

      <input
        type="text"
        name="phone"
        placeholder="Số điện thoại"
        value={formData.phone}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />

      <div className="flex justify-end gap-2">

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded"
        >
          Huỷ
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Lưu
        </button>

      </div>

    </form>
  );
}

export default UserForm;