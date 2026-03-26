import { Button } from "./ui/button";
import { Input } from "./ui/input";
import hamburger from "../assets/hamburger.svg";
import { useNavigate } from "react-router-dom";

interface Props {
  onHamburgerClick: () => void;
  onLargeScreen: boolean;
  onSmallScreen: boolean;
}

export function NavBar({
  onHamburgerClick,
  onLargeScreen,
  onSmallScreen,
}: Props) {
  const navigate = useNavigate();

  return (
    <nav className="h-14 fixed top-0 left-0 right-0 flex justify-between px-2 sm:px-5 items-center bg-white z-40 border-b border-gray-100">
      <div className="flex gap-1 items-center">
        {!onLargeScreen && (
          <button onClick={onHamburgerClick} className="bg-transparent">
            <img className="w-10" src={hamburger} alt="Icone menu" />
          </button>
        )}
        {!onSmallScreen && (
          <Button
            onClick={() => navigate("/")}
            className="text-black text-2xl font-medium bg-transparent"
          >
            <span>
              We<span className="text-blue-700">Blog</span>
            </span>
          </Button>
        )}
        <Input
          className={`${onSmallScreen ? "hidden" : ""}`}
          placeholder="Rechercher..."
        />
      </div>
      <div className="flex gap-5">
        <Button onClick={() => navigate("/new-post")}>Nouvel article</Button>
      </div>
    </nav>
  );
}
