import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import http from "../utils/http";

const SlotDetails = () => {
  const { id } = useParams();
  const [showContent, setShowContent] = useState(true);
  const [showTopics, setShowTopics] = useState(false);

  const {
    data: slot,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["slot", id],
    queryFn: async () => {
      const response = await http.get(`/slots/${id}`);
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}
      >
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="">
            <div className="mb-4">
              <button
                className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setShowContent(true)}
              >
                CONTENT
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setShowContent(false)}
              >
                STUDENT
              </button>
            </div>

            {showContent ? (
              <div>
                <button
                  className="mb-4 px-4 py-2 bg-gray-200 rounded"
                  onClick={() => setShowTopics(!showTopics)}
                >
                  {showTopics ? "HIDDEN INFO SESSIONS" : "SHOW INFO SESSIONS"}
                </button>

                {showTopics && (
                  <ul className="mb-4 pl-4">
                    {slot.topics.map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>
                )}

                <h2 className="text-xl font-bold mb-2">Questions:</h2>
                {slot.questions.map((question) => (
                  <Link
                    key={question.id}
                    to={`/questions/${question.id}`}
                    className="block mb-2 p-2 border rounded hover:bg-gray-100"
                  >
                    <div className="flex">
                      {" "}
                      <img src="data:image/svg+xml,%3csvg%20width='28'%20height='28'%20viewBox='0%200%2028%2028'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0%208C0%203.58172%203.58172%200%208%200H20C24.4183%200%2028%203.58172%2028%208V20C28%2024.4183%2024.4183%2028%2020%2028H8C3.58172%2028%200%2024.4183%200%2020V8Z'%20fill='%23FD9246'%3e%3c/path%3e%3cg%20clip-path='url(%23clip0_5268_6432)'%3e%3cpath%20d='M23.2361%2019.9705C23.7368%2019.2061%2024%2018.3632%2024%2017.5158C24%2014.6848%2021.2575%2012.3746%2017.8333%2012.2539C17.0355%2014.6348%2014.659%2016.6282%2011.1702%2016.8785C11.1393%2017.0891%2011.1094%2017.3%2011.1094%2017.5159C11.1094%2020.4238%2014.0007%2022.7893%2017.5547%2022.7893C18.7729%2022.7893%2019.9557%2022.5049%2020.9925%2021.9642L23.2178%2022.7555C23.4266%2022.8301%2023.6668%2022.78%2023.8289%2022.6171C23.9886%2022.4568%2024.0418%2022.2188%2023.9657%2022.0054L23.2361%2019.9705ZM15.7968%2018.1018C15.7968%2018.4256%2015.5348%2018.6877%2015.2109%2018.6877C14.887%2018.6877%2014.625%2018.4256%2014.625%2018.1018V16.9299C14.625%2016.606%2014.887%2016.3439%2015.2109%2016.3439C15.5348%2016.3439%2015.7968%2016.606%2015.7968%2016.9299V18.1018ZM18.1406%2018.1018C18.1406%2018.4256%2017.8785%2018.6877%2017.5546%2018.6877C17.2308%2018.6877%2016.9687%2018.4256%2016.9687%2018.1018V16.9299C16.9687%2016.606%2017.2308%2016.3439%2017.5546%2016.3439C17.8785%2016.3439%2018.1406%2016.606%2018.1406%2016.9299V18.1018ZM20.4843%2018.1018C20.4843%2018.4256%2020.2223%2018.6877%2019.8984%2018.6877C19.5745%2018.6877%2019.3125%2018.4256%2019.3125%2018.1018V16.9299C19.3125%2016.606%2019.5745%2016.3439%2019.8984%2016.3439C20.2223%2016.3439%2020.4843%2016.606%2020.4843%2016.9299V18.1018Z'%20fill='white'%3e%3c/path%3e%3cpath%20d='M10.4453%205.21122C9.22594%205.21122%208.04379%205.4956%207.0075%206.03634L4.78219%205.24497C4.56934%205.16888%204.33074%205.22267%204.17109%205.38345C4.01145%205.54368%203.95824%205.78169%204.03434%205.99513L4.76391%208.02989C4.2632%208.79435%204%209.6372%204%2010.4847C4%2013.3926%206.89137%2015.7581%2010.4453%2015.7581C13.9125%2015.7581%2016.8906%2013.4692%2016.8906%2010.4847C16.8906%207.57669%2013.9993%205.21122%2010.4453%205.21122ZM10.4453%2013.4143C10.1217%2013.4143%209.85938%2013.152%209.85938%2012.8284C9.85938%2012.5047%2010.1217%2012.2425%2010.4453%2012.2425C10.7689%2012.2425%2011.0312%2012.5047%2011.0312%2012.8284C11.0312%2013.152%2010.7689%2013.4143%2010.4453%2013.4143ZM11.0387%2010.9681C11.0387%2011.2914%2010.7726%2011.605%2010.4493%2011.605C10.1254%2011.605%209.85934%2011.3944%209.85934%2011.0706C9.85934%2010.4795%2010.1746%2010.0326%2010.6432%209.86493C10.875%209.78138%2011.0312%209.55993%2011.0312%209.31275C11.0312%208.98946%2010.7686%208.72681%2010.4453%208.72681C10.122%208.72681%209.85934%208.98946%209.85934%209.31275C9.85934%209.63661%209.59727%209.89868%209.2734%209.89868C8.94953%209.89868%208.68746%209.63661%208.68746%209.31275C8.68746%208.34345%209.47598%207.55493%2010.4453%207.55493C11.4146%207.55493%2012.2031%208.34345%2012.2031%209.31275C12.2031%2010.0526%2011.7351%2010.7181%2011.0387%2010.9681Z'%20fill='white'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_5268_6432'%3e%3crect%20width='20'%20height='20'%20fill='white'%20transform='translate(4%204)'%3e%3c/rect%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e" />{" "}
                      <div className="ml-1">{question.content}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div>
                <p>Number of waiting students: 0</p>
                <p>
                  The number of students who joined the group:{" "}
                  {slot.onlineUsers}
                </p>
                {/* đang bị lỗi do chưa set được chuẩn phần group trong db.json */}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SlotDetails;
