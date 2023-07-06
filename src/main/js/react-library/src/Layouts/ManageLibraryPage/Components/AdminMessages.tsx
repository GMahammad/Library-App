import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import MessageModel from "../../../Models/MessageModel";
import SpinnerLoading from "../../Utils/SpinnerLoading";
import { error } from "console";
import Pagination from "../../Utils/Pagination";
import AdminMessage from "./AdminMessage";
import AdminMessageRequestModel from "../../../Models/AdminMessageRequestModel";

const AdminMessages = () => {
  const { authState } = useOktaAuth();

  //Loading & HttpError States Start
  const [isLoadingAdminMessages, setIsLoadingAdminMessages] = useState(false);
  const [httpError, setHttpError] = useState(null);
  //Loading & HttpError States End

  // Messages States Start
  const [messages, setAdminMessages] = useState<MessageModel[]>([]);
  const [messagesPerPage] = useState(5);
  // Messages States End

  //  Pagination States Start
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  //  Pagination States End

  const [btnSubmit, setBtnSubmit] = useState(false);

  useEffect(() => {
    if (authState && authState.isAuthenticated) {
      const fetchAdminMessages = async () => {
        const url = `${process.env.REACT_APP_API}/messages/search/findByClosed/?closed=false&page=${
          currentPage - 1
        }&size=${messagesPerPage}`;
        const requestBody = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const adminMessagesData = await fetch(url, requestBody);
        if (!adminMessagesData.ok) {
          throw new Error("Something went wrong!");
        }

        const adminMessagesJson = await adminMessagesData.json();

        setAdminMessages(adminMessagesJson._embedded.messages);
        setTotalPages(adminMessagesJson.page.totalPages);
      };
      fetchAdminMessages().catch((error) => {
        setIsLoadingAdminMessages(false);
        setHttpError(error);
      });
    }
  }, [authState, currentPage, btnSubmit]);

  const replyMessage = async (id: number, response: string) => {
    const url = `${process.env.REACT_APP_API}/messages/secure/admin/update/message`;
    if (
      authState &&
      authState.isAuthenticated &&
      id !== null &&
      response !== ""
    ) {
      const messageAdminRequestModel: AdminMessageRequestModel =
        new AdminMessageRequestModel(id, response);
      const requestBody = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authState.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageAdminRequestModel),
      };
      const messageAdminResponse = await fetch(url, requestBody);

      if (!messageAdminResponse.ok) {
        throw new Error("Something went wrong!");
      }
      setBtnSubmit(!btnSubmit);
    }
  };

  if (httpError) {
    <div className="container mt-5">
      <p>{httpError}</p>
    </div>;
  }

  if (isLoadingAdminMessages) {
    <SpinnerLoading />;
  }

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mt-3">
      {messages.length > 0 ? (
        <>
          <h5>Pending Q/A: </h5>
          {messages.map((message) => (
            <AdminMessage
              submitResponseToQuestion={replyMessage}
              message={message}
            />
          ))}
        </>
      ) : (
        <h5>No pending Q/A</h5>
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

export default AdminMessages;
