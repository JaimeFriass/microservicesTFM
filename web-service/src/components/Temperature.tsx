import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { getTemperatures } from "../firebaseConfig";
import { Layout, Row, Col, Card, Statistic } from "antd";
import React, { useEffect, useState } from "react";
import app from "../firebaseConfig";
import { FireOutlined } from "@ant-design/icons";

am4core.useTheme(am4themes_animated);

const { Header, Footer, Sider, Content } = Layout;

const GetTemperaturesSnapshot = (userId: string) => {
  const [temperatures, setTemperatures] = useState<any[]>();
  const upper_range = 37;
  const lower_range = 35;
  useEffect(() => {
    app
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("temperature")
      .orderBy("timestamp", "asc")
      .limit(25)
      .onSnapshot((querySnapshot) => {
        const newTemperatures: any[] = querySnapshot.docs.map((doc: any) => ({
          value: doc.data().temperature,
          date: doc.data().timestamp.toDate(),
          key: doc.id,
          alert:
            doc.data().temperature > upper_range ||
            doc.data().temperature < lower_range,
        }));

        setTemperatures(newTemperatures);
      });
  }, []);

  return temperatures;
};

const Temperature: React.FC = () => {
  const temperatures = GetTemperaturesSnapshot("000001");

  const [loaded, setLoaded] = useState<boolean>(false);
  const [chart, setChart] = useState<any>();

  const initChart = (temperatures: any[]) => {
    let chart = am4core.create("chartdiv", am4charts.XYChart);

    chart.paddingRight = 20;

    chart.data = temperatures;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.title.text = "Hora";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip!.disabled = true;
    valueAxis.renderer.minWidth = 35;
    valueAxis.title.text = "Grados";

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";

    series.tooltipText = "{valueY.value}º";
    chart.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    setChart(chart);
  };

  useEffect(() => {
    if (temperatures && !loaded) {
      initChart(temperatures);
      setLoaded(true);
    }
  }, [temperatures]);

  return (
    <Content>
      <Row align="middle" justify="center">
        <Col xs={6} sm={12} md={12}>
          <h1>
            <FireOutlined /> Temperatura
          </h1>
        </Col>
        {temperatures && (
          <Col xs={12} sm={6} md={6} lg={6} xl={4}>
            <Card>
              {temperatures[temperatures.length - 1].alert ? (
                <Statistic
                  valueStyle={{ color: "#cf1322" }}
                  value={temperatures[temperatures.length - 1].value + "º"}
                />
              ) : (
                <Statistic
                  value={temperatures[temperatures.length - 1].value + "º"}
                />
              )}
            </Card>
          </Col>
        )}
      </Row>
      <Row>
        <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
      </Row>
    </Content>
  );
};

export default Temperature;
