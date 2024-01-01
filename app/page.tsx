'use client'

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DisplayItem from './components/displayItem';
import { faFilter, faGreaterThan, faLessThan, faX } from '@fortawesome/free-solid-svg-icons';
import Image from "next/image";
import Logo from "./img/logo.jpg";
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
    const dealOfTheDayRef = useRef<HTMLDivElement | null>(null);
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
      const scrollToDealOfTheDay = () => {
        if (dealOfTheDayRef.current) {
          dealOfTheDayRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end", 
          });
        }
      };
      const handleButtonClick = (clickedTag:string) => {
        // Thực thi hàm 1
        setTag(clickedTag)
      
        // Thực thi hàm 2
        scrollToDealOfTheDay()
      };
      const handleCickSearch = (clickedTag:string) => {
        // Thực thi hàm 1
        setQ(clickedTag)
      
        // Thực thi hàm 2
        scrollToDealOfTheDay()
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
                  tag === "Tất cả" ? styles.activeBox : styles.filterBox
                }
                onClick={() => {
                  setTag("Tất cả");
                  scrollToDealOfTheDay();
                }}
              >
                {"Tất cả"}
              </button>
              {category.map((value, index) => (
                 <button
                 key={index}
                 className={
                   tag === value.name ? styles.activeBox : styles.filterBox
                 }
                 onClick={() => {
                   setTag(value.name);
                   scrollToDealOfTheDay();
                 }}
               >
                 {value.name}
               </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <Image src={Logo} alt="" className={styles.imageLogo} />
        <div className={styles.nameLogo}>
          <div className={styles.mainName}>Grocery</div>
          <div className={styles.subName}>Dream</div>
        </div>

        <input
          className={styles.searchBar}
          placeholder="Tìm kiếm"
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
          }}
          onKeyDown={(f) => {
            if (f.key === 'Enter') {
              scrollToDealOfTheDay();
            }
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
              onClick={() => handleButtonClick("Tất cả")}
            >
              {"Tất cả"}
            </button>
            {category.map((value, index) => (
               <button
               key={index}
               className={
                 tag == value.name ? styles.activeBox : styles.filterBox
               }
               onClick={() => handleButtonClick(value.name)}
             >
               {value.name}
             </button>
            ))}
          </div>
        </div>
        <div className={styles.sliderSection}>
          <div className={styles.textColumn}>
          <h3>Chào mừng đến với</h3>
            <h2>DREAM GROCERY</h2>
          </div>
          <div className={styles.imageColumn}>
            <Image src={slider} alt="" className={styles.imageSlider} />
          </div>
        </div>
      </div>
      <div ref={dealOfTheDayRef} className={styles.dealOfTheDay}>
            <div className={styles.dealHeader}>
                <p className={styles.dealTitle}>Danh sách sản phẩm</p>
                <button className={styles.buttonLeft} onClick={scrollLeft}> <FontAwesomeIcon icon={faLessThan} /></button>
                <button className={styles.buttonRight} onClick={scrollRight}><FontAwesomeIcon icon={faGreaterThan} /></button>
            </div>
            <div className={styles.displayList} ref={productListRef}> {data.map((value: ProductData) => <DisplayItem item={value} key={value.id} />)} </div>
        </div>
        <div className={styles.trendTitle}>
        <h2>  Tiêu chí cửa hàng</h2>
      </div>
      <div className={styles.trendSection}>
        <div className={styles.trend1}>
          <Image src={snack} alt="" className={styles.imgSnack} />
          <h3>Chất lượng sản phẩm</h3>
          <h5>Cam kết chỉ bán sản phẩm chất lượng và đáng tin cậy,</h5>
          <h5>tuân thủ đầy đủ các tiêu chuẩn an toàn thực phẩm.</h5>
        </div>
        <div className={styles.trend2}>
          <div className={styles.trend21}>
            <div className={styles.textTrend21}>
              <h3>Chất lượng dịch vụ</h3>
              <h5>Chăm sóc khách hàng tận tâm</h5>
              <h5>Không gian cửa hàng sạch sẽ, gọn gàng. </h5>
            </div>
            <Image src={milo} alt="" className={styles.imgMilo} />
          </div>
          <div className={styles.trend22}>
            <Image src={skippy} alt="" className={styles.imgSkippy} />
            <div className={styles.textTrend22}>
              <h3>Tiêu dùng "xanh" </h3>
              <h5> Sử dụng túi tái sử dụng và cung cấp</h5>
              <h5> các sản phẩm thân thiện với môi trường.</h5>
            </div>
          </div>
        </div>
        <div className={styles.trend3}>
          <Image src={water} alt="" className={styles.imgWater} />
          <h2>Đa dạng sản phẩm </h2>
          <h5>Cung cấp đầy đủ sản phẩm từ</h5>
          <h5> thực phẩm, đồ khô đến hàng tiêu dùng và đồ gia dụng.</h5>
        </div>
      </div>
    </div>
  );
}
