import styles from "./styles.module.scss";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ErrorMessage, useField } from "formik";
import { RiShape2Line, RiDeleteBin7Fill } from "react-icons/ri";
import { GiExtractionOrb } from "react-icons/gi";
import { showDialog, hideDialog } from "@/store/DialogSlice";

export default function Images({
    images,
    setImages,
    header,
    text,
    name,
    setColorImage,
    ...props
}) {
    const dispatch = useDispatch();
    const fileInput = useRef(null);
    const [meta, field] = useField(props);
    const [disableButton, setDisabledButton] = useState(false);

    useEffect(() => {
        images.length >= 6 ? setDisabledButton(true) : setDisabledButton(false);
    }, [images]);

    const handleImages = (e) => {
        let files = Array.from(e.target.files);
        files.forEach((img, i) => {
            if (images.length >= 6) {
                console.log("ERROR");
                dispatch(
                    showDialog({
                        header: "Дозволено максимум 6 зображень",
                        msgs: [
                            {
                                msg: `Дозволено максимум 6 зображень`,
                                type: "error",
                            },
                        ],
                    })
                );
                return;
            } else if (
                img.type !== "image/jpeg" &&
                img.type !== "image/jpg" &&
                img.type !== "image/webp" &&
                img.type !== "image/png"
            ) {
                dispatch(
                    showDialog({
                        header: "Unsupported Format.",
                        msgs: [
                            {
                                msg: `${img.name} format не підтримується! Лише JPEG, PNG, WEBP дозволено`,
                                type: "error",
                            },
                        ],
                    })
                );
                files = files.filter((item) => item !== img.name);
                return;
            } else if (img.size > 1024 * 1024 * 10) {
                dispatch(
                    showDialog({
                        header: "Unsupported Size.",
                        msgs: [
                            {
                                msg: `${img.name} розмір занадто великий, максимум  10MB дозволено`,
                                type: "error",
                            },
                        ],
                    })
                );
                return;
            } else {
                const reader = new FileReader();
                reader.readAsDataURL(img);
                reader.onload = (e) => {
                    setImages((images) => [...images, e.target.result]);
                };
            }
        });
    };

    const handleRemove = (image) => {
        setImages((images) => images.filter((item) => item !== image));
    };

    return (
        <div className={styles.images}>
            <div
                className={`${styles.header} ${meta.error ? styles.header_error : ""}`}
                style={{ border: "none" }}
            >
                <div className={styles.flex}>
                    {meta.error && <img src="../../../images/warning.png" alt="" />}
                    {header}
                </div>
                <span>
                    {meta.touched && meta.error && (
                        <div className={styles.error_msg}>
                            <span></span>
                            <ErrorMessage name={name} />
                        </div>
                    )}
                </span>
            </div>
            <input
                type="file"
                name={name}
                ref={fileInput}
                hidden
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImages}
            />
            <div className={styles.images_main}>
                <div
                    className={`${styles.images_main_grid} ${images.length == 2
                            ? styles.grid_two
                            : images.length == 3
                                ? styles.grid_three
                                : images.length == 4
                                    ? styles.grid_four
                                    : images.length == 5
                                        ? styles.grid_five
                                        : images.length == 6
                                            ? styles.grid_six
                                            : ""
                        }`}
                >
                    {!images.length ? (
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1200px-No-Image-Placeholder.svg.png"
                            alt=""
                        />
                    ) : (
                        images.map((img, i) => (
                            <div className={styles.images_main_grid_wrap} key={i}>
                                <div className={styles.blur}> </div>
                                <img src={img} alt="" />
                                <div className={styles.images_main_grid_actions}>
                                    <button onClick={() => handleRemove(img)}>
                                        <RiDeleteBin7Fill />
                                    </button>
                                    {/* <button><GiExtractionOrb /></button> */}
                                    {/* <button><RiShape2Line /></button> */}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <button
                type="reset"
                disabled={disableButton}
                style={{ opacity: disableButton ? "0.5" : "1" }}
                onClick={() => fileInput.current.click()}
                className={`${styles.btn} ${styles.btn_primary}`}
            >
                Додати фото
            </button>
        </div>
    );
}
