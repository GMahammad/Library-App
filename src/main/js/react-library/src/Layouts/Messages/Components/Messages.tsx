import { useOktaAuth } from "@okta/okta-react";
import React, { useEffect, useState } from "react";
import Pagination from "../../Utils/Pagination";
import MessageModel from "../../../Models/MessageModel";

const Messages = () => {
  const { authState } = useOktaAuth();

  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [isLoadingMessage, setIsLoadingMessage] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [messagePerPage, setMessagePerPage] = useState(5);

  useEffect(() => {
    const fetchMessages = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/messages/search/findMessagesByUserEmail/?userEmail=${
          authState.accessToken?.claims.sub
        }&page=${currentPage - 1}&size=${messagePerPage}`;
        const requestBody = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const messagesData = await fetch(url, requestBody);
        if (!messagesData.ok) {
          throw new Error("Something went wrong!");
        }
        const messageJson = await messagesData.json();
        setMessages(messageJson._embedded.messages);
        setIsLoadingMessage(false)
        setTotalPages(messageJson.page.totalPages);

      }
    };
    fetchMessages().catch((error) => {
      setHttpError(error.message);
      setIsLoadingMessage(false);
    });
  }, [authState, currentPage]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mt-2">
      {messages.length > 0 ? (
        <>
          <h5>Current Q/A: </h5>
          {messages.map((message) => (
            <div key={message.id}>
              <div  className="card mt-2 shadow p-3 bg-body rounded">
                <h5>
                  Message #{message.id}: {message.title}
                </h5>
                <h6>From: {message.userEmail}</h6>
                <p><span className="pb-2 fw-bold "style={{color:"orange"}} >Question: </span><br/><br />
                  {message.question}</p>
                <hr />
                <div>
                  <h5>Response: </h5>
                  {message.response && message.adminEmail ? (
                    <>
                      <h6>From: {message.adminEmail} (admin)</h6>
                      <p>{message.response}</p>
                    </>
                  ) : (
                    <p>
                      <i>
                        Pending response from administration. Please be patient.
                      </i>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <h5>All questions you submit will be shown here</h5>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};

export default Messages;
