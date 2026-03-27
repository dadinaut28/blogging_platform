import { useState, type SyntheticEvent } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { authenticateUser } from "../queries";
import { Link, useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showServerErrorMessage, setShowServerErrorMessage] = useState(false);
  const [showIncorrectIdentifierMessage, setShowIncorrectIdentifierMessage] =
    useState(false);
  const [showLoginSuccessMessage, setShowLoginSuccessMessage] = useState(false);

  const handleFormSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await authenticateUser(email, password);
      if (!result) return;
      const [status, token] = result;
      if (status === 200) {
        console.log("Token from login: ", token);
        localStorage.setItem("dadinaut_blogging_platform_auth_token", token);
        setShowLoginSuccessMessage(true);
        setTimeout(() => {
          setShowLoginSuccessMessage(false);
          navigate("/");
        }, 2000);
      } else if (status === 500) {
        setShowServerErrorMessage(true);
        setTimeout(() => setShowServerErrorMessage(false), 2500);
      } else if (status >= 400 && status < 500) {
        setShowIncorrectIdentifierMessage(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const buttonDisabled = email.length === 0 || password.length === 0 || loading;

  return (
    <div>
      {showServerErrorMessage && (
        <div className="fixed right-5 top-20 bg-red-100 border border-red-300 text-red-500 rounded-sm px-2.5 py-1 text-sm font-medium">
          <p>Erreur interne: réessayez plus tard.</p>
        </div>
      )}
      {showLoginSuccessMessage && (
        <div className="fixed right-5 top-20 bg-blue-50 border border-blue-300 text-blue-500 rounded-sm px-2.5 py-1 text-sm font-medium">
          <p>Connexion réussie</p>
        </div>
      )}
      <nav className="fixed left-0 top-0 right-0 flex items-center h-14 border-b border-gray-100 px-5">
        <Button
          onClick={() => navigate("/")}
          className="text-2xl font-medium text-black bg-transparent"
        >
          <span>
            We<span className="text-blue-700">Blog</span>
          </span>
        </Button>
      </nav>
      <h2 className="title text-3xl font-semibold text-center mt-25">
        Connectez vous
      </h2>
      <div className="flex justify-center">
        <form onSubmit={handleFormSubmit} className="mt-12">
          <Input
            placeholder="Email"
            className="w-72 md:w-75 mb-7"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />{" "}
          <br />
          <Input
            type="password"
            placeholder="Mot de passe"
            className="w-72 md:w-75 mb-7"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />{" "}
          <br />
          <Button className="w-full" disabled={buttonDisabled}>
            Me connecter
          </Button>
          {showIncorrectIdentifierMessage && (
            <p className="text-sm text-red-500 my-4">
              L'adresse email ou le mot de passe est incorrect.
            </p>
          )}
          <p className="text-sm mt-5">
            Vous n'avez pas encore de compte ? <br />{" "}
            <Link className="text-blue-600" to="/register">
              Inscrivez-vous
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
