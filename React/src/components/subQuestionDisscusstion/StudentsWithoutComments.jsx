const StudentsWithoutComments = ({ users, comments, questionId }) => {
  const studentsWithoutComments = users.filter(
    (user) =>
      !comments.some(
        (comment) =>
          comment.userId === user.id && comment.questionId === questionId
      )
  );

  return (
    <div className="p-4 bg-white w-[800px] h-[500px] rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Students Without Comments</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">NO</th>
            <th className="text-left">STUDENT</th>
          </tr>
        </thead>
        <tbody>
          {studentsWithoutComments.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>
                {student.fullName}
                <br />
                <span className="text-gray-500">{student.email}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsWithoutComments;
