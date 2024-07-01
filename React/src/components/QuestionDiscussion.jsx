import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuestion,
  fetchComments,
  addComment,
  voteComment,
} from "../store/questionSlice";
import Sidebar from "./Sidebar";

function QuestionDiscussion() {
  const dispatch = useDispatch();
  const { question, comments, status, error } = useSelector(
    (state) => state.question
  );
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("DISCUSS");
  const { questionId } = useParams();

  useEffect(() => {
    if (questionId) {
      dispatch(fetchQuestion(questionId));
      dispatch(fetchComments(questionId));
    }
  }, [dispatch, questionId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await dispatch(addComment({ questionId, content: newComment, userId: 1 }));
    setNewComment("");
  };

  const handleVote = async (commentId, value) => {
    try {
      await dispatch(voteComment({ commentId, value }));
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };
  const handleReply = (commentId) => {
    // Implement reply functionality
    console.log(`Replying to comment ${commentId}`);
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <button className="text-gray-600">☰</button>
          <h1 className="text-xl font-semibold">Question Discussion</h1>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <h2 className="text-2xl font-semibold mb-4">{question?.content}</h2>

          <div className="bg-white rounded-lg shadow">
            <div className="flex border-b">
              {["GROUP", "DISCUSS", "GRADE", "TEACHER MESSAGE"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 ${
                    activeTab === tab ? "border-b-2 border-blue-500" : ""
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "DISCUSS" && (
              <div className="p-4">
                <form onSubmit={handleCommentSubmit} className="mb-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Add your comment..."
                    rows="4"
                  />
                  <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Submit
                  </button>
                </form>

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded">
                      <p>{comment.content}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <span className="mr-4">Votes: {comment.votes}</span>
                        <div className="flex space-x-2">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleVote(comment.id, star)}
                              className="text-yellow-400 hover:text-yellow-500"
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        {/* ... */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="bg-white border-t p-4">
          <p className="text-center text-sm text-gray-600">Online: 9927</p>
        </footer>
      </div>

      <div className="w-64 bg-white p-4 border-l">
        <h3 className="font-semibold mb-2">Table of contents</h3>
        <div className="space-y-2">
          {question?.relatedQuestions?.map((relatedQuestion) => (
            <div key={relatedQuestion.id} className="flex items-center">
              <span className="mr-2 text-orange-500">◻</span>
              <Link
                to={`/questions/${relatedQuestion.id}`}
                className="text-sm hover:underline"
              >
                {relatedQuestion.content}
              </Link>
              <span className="ml-auto text-xs text-blue-500">
                {relatedQuestion.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuestionDiscussion;