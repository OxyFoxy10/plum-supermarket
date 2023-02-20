import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../styles/product.module.scss";
import db from "../../utils/db";
import Product from "../../models/Product";
import Category from "../../models/Category";
import SubCategory from "../../models/SubCategory";
//import User from "../../models/User";
import Header from "../../components/header";
import Footer from "../../components/footer";
import MainSwiperCard from "../../components/productPage/mainSwiperCard";
import Infos from "../../components/productPage/infos";
// import Reviews from "../../components/productPage/reviews";
import { useState } from "react";
import LightPlumIcon from "@/components/icons/LightPlumIcon";
import GreenChevronRight from "@/components/icons/ChevronRight";
import Link from "next/link";
import CustomerInfo from "@/components/productPage/customerInfo";
import { Col, Container, Row } from "react-bootstrap";
import Questions from "@/components/Questions";
import BunnerApp from "@/components/bunnerApp";
import CheaperTogether from "@/components/productPage/cheaperTogether";

export default function product({ product }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <Header country="" />
      <Container fluid className={styles.productpage}>
        <Row>
          <Col>
            <Link href="/">
              <LightPlumIcon />
              <GreenChevronRight fillColor="#70BF63"  w="30px" h="30px"/>
            </Link>
            <Link
              href={product.category.name}
              className={styles.productpage__link}
            >
              <span>{product.category.name}</span>
              <GreenChevronRight fillColor="#70BF63"   w="30px" h="30px"/>
            </Link>
            {product.subCategories.map((sub, i) => (
              <Link
                href={`/${product.category.name}/${sub.name}`}
                key={i}
                className={styles.productpage__link}
              >
                <span> {sub.name}</span>
              </Link>
            ))}
          </Col>
        </Row>
        <Row className={styles.productpage__nameCode}>
          <Col className={styles.productpage__nameCode_name}>

            <span>{product.name} {product.color} {product.size}</span>
          </Col>
          <Col className={styles.productpage__nameCode_code}>
            <span>Code: {product.code}</span>
          </Col>
        </Row>
        <Row className={styles.productpage__main}>
          <Col>
          <MainSwiperCard product={product} setActive={setActive} />
          </Col>
          <Col> <Infos product={product} active={active}/></Col>
        </Row>

        <Row>
          <CustomerInfo />
        </Row>
        <Row className={styles.productpage__title}>
          <span>Разом дешевше</span>
        </Row>
        <Row>
          <CheaperTogether product={product} productsPlus={product.productsPlus}/>
        </Row>
        <Row className={styles.productpage__title}>
          <span>Найпопулярніші відгуки</span>
          <button className={styles.productpage__title_btnReview}>
            Залишити відгук
          </button>
        </Row>
        <Row className={styles.productpage__title}>
          <span>Також вас можуть зацікавити</span>
        </Row>
      </Container>
      <BunnerApp />
      <Questions />
      <Footer />
    </div>
  );
}
export async function getServerSideProps(context) {
  const { query } = context;
  const slug = query.slug;
  const style = query.style;
  const code = query.code || 0;
  db.connectDb();
  //----------------
  //from db
  let product = await Product.findOne({ slug })
    .populate({ path: "category", model: Category })
    .populate({ path: "subCategories", model: SubCategory })
    //.populate({path: "reviews.reviewBy", model: User})
    .lean();

  let subProduct = product.subProducts[style];
  let priceBefore=subProduct.sizes[0].price.toFixed(2);

  // let prices = subProduct.sizes
  //   .map((s) => {
  //     return s.price;
  //   })
  //   .sort((a, b) => {
  //     return a - b;
  //   });

    //products that go together cheaper
  let productsPlus = await Product.find().sort({createdAt: -1}).lean();

  let newProduct = {
    ...product,
    style,
    // code: subProduct.sizes[code].code,
    code,
    images: subProduct.images,
    //sizes: subProduct.sizes,
    size:subProduct.sizes[0].size,
    discount: subProduct.discount,
    color: subProduct.color?.color,
    priceBefore,
    price: ((100-subProduct.discount)*priceBefore/100).toFixed(2),
    price_unit: subProduct.sizes[0].price_unit,
    code: subProduct.sizes[0].code,
    sold: subProduct.sold,

    // priceRange: subProduct.discount
    //   ? `From ${(prices[0] - prices[0] / subProduct.discount).toFixed(2)} to ${(
    //     prices[prices.length - 1] -
    //     prices[prices.length - 1] / subProduct.discount
    //   ).toFixed(2)}$`
    //   : `From ${prices[0]} to ${prices[prices.length - 1]}$`,
    // price:
    //   subProduct.discount > 0
    //     ? (
    //         subProduct.sizes[code].price -
    //         subProduct.sizes[code].price / subProduct.discount
    //       ).toFixed(2)
    //     : subProduct.sizes[code].price,
    // priceBefore: subProduct.sizes[code].price,
    quantity: subProduct.sizes[0].qty,
    productsPlus,
    ratings: [
      { percentage: 76 },
      { percentage: 14 },
      { percentage: 6 },
      { percentage: 4 },
      { percentage: 0 },
    ],
    // allSizes: product.subProducts
    //   .map((p) => {
    //     return p.sizes;
    //   })
    //   .flat()
    //   .sort((a, b) => {
    //     return a.size - b.size;
    //   })
    //   .filter(
    //     (element, index, array) =>
    //       array.findIndex((el2) => el2.size === element.size) === index
    //   ),
  };
 // console.log("newProduct",newProduct);
  //----------------
  db.disconnectDb();
  return {
    props: { product: JSON.parse(JSON.stringify(newProduct)) },
  };
}
