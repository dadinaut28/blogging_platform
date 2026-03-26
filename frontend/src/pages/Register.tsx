import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useState, type SyntheticEvent } from "react";
import { registerUser } from "../queries";

export function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBadInputMessage, setShowBadInputMessage] = useState(false);
  const [showServerErrorMessage, setShowServerErrorMessage] = useState(false);
  const [showRegisterSuccessMessage, setShowRegisterSuccessMessage] =
    useState(false);

  const handleFormSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const status = await registerUser(email, firstname, lastname, password);

      if (status === 201) {
        setShowRegisterSuccessMessage(true);
        setTimeout(() => {
          setShowRegisterSuccessMessage(false);
          navigate("/login");
        }, 2000);
      } else if (status >= 400 && status < 500) {
        setShowBadInputMessage(true);
        setTimeout(() => setShowBadInputMessage(false), 2500);
      } else if (status === 500) {
        setShowServerErrorMessage(true);
        setTimeout(() => setShowServerErrorMessage(false), 2500);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const buttonDisabled =
    !firstname || !lastname || !email || !password || loading;

  return (
    <div>
      {showBadInputMessage && (
        <div className="fixed right-5 top-20 bg-red-100 border border-red-300 text-red-500 rounded-sm px-2.5 py-1 text-sm font-medium">
          <p>Vérifiez les entrées et réessayez.</p>
        </div>
      )}
      {showServerErrorMessage && (
        <div className="fixed right-5 top-20 bg-red-100 border border-red-300 text-red-500 rounded-sm px-2.5 py-1 text-sm font-medium">
          <p>Erreur interne: réessayez plus tard.</p>
        </div>
      )}
      {showRegisterSuccessMessage && (
        <div className="fixed right-5 top-20 bg-blue-50 border border-blue-300 text-blue-500 rounded-sm px-2.5 py-1 text-sm font-medium">
          <p>Inscription réussie.</p>
        </div>
      )}
      <nav className="flex items-center h-14 border-b border-gray-100 px-5">
        <Button
          onClick={() => navigate("/")}
          className="text-2xl font-medium text-black bg-transparent"
        >
          <span>
            We<span className="text-blue-700">Blog</span>
          </span>
        </Button>
      </nav>
      <h2 className="mt-16 text-center text-3xl font-semibold">
        Créez un compte
      </h2>
      <div className="flex justify-center mt-10">
        <form onSubmit={handleFormSubmit}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-72 md:w-75 mb-5"
            placeholder="Email"
          />{" "}
          <br />
          <Input
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="w-72 md:w-75 mb-5"
            placeholder="Nom"
          />{" "}
          <br />
          <Input
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="w-72 md:w-75 mb-5"
            placeholder="Prénom"
          />{" "}
          <br />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-72 md:w-75 mb-5"
            placeholder="Mot de passe"
          />{" "}
          <br />
          <Button disabled={buttonDisabled} className="w-full">
            M'inscrire
          </Button>
          <p className="text-sm mt-5">
            Vous avez déjà un compte ?{" "}
            <Link className="text-blue-600" to="/login">
              Connectez-vous
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
