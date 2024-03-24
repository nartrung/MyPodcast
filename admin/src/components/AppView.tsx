import { Button } from "@mui/material";
import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/MyPodcastBanner.png";
interface Props {
  children: ReactNode;
}

const AppView: FC<Props> = ({ children }) => {
  const onSubmit = async () => {
    await localStorage.removeItem("token");
    window.location.reload();
  };
  return (
    <div>
      <nav className="fixed top-0 left-0 w-full bg-white z-50 border-b border-b-[#8a8a8a] shadow-md shadow-gray-300">
        <ul className="flex items-center space-x-4 justify-between mx-10">
          <Link to="/">
            <img className="h-16" src={logo} alt="Brand Logo" />
          </Link>
          <li>
            <Button onClick={onSubmit} variant="contained" color="error">
              Đăng xuất
            </Button>
          </li>
        </ul>
      </nav>
      <div className="h-16"></div>
      {children}
    </div>
  );
};

export default AppView;
