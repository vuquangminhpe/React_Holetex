import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuestion,
  fetchComments,
  addComment,
  voteComment,
  fetchUsers,
  fetchSlot,
  fetchGroupMembers,
} from "../store/questionSlice";

function QuestionDiscussion() {
  const dispatch = useDispatch();
  const {
    question,
    comments,
    users,
    status,
    error,
    currentSlot,
    currentGroup,
  } = useSelector((state) => state.question);
  const { currentUser } = useSelector((state) => state.user);
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("DISCUSS");
  const { questionId } = useParams();
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    if (questionId) {
      dispatch(fetchQuestion(questionId)).then(() => {
        dispatch(fetchSlot(questionId));
      });
      dispatch(fetchComments(questionId));
      dispatch(fetchUsers());
    }
  }, [dispatch, questionId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    await dispatch(
      addComment({
        questionId,
        content: newComment,
        userId: currentUser.id,
      })
    );
    setNewComment("");
  };

  const handleVote = async (commentId, value) => {
    try {
      await dispatch(voteComment({ commentId, value })).unwrap();
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setReplyContent("");
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !currentUser) return;

    try {
      await dispatch(
        addComment({
          questionId,
          content: replyContent,
          userId: currentUser.id,
          parentId: replyingTo,
        })
      ).unwrap();
      setReplyingTo(null);
      setReplyContent("");
    } catch (error) {
      console.error("Failed to submit reply:", error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "GROUP") {
      dispatch(fetchGroupMembers("1"));
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Question Discussion</h1>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <h2 className="text-2xl font-semibold mb-4">{question?.content}</h2>

          <div className="bg-white rounded-lg shadow">
            <div className="flex border-b">
              {["GROUP", "DISCUSS", "GRADE", "TEACHER MESSAGE"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-4 py-2 ${
                    activeTab === tab ? "border-b-2 border-blue-500" : ""
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "GROUP" && (
              <div className="p-4">
                <h3 className="font-semibold mb-2">Group Members</h3>
                {currentGroup &&
                  currentGroup.members.map((member) => (
                    <div key={member.id} className="flex items-center my-2">
                      <img
                        src={member.avatar}
                        alt={member.fullName}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span>{member.fullName}</span>
                      <span className="ml-auto">
                        {member.online ? "Online" : "Offline"}
                      </span>
                    </div>
                  ))}
              </div>
            )}

            {activeTab === "DISCUSS" && (
              <div className="p-4">
                {currentUser ? (
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
                ) : (
                  <p>Please log in to comment.</p>
                )}

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-50 p-4 rounded mb-4"
                    >
                      <span className="mr-4">
                        {users.find((u) => u.id === comment.userId)?.fullName ||
                          "Unknown"}
                      </span>
                      <p>{comment.content}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <span className="mr-4">Votes: {comment.votes}</span>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleVote(comment.id, star)}
                              className="text-yellow-400 hover:text-yellow-500"
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        {currentUser && (
                          <button
                            onClick={() => handleReply(comment.id)}
                            className="ml-4 text-blue-500 hover:underline"
                          >
                            Reply
                          </button>
                        )}
                      </div>
                      {replyingTo === comment.id && currentUser && (
                        <form onSubmit={handleSubmitReply} className="mt-4">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Write your reply..."
                            rows="3"
                          />
                          <div className="mt-2">
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                            >
                              Submit Reply
                            </button>
                            <button
                              type="button"
                              onClick={() => setReplyingTo(null)}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                      {comment.replies &&
                        comment.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="ml-8 mt-2 p-2 bg-gray-100 rounded"
                          >
                            <span className="mr-4">
                              {reply.user ? reply.user.fullName : "Unknown"}
                            </span>
                            <p>{reply.content}</p>
                          </div>
                        ))}
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
          <div className="mr-2">Question</div>
          {currentSlot?.questions.map((relatedQuestion) => (
            <div key={relatedQuestion.id} className="flex items-center">
              <Link
                to={`/questions/${relatedQuestion.id}`}
                className="text-sm hover:underline"
              >
                <div className="flex">
                  <img
                    className="mr-2"
                    src="data:image/svg+xml,%3csvg%20width='28'%20height='28'%20viewBox='0%200%2028%2028'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%208C0%203.58172%203.58172%200%208%200H20C24.4183%200%2028%203.58172%2028%208V20C28%2024.4183%2024.4183%2028%2020%2028H8C3.58172%2028%200%2024.4183%200%2020V8Z'%20fill='%23FD9246'%3e%3c/path%3e%3cg%20clip-path='url(%23clip0_5268_6432)'%3e%3cpath%20d='M23.2361%2019.9705C23.7368%2019.2061%2024%2018.3632%2024%2017.5158C24%2014.6848%2021.2575%2012.3746%2017.8333%2012.2539C17.0355%2014.6348%2014.659%2016.6282%2011.1702%2016.8785C11.1393%2017.0891%2011.1094%2017.3%2011.1094%2017.5159C11.1094%2020.4238%2014.0007%2022.7893%2017.5547%2022.7893C18.7729%2022.7893%2019.9557%2022.5049%2020.9925%2021.9642L23.2178%2022.7555C23.4266%2022.8301%2023.6668%2022.78%2023.8289%2022.6171C23.9886%2022.4568%2024.0418%2022.2188%2023.9657%2022.0054L23.2361%2019.9705ZM15.7968%2018.1018C15.7968%2018.4256%2015.5348%2018.6877%2015.2109%2018.6877C14.887%2018.6877%2014.625%2018.4256%2014.625%2018.1018V16.9299C14.625%2016.606%2014.887%2016.3439%2015.2109%2016.3439C15.5348%2016.3439%2015.7968%2016.606%2015.7968%2016.9299V18.1018ZM18.1406%2018.1018C18.1406%2018.4256%2017.8785%2018.6877%2017.5546%2018.6877C17.2308%2018.6877%2016.9687%2018.4256%2016.9687%2018.1018V16.9299C16.9687%2016.606%2017.2308%2016.3439%2017.5546%2016.3439C17.8785%2016.3439%2018.1406%2016.606%2018.1406%2016.9299V18.1018ZM20.4843%2018.1018C20.4843%2018.4256%2020.2223%2018.6877%2019.8984%2018.6877C19.5745%2018.6877%2019.3125%2018.4256%2019.3125%2018.1018V16.9299C19.3125%2016.606%2019.5745%2016.3439%2019.8984%2016.3439C20.2223%2016.3439%2020.4843%2016.606%2020.4843%2016.9299V18.1018Z'%20fill='white'%3e%3c/path%3e%3cpath%20d='M10.4453%205.21122C9.22594%205.21122%208.04379%205.4956%207.0075%206.03634L4.78219%205.24497C4.56934%205.16888%204.33074%205.22267%204.17109%205.38345C4.01145%205.54368%203.95824%205.78169%204.03434%205.99513L4.76391%208.02989C4.2632%208.79435%204%209.6372%204%2010.4847C4%2013.3926%206.89137%2015.7581%2010.4453%2015.7581C13.9125%2015.7581%2016.8906%2013.4692%2016.8906%2010.4847C16.8906%207.57669%2013.9993%205.21122%2010.4453%205.21122ZM10.4453%2013.4143C10.1217%2013.4143%209.85938%2013.152%209.85938%2012.8284C9.85938%2012.5047%2010.1217%2012.2425%2010.4453%2012.2425C10.7689%2012.2425%2011.0312%2012.5047%2011.0312%2012.8284C11.0312%2013.152%2010.7689%2013.4143%2010.4453%2013.4143ZM11.0387%2010.9681C11.0387%2011.2914%2010.7726%2011.605%2010.4493%2011.605C10.1254%2011.605%209.85934%2011.3944%209.85934%2011.0706C9.85934%2010.4795%2010.1746%2010.0326%2010.6432%209.86493C10.875%209.78138%2011.0312%209.55993%2011.0312%209.31275C11.0312%208.98946%2010.7686%208.72681%2010.4453%208.72681C10.122%208.72681%209.85934%208.98946%209.85934%209.31275C9.85934%209.63661%209.59727%209.89868%209.2734%209.89868C8.94953%209.89868%208.68746%209.63661%208.68746%209.31275C8.68746%208.34345%209.47598%207.55493%2010.4453%207.55493C11.4146%207.55493%2012.2031%208.34345%2012.2031%209.31275C12.2031%2010.0526%2011.7351%2010.7181%2011.0387%2010.9681Z'%20fill='white'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_5268_6432'%3e%3crect%20width='20'%20height='20'%20fill='white'%20transform='translate(4%204)'%3e%3c/rect%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
                  ></img>
                  {relatedQuestion.content}
                </div>
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
