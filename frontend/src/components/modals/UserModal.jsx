import { useState } from "react";
import userService from "../../services/userService";

function UserModal({ isOpen, onClose, reloadUsers }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await userService.create({
        name,
        email,
        phone
      });

      reloadUsers(); // reload table
      onClose();

      setName("");
      setEmail("");
      setPhone("");

    } catch (err) {

      console.log("Create error:", err);

    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

      <div className="bg-white p-6 rounded-lg w-96">

        <h2 className="text-xl font-bold mb-4">
          Thêm nhân viên
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <input
            type="text"
            placeholder="Tên nhân viên"
            className="border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Số điện thoại"
            className="border p-2 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="flex justify-end gap-2 mt-3">

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 border rounded"
            >
              Huỷ
            </button>

            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              Lưu
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default UserModal;