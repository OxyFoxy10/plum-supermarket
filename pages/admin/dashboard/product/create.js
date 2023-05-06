import styles from "@/styles/products.module.scss";
import Layout from "@/components/admin/layout";
import db from "../../../../utils/db";
import { useState, useEffect } from "react";
import Product from "../../../../models/Product";
import Category from "../../../../models/Category";
import axios from "axios";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import SingularSelect from "@/components/admin/select/SingularSelect";
import MultipleSelect from "@/components/admin/select/MultipleSelect";
import AdminInput from "@/components/inputs/adminInput";
import Images from "@/components/admin/createProduct/images";
import Colors from "@/components/admin/createProduct/colors";
import Style from "@/components/admin/createProduct/style";
import Sizes from "@/components/admin/createProduct/sizes";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import DotLoaderSpinner from "@/components/loaders/dotLoader";
import slugify from "slugify";
import DialogModal from "@/components/dialogModal";
import { useDispatch, useSelector } from "react-redux";
import { showDialog, hideDialog } from "@/store/DialogSlice";
import Details from "@/components/admin/createProduct/details";
import { validateCreateProduct } from "@/utils/validation";
import { uploadImages } from "@/requests/upload";
import dataURItoBlob from "@/utils/dataURItoBlob";

const animatedComponents = makeAnimated();
const createUniqueCode = () => {
  const len = 8;
  let randStr = "";
  for (let i = 0; i < len; i += 1) {
    const ch = Math.floor(Math.random() * 10 + 1);
    randStr += ch;
  }
  return randStr;
};
const initialState = {
  name: "",
  description: "",
  brand: "",
  // slug: "", 
  category: "",
  groupSubCategory: {
    name: "",
    _id: "",
    parent: "",
    slug: "",
  },
  subCategories: [],
  details: [
    {
      group: "",
      fields: [
        {
          name: "",
          value: "",
          isMain: false,
        },
      ],
    },
  ],
  reviews: [],
  refundPolicy: "30 днів",
  rating: 0,
  numReviews: 0,
  parent: "",
  images: [],
  color: {
    color: "",
    image: "",
  },
  sizes: [
    {
      size: "",
      qty: 1,
      price: 0,
      price_unit: "₴",
      code: createUniqueCode(),
    },
  ],
  discount: 0,
  sold: 0,
};

export default function create({ parents, categories }) {
  const dispatch = useDispatch();
  const [product, setProduct] = useState(initialState);
  const [subCategories, setSubs] = useState([]);
  const [groupSub, setGroupSub] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataOptions, setDataOptions] = useState([]);
  const [dataSelectedOptions, setDataSelectedOptions] = useState([]);
  // const [slug, setSlug] = useState("");

  //     useEffect(()=>{
  // dispatch(showDialog({
  //     header: "Перевірка продукту",
  //     msgs: [{
  //         msg: "Виберіть принаймі 2 зображення",
  //         type: "error",
  //     },
  // ],
  // }))
  //     },[])
  const getParentData = async () => {
    setDataOptions([]);
    setDataSelectedOptions([]);
    if (product.parent != "") {
      setLoading(true);
      const { data } = await axios.get(`/api/product/${product.parent}`);
      if (data) {
        setProduct({
          ...product,
          name: data.name,
          description: data.description,
          brand: data.brand,
          // slug: data.slug,
          category: data.category_id,
          subCategories: data.subCategories,
          details: data.details,
          groupSubCategory: data.groupSubCategory._id,
          color: data.color,
          sizes: data.sizes,
          discount: data.discount,
          images: data.images
        });
      }
      getSubs();
    } else {
      setProduct(initialState);
    }
  };
  useEffect(() => {
    getParentData();
  }, [product.parent]);

  const getGroupSub = async () => {
    setLoading(true);
    const { data } = await axios.get(`/api/admin/groupSubCategory`, {
      params: {
        category: product.category,
      },
    });
    setGroupSub(data);
    setLoading(false);
  };
  const getSubs = async () => {
    setLoading(true);
    const { data } = await axios.get(`/api/admin/subCategory`, {
      params: {
        groupSubCategory: product.groupSubCategory,
      },
    });
    if (product.parent !== "") {
      setSubs(product.subCategories);
    } else {
      setSubs(data);
    }
    changeSelectedOptions();
    setLoading(false);
  };
  useEffect(() => {
    getGroupSub();
    changeSelectedOptions();
  }, [product.category]);

  useEffect(() => {
    setLoading(true);
    getSubs();
    setLoading(false);
  }, [product.groupSubCategory]);

  const changeSelectedOptions = () => {
    if (product.parent !== "") {
      setDataSelectedOptions(
        subCategories.map((item) => {
          let label = `${item.name}`;
          let value = `${item._id}`;
          return {
            ...item,
            label,
            value,
            isFixed: false,
          };
        })
      );
    } else {
      setDataSelectedOptions([]);
    }
    setDataOptions(
      subCategories.map((item) => {
        let label = `${item.name}`;
        let value = `${item._id}`;
        return {
          ...item,
          label,
          value,
          isFixed: false,
        };
      })
    );
  };
  useEffect(() => {
    setLoading(true);
    changeSelectedOptions();
    setLoading(false);
  }, [subCategories]);

  const handleChange = (e) => {
    if (e !== undefined) {
      const { value, name } = e.target;
      setProduct({ ...product, [name]: value });
    }

  };
  const handleChangeSubCategory = (value) => {
    setDataSelectedOptions(value);
    setProduct({ ...product, subCategories: value });
  };

  const validate = Yup.object({
    name: Yup.string()
      .required("Please add a name")
      .min(10, "Product name must be between 10 and 300 characters")
      .max(300, "Product name must be between 10 and 300 characters"),
    brand: Yup.string().required("Please add a brand"),
    category: Yup.string().required("Please select a category"),
    dataSelectedOptions: Yup.array().min(
      1,
      "Please select at least 1 subCategory"
    ),
    groupSubCategory: Yup.string().required(
      "Please select a group of subCategories"
    ),
    // slug: Yup.string().required("Please add a slug"),
    // color: Yup.object().required("Please add a color"),
    description: Yup.string().required("Please add a description"),
  });

  const createProduct = async () => {
    let test = validateCreateProduct(product, images);
    console.log("test", test);
    if (test == "valid") {
      createProductHandler();
    } else {
      dispatch(
        showDialog({
          header: "Будь ласка дотримуйтесь інструкцій",
        })
      );
    }
  };

  let uploaded_images = [];
  const createProductHandler = async () => {
    setLoading(true);
    if (images.length > 0) {
      let temp = images.map((img) => {
        return dataURItoBlob(img);
      });
      const path = "product images";
      let formData = new FormData();
      formData.append("path", path);
      temp.forEach((img) => {
        formData.append("file", img);
      });
      uploaded_images = await uploadImages(formData);
      console.log("uploaded images: ", uploaded_images);
    }

    try {
      const { data } = await axios.post("/api/admin/product", {
        ...product,
        images: uploaded_images,
        color: product.color,
      });
      setLoading(false);
      toast.success(data.message);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <Layout>
      {loading && <DotLoaderSpinner loading={loading} />}
      <div className={styles.header}>Create Product</div>
      <div>product</div>
      {JSON.stringify(product)}
      {/* <DialogModal show={dialog.show} onHide={()=>hideDialog()} msgs={dialog.msgs} header={dialog.header}/> */}
      <DialogModal />
      <Formik
        enableReinitialize
        initialValues={{
          name: product.name,
          brand: product.brand,
          description: product.description,
          category: product.category,
          subCategories: product.subCategories,
          groupSubCategory: product.groupSubCategory,
          parent: product.parent,
          // slug: product.slug,
          discount: product.discount,
          color: product.color,
          images: product.images,
          imageInputFile: "",
        }}
        validationSchema={validate}
        onSubmit={() => {
          createProduct();
        }}
      >
        {(formik) => (
          <Form>
            <Images
              name="imagesInputFile"
              header="Product Carousel Images"
              text="Додати зображення"
              images={images}
              setImages={setImages}
            />
            <div className={styles.flex}>
              {product.color?.image && (
                <>
                  <h3>
                    {" "}
                    Колір продукту: <span>{product.color?.color}</span>
                  </h3>
                  <span
                    className={styles.color_span}
                    style={{ background: `${product.color?.image}` }}
                  ></span>
                </>
              )}
            </div>
            <Colors
              name="color"
              product={product}
              setProduct={setProduct}
              color={product.color}
            />
            {/* <Style
              name="styleInput"
              product={product}
              setProduct={setProduct}
              colorImage={colorImage}
            /> */}
            {/* TODO product to which one we want to add subProduct */}
            <SingularSelect
              name="parent"
              value={product.parent}
              label="parent"
              data={parents}
              header="Додати до існуючого продукту"
              handleChange={handleChange}
            />
            {/* TODO selector for Category */}
            <SingularSelect
              name="category"
              value={product.category}
              label="Category"
              data={categories}
              header="Виберіть категорію"
              handleChange={handleChange}
              disabled={product.parent != ""}
            />

            <SingularSelect
              name="groupSubCategory"
              value={product.groupSubCategory}
              label="GroupSubCategory"
              data={groupSub}
              header="Виберіть групу субкатегорій"
              handleChange={handleChange}
              disabled={product.parent != ""}
            />
            {/* <MultipleSelect
                                    name="subCategories"
                                    value={dataOptions}                                   
                                    data={subs}
                                    header="Виберіть субкатегорії"
                                    onChange={handleChange}
                                    disabled={product.parent!=""}
                                /> */}
            <div style={{ marginBottom: "1rem" }}>
              <Select
                isMulti
                name="dataSelectedOptions"
                value={dataSelectedOptions}
                disabled={product.parent != ""}
                onChange={handleChangeSubCategory}
                placeholder="Виберіть субкатегорії"
                components={animatedComponents}
                className={`${styles.select} ${formik.touched && formik.errors && styles.error_select
                  }`}
                classNamePrefix="Виберіть субкатегорії"
                options={dataOptions}
                isClearable={true}
              ></Select>
              {formik.touched && formik.errors && (
                <p className={styles.error_msg}>
                  <ErrorMessage name="dataSelectedOptions" />
                </p>
              )}
            </div>
            <div className={styles.header}>Basic Infos</div>
            <AdminInput
              type="text"
              label="Name"
              name="name"
              placeholder="Name"
              onChange={(e) => handleChange(e)}
            />
            <AdminInput
              type="textarea"
              rows="4"
              cols="50"
              label="Description"
              name="description"
              placeholder="Description"
              onChange={(e) => handleChange(e)}
            />
            <AdminInput
              type="text"
              label="Brand"
              name="brand"
              placeholder="Brand"
              onChange={(e) => handleChange(e)}
            />
            {/* <AdminInput
              type="text"
              label="Slug"
              name="slug"
              placeholder="Slug"
              value={slug}
              onChange={handleChange}
            /> */}
            <AdminInput
              type="text"
              label="Discount"
              name="discount"
              placeholder="Discount"
              onChange={(e) => handleChange(e)}
            />
            {/* <Images
                            name="imageDescInputFile"
                            header="Product Description Images"
                            text="Add images"
                            images={description_images}
                            setImages={setDescriptionImages}
                            setColorImage={setColorImage} /> */}
            <Sizes
              sizes={product.sizes}
              product={product}
              setProduct={setProduct}
            />
            <Details
              details={product.details}
              product={product}
              setProduct={setProduct}
            />
            <button className={styles.btn} type="submit">
              Create Product
            </button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  await db.connectDb();
  const results = await Product.find({}).select("name subProducts").lean();
  const categories = await Category.find({}).sort({ updatedAt: -1 }).lean();
  await db.disconnectDb();
  return {
    props: {
      parents: JSON.parse(JSON.stringify(results)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}
