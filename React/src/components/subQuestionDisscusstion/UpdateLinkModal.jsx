import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateLinkDrive } from "../../store/questionSlice";

function UpdateLinkModal({ onClose, slotId, currentLink }) {
  const [link, setLink] = useState(currentLink || "");
  const dispatch = useDispatch();

  const handleSave = () => {
    dispatch(updateLinkDrive({ slotId, linkDrive: link }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg">
        <h2 className="text-xl mb-4">Update Meeting Video Link</h2>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="https://meet.google.com/"
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-200 rounded"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateLinkModal;
