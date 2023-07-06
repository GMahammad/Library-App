import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import MessageModel from "../../../Models/MessageModel";

const PostNewMessage = () => {
  const { authState } = useOktaAuth();
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayWarning, setDisplayWarning] = useState(false);
  const [question, setQuestion] = useState("");
  const [title, setTitle] = useState("");

  const submitMessage = async () => {
    if (
      authState &&
      authState.isAuthenticated &&
      title !== "" &&
      question !== ""
    ) {
        const url = `${process.env.REACT_APP_API}/messages/secure/add/message`;
        const messageRequestModel:MessageModel = new MessageModel(title,question);
        const requestBody = {
            method:'POST',
            headers:{
                Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                'Content-Type':"application/json"
            },
            body: JSON.stringify(messageRequestModel)
        }
        const submitMessageData = await fetch(url,requestBody);
        if(!submitMessageData.ok){
            throw new Error("Something went wrong!");
        }
        setTitle('');
        setQuestion('');
        setDisplaySuccess(true);
        setDisplayWarning(false);
        
    }
  };

  return (
    <div className="card mt-3">
      {displaySuccess && (
        <div className="alert alert-success" role="alert">
          Question added successfully
        </div>
      )}
      <div className="card-header">Ask question to BookLover Admin</div>
      <div className="card-body">
        <form method="POST"  >
          {displayWarning && (
            <div className="alert alert-danger" role="alert">
              All fields must be filled out
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Question</label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows={3}
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
            ></textarea>
          </div>
          <div>
            <button type="button" onClick={submitMessage} className="button-rare mt-3">
              Submit Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostNewMessage;
