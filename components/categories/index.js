import styles from "./styles.module.scss"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Link from "next/link"
import Image from 'react-bootstrap/Image'


export default function Categories({ icon, category }) {

    return (
        <Container className={styles.container}>
            <Row className={styles.row}>
                <Col className={styles.col}>
                    <Link href="/" className={styles.link}>
                        <Image width="36px" height="36px" src="../../../images/categories/laptop1.png" />
                        Desktops & laptops
                    </Link>
                </Col>
                <Col className={styles.col}>
                    <Link href="/" className={styles.link}>
                        <Image width="36px" height="36px" src="../../../images/categories/bed.png" />
                        Household
                    </Link>
                </Col>
                <Col className={styles.col}>
                    <Link href="/" className={styles.link}>
                        <Image width="36px" height="36px" src="../../../images/categories/baseball.png" />
                        Sport, Hobby
                    </Link>
                </Col>
                <Col className={styles.col}>
                    <Link href="/" className={styles.link}>
                        <Image width="36px" height="36px" src="../../../images/categories/dog.png" />
                        Pet supplies
                    </Link>
                </Col>
            </Row>
            <Row className={styles.row}>
                <Col className={styles.col}>
                    <Link href="/" className={styles.link}>
                        <Image width="36px" height="36px" src="../../../images/categories/devices.png" />
                        TV & Electronics
                    </Link>
                </Col>
                <Col className={styles.col}>
                    <Link href="/" className={styles.link}>
                        <Image width="36px" height="36px" src="../../../images/categories/tools.png" />
                        Tools and auto
                    </Link>
                </Col>
                <Col className={styles.col}>
                    <Link href="/" className={styles.link}>
                        <Image width="36px" height="36px" src="../../../images/categories/hanger.png" />
                        Clothes, shoes, decoration
                    </Link>
                </Col>
                <Col className={styles.col}>
                    <Link href="/" className={styles.link}>
                        <Image width="36px" height="36px" src="../../../images/categories/school.png" />
                        Office, school, books
                    </Link>
                </Col>
            </Row>
            <Row className={styles.row}>
                <Col className={styles.col}>
                    <Link href="/" className={styles.link}>
                        <Image width="36px" height="36px" src="../../../images/categories/games1.png" />
                        Gaming products
                    </Link>
                </Col>
                <Col className={styles.col}>
                    <Link href="/" className={styles.link}>
                        <Image width="36px" height="36px" src="../../../images/categories/shower.png" />
                        Plumbing and repair
                    </Link>
                </Col>
                <Col className={styles.col}>
                    <Link href="/" className={styles.link}>
                        <Image width="36px" height="36px" src="../../../images/categories/hair.png" />
                        Beauty and health
                    </Link>
                </Col>
                <Col className={styles.col}>
                    <Link href="/" className={styles.link}>
                        <Image width="36px" height="36px" src="../../../images/categories/glass.png" />
                        Alcohol & Food
                    </Link>
                </Col>
            </Row>
            <Row className={styles.row}>
                <Col className={styles.col}>
                    <Link href="/" className={styles.link}>
                        <Image width="36px" height="36px" src="../../../images/categories/vacuum.png" />
                        Appliances
                    </Link>
                </Col>
                <Col className={styles.col}>
                    <Link href="/" className={styles.link}>
                        <Image width="36px" height="36px" src="../../../images/categories/shovel.png" />
                        Cottage and garden
                    </Link>
                </Col>
                <Col className={styles.col}>
                    <Link href="/" className={styles.link}>
                        <Image width="36px" height="36px" src="../../../images/categories/baby.png" />
                        Childen's goods
                    </Link>
                </Col>
                <Col className={styles.col}>
                    <Link href="/" className={styles.link}>
                        <Image width="36px" height="36px" src="../../../images/categories/union.png" />
                        Our defenders
                    </Link>
                </Col>
            </Row>
        </Container>

    )
}