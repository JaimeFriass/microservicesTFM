import React from "react";
import "./App.css";
import { Layout, Row, Col, Menu } from "antd";
import Temperature from "./components/Temperature";
import Heartbeat from "./components/Heartbeat";
import AirQuality from "./components/AirQuality";
import Glucose from "./components/Glucose";
import UVIndex from "./components/UVIndex";
import Bloodpressure from "./components/Bloodpressure";
import Health from "./components/Health";
function App() {
  const { Header, Content } = Layout;

  return (
    <Layout>
      <Header>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">Inicio</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ marginTop: "15px" }}>
        <Row justify="center">
          <Col sm={6} md={6} lg={4} xl={3}>
            <AirQuality />
          </Col>
          <Col sm={8} md={8} lg={6} xl={4}>
            <Health />
          </Col>
          <Col sm={6} md={6} lg={4} xl={3}>
            <UVIndex />
          </Col>
        </Row>
        <Row justify="center">
          <Col sm={24} md={12} lg={12} xl={12} xxl={6}>
            <Temperature />
          </Col>
          <Col sm={24} md={12} lg={12} xl={12} xxl={6}>
            <Heartbeat />
          </Col>
          <Col sm={24} md={12} lg={12} xl={12} xxl={6}>
            <Glucose />
          </Col>
          <Col sm={24} md={12} lg={12} xl={12} xxl={6}>
            <Bloodpressure />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;
