import { useState } from "react";
import { useDispatch } from "react-redux";
import { addContactSupport } from "../../slices/contactSupportSlice";

const ContactSupportPopup = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addContactSupport({ title, contact, description }));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Contact Support</h2>
        <p className="text-red-500 mb-2">
          Please refer to FQA before requesting support
        </p>
        <p className="mb-4">
          Contact IT: 0913677744. If the request is important
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 mb-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Contact information (mobile or email)"
            className="w-full p-2 mb-2 border rounded"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 mb-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-200 rounded"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactSupportPopup;
