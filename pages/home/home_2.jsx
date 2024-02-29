import React from "react";
import Hero_2 from "../../components/hero/hero_2";
import {
  Top_collection,
  Auctions_categories,
  NewseLatter,
  Feature_collections,
  Partners,
  Browse_category,
} from "../../components/component";
import Meta from "../../components/Meta";
import Process from "../../components/blog/process";
import Download from "../../components/blog/download";

const Home_2 = () => {
  return (
    <>
      <Meta title="Home 2" />
      <Hero_2 />
      <Browse_category />
      <Top_collection />
      <Process />
      <Auctions_categories />
      <NewseLatter />
      <Feature_collections />
      <Partners />
      <Download />
    </>
  );
};

export default Home_2;
