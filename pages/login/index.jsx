import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Meta from "../../components/Meta";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/user/login/`,
        {
          email,
          password,
        }
      );
      // Handle successful login
      console.log(response.data);
      toast.success("Login successful");
      // Redirect to login page after a delay
    setTimeout(() => {
      router.push("/");
    }, 1000); //
    } catch (error) {
      // Handle login error
      console.error("Login error:", error);
      toast.error("Invalid credentials. Please try again.");
    }
  };

  return (
    <div>
      <Meta title="Login || Xhibiter | NFT Marketplace Next.js Template" />
      <section className="relative h-screen">
        <div className="lg:flex lg:h-full">
          <div className="relative text-center lg:w-1/2">
            <img
              src="/images/login.jpg"
              alt="login"
              className="absolute h-full w-full object-cover"
            />
            <Link href="/">
              <a className="relative inline-block py-36">
                <img
                  src="/images/logo_white.png"
                  className="inline-block max-h-7"
                  alt="Xhibiter | NFT Marketplace"
                />
              </a>
            </Link>
          </div>
          <div className="relative flex items-center justify-center p-[10%] lg:w-1/2">
            <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
              <img
                src="/images/gradient_light.jpg"
                alt="gradient"
                className="h-full w-full"
              />
            </picture>
            <div className="w-full max-w-[25.625rem] text-center">
              <h1 className="text-jacarta-700 font-display mb-6 text-4xl dark:text-white">
                Sign in
              </h1>
              <p className="dark:text-jacarta-300 mb-10 text-lg leading-normal">
                Choose one of available wallet providers or create a new wallet.
                <a href="#" className="text-accent">
                  What is a wallet?
                </a>
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="font-display text-jacarta-700 mb-1 block text-sm dark:text-white">
                    Email address<span className="text-red">*</span>
                  </label>
                  <input
                    type="email"
                    id="profile-email"
                    value={email}
                    onChange={handleEmailChange}
                    className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white px-3"
                    placeholder="Enter email"
                    required
                    style={{ textTransform: 'lowercase' }}
                  />
                </div>
                <div className="mb-6">
                  <label className="font-display text-jacarta-700 mb-1 block text-sm dark:text-white">
                    Password<span className="text-red">*</span>
                  </label>
                  <input
                    type="password"
                    id="profile-username"
                    value={password}
                    onChange={handlePasswordChange}
                    className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white px-3"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default Login;
