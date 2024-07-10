import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import PropTypes from "prop-types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GroupActivityChart = ({ groups = [], comments = [] }) => {
  const groupArray = Array.isArray(groups) ? groups : [groups];

  const groupComments = groupArray.map((group) => {
    const userIds = group.members.map((member) => member.id);
    return comments.filter((comment) => userIds.includes(comment.userId))
      .length;
  });

  const groupVotes = groupArray.map((group) => {
    const userIds = group.members.map((member) => member.id);
    return comments
      .filter((comment) => userIds.includes(comment.userId))
      .reduce((sum, comment) => sum + (comment.votes || 0), 0);
  });

  const data = {
    labels: groupArray.map((group) => `Group ${group.id}`),
    datasets: [
      {
        label: "Comments",
        data: groupComments,
        backgroundColor: "rgba(54, 162, 235, 0.8)",
      },
      {
        label: "Votes",
        data: groupVotes,
        backgroundColor: "rgba(255, 206, 86, 0.8)",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Group Activity</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

GroupActivityChart.propTypes = {
  groups: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  comments: PropTypes.array,
};

export default GroupActivityChart;
