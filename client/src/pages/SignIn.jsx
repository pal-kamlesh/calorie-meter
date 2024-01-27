import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Label, Spinner, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all fields"));
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        if (data.isAdmin) {
          navigate("/dashboard?tab=profile");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className=" min-h-screen mt-20">
      <div className=" flex p-3 max-w-3xl mx-auto flex-row items-center gap-5">
        {/* left */}
        <div className=" flex-1">
          <Link to="/" className=" font-bold dark:text-white text-4xl">
            <img
              src="https://cdn.iconscout.com/icon/premium/png-256-thumb/calories-4057081-3410087.png"
              alt="logo"
            />
          </Link>
        </div>
        {/* right */}
        <div className=" flex-1">
          <form className=" flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@gmail.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="********"
                id="password"
                onChange={handleChange}
              />
            </div>
            <button
              className=" h-9 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className=" pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          <div className=" flex gap-2 text-sm mt-5">
            <span>Don&rsquo;t have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
