import "./App.css";
import Navbar from "./Layouts/NavbarAndFooter/Navbar";
import Footer from "./Layouts/NavbarAndFooter/Footer";
import HomePage from "./Layouts/Home/HomePage";
import SearchBooksPage from "./Layouts/SearchBook/SearchBooksPage";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import BookCheckoutPage from "./Layouts/BookCheckout/BookCheckoutPage";
import { oktaConfig } from "./Lib/oktaConfig";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { Security, LoginCallback, SecureRoute } from "@okta/okta-react";
import LoginWidget from "./Auth/LoginWidget";
import ReviewListPage from "./Layouts/BookCheckout/ReviewListPage/ReviewListPage";
import ShelfPage from "./Layouts/ShelfPage/ShelfPage";
import MessagesPage from "./Layouts/Messages/MessagesPage";
import ManageLibraryPage from "./Layouts/ManageLibraryPage/ManageLibraryPage";
const oktaAuth = new OktaAuth(oktaConfig);

const App = () => {
  const customAuthHandler = () => {
    history.push("/login");
  };

  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || "/", window.location.origin));
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Security
        oktaAuth={oktaAuth}
        restoreOriginalUri={restoreOriginalUri}
        onAuthRequired={customAuthHandler}
      >
        <Navbar />
        <div className="flex-grow-1">
          <Switch>
            <Route path="/" exact>
              <Redirect to="/home" />
              <HomePage />
            </Route>
            <Route path="/home">
              <HomePage />
            </Route>
            <Route path="/search">
              <SearchBooksPage />
            </Route>
            <Route path="/reviewlist/:bookId">
              <ReviewListPage />
            </Route>
            <Route path="/checkout/:bookId">
              <BookCheckoutPage />
            </Route>
         
              <Route
              path="/login"
              render={() => <LoginWidget config={oktaConfig} />}
            />
            <Route path="/login/callback" component={LoginCallback} />
            <SecureRoute path="/shelf">
              <ShelfPage />
            </SecureRoute>
            <SecureRoute path="/libraryservice"><MessagesPage/></SecureRoute>
            <SecureRoute path="/admin"><ManageLibraryPage/></SecureRoute>
            
          </Switch>
        </div>
        <Footer />
      </Security>
    </div>
  );
};

export default App;
