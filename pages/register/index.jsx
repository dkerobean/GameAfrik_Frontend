import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Meta from "../../components/Meta";
import { useRouter } from "next/router";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/user/register/`,
        {
          email,
          name,
          password,
          confirm_password: confirmPassword
        }
      );
      // Handle successful registration
    console.log(response.data);
    toast.success("Registration successful");
    // Redirect to login page after a delay
    setTimeout(() => {
      router.push("/login");
    }, 1000); // 3 seconds delay
    } catch (error) {
      // Handle registration error
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <Meta title="Register || Xhibiter | NFT Marketplace Next.js Template" />
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
                Register
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
                    style={{ textTransform: 'lowercase' }}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="font-display text-jacarta-700 mb-1 block text-sm dark:text-white">
                    Username<span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    id="profile-username"
                    value={name}
                    onChange={handleUsernameChange}
                    className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white px-3"
                    placeholder="Enter username"
                    style={{ textTransform: 'lowercase' }}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="font-display text-jacarta-700 mb-1 block text-sm dark:text-white">
                    Password<span className="text-red">*</span>
                  </label>
                  <input
                    type="password"
                    id="profile-password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white px-3"
                    placeholder="Enter password"
                    style={{ textTransform: 'lowercase' }}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="font-display text-jacarta-700 mb-1 block text-sm dark:text-white">
                    Confirm Password<span className="text-red">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirm_password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 hover:ring-2 dark:text-white px-3"
                    placeholder="Confirm password"
                    style={{ textTransform: 'lowercase' }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                >
                  Register
                </button>
                <p className="dark:text-jacarta-300 mb-10 text-lg leading-normal mt-5">
                Already have an account ?
                <a href="/login" className="text-accent ml-2">
                  Login
                </a>
              </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default Register;
