import React, { useEffect, useState } from "react";
import BookModel from "../../Models/BookModel";
import SpinnerLoading from "../Utils/SpinnerLoading";
import SearchBook from "./SearchBook";
import Pagination from "../Utils/Pagination";
import { url } from "inspector";

const SearchBooksPage = () => {
  // Fetch States Start
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  // Fetch States End

  // Pagination States Start
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // Pagination States End

  // SearchBar States Start
  const [searchUrl, setSearchUrl] = useState("");
  const [search, setSearch] = useState("");
  // SearchBar States End

  //Category States Start
  const [categorySelection, setCategorySelection] = useState("Book category");
  //Category States End

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl = `${process.env.REACT_APP_API}/books`;
      let url = "";

      if (searchUrl === "") {
        url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
      } else {
        let searchWithPage = searchUrl.replace('<pageNumber>',`${currentPage-1}`)
        url = baseUrl + searchWithPage;
      }
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
    };
    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [currentPage, searchUrl,categorySelection]);

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
  let lastItem =
    booksPerPage * currentPage <= totalAmountOfBooks
      ? booksPerPage * currentPage
      : totalAmountOfBooks;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const searchUrlHandler = () => {
    setCurrentPage(1);
    if (search === "") {
      setSearchUrl("");
    } else {
      setSearchUrl(
        `/search/findByTitleContainingIgnoreCase?title=${search}&page=<pageNumber>&size=${booksPerPage}`
      );
    }
    setCategorySelection('Book category')
  };

  const categoryFields = (value: string) => {
    setCurrentPage(1);
    if (
      value.toLowerCase() == "fe" ||
      value.toLowerCase() == "be" ||
      value.toLowerCase() == "data" ||
      value.toLowerCase() == "devops"
    ) {
      setCategorySelection(value);
      setSearchUrl(
        `/search/findByCategoryIgnoreCase?category=${value}&page=<pageNumber>&size=${booksPerPage}`
      );
    }else{
      setCategorySelection('All')
      setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`);
    }
  };
  return (
    <div>
      <div className="container">
        <div>
          <div className="row mt-5">
            <div className="col-6">
              <div className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-labelledby="Search"
                  onChange={(e) => setSearch(e.target.value)}
                  form="submit"
                />
                <button
                  className="button-rare"
                  onClick={() => searchUrlHandler()}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="col-4">
             
            </div>
          </div>

          {totalAmountOfBooks > 0 ? (
            <>
              <div className=" mt-3 d-flex justify-content-between">
                <h5>Number of results: ({totalAmountOfBooks})</h5>
                <div className="dropdown">
                <button
                  className="button-rare dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  
                >
                  {categorySelection}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li onClick={() => categoryFields('All')}>
                    <a className="dropdown-item" href="#">
                      All
                    </a>
                  </li>
                  <li onClick={() => categoryFields('FE')}>
                    <a className="dropdown-item" href="#">
                      Front End
                    </a>
                  </li>
                  <li onClick={() => categoryFields('BE')}>
                    <a className="dropdown-item" href="#">
                      Back End
                    </a>
                  </li>
                  <li onClick={() => categoryFields('Data')}>
                    <a className="dropdown-item" href="#">
                      Data
                    </a>
                  </li>
                  <li onClick={() => categoryFields('Devops')}>
                    <a className="dropdown-item" href="#">
                      DevOps
                    </a>
                  </li>
                </ul>
              </div>
              </div>
              <p>
                {indexOfFirstBook + 1} to{" "}
                {indexOfLastBook > totalAmountOfBooks
                  ? totalAmountOfBooks
                  : indexOfLastBook}{" "}
                of {totalAmountOfBooks} items:
              </p>
              {books.map((book) => (
                <SearchBook book={book} key={book.id} />
              ))}
            </>
          ) : (
            <div className="m-5">
              <h3 className="pb-4">Can't find what you are looking for?</h3>
              <a
                href="#"
                type="button"
                className="btn main-color btn-md px-4 me-md-2 fw-bold"
                style={{ color: "orange" }}
              >
                Library Services
              </a>
            </div>
          )}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBooksPage;
