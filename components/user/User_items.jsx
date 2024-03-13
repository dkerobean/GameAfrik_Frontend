import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Image from "next/image";
import Trending_categories_items from "../categories/trending_categories_items";
import Trending_categories_items_joined from "../categories/trending_categories_items_joined";
import Trending_categories_items_host from "../categories/trending_categories_items_host";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Activity_item from "../collections/Activity_item";

const User_items = () => {
  const [itemActive, setItemActive] = useState(1);
  const [userRole, setUserRole] = useState(null);
  const backendUrl = process.env.NEXT_PUBLIC_APP_BACKEND_URL;
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/user/profile/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
        } else {
          throw new Error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to fetch user profile");
      }
    };

    if (accessToken) {
      fetchUserRole();
    }
  }, [accessToken, backendUrl]);

  const tabItem = [
    {
      id: 1,
      text: "All",
      icon: "on-sale",
    },
    {
      id: 2,
      text: "Joined",
      icon: "owned",
    },
    {
      id: 3,
      text: "Hosted",
      icon: "created",
    },
    {
      id: 4,
      text: "Faviurites",
      icon: "listing",
    },
    {
      id: 5,
      text: "Activity",
      icon: "activity",
    },
  ];

  return (
    <section className="relative py-24">
      <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
        <Image
          src="/images/gradient_light.jpg"
          alt="gradient"
          className="h-full w-full"
          layout="fill"
        />
      </picture>
      <div className="container">
        <Tabs className="tabs">
          <TabList className="nav nav-tabs scrollbar-custom mb-12 flex items-center justify-start overflow-x-auto overflow-y-hidden border-b border-jacarta-100 pb-px dark:border-jacarta-600 md:justify-center">
            {tabItem.map(({ id, text, icon }) => {
              return (
                <Tab
                  className="nav-item"
                  role="presentation"
                  key={id}
                  onClick={() => setItemActive(id)}
                >
                  <button
                    className={
                      itemActive === id
                        ? "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active"
                        : "nav-link hover:text-jacarta-700 text-jacarta-400 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white"
                    }
                  >
                    <svg className="icon mr-1 h-5 w-5 fill-current">
                      <use xlinkHref={`/icons.svg#icon-${icon}`}></use>
                    </svg>
                    <span className="font-display text-base font-medium">
                      {text}
                    </span>
                  </button>
                </Tab>
              );
            })}
          </TabList>

          {tabItem.map(({ id }) => (
            <TabPanel key={id}>
              {/* Conditionally render content based on tab id and userRole */}
              {id === 1 && <Trending_categories_items />}
              {id === 2 && <Trending_categories_items_joined />}
              {id === 3 && (
                <>
                  {userRole === "host" ? (
                    <Trending_categories_items_host />
                  ) : (
                    <h3>You are not a host!</h3>
                  )}
                </>
              )}
              {/* {id === 4 && <Activity_item />} */}
            </TabPanel>
          ))}
        </Tabs>
      </div>
      <ToastContainer />
    </section>
  );
};

export default User_items;
