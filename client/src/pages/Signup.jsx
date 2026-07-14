import GuestHeader from "../components/GuestHeader";
import GuestFooter from "../components/GuestFooter";
import { AnimatedCallToAction } from "../components/Buttons";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../utils/apiUrl";

export default function Signup() {
  const [errors, setErrors] = useState({});
  const { setUser, user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const messages = Object.values(errors);

  async function signup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const response = await apiFetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: formData.get("userName"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      }),
    });
    const data = await response.json();
    if (data.info) {
      setErrors({ info: data.info.msg });
    }
    if (
      data.emailMsg ||
      data.passLengthMsg ||
      data.passConfirmMsg ||
      data.UNMsg ||
      data.error
    ) {
      setErrors(data);
    }
    if (data.user) {
      setUser(data.user);
      navigate("/my-squad");
    }
  }
  useEffect(() => {
    if (!isLoading && user) {
      navigate("/my-squad");
    }
  }, [user, isLoading]);

  return (
    <>
      <GuestHeader />
      <div className="px-6 text-(--c-violet-void)">
        <main className="border border-inherit rounded-lg max-w-[550px] mx-auto mt-10 mb-20 lg:mt-20 text-sm p-10 flex flex-col gap-6">
          <h3 className="text-2xl">Sign Up</h3>
          {messages.length > 0 &&
            messages.map((el, index) => (
              <div className="alert alert-danger" key={index}>
                {" "}
                {el}
              </div>
            ))}

          <form onSubmit={signup}>
            <label htmlFor="userName">User Name</label>
            <input
              type="text"
              id="userName"
              name="userName"
              className="border border-inherit rounded-md px-3 py-2 w-full mb-6"
            />
            <label htmlFor="signupInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              id="signupInputEmail1"
              aria-describedby="emailHelp"
              name="email"
              className="border border-inherit rounded-md px-3 py-2 w-full"
            />
            <div id="emailHelp" className="text-xs mb-6">
              We'll never share your email with anyone else.
            </div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="border border-inherit rounded-md px-3 py-2 w-full mb-6"
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="border border-inherit rounded-md px-3 py-2 w-full mb-6"
            />

            <div className="flex justify-center my-3">
              <AnimatedCallToAction type="button" text="Create Account" />
            </div>
          </form>
        </main>
      </div>
      <GuestFooter />
    </>
  );
}
