import React, { useEffect, useState } from "react";
import BookModel from "../../../Models/BookModel";
import { useOktaAuth } from "@okta/okta-react";
import SpinnerLoading from "../../Utils/SpinnerLoading";
import Pagination from "../../Utils/Pagination";
import ChangeQuantityOfBook from "./ChangeQuantityOfBook";

const ChangeQuantity = () => {

const {authState} = useOktaAuth();
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookDeleted, setBookDeleted] = useState(false);

  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      const url = `${process.env.REACT_APP_API}/books?page=${currentPage-1}&size=${booksPerPage}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const responseJson = await response.json();
      const responseData = responseJson._embedded.books;

      setTotalAmountOfBooks(responseJson.page.totalElements);
      setTotalPages(responseJson.page.totalPages);

      const loaddedBooks: BookModel[] = [];

      for (const key in responseData) {
        loaddedBooks.push({
          id: responseData[key].id,
          title: responseData[key].title,
          author: responseData[key].author,
          description: responseData[key].description,
          copies: responseData[key].copies,
          copiesAvailable: responseData[key].copiesAvailable,
          category: responseData[key].category,
          img: responseData[key].img,
        });
      }
      setBooks(loaddedBooks);
      setIsLoading(false);
      setBookDeleted(false)
    };
    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [currentPage,authState,bookDeleted]);

  const deleteBook = async (bookId:number) => {
    if (authState && authState.isAuthenticated) {
      const url = `${process.env.REACT_APP_API}/admin/secure/delete?bookId=${bookId}`;
      const requestBody = {
        method:'DELETE',
        headers:{
          Authorization: `Bearer ${authState.accessToken?.accessToken}`,
          'Content-Type' : 'application/json'
        }
      }
      const decreaseData = await fetch(url,requestBody)
      setBookDeleted(true);
      if(!decreaseData.ok){
        throw new Error("Something went wrong!")
      } 
    }
  };


  if (isLoading) {
    return (
      <div>
        <SpinnerLoading />
      </div>
    );
  }

  if (httpError) {
    return (
      <div>
        <p>{httpError}</p>
      </div>
    );
  }

  const indexOfLastBook: number = currentPage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
  let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ?
  booksPerPage * currentPage : totalAmountOfBooks;
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      {totalAmountOfBooks > 0 ? (
        <>
          <div className="mt-3">
            <h3>Number of results: ({totalAmountOfBooks})</h3>
          </div>
          <p>
            {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
          </p>
          {books.map((book) => (
            <ChangeQuantityOfBook  key={book.id} book={book} deleteBook={deleteBook}/>
          ))}
        </>
      ) : (
        <h5>Add a book before changing quantity</h5>
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

export default ChangeQuantity;
