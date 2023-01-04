import type { GetServerSideProps, NextPage } from 'next'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import { Loader } from 'semantic-ui-react';

const inter = Inter({ subsets: ['latin'] })

interface SearchCatImg {
  id: string;
  url: string;
  width: number;
  height: number;
};

interface IndexPageProps {
  initialCatImgUrl: string;
};

const fetchCatImg = async () : Promise<SearchCatImg> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const result = await res.json();
  return result[0];
};

const Home: NextPage<IndexPageProps> = ({ initialCatImgUrl }) => {
  const [catImageUrl, setCatImgUrl] = useState(initialCatImgUrl);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const catImage = await fetchCatImg();
    setCatImgUrl(catImage.url);
    setIsLoading(false);
  };

  return (
    <>
      <div className={styles.default_center}>
        <h1>猫画像アプリ</h1>
        {isLoading ? (
          <Loader active size="huge" inline="centered" />
        ) : (
          <img src={catImageUrl} />
        )};
        <p />

        <button onClick={handleClick} >今日の猫画像</button>
      </div>
    </>
  );
};

// SSR(サーバーサイドレンダリング)
export const getServerSideProps:
  GetServerSideProps<IndexPageProps> = async () => {
    const catImage = await fetchCatImg();
    return {
      props: {
        initialCatImgUrl: catImage.url,
      }
    };
  };

export default Home;
