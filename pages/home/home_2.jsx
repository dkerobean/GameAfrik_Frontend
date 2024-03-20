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
import Hero_4 from "../../components/hero/hero_4";
import CoverflowCarousel from "../../components/carousel/coverflowCarousel";

const Home_2 = () => {
  return (
    <>
      <Meta title="Home 2" />
      <Hero_4 />
      <CoverflowCarousel />
      {/* <Hero_2 /> */}
      <Process />
      <Auctions_categories />
      <Top_collection />
      <Browse_category />
      {/* <NewseLatter /> */}
      <Feature_collections />
      <Partners />
      <Download />
    </>
  );
};

export default Home_2;
