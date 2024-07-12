const GradeDisplay = ({ grades = [] }) => {
  if (!grades.length) {
    return <div>No grades available</div>;
  }

  const groupedGrades = grades.reduce((acc, grade) => {
    const { userId, hardWorking, goodKnowledge, teamworking } = grade;
    const totalScore = (hardWorking + goodKnowledge + teamworking) / 3;
    if (!acc[userId]) {
      acc[userId] = [];
    }
    acc[userId].push({ ...grade, totalScore });
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div>
        <div>
          <button>GET INDIVIDUAL</button>
          <button>RESET</button>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-blue-600">On Going</h2>
        <span className="text-gray-500">Latest: N/A</span>
      </div>
      <h3 className="text-xl font-bold mb-4">Round 1</h3>
      {Object.entries(groupedGrades).map(([userId, userGrades], index) => {
        const averageScore =
          userGrades.reduce((sum, grade) => sum + grade.totalScore, 0) /
          userGrades.length;

        return (
          <div
            key={userId}
            className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex items-center">
              <span className="font-semibold mr-2">
                {index === 0 ? "Presenting" : "Reviewing"}
              </span>
              <span className="text-gray-600">User {userId}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold">
                {averageScore.toFixed(1)}/5.0
              </span>
            </div>
          </div>
        );
      })}
      <div className="mt-4 text-sm text-gray-500">
        Created by: hoannn6@fpt.edu.vn
      </div>
    </div>
  );
};

export default GradeDisplay;
