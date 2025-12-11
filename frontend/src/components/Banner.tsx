import Image from 'next/image';
import styles from './Banner.module.css';

const Banner = () => {
  return (
    <div className={styles.bannerContainer}>
{/*       <Image
        src={"/assets/banner4.svg"}
        alt="Banner"
        objectFit="cover"
        quality={100}
        height={150}
        width={100}
        priority
        style={{
          marginTop: "-150px",
          height: "150%",
          width: "100%",
        }}
      /> */}
{/*       <div className={styles.bannerContent}>
        <h1>Automatic job application</h1>
      </div> */}
    </div>
  );
};

export default Banner;