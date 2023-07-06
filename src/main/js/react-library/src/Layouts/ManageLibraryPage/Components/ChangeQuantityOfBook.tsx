import React, { useEffect, useState } from "react";
import BookModel from "../../../Models/BookModel";
import { useOktaAuth } from "@okta/okta-react";

const ChangeQuantityOfBook: React.FC<{ book: BookModel,deleteBook:any }> = (props) => {
  const { authState } = useOktaAuth();

  const [quantity, setQuantity] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);
  const [changeError, setChangeError] = useState("");
  useEffect(() => {
    const fetchBookInState = () => {
      props.book.copies ? setQuantity(props.book.copies) : setQuantity(0);
      props.book.copiesAvailable
        ? setRemaining(props.book.copiesAvailable)
        : setRemaining(0);
    };
    fetchBookInState();
  }, []);

    const decreaseBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/admin/secure/quantity/decrease?bookId=${props.book.id}`;
        const requestBody = {
          method:'PUT',
          headers:{
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type' : 'application/json'
          }
        }
        const decreaseData = await fetch(url,requestBody)
        if(!decreaseData.ok){
          throw new Error("Something went wrong!")
        } 
        setQuantity(quantity-1);
        setRemaining(remaining-1);

      }
    };
    const increaseBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/admin/secure/quantity/increase?bookId=${props.book.id}`;
        const requestBody = {
          method:'PUT',
          headers:{
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type' : 'application/json'
          }
        }
        const decreaseData = await fetch(url,requestBody)
        if(!decreaseData.ok){
          throw new Error("Something went wrong!")
        } 
        setQuantity(quantity+1);
        setRemaining(remaining+1);

      }
    };
   

  return (
    <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
      <div className="row g-0">
        <div className="col-md-2">
          <div className="d-none d-lg-block">
            {props.book.img ? (
              <img src={props.book.img} width="123" height="196" alt="Book" />
            ) : (
              <img
                src={require("../../../Images/BooksImages/book-luv2code-1000.png")}
                width="123"
                height="196"
                alt="Book"
              />
            )}
          </div>
          <div className="d-lg-none d-flex justify-content-center align-items-center">
            {props.book.img ? (
              <img src={props.book.img} width="123" height="196" alt="Book" />
            ) : (
              <img
                src={require("../../../Images/BooksImages/book-luv2code-1000.png")}
                width="123"
                height="196"
                alt="Book"
              />
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-body">
            <h5 className="card-title">{props.book.author}</h5>
            <h4>{props.book.title}</h4>
            <p className="card-text"> {props.book.description} </p>
          </div>
        </div>
        <div className="mt-3 col-md-4">
          <div className="d-flex justify-content-center align-items-center">
            <p>
              Total Quantity: <b>{quantity}</b>
            </p>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <p>
              Books Remaining: <b>{remaining}</b>
            </p>
          </div>
        </div>
        <div className="mt-3 col-md-1"></div>
        <div className="d-flex mb-2 justify-content-center justify-content-around">
          <button onClick={increaseBook} className="m1 mx-5 btn w-50 btn-md btn-success">
            Add Quantity
          </button>
          <button onClick={decreaseBook} className="m1 w-50 mx-5 btn btn-md btn-secondary">
            Decrease Quantity
          </button>
        </div>
        <button onClick={() => props.deleteBook(props.book.id)} className="w-50 m-auto btn btn-md btn-danger d-block">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ChangeQuantityOfBook;
