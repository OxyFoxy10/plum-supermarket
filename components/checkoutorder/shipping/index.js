import styles from "../styles.module.scss";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import CityModal from "../citymodal";
import { getStreets } from "@/requests/street";
import useDeepCompareEffect from "use-deep-compare-effect";
import { deliveryTypes } from "@/data/deliveryTypes";

export default function Shipping({
  user,
  userData,
  activeAddress,
  setActiveAddress,
  country,
  delivery,
  setDelivery,
  setOrderError,
}) {
  const [cityModalShow, setCityModalShow] = useState(false);
  const [selectedCity, setSelectedCity] = useState();
  const [showSelfPickup, setSelfPickup] = useState("none");
  const [showPostmanDeliveryAll, setShowPostmanDeliveryAll] = useState("none");
  const [showNovaPoshtaDelivery, setShowNovaPoshtaDelivery] = useState("block");
  const [showAddAddressBlock, setShowAddAddressBlock] = useState("none");
  const [userAddresses, setUserAdresses] = useState(user?.address || []);
  const [filteredUserAdresses, setFilteredUserAdresses] = useState(
    userAddresses?.filter((address) =>
      address.zipCode
        ? address.zipCode === selectedCity?.object_code
        : address.city === selectedCity.object_name &&
          address.region === selectedCity.region
    )
  );

  //вулиці в випадаючому списку (з бази)
  const [filteredStreets, setFilteredStreets] = useState([]);
  const [searchStreet, setSearchStreet] = useState("");
  const [selectedStreet, setSelectedStreet] = useState({});
  const [visibleAddressField, setVisibleAddressField] = useState(false);
  const [addressValues, setAddressValues] = useState({
    street: "",
    building: "",
    flat: "",
    ground: "",
    elevator: "Відсутній",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const selectRef = useRef();
  const cityRef = useRef();
  const postmanRef = useRef();
  const selfRef = useRef();
  const [deliveryAddressSelected, setDeliveryAddressSelected] =
    useState("відділення №1");
  const [selectedAddress, setSelectedAddress] = useState(
    filteredUserAdresses.length > 0
      ? filteredUserAdresses.find((item) => item.active === true).address
      : ""
  );

  useEffect(() => {
    if (selectedAddress && selectedAddress!="") {
        const selectedOption = filteredUserAdresses.find(
          (item) => item.address == selectedAddress
        );
        if(selectedOption) {
                   setActiveAddress(selectedOption);
        setDelivery({
          ...delivery,
          deliveryAddress: `${selectedCity?.value}, ${selectedOption.address}, ${selectedOption.ground} поверх, ліфт ${selectedOption.elevator}`,
        });
      }
        }
 
  }, [selectedAddress]);

  useEffect(() => {
    if (
      delivery.deliveryType === "" ||
      delivery.deliveryCost === "" ||
      delivery.deliveryAddress === "" ||
      delivery.deliveryId === ""
    ) {
      setOrderError((prevState) => ({
        ...prevState,
        shippingError: "Заповніть будь ласка адресу доставки",
      }));
    } else {
      setOrderError((prevState) => ({
        ...prevState,
        shippingError: "",
      }));
    }
  }, [delivery]);

  useEffect(() => {
    setDelivery((prevState) => ({
      ...prevState,
      deliveryAddress: `${selectedCity?.value}, ${deliveryAddressSelected}`,
    }));
  }, [deliveryAddressSelected]);

  useEffect(() => {
    setSelectedCity(
      activeAddress
        ? {
            value: `${activeAddress.cityType} ${activeAddress.city}, ${activeAddress.region}`,
            object_category: activeAddress.cityType,
            object_name: activeAddress.city,
            object_code: activeAddress.zipCode,
            region: activeAddress.region,
          }
        : {
            community: "Київ",
            level_1: "3200000000",
            level_2: "8000000000",
            object_category: "м.",
            object_code: "8000000000",
            object_name: "Київ",
            region: "Київська Область",
            _id: "63fd04b68cbfb5572cac4442",
            value: "м. Київ, Київська Область",
            label: "м. Київ, Київська Область",
          }
    );
    setSelectedStreet(
      activeAddress
        ? {
            value: activeAddress?.address,
            name: activeAddress?.street,
            street_type: activeAddress?.streetType,
            city_name: activeAddress?.city,
            city_code: activeAddress?.zipCode,
          }
        : null
    );
  }, []);
  const handleSearchCity = (e) => {
    e.preventDefault();
    cityRef.current.focus();
    setCityModalShow(true);
  };
  const handleCityModalClose = (selectedCity) => {
    if (selectedCity) {
      setUserAdresses(user?.address || []);
      setSelectedCity(selectedCity);
      setActiveAddress((prevState) => ({
        ...prevState,
        address: "",
        streetType: "",
        street: "",
        building: "",
        flat: "",
        ground: "",
        elevator: "",
        cityType: selectedCity.object_category,
        country: country.name,
        city: selectedCity.object_name,
        region: selectedCity.region,
        zipCode: selectedCity.object_code,
        active: true,
      }));
    }
    setCityModalShow(false);
  };

  useEffect(() => {
    if (selectedCity && searchStreet) {
      setAddressValues({
        ...addressValues,
        street: searchStreet,
      });
      let streets = [];
      setTimeout(async () => {
        streets = await getStreets(selectedCity, searchStreet);
        if (streets && streets.length > 0) {
          setFilteredStreets(streets);
        } else {
          setFilteredStreets([]);
        }
      }, 1000);
    }
  }, [searchStreet]);

  useEffect(() => {
    if (searchStreet != "" && addressValues.building != "") {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [addressValues]);

  useDeepCompareEffect(() => {
    if (
      filteredUserAdresses.length > 0 &&
      delivery.deliveryId == "postmanDelivery"
    ) {
      setShowAddAddressBlock("none");
      setShowPostmanDeliveryAll("block");
      setVisibleAddressField(true);
      setSelectedAddress(
        filteredUserAdresses.find((item) => item.active === true).address || ""
      );
    } else {
      setShowAddAddressBlock("block");
      setShowPostmanDeliveryAll("none");
      setVisibleAddressField(false);
    }
  }, [filteredUserAdresses]);

  useEffect(() => {
    if (selectedCity) {
      setFilteredUserAdresses(
        userAddresses?.filter((address) =>
          address.zipCode
            ? address.zipCode === selectedCity?.object_code
            : address.city === selectedCity.object_name &&
              address.region === selectedCity.region
        )
      );
      setDeliveryAddressSelected("відділення №1");
      if (filteredUserAdresses && filteredUserAdresses.length > 0) {
        // setVisibleAddressField(true);
        setActiveAddress((prevState) => ({
          ...prevState,
          address: filteredUserAdresses[0].address,
          streetType: filteredUserAdresses[0].street_type,
          street: filteredUserAdresses[0].name,
          building: filteredUserAdresses[0].building,
          flat: filteredUserAdresses[0].flat,
          ground: filteredUserAdresses[0].ground,
          elevator: filteredUserAdresses[0].elevator,
          active: true,
        }));
      } else {
        setVisibleAddressField(false);
      }
      setDelivery((prevState) => ({
        ...prevState,
        deliveryType: "Нова пошта",
        deliveryCost: "за тарифами перевізника",
        deliveryAddress: `${selectedCity?.value}, ${deliveryAddressSelected}`,
        deliveryId: "novaPoshta",
      }));
      setActiveAddress(null);
      setShowPostmanDeliveryAll("none");
      setVisibleAddressField(false);
      setSelfPickup("none");
      setShowNovaPoshtaDelivery("block");
    }
    // setVisibleAddressField(false);
    // setShowPostmanDeliveryAll("none")
  }, [selectedCity]);

  useDeepCompareEffect(() => {
    if (selectedCity) {
      setFilteredUserAdresses(
        userAddresses?.filter((address) =>
          address.zipCode
            ? address.zipCode === selectedCity?.object_code
            : address.city === selectedCity.object_name &&
              address.region === selectedCity.region
        )
      );

      //   if (filteredUserAdresses && filteredUserAdresses.length > 0) {
      //     setVisibleAddressField(true);
      //   } else {
      //     setVisibleAddressField(false);
      //   }
    }
  }, [userAddresses]);

  const handleSelectStreet = (street) => {
    selectRef.current.focus();
    setSelectedStreet(street);
    setSearchStreet(`${street.street_type} ${street.name}`);
  };
  const handleStreetChange = (e) => {
    setSearchStreet(e.target.value);
  };
  const handleChangeAdress = (e) => {
    setAddressValues({
      ...addressValues,
      [e.target.name]: e.target.value,
    });
  };
  const handleSelectPostman = (e) => {
    postmanRef.current.focus();
    if (selectedAddress) {
      // змінюємо властивість active для вибраного елемента
      const updatedAddresses = filteredUserAdresses.map((item) =>
        item.address == e.target.value
          ? { ...item, active: true }
          : { ...item, active: false }
      );
      setFilteredUserAdresses(updatedAddresses);
    }
    setSelectedAddress(e.target.value);
  };

  const handleChangeDelivery = (e) => {
    if (e.target.name === "selfPickup") {
      const addressDefault = deliveryTypes[0].adresses.find(
        (item) => item.city === selectedCity?.object_name
      );
      setDelivery((prevState) => ({
        ...prevState,
        deliveryAddress: `${addressDefault.cityType} ${addressDefault.city} ${addressDefault.street}`,
      }));
      setActiveAddress(null);
      setSelfPickup("block");
      setShowPostmanDeliveryAll("none");
      setShowNovaPoshtaDelivery("none");
    }
    if (e.target.name === "postmanDelivery") {
      const defaultAddress = filteredUserAdresses.filter(
        (c) => c.city == selectedCity?.object_name
      );
      if (defaultAddress && defaultAddress.length > 0) {
        const selectedAddressActive = defaultAddress.find(
          (c) => c.active === true
        );
        setSelectedAddress(selectedAddressActive.address);
        setDelivery((prevState) => ({
          ...prevState,
          deliveryAddress: `${selectedCity?.value}, ${selectedAddressActive.address}, ${selectedAddressActive.ground} поверх, ліфт ${selectedAddressActive.elevator}`,
        }));
        setActiveAddress(selectedAddressActive);
      } else {
        setDelivery((prevState) => ({
          ...prevState,
          deliveryAddress: "",
        }));
      }
      setShowPostmanDeliveryAll("block");
      if (filteredUserAdresses.length > 0) {
        setVisibleAddressField(true);
        setShowAddAddressBlock("none");
      }
      setSelfPickup("none");
      setShowNovaPoshtaDelivery("none");
    } else {
      setShowPostmanDeliveryAll("none");
    }
    if (e.target.name === "novaPoshta") {
      setDelivery((prevState) => ({
        ...prevState,
        deliveryAddress: `${selectedCity?.value}, ${deliveryAddressSelected}`,
      }));
      setActiveAddress(null);
      setShowNovaPoshtaDelivery("block");
      setVisibleAddressField(false);
      setShowPostmanDeliveryAll("none");
      setSelfPickup("none");
    } else {
      //   setShowNovaPoshtaDelivery("none");
    }
    const deliveryPrice = deliveryTypes
      .filter((d) => d.name === e.target.value)
      .map((p) => p.price);
    setDelivery((prevState) => ({
      ...prevState,
      deliveryType: e.target.value,
      deliveryCost: deliveryPrice[0],
      deliveryId: e.target.id,
    }));
  };

  const handleSelectPickup = (e) => {
    // const options = e.target.options;
    // if (options[0].selected) {
    //     options[0].disabled = true;
    // }
    selfRef.current.focus();
    setDelivery({
      ...delivery,
      deliveryAddress: e.target.value,
    });
  };
  const handleAddAdress = () => {
    if (selectedCity) {
      const addressString =
        selectedStreet?.street_type +
        " " +
        selectedStreet?.name +
        ", буд. " +
        addressValues.building +
        ", кв. " +
        addressValues.flat;
      let newAddress = {
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        phoneNumber: userData?.phoneNumber || "",
        address: addressString,
        streetType: selectedStreet?.street_type,
        street: selectedStreet?.name,
        building: addressValues.building,
        flat: addressValues.flat,
        ground: addressValues.ground,
        elevator: addressValues.elevator,
        cityType: selectedCity.object_category,
        country: country.name,
        city: selectedCity.object_name,
        region: selectedCity.region,
        zipCode: selectedCity.object_code,
        active: true,
      };
      if (newAddress) {
        setActiveAddress(newAddress);
        let addresses = [];
        for (let i = 0; i < userAddresses.length; i++) {
          let temp_address = {};
          temp_address = { ...userAddresses[i], active: false };
          addresses.push(temp_address);
        }
        addresses.push(newAddress);
        setUserAdresses(addresses);
        setDelivery((prevState) => ({
          ...prevState,
          deliveryAddress: `${newAddress.address}, поверх ${newAddress.ground}, ліфт ${newAddress.elevator}`,
        }));
        setSelectedAddress(newAddress);
      }

      setShowAddAddressBlock("none");
      setShowPostmanDeliveryAll("block");
      setAddressValues({
        ...addressValues,
        street: "",
        building: "",
        flat: "",
      });

      setSearchStreet("");
    }
  };
  const handleShowAddAdress = () => {
    setVisibleAddressField(false);
    setShowAddAddressBlock("block");
  };
  const handleChangeGround = (e) => {
    setAddressValues({
      ...addressValues,
      ground: e.target.value,
    });
  };
  const handleSelectElevator = (e) => {
    const options = e.target.options;
    if (options[0].selected) {
      options[0].disabled = true;
    }
    setAddressValues({
      ...addressValues,
      elevator: e.target.value,
    });
  };
  const handleCancelAddAdress = () => {
    if (filteredUserAdresses.length > 0) {
      setShowAddAddressBlock("none");
      setVisibleAddressField(true);
      setAddressValues({
        street: "",
        building: "",
        flat: "",
        ground: "",
        elevator: "Відсутній",
      });
      setSearchStreet("");
    } else {
      setSearchStreet("");
      setAddressValues({
        street: "",
        building: "",
        flat: "",
        ground: "",
        elevator: "Відсутній",
      });
    }
  };
  return (
    <>
      <div>activeAddress</div>
      {JSON.stringify(activeAddress, null, 4)}
      <div>delivery</div>
      {JSON.stringify(delivery, null, 4)}
      <div>SelectedCity</div>
      {JSON.stringify(selectedCity, null, 4)}
      <div>SearchStreet</div>
      {JSON.stringify(searchStreet, null, 4)}
      <div>SelectedStreet</div>
      {JSON.stringify(selectedStreet, null, 4)}
      <div>addressValues</div>
      {JSON.stringify(addressValues, null, 4)}
      <div>userAddresses</div>
      {JSON.stringify(userAddresses, null, 4)}
      <div>filteredUserAdresses</div>
      {JSON.stringify(filteredUserAdresses, null, 4)}
      <div>DeliveryAddressSelected</div>
      {deliveryAddressSelected}
      <Form onSubmit={(e) => e.preventDefault()}>
        <Row className={styles.row}>
          <div className={styles.panel}>
            {" "}
            <div className={styles.count}>2</div>Спосіб доставки
          </div>
        </Row>
        <Row className={styles.delivery}>
          <Form.Group style={{ padding: 0 }}>
            <Form.Label className={styles.form_label} htmlFor="city-name">
              Ваше місто
            </Form.Label>
            <Form.Control
              className={styles.form_input}
              placeholder="Оберіть місто..."
              value={selectedCity ? selectedCity.value : ""}
              name="city"
              onClick={handleSearchCity}
              readOnly={true}
              id="city-name"
              ref={cityRef}
            />
            {/* <Form.Control.Feedback type="invalid">{orderError.shippingError}
                            </Form.Control.Feedback> */}
            <CityModal show={cityModalShow} onClose={handleCityModalClose} />
            {deliveryTypes[0].adresses.some(
              (item) => item.city === selectedCity?.object_name
            ) && (
              <Row>
                <Col>
                  <Form.Check
                    type="radio"
                    className={styles.radio}
                    aria-label="radio 9"
                  >
                    <Form.Check.Input
                      id="selfPickup"
                      name="selfPickup"
                      type="radio"
                      className={styles.rrr}
                      value={deliveryTypes[0].name}
                      onChange={handleChangeDelivery}
                      checked={
                        delivery.deliveryType === `${deliveryTypes[0].name}`
                      }
                    />
                    <Form.Check.Label
                      htmlFor="selfPickup"
                      className={styles.labeltext}
                    >
                      {deliveryTypes[0].name}
                    </Form.Check.Label>
                  </Form.Check>
                </Col>
                <Col className={styles.text_span}>{deliveryTypes[0].price}</Col>
                <Row style={{ display: showSelfPickup }}>
                  <Form.Select
                    className={styles.form_input2}
                    onChange={(e) => handleSelectPickup(e)}
                    ref={selfRef}
                  >
                    <option
                      value="Вибрати адресу відділення..."
                      disabled={true}
                      key="selfpick1"
                    >
                      Вибрати адресу відділення...
                    </option>
                    {deliveryTypes[0].adresses.map(
                      (item, i) =>
                        item.city === selectedCity?.object_name && (
                          <option key={item.id}>
                            {item.cityType}
                            {item.city}, {item.street}
                          </option>
                        )
                    )}
                  </Form.Select>
                </Row>
              </Row>
            )}

            <Row>
              <Col>
                <Form.Check
                  type="radio"
                  className={styles.radio}
                  aria-label="radio 8"
                >
                  <Form.Check.Input
                    name="postmanDelivery"
                    id="postmanDelivery"
                    type="radio"
                    className={styles.rrr}
                    value={deliveryTypes[1].name}
                    onChange={handleChangeDelivery}
                    checked={
                      delivery.deliveryType === `${deliveryTypes[1].name}`
                    }
                  />
                  <Form.Check.Label
                    htmlFor="postmanDelivery"
                    className={styles.labeltext}
                  >
                    {deliveryTypes[1].name}
                  </Form.Check.Label>
                </Form.Check>
              </Col>
              <Col className={styles.text_span}>
                {deliveryTypes[1].price} &#x20b4;
              </Col>
            </Row>
            <Row style={{ display: showPostmanDeliveryAll }}>
              {" "}
              {/* //TODO padding controll */}
              {visibleAddressField ? (
                <div className={styles.group_floor}>
                  <Form.Select
                    className={styles.form_address}
                    name="selectPostmanDelivery"
                    id="selectPostmanDelivery"
                    onChange={(e) => handleSelectPostman(e)}
                    ref={postmanRef}
                    defaultValue={selectedAddress}
                  >
                    {/* <option key ="addressOPt0" value="Вибрати адресу доставки..." disabled={true}>Вибрати адресу доставки...</option>  */}
                    {filteredUserAdresses != null &&
                    filteredUserAdresses.filter(
                      (c) => c.city == selectedCity?.object_name
                    )
                      ? filteredUserAdresses.map((item, index) => (
                          <option
                            key={`${item.address}-${index}`}
                            value={item.address}
                          >
                            {item.address}
                          </option>
                        ))
                      : null}
                  </Form.Select>
                  <Col>
                    <button
                      onClick={handleShowAddAdress}
                      id="btn-add-another-address"
                    >
                      Додати адресу
                    </button>
                  </Col>
                </div>
              ) : null}
              <div
                style={{ display: showAddAddressBlock }}
                className={styles.street_div}
              >
                <Form.Group>
                  <Form.Label className={styles.form_label} htmlFor="street">
                    Вулиця
                  </Form.Label>
                  <Form.Control
                    className={styles.form_floor}
                    type="text"
                    value={searchStreet}
                    name="street"
                    id="street"
                    onChange={(e) => handleStreetChange(e)}
                    ref={selectRef}
                  />
                  {filteredStreets.length > 0 && (
                    <ul className={styles.city_list} id="ulStreetSelect">
                      {filteredStreets.map((street, i) => (
                        <li
                          key={`${street._id}-${i}`}
                          id={street._id}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSelectStreet(street)}
                        >
                          {`${street.street_type} ${street.name}`}
                        </li>
                      ))}
                    </ul>
                  )}
                </Form.Group>
                <div className={styles.flex_row}>
                  <Form.Group controlId="buildingGroup">
                    <Form.Label className={styles.form_label}>
                      Будинок
                    </Form.Label>
                    <Form.Control
                      className={styles.form_floor}
                      name="building"
                      value={addressValues.building}
                      onChange={(e) => handleChangeAdress(e)}
                    />
                  </Form.Group>
                  <Form.Group controlId="flatGroup">
                    <Form.Label className={styles.form_label}>
                      Квартира
                    </Form.Label>
                    <Form.Control
                      className={styles.form_floor}
                      name="flat"
                      value={addressValues.flat}
                      onChange={(e) => handleChangeAdress(e)}
                    />
                  </Form.Group>
                  <button
                    onClick={handleAddAdress}
                    id="btnAddAddress"
                    disabled={isButtonDisabled}
                  >
                    Додати
                  </button>
                  <button
                    onClick={handleCancelAddAdress}
                    id="btnCancelAddAddress"
                  >
                    Скасувати
                  </button>
                </div>
              </div>
              <div className={styles.group_floor}>
                <Form.Group controlId="groundGroup" className={styles.floor}>
                  <Form.Label className={styles.form_label}>Поверх</Form.Label>
                  <Form.Control
                    className={styles.form_floor}
                    name="ground"
                    onChange={handleChangeGround}
                    value={addressValues.ground}
                  />
                </Form.Group>

                <Form.Group controlId="elevatorGroup" className={styles.floor}>
                  <Form.Label className={styles.form_label}>Ліфт</Form.Label>
                  <Form.Select
                    className={styles.form_elevator}
                    name="elevator"
                    id="idElevator"
                    value={addressValues.elevator}
                    onChange={handleSelectElevator}
                  >
                    <option
                      value="Наявність ліфта"
                      disabled={true}
                      id="optEl1"
                      key="optEl1"
                    >
                      Наявність ліфта
                    </option>
                    <option id="optEl2" key="optEl2">
                      Відсутній
                    </option>
                    <option id="optEl3" key="optEl3">
                      Присутній
                    </option>
                  </Form.Select>
                </Form.Group>
              </div>
              <Form.Group
                controlId="formBasicCheckbox"
                className={styles.lift_up}
              >
                <Form.Check type="checkbox" className={styles.checkbox}>
                  <Form.Check.Input
                    className={styles.checkbox_box}
                    type="checkbox"
                  />
                  <Form.Check.Label className={styles.checkbox_label}>
                    Підняти на поверх
                  </Form.Check.Label>
                </Form.Check>
              </Form.Group>
              <div className={styles.shiping_line}></div>
              <Container className={styles.bottom}>
                <Row className={styles.deltime_text}>
                  Вкажіть зручний день та час для доставки
                </Row>
                <Row className={styles.shipping_time}>
                  <button id="kiev">14 травня</button>
                  <button id="kharkiv">15 травня</button>
                  <button id="kharkiv">16 травня</button>
                  <button id="lviv">17 травня</button>
                </Row>
                <Row className={styles.shipping_time}>
                  <button id="frankivsk">10:00-12:00</button>
                  <button id="odesa">12:00-14:00</button>
                  <button id="kharkiv">14:00-16:00</button>
                  <button id="dnipro">16:00-18:00</button>
                </Row>
              </Container>
            </Row>
            <Row>
              <Col>
                <Form.Check
                  type="radio"
                  className={styles.radio}
                  aria-label="radio 6"
                >
                  <Form.Check.Input
                    type="radio"
                    value={deliveryTypes[2].name}
                    name="novaPoshta"
                    id="novaPoshta"
                    className={styles.rrr}
                    checked={
                      delivery.deliveryType === `${deliveryTypes[2].name}`
                    }
                    onChange={handleChangeDelivery}
                  />
                  <Form.Check.Label
                    htmlFor="novaPoshta"
                    className={styles.labeltext}
                  >
                    {deliveryTypes[2].name}
                  </Form.Check.Label>
                </Form.Check>
              </Col>
              <Col className={styles.text_span}>{deliveryTypes[2].price}</Col>
            </Row>
            <Row style={{ display: showNovaPoshtaDelivery }}>
              <Col>
                <Form.Label
                  className={styles.form_label}
                  htmlFor="npdepartment"
                >
                  Введіть адресу відділення
                </Form.Label>
                <Form.Control
                  className={styles.form_input}
                  type="text"
                  name="npdepartment"
                  id="npdepartment"
                  value={deliveryAddressSelected}
                  onChange={(e) => setDeliveryAddressSelected(e.target.value)}
                />
              </Col>
            </Row>
          </Form.Group>
        </Row>
      </Form>
    </>
  );
}
