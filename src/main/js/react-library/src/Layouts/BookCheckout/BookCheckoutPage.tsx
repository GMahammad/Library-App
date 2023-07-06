import React, { useEffect, useState } from "react";
import BookModel from "../../Models/BookModel";
import SpinnerLoading from "../Utils/SpinnerLoading";
import StarsReview from "../Utils/StarsReview";
import CheckoutAndReviewBox from "./CheckoutAndReviewBox";
import ReviewModel from "../../Models/ReviewModel";
import { LatestReviews } from "./LatestReview";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../Models/ReviewRequestModel";

const BookCheckoutPage = () => {
  const { authState } = useOktaAuth();

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setisLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // Review State Start
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setisLoadingReview] = useState(true);
  // Review State End

  // Loans Count State Start
  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] =
    useState(true);
  // Loans Count State End

  // Book Checked Out Start
  const [isCheckedOut, setIsCheckedout] = useState(false);
  const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);
  // Book Checked Out End

  // Review User State Start
  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);
  // Review User State End

  const bookId = window.location.pathname.split("/")[2];
  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl = `${process.env.REACT_APP_API}/books/${bookId}`;
      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const responseJson = await response.json();
      const loaddedBook: BookModel = {
        id: responseJson.id,
        title: responseJson.title,
        author: responseJson.author,
        description: responseJson.description,
        copies: responseJson.copies,
        copiesAvailable: responseJson.copiesAvailable,
        category: responseJson.category,
        img: responseJson.img,
      };

      setBook(loaddedBook);
      setisLoading(false);
    };
    fetchBooks().catch((error: any) => {
      setisLoading(false);
      setHttpError(error.message);
    });
  }, [isCheckedOut]);

  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;

      const responseReview = await fetch(reviewUrl);

      if (!responseReview.ok) {
        throw new Error("Something went wrong!");
      }

      const responseJsonReviews = await responseReview.json();

      const responseData = responseJsonReviews._embedded.reviews;

      const loaddedReviews: ReviewModel[] = [];

      let weightedStarReviews: number = 0;

      for (const key in responseData) {
        loaddedReviews.push({
          id: responseData[key].id,
          userEmail: responseData[key].userEmail,
          date: responseData[key].date,
          rating: responseData[key].rating,
          bookId: responseData[key].bookId,
          reviewDescription: responseData[key].reviewDescription,
        });
        weightedStarReviews = weightedStarReviews + responseData[key].rating;
      }
      if (loaddedReviews) {
        const round = Math.round(
          weightedStarReviews / loaddedReviews.length
        ).toFixed(1);
        setTotalStars(Number(round));
      }
      setisLoadingReview(false);
      setReviews(loaddedReviews);
    };

    fetchBookReviews().catch((error: any) => {
      setisLoadingReview(false);
      setHttpError(error.message);
    });
  }, [isReviewLeft]);

  useEffect(() => {
    const fetchUserReviewBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/reviews/secure/user/book/?bookId=${bookId}`;
        const requestBody = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const userReview = await fetch(url, requestBody);
        if (!userReview.ok) {
          throw new Error("Something went wrong !");
        }
        const userReviewJson = await userReview.json();
        setIsReviewLeft(userReviewJson);
      }
      setIsLoadingUserReview(false);
    };
    fetchUserReviewBook().catch((err: any) => setHttpError(err.message));
  }, [authState]);

  useEffect(() => {
    const fetchUserCountLoansCount = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
        const requestBody = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const currentLoansCountResponse = await fetch(url, requestBody);

        if (!currentLoansCountResponse.ok) {
          throw new Error("Something went wrong!");
        }

        const currentLoansCountJson = await currentLoansCountResponse.json();
        setCurrentLoansCount(currentLoansCountJson);
      }
      setIsLoadingCurrentLoansCount(false);
    };
    fetchUserCountLoansCount().catch((error: any) => {
      setIsLoadingCurrentLoansCount(false);
      setHttpError(error.message);
    });
  }, [authState, isCheckedOut]);

  useEffect(() => {
    const fetchUserCheckedOutBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser?bookId=${bookId}`;
        const requestBody = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        const userCheckedOutBookData = await fetch(url, requestBody);
        if (!userCheckedOutBookData.ok) {
          throw new Error("Something went wrong !");
        }
        const userCheckedOutBookJson = await userCheckedOutBookData.json();
        setIsCheckedout(userCheckedOutBookJson);
      }
      setIsLoadingBookCheckedOut(false);
    };
    fetchUserCheckedOutBook().catch((error: any) => {
      setIsLoadingBookCheckedOut(false);
      setHttpError(error.message);
    });
  }, [authState]);

  if (
    isLoading ||
    isLoadingReview ||
    isLoadingBookCheckedOut ||
    isLoadingUserReview ||
    isLoadingCurrentLoansCount
  ) {
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

  const checkoutBook = async () => {
    const url = `${process.env.REACT_APP_API}/books/secure/checkout/?bookId=${book?.id}`;
    const requestBody = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const checkoutResponse = await fetch(url, requestBody);
    if (!checkoutResponse.ok) {
      throw new Error("Something went wrong!");
    }
    setIsCheckedout(true);
  };

  const submitReview = async (starInput: number, reviewDescription: string) => {
    let bookId: number = 0;
    if (book?.id) {
      bookId = book.id;
    }
    const reviewRequestModel = new ReviewRequestModel(
      starInput,
      bookId,
      reviewDescription
    ); 
    const url = `${process.env.REACT_APP_API}/reviews/secure`;
    const requestBody = {
      method:'POST',
      headers:{
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(reviewRequestModel)
    }

    const returnResponse = await fetch(url,requestBody)

    if(!returnResponse.ok){
      throw new Error("Something went wrong!")
    }
    setIsReviewLeft(true);

  };

  return (
    <div>
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.img ? (
              <img src={book?.img} width="226" height="349" alt="Book" />
            ) : (
              <img
                src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
                width="226"
                height="349"
                alt="Book"
              />
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReview rating={totalStars} size={24} />
            </div>
          </div>
          <CheckoutAndReviewBox
            submitReview={submitReview}
            isReviewLeft={isReviewLeft}
            checkoutBook={checkoutBook}
            isAuthenticated={authState?.isAuthenticated}
            isCheckedOut={isCheckedOut}
            currentLoansCount={currentLoansCount}
            book={book}
            mobile={false}
          />
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
      </div>
      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center align-items-center">
          {book?.img ? (
            <img src={book?.img} width="226" height="349" alt="Book" />
          ) : (
            <img
              src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
              width="226"
              height="349"
              alt="Book"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox
          submitReview={submitReview}
          isReviewLeft={isReviewLeft}
          checkoutBook={checkoutBook}
          isAuthenticated={authState?.isAuthenticated}
          isCheckedOut={isCheckedOut}
          currentLoansCount={currentLoansCount}
          book={book}
          mobile={true}
        />
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
};

export default BookCheckoutPage;
