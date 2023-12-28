'use client'

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DisplayItem from './components/displayItem';
import { faFilter, faGreaterThan, faLessThan, faX } from '@fortawesome/free-solid-svg-icons';
import Image from "next/image";
import Logo from "./img/logo.png";
import slider from "./img/slider.png";
import snack from "./img/snack.png";
import water from "./img/water.png";
import skippy from "./img/skippy.png";
import milo from "./img/milo.png";
export default function Home() {
    const [q, setQ] = useState("");
    const [tag, setTag] = useState("Tất cả");
    const [sort, setSort] = useState("");
    const [data, setData] = useState<ProductData[]>([]);
    const [category, setCategory] = useState<Category[]>([]);
    const [updated, update] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    const productListRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (productListRef.current) {
          productListRef.current.scrollBy({
            left: -300,
            behavior: "smooth",
        }); // Điều chỉnh giá trị này để thay đổi khoảng cách cuộn
        }
      };
    
      const scrollRight = () => {
        if (productListRef.current) {
            productListRef.current.scrollBy({
              left: 300,
              behavior: "smooth",
          }); // Điều chỉnh giá trị này để thay đổi khoảng cách cuộn
          }
      };

    useEffect(() => {
        async function getData() {
            let res = await fetch(`/api/product?q=${q}&tag=${tag}&sort=${sort}`, {cache: "no-store"});
            if (res.ok) {
                let products = await res.json();
                setData(products);
            }
            else console.log("Failed to fetch product data");
        };
        getData();
    }, [q, tag, updated]);

    useEffect(() => {
        async function getData() {
            let res = await fetch(`/api/product?getCategory=1`, {cache: "no-store"});
            if (res.ok) {
                let category = await res.json();
                setCategory(category);
            }
            else console.log("Failed to fetch category data");
        };
        getData();
    }, [updated]);

 return (
    <div className={styles.home}>
      <div
        className={showFilter ? styles.filterBackground : styles.hidden}
        onMouseDown={() => setShowFilter(false)}
      >
        <div
          className={styles.filterPanel}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className={styles.filterHeader}>
            <h2>Bộ lọc tìm kiếm</h2>
            <button onMouseDown={() => setShowFilter(false)}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
          <div className={styles.filterSection}>
            <h3>Phân loại sản phẩm</h3>
            <div>
              <button
                className={
                  tag == "Tất cả" ? styles.activeBox : styles.filterBox
                }
                onClick={() => setTag("Tất cả")}
              >
                {"Tất cả"}
              </button>
              {category.map((value, index) => (
                <button
                  key={index}
                  className={
                    tag == value.name ? styles.activeBox : styles.filterBox
                  }
                  onClick={() => setTag(value.name)}
                >
                  {value.name}
                </button>
              ))}
            </div>
          </div>
          {/* <div className={styles.filterSection}>
                    <h3>Sắp xếp sản phẩm</h3>
                    <div>
                    {sorts.map((value, index) => 
                        <button key={index}
                            className={(sort == value) ? styles.activeBox : styles.filterBox}
                            onClick={() => setSort(value)}>{value}</button>)}
                    </div>
                </div> */}
        </div>
      </div>
      <div className={styles.container}>
        <Image src={Logo} alt="" className={styles.imageLogo} />
        {/* <CldImage
          className={styles.imageLogo}
          width="50"
          height="50"
          src=""
          sizes="100vw"
          aspectRatio="16:9"
          crop="fill"
          alt="Description of my image"
        /> */}
        <div className={styles.nameLogo}>
          <div className={styles.mainName}>Grocery</div>
          <div className={styles.subName}>Dream Team</div>
        </div>

        <input
          className={styles.searchBar}
          placeholder="Tìm kiếm"
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
          }}
        />
        {/* <button onClick={() => setShowFilter(true)}>
          <FontAwesomeIcon icon={faFilter} />
        </button> */}
      </div>
     
      <div className={styles.slider}>
        <div className={styles.filterSection}>
          <h3>Phân loại sản phẩm</h3>
          <div>
            <button
              className={tag == "Tất cả" ? styles.activeBox : styles.filterBox}
              onClick={() => setTag("Tất cả")}
            >
              {"Tất cả"}
            </button>
            {category.map((value, index) => (
              <button
                key={index}
                className={
                  tag == value.name ? styles.activeBox : styles.filterBox
                }
                onClick={() => setTag(value.name)}
              >
                {value.name}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.sliderSection}>
          <div className={styles.textColumn}>
            <h3>Siêu sale ưu đãi</h3>
            <h2>Giảm giá đến 40%</h2>
          </div>
          <div className={styles.imageColumn}>
            <Image src={slider} alt="" className={styles.imageSlider} />
          </div>
        </div>
      </div>
      <div className={styles.dealOfTheDay}>
            <div className={styles.dealHeader}>
                <p className={styles.dealTitle}>Danh sách sản phẩm</p>
                <button className={styles.buttonLeft} onClick={scrollLeft}> <FontAwesomeIcon icon={faLessThan} /></button>
                <button className={styles.buttonRight} onClick={scrollRight}><FontAwesomeIcon icon={faGreaterThan} /></button>
            </div>
            <div className={styles.displayList} ref={productListRef}> {data.map((value: ProductData) => <DisplayItem item={value} key={value.id} />)} </div>
        </div>
      <div className={styles.trendSection}>
        <div className={styles.trend1}>
          <Image src={snack} alt="" className={styles.imgSnack} />
          <h3>One Day Delivery</h3>
          <h4>Get Up To 30% Off</h4>
        </div>
        <div className={styles.trend2}>
          <div className={styles.trend21}>
            <h3>One Day Delivery</h3>
            <h4>Get Up To 30% Off</h4>
            <Image src={milo} alt="" className={styles.imgMilo} />
          </div>
          <div className={styles.trend22}>
            <h3>One Day Delivery</h3>
            <h4>Get Up To 30% Off</h4>
            <Image src={skippy} alt="" className={styles.imgSkippy} />
          </div>
        </div>
        <div className={styles.trend3}>
          <Image src={water} alt="" className={styles.imgWater} />
          <h3>One Day Delivery</h3>
          <h4>Get Up To 30% Off</h4>
        </div>
      </div>
    </div>
  );
}
