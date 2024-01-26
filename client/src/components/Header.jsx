import { Avatar, Dropdown, Navbar } from "flowbite-react";
import logo from "../assets/logo.jpg";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname;

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.messsage);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.messsage);
    }
  };

  return (
    <Navbar fluid rounded>
      <Navbar.Brand>
        <img src={logo} className="mr-3 h-[50px] " alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Calorie-meter
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {currentUser && (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentUser?.username}</span>
              <span className="block truncate text-sm font-medium">
                {currentUser?.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Link to="/">
          <Navbar.Link active={path === "/"} as={"div"}>
            Home
          </Navbar.Link>
        </Link>
        <Navbar.Link href="#">About</Navbar.Link>

        <Navbar.Link href="#">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
