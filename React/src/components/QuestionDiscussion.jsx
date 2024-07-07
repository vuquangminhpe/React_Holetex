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
  deleteComment,
  editComment,
} from "../store/questionSlice";
import Sidebar from "./Sidebar";
import GradingModal from "./GradingModal";

function QuestionDiscussion() {
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [hoveredCommentId, setHoveredCommentId] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("DISCUSS");
  const { questionId } = useParams();
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    if (questionId) {
      dispatch(fetchUsers()).then(() => {
        dispatch(fetchQuestion(questionId));
        dispatch(fetchComments(questionId));
        dispatch(fetchSlot(questionId));
      });
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
    dispatch(fetchComments(questionId));
  };
  const handleVote = async (commentId, value) => {
    if (!currentUser) return;
    try {
      await dispatch(
        voteComment({ commentId, value, userId: currentUser.id })
      ).unwrap();
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
  const handleEditComment = (commentId, newContent) => {
    dispatch(editComment({ commentId, content: newContent }));
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Bạn có chắc muốn xóa bình luận này?")) {
      dispatch(deleteComment(commentId));
    }
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "GROUP") {
      dispatch(fetchGroupMembers("1"));
    }
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  console.log(users);
  console.log(comments);
  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex h-full bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`flex-1 h-full flex flex-col  transition-all duration-300 ${
          isSidebarOpen ? "" : "ml-4"
        }`}
      >
        {" "}
        <header className="bg-white shadow-md p-4 flex items-center">
          <h1 className="text-xl font-semibold">Question Discussion</h1>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="w-full h-24 p-4 rounded-lg mb-4 bg-slate-200">
            <div className="border-b-[0.01px] border-b-gray-400">Content</div>
            <h2 className="text-2xl font-semibold mb-4">{question?.content}</h2>
          </div>

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
                        src="data:image/png;base64,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"
                        alt={member.fullName}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span>{member.fullName}</span>
                      <span className="ml-auto">
                        {member.id === currentUser.id ? (
                          <span className="text-green-400">Online</span>
                        ) : (
                          <span className="text-red-600">Offline</span>
                        )}
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
                      onMouseEnter={() => setHoveredCommentId(comment.id)}
                      onMouseLeave={() => setHoveredCommentId(null)}
                    >
                      <span className="mr-4">
                        {comment.user?.fullName ||
                          users.find(
                            (u) => Number(u.id) === Number(comment.userId)
                          )?.fullName ||
                          "Unknown"}
                      </span>
                      {currentUser &&
                        Number(currentUser.id) === Number(comment.userId) && (
                          <div className="flex float-right">
                            {editingCommentId === comment.id ? (
                              <>
                                <button
                                  className="bg-green-500 rounded-2xl mr-2 w-14"
                                  onClick={() => {
                                    handleEditComment(comment.id, editContent);
                                    setEditingCommentId(null);
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  className="bg-gray-500 rounded-2xl mr-2 w-14"
                                  onClick={() => setEditingCommentId(null)}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                className="bg-slate-200 rounded-2xl mr-2 w-14"
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditContent(comment.content);
                                }}
                              >
                                Edit
                              </button>
                            )}
                            <button
                              className="bg-slate-200 rounded-2xl mr-2 w-14"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      <div className="flex items-center mb-2">
                        <img
                          src="data:image/png;base64,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"
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="font-semibold">{}</span>
                        <span className="text-gray-500 text-sm ml-2">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      {editingCommentId === comment.id ? (
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <p>{comment.content}</p>
                      )}
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <span className="mr-2">Votes</span>
                        {hoveredCommentId === comment.id && (
                          <div className="flex items-center">
                            {currentUser &&
                              Number(currentUser.id) !==
                                Number(comment.userId) && (
                                <>
                                  {[1, 2, 3, 4].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() =>
                                        handleVote(comment.id, star)
                                      }
                                      className={`text-yellow-400 hover:text-yellow-500 ${
                                        comment.userVote >= star
                                          ? "text-yellow-500"
                                          : ""
                                      }`}
                                    >
                                      ★
                                    </button>
                                  ))}
                                </>
                              )}
                          </div>
                        )}
                        {currentUser && (
                          <button
                            onClick={() => handleReply(comment.id)}
                            className="ml-4 text-blue-500 hover:underline"
                          >
                            Reply
                          </button>
                        )}
                      </div>
                      <div className="rounded-md bg-white w-16 -translate-y-8 h-10 leading-10 justify-center float-right flex">
                        <div className="text-orange-400">★</div> {comment.votes}{" "}
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
                              {users.find(
                                (u) => Number(u.id) === Number(reply.userId)
                              )?.fullName || "Unknown"}
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
      </div>

      <div className="w-64 bg-white p-4 border-l">
        <h3 className="font-semibold mb-2">Table of contents</h3>
        <div className="space-y-2 mb-5">
          <div className="mr-2 font-semibold">Group meeting</div>

          <button className="w-full text-center rounded h-10 leading-10 bg-blue-500">
            UPDATE
          </button>
        </div>
        <div className="space-y-2 mb-5">
          <div className="mr-2 flex font-semibold">Individual grade</div>

          <button
            className="w-full rounded text-center h-10 leading-10 bg-blue-500 text-white"
            onClick={() => setShowGradingModal(true)}
          >
            GRADES ON GROUPMATES
          </button>
        </div>
        {showGradingModal && (
          <GradingModal
            onClose={() => setShowGradingModal(false)}
            questionId={questionId}
            currentUserId={currentUser.id}
          />
        )}
        <div className="space-y-2 mb-5">
          <div className="font-semibold mr-2">Chart summary</div>
          <div className=" flex">
            <img
              className="font-thin text-xs w-15 h-10 mr-3"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M17 4h3v16h-3zM5 14h3v6H5zm6-5h3v11h-3z'%3E%3C/path%3E%3C/svg%3E"
            />

            <img
              className="font-thin text-xs w-15 h-10 mr-3`"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m8.01-1c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3m0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1M16.5 3C13.47 3 11 5.47 11 8.5s2.47 5.5 5.5 5.5S22 11.53 22 8.5 19.53 3 16.5 3m0 9c-1.93 0-3.5-1.57-3.5-3.5S14.57 5 16.5 5 20 6.57 20 8.5 18.43 12 16.5 12'%3E%3C/path%3E%3C/svg%3E"
            />

            <img
              className="font-thin text-xs w-15 h-10"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='m16 18 2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z'%3E%3C/path%3E%3C/svg%3E"
            />
          </div>
        </div>
        <div className="space-y-2 mb-5">
          <div className="font-semibold mr-2">Call video</div>
          <button className="shadow-lg text-blue-400">JOIN STREAM</button>
        </div>
        <div className="space-y-2 mb-5">
          <div className="font-semibold">Pass criteria</div>
          <div>View question</div>
          <span className="flex justify-between">
            <div>No. of comments posted</div>
            <div>1</div>
          </span>
          <span className="flex justify-between">
            {" "}
            <div>No. of stars rated by others</div>
            <div>1</div>
          </span>
          <span className="flex justify-between">
            {" "}
            <div>No. of votes</div>
            <div>1</div>
          </span>
        </div>
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
        <p className=" absolute bottom-0 right-0 text-green-400 text-sm mr-2">
          Online: 9927
        </p>
      </div>
    </div>
  );
}

export default QuestionDiscussion;
