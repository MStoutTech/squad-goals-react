import GuestHeader from "../components/GuestHeader";
import GuestFooter from "../components/GuestFooter";
import { AnimatedCallToAction } from "../components/Buttons";
import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [errors, setErrors] = useState({});
  const { login, user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const messages = Object.values(errors);

  async function submitLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const response = await login(
      formData.get("email"),
      formData.get("password"),
    );
    if (response.info) {
      setErrors({ info: response.info.msg });
    }
    if (response.emailMsg || response.passwordMsg) {
      setErrors(response);
    }
    if (response.user) {
      navigate("/mission-control");
    }
  }
  useEffect(() => {
    if (!isLoading && user) {
      navigate("/mission-control");
    }
  }, [user, isLoading]);
  return (
    <>
      <GuestHeader />
      <div className="px-6">
        <main className="bg-(--c-violet-void-40) rounded-lg max-w-[550px] mx-auto mt-10 mb-40 lg:mt-20 text-sm text-purple-300 p-10 flex flex-col gap-6">
          {messages.length > 0 &&
            messages.map((el, index) => (
              <div className="alert alert-danger" key={index}>
                {" "}
                {el}
              </div>
            ))}
          <form onSubmit={submitLogin}>
            <label htmlFor="loginInputEmail1">Email address</label>
            <input
              type="email"
              id="loginInputEmail1"
              name="email"
              className="border border-purple-300 rounded-md px-3 py-2 w-full mb-6"
            />
            <label htmlFor="loginInputPassword1">Password</label>
            <input
              type="password"
              id="loginInputPassword1"
              name="password"
              className="border border-purple-300 rounded-md px-3 py-2 w-full mb-6"
            />
            <div className="flex justify-center my-3">
              <AnimatedCallToAction type="button" text="Login" />
            </div>
          </form>
          <div className="flex justify-between">
            <a href="">Forgot Password</a>
            <Link to="/signup">Create Account</Link>
          </div>
        </main>
      </div>
      <GuestFooter />
    </>
  );
}
