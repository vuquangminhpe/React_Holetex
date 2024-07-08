import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupMembers, updateGrades } from "../store/questionSlice";

const StarRating = ({ rating, onRatingChange, disabled }) => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          className="font-semibold p-1 "
          key={star}
          onClick={() => !disabled && onRatingChange(star)}
          style={{
            cursor: disabled ? "default" : "pointer",
            color: star <= rating ? "gold" : "gray",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const GradingModal = ({ onClose, questionId, currentUserId }) => {
  const dispatch = useDispatch();
  const { currentGroup, currentSlot } = useSelector((state) => state.question);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    dispatch(fetchGroupMembers("1"));
  }, [dispatch]);

  useEffect(() => {
    if (currentSlot && currentSlot.grades) {
      const initialGrades = {};
      currentSlot.grades.forEach((grade) => {
        initialGrades[grade.userId] = {
          hardWorking: grade.hardWorking,
          goodKnowledge: grade.goodKnowledge,
          teamworking: grade.teamworking,
        };
      });
      setGrades(initialGrades);
    }
  }, [currentSlot]);

  const handleRatingChange = (userId, category, value) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [userId]: {
        ...prevGrades[userId],
        [category]: value,
      },
    }));
  };

  const handleGrade = () => {
    const updatedGrades = Object.entries(grades).map(([userId, ratings]) => ({
      userId,
      questionId,
      ...ratings,
    }));
    dispatch(updateGrades({ slotId: currentSlot.id, grades: updatedGrades }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg w-3/4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold w-full p-1 border-b-2">
            Grading For Groupmates
          </h2>
          <button onClick={onClose} className="text-xl">
            &times;
          </button>
        </div>
        <p className="mb-4">
          You are grading for groupmates (Click on stars to grade)
        </p>
        <table className="w-full">
          <thead className="p-4">
            <tr className="text-left  border-b-2 bg-gray-100">
              <th className="">Name</th>
              <th className="">Roll Number</th>
              <th className="">Hard-working</th>
              <th className="">Good knowledge/Skills</th>
              <th className="">Teamworking</th>
              <th className="">Total</th>
            </tr>
          </thead>
          <tbody className="p-4">
            {currentGroup &&
              currentGroup.members.map((member) => (
                <tr className="border-b-2" key={member.id}>
                  <td>{member.fullName}</td>
                  <td>{member.username}</td>
                  <td>
                    <StarRating
                      rating={grades[member.id]?.hardWorking || 0}
                      onRatingChange={(value) =>
                        handleRatingChange(member.id, "hardWorking", value)
                      }
                      disabled={member.id === currentUserId}
                    />
                  </td>
                  <td>
                    <StarRating
                      rating={grades[member.id]?.goodKnowledge || 0}
                      onRatingChange={(value) =>
                        handleRatingChange(member.id, "goodKnowledge", value)
                      }
                      disabled={member.id === currentUserId}
                    />
                  </td>
                  <td>
                    <StarRating
                      rating={grades[member.id]?.teamworking || 0}
                      onRatingChange={(value) =>
                        handleRatingChange(member.id, "teamworking", value)
                      }
                      disabled={member.id === currentUserId}
                    />
                  </td>
                  <td>
                    {Math.floor(
                      ((grades[member.id]?.hardWorking || 0) +
                        (grades[member.id]?.goodKnowledge || 0) +
                        (grades[member.id]?.teamworking || 0)) /
                        5
                    ) || 0}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-200 rounded"
          >
            CANCEL
          </button>
          <button
            onClick={handleGrade}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            GRADE
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradingModal;
