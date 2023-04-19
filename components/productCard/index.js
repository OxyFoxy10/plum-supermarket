import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import ProductSwiper from "./ProductSwiper";
import Link from "next/link";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HeartIcon from "../icons/HeartIcon";
import CartIcon from "../icons/CartIcon";
import ScalesIcon from "../icons/ScalesIcon";
import axios from "axios";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import { addToWishList } from "@/store/wishListSlice";
import { saveWishList } from "@/requests/user";
import { useSession } from "next-auth/react";
import {
  addToScaleList,
  updateScaleList,
  removeFromScaleList,
} from "@/store/scaleListSlice";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export default function ProductCard({ product, style, mode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const [images, setImages] = useState(product.subProducts[style]?.images);
  const [qty, setQty] = useState(1);
  const [errorInProductCard, setErrorInProductCard] = useState("");
  const cart = useSelector((state) => state.cart);
  const wishList = useSelector((state) => state.wishList);
  const scaleList = useSelector((state) => state.scaleList);
  const reviewRating = useSelector((state) => state.reviewRating);
  const [isOpen, setIsOpen] = useState(false);
  const [wishError, setWishError] = useState(false);
  const [isOpenInCart, setIsOpenInCart] = useState(false);
  const [isOpenInWish, setIsOpenInWish] = useState(false);
  const [isOpenInScale, setIsOpenInScale] = useState(false);

  const [wishChosen, setWishChosen] = useState(false);
  const [cartChosen, setCartChosen] = useState(false);
  const [scaleChosen, setScaleChosen] = useState(false);

  useEffect(() => {
    setImages(product.subProducts[style].images);
  }, [style, product.slug]);

  useEffect(() => {
    let _uid = `${product._id}_${product.style}_${product.mode}`;
    let exist = null;
    if (cart.cartItems) {
      exist = cart.cartItems.find((item) => item._uid == _uid);
    }
    if (exist) {
      setCartChosen(true);
      setIsOpenInCart(true);
    } else {
      setCartChosen(false);
      setIsOpenInCart(false);
    }
  }, [cart.cartTotal, style, mode]);

  useEffect(() => {
    let _uid = `${product._id}_${product.style}_${product.mode}`;
    let exist = null;
    if (wishList.wishListItems) {
      exist = wishList.wishListItems.find((item) => item._uid == _uid);
    }
    if (exist) {
      setWishChosen(true);
      setIsOpenInWish(true);
    } else {
      setWishChosen(false);
      setIsOpenInWish(false);
    }
  }, [wishList.wishListTotal, style, mode]);

  useEffect(() => {
    let exist = null;
    if (scaleList.scaleListItems) {
      exist = scaleList.scaleListItems.some((item) => {
        return item.items.some((p) =>
        p._id == product._id && p.style == product.style && p.mode == product.mode
        )
      });
    }
    if (exist) {
      setScaleChosen(true);
      setIsOpenInScale(true);
    } else {
      setScaleChosen(false);
      setIsOpenInScale(false);
    }
  }, [scaleList.scaleListTotal, style, mode]);

  const addToCartHandler = async () => {
    const { data } = await axios.get(
      `/api/product/${product._id}?style=${style}&code=${mode}`
    );
    if (qty > data.quantity) {
      setErrorInProductCard("The quantity is bigger than in stock.");
      return;
    } else if (data.quantity < 1) {
      setErrorInProductCard("This product is out of stock.");
      return;
    } else {
      let _uid = `${data._id}_${data.style}_${data.mode}`;
      let exist = null;
      console.log("cartHandler", _uid);
      if (cart.cartItems) {
        exist = cart.cartItems.find((item) => item._uid === _uid);
      }
      if (exist) {
        // setIsOpenInCart(true);
        // let newCart = cart.cartItems.map((item) => {
        //   if (item._uid === exist._uid) {
        //     return { ...item, qty: item.qty + 1 };
        //   }
        //   return item;
        // });
        // dispatch(updateCart(newCart));
        // setCartChosen(true);
      } else {
        dispatch(addToCart({ ...data, qty, size: data.size, _uid }));
        setCartChosen(true);
      }
    }
  };
  const addToWishHandler = async () => {
    if (session) {
      setWishError("");
      setIsOpenInWish(false);
      let _uid = `${product._id}_${style}_${mode}`;
      let exist = null;
      if (wishList.wishListItems) {
        exist = wishList.wishListItems.find((item) => item._uid === _uid);
      }
      if (exist) {
        setWishError("Товар уже в списку улюблених");
        setIsOpenInWish(true);
        // let newWishList = wishList.wishListItems.filter((item) => {
        //   return item._uid != _uid;
        // });
        // dispatch(updateWishList(newWishList));
        // updateOneInWishList({ productId: product._id });
        // setWishChosen(false);
      } else {
        const { data } = await axios.get(
          `/api/product/${product._id}?style=${style}&code=${mode}`
        );
        dispatch(
          addToWishList({ ...data, qty, size: data.size, _uid, mode: mode })
        );
        saveWishList({
          productId: product._id,
          size: product.subProducts[style].sizes[mode].size,
          image: product.subProducts[style].images[0],
          color: product.subProducts[style].color?.color,
          code: product.subProducts[style].sizes[mode].code,
        });
      }
    } else {
      setWishError("Будь ласка зареєструйтесь!");
      setIsOpenInWish(true);
    }
  };

  const addToScaleHandler = async () => {
    const { data } = await axios.get(
      `/api/product/${product._id}?style=${style}&code=${mode}`
    );
    let existSub = null;
    let existItem = null;
    if (scaleList.scaleListItems) {
      existSub = scaleList.scaleListItems.find(
        (item) => item.subCategory_id === data.subCategory_id
      );
      if (existSub) {
        console.log("existSub",existSub);
        console.log("data",data);
        existItem = existSub.items.find((p) => p._id == data._id && p.style == data.style && p.mode == data.mode);
        console.log("existItem", existItem);
        if (existItem) {
           if (existSub.items.length === 1) {
            dispatch(removeFromScaleList({ ...existSub }));
            setScaleChosen(false);
          } else {
            dispatch(updateScaleList({ ...data }));
            setScaleChosen(true);
          }
        } else {
          dispatch(addToScaleList({ ...data }));
          setScaleChosen(true);
        }
      } else {
        dispatch(addToScaleList({ ...data }));
        setScaleChosen(true);
      }
    }
  };

  return (
    <Card className={styles.product}>
      <Tooltip
        id="wish-tooltip"
        content={wishError}
        isOpen={isOpenInWish}
        style={{ backgroundColor: "#70BF63", color: "#fff", borderRadius: "30px", zIndex:"999" }}
       
      />
      {/* <Tooltip
        id="incart-tooltip"
        content="Товар в корзині"
        isOpenInCart={isOpenInCart}
        offset={30}
        style={{ backgroundColor: "#70BF63", color: "#fff", borderRadius: "30px" }}
      /> */}
      <div className={styles.product__container}>
        <div className={styles.product__container_photobox}>
          <Link href={`/product/${product.slug}?style=${style}&code=${mode}`}>
            <ProductSwiper images={images} />
          </Link>
          <Button
            className={styles.btnheart}
            onClick={addToWishHandler}
            data-tooltip-id="wish-tooltip"
            onMouseLeave={() => setIsOpenInWish(false)}
            style={{ backgroundColor: wishChosen ? "#220F4B" : "#FAF8FF" }}
          >
            <HeartIcon fillColor={wishChosen ? "#FAF8FF" : "#220F4B"} />
          </Button>
        </div>
        {product.subProducts[style]?.discount ? (
          <div className={styles.product__discount}>
            -{product.subProducts[style]?.discount}%
          </div>
        ) : (
          <></>
        )}
        <Container className={styles.product__container_infos}>
          <Row>
            <Col>
              <Card.Title className={styles.product__container_infos_title}>
                <Link
                  href={`/product/${product.slug}?style=${style}&code=${mode}`}
                  className={styles.linktext}
                >
                  {(
                    product.name +
                    " " +
                    (product.subProducts[style]?.color
                      ? product.subProducts[style]?.color.color
                      : "") +
                    " " +
                    product.subProducts[style]?.sizes[mode].size
                  ).length > 55
                    ? `${product.name.substring(0, 55)}...`
                    : product.name +
                    " " +
                    (product.subProducts[style]?.color
                      ? product.subProducts[style]?.color.color
                      : "") +
                    " " +
                    product.subProducts[style]?.sizes[mode].size}
                </Link>
              </Card.Title>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={styles.product__container_infos_line}></div>
            </Col>
          </Row>
          <Row className={styles.product__container_infos_pricebtn}>
            {product.subProducts[style]?.discount > 0 ? (
              <Col className={styles.product__container_infos_pricebtn_price}>
                <span
                  className={styles.pricediscount}
                >{`${product.subProducts[style]?.sizes[mode].price.toLocaleString("uk-UA")} ${product.subProducts[style]?.sizes[mode].price_unit
                  }`}</span>
                <span className={styles.priceregular}>
                  {`${Math.round(
                    (product.subProducts[style]?.sizes[mode].price * (100 - product.subProducts[style]?.discount)) /
                    100
                  ).toLocaleString("uk-UA")}`}{" "}
                  {product.subProducts[style].sizes[mode].price_unit}
                </span>
              </Col>
            ) : (
              <Col className={styles.product__container_infos_pricebtn_price}>
                <span
                  className={styles.priceregular}
                >{`${product.subProducts[style]?.sizes[mode].price} ${product.subProducts[style]?.sizes[mode].price_unit}`}</span>
              </Col>
            )}
            <Button
              className={styles.btnscales}
              style={{ backgroundColor: scaleChosen ? "#220F4B" : "#FAF8FF" }}
              onClick={() => addToScaleHandler()}
            >
              <ScalesIcon fillColor={scaleChosen ? "#FAF8FF" : "#220F4B"} />
            </Button>
            <Button
              className={styles.btncart}
              disabled={product.quantity < 1}
              style={{
                cursor: `${product.quantity < 1 ? "not-allowed" : ""}`,
                backgroundColor: cartChosen ? "#220F4B" : "#FAF8FF"
              }}
              onClick={() => addToCartHandler()}

            // data-tooltip-id={cartChosen?"incart-tooltip":"not-incart"}
            // onMouseLeave={() => setIsOpenInCart(false)}
            >
              <CartIcon fillColor={cartChosen ? "#FAF8FF" : "#220F4B"} />
            </Button>
          </Row>
          {errorInProductCard && <span>{errorInProductCard}</span>}
        </Container>
      </div>
    </Card>
  );
}
