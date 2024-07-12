import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const StudentActivityChart = ({ users, comments, questionId }) => {
  const studentActivity = users.map((user) => {
    const userComments = comments.filter(
      (comment) =>
        comment.userId === user.id && comment.questionId === questionId
    );
    const totalComments = userComments.length;
    const totalVotes = userComments.reduce(
      (sum, comment) => sum + comment.votes,
      0
    );
    const activityScore = Math.floor((totalVotes + totalComments) / 3);

    return {
      x: totalVotes,
      y: totalComments,
      r: activityScore * 5,
      label: user.fullName,
    };
  });

  const data = {
    datasets: [
      {
        label: "Student Activity",
        data: studentActivity,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Votes Given",
        },
      },
      y: {
        title: {
          display: true,
          text: "Comments",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.raw.label}: (Votes: ${context.raw.x}, Comments: ${context.raw.y})`,
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg  shadow-lg">
      <h2 className="text-xl font-bold mb-4">Student Activity</h2>
      <Scatter data={data} options={options} />
    </div>
  );
};

export default StudentActivityChart;
