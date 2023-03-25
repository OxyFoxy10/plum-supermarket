import styles from "./styles.module.scss"
import Modal from 'react-bootstrap/Modal'
import Image from 'react-bootstrap/Image'


export default function EmptyCart(props) {
    return (
        <Modal.Body className={styles.modalbodyempty}>
            <Image src='../../../images/cart.jpg' width="180px" height="180px" />
            <h2>Корзина пуста</h2>
            <h5>Але ще не пізно це виправити!</h5>
            <div className={styles.line}></div>
            <button className={styles.addbtn}
               onClick={() => props.onHide()}
            >Додати товари</button>
        </Modal.Body>
    )
}