import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { getTemperatures } from "../firebaseConfig";
import { Layout, Row, Col, Statistic, Card } from "antd";
import React, { useEffect, useState } from "react";
import app from "../firebaseConfig";
import { HeartOutlined, DotChartOutlined } from "@ant-design/icons";

am4core.useTheme(am4themes_animated);

const { Header, Footer, Sider, Content } = Layout;

const GetGlucoseSnapshot = (userId: string) => {
  const [glucose, setGlucose] = useState<any[]>();
  const upper_range = 110;
  const lower_range = 70;

  useEffect(() => {
    app
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("glucose")
      .orderBy("timestamp", "asc")
      .limit(20)
      .onSnapshot((querySnapshot) => {
        const newGlucose: any[] = querySnapshot.docs.map((doc: any) => ({
          value: doc.data().glucose,
          date: doc.data().timestamp.toDate(),
          key: doc.id,
          alert:
            doc.data().glucose > upper_range ||
            doc.data().glucose < lower_range,
        }));
        setGlucose(newGlucose);
      });
  }, []);

  return glucose;
};

const Glucose: React.FC = () => {
  const glucose = GetGlucoseSnapshot("000001");
  const [loaded, setLoaded] = useState<boolean>(false);
  const [chart, setChart] = useState<any>();

  const initChart = (temperatures: any[]) => {
    let chart = am4core.create("glucosediv", am4charts.XYChart);

    chart.paddingRight = 20;

    chart.data = temperatures;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.title.text = "Hora";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip!.disabled = true;
    valueAxis.renderer.minWidth = 35;
    valueAxis.title.text = "mg/dl";

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";

    series.tooltipText = "{valueY.value} mg/dl";
    chart.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    setChart(chart);
  };

  useEffect(() => {
    if (glucose && !loaded) {
      initChart(glucose);
      setLoaded(true);
    }
  }, [glucose]);

  return (
    <Content>
      <Row align="middle" justify="center">
        <Col xs={6} sm={12} md={12}>
          <h1>
            <DotChartOutlined /> Niveles de glucosa
          </h1>
        </Col>

        {glucose && (
          <Col xs={12} sm={6} md={6} lg={6} xl={4}>
            <Card>
              {glucose[glucose.length - 1].alert ? (
                <Statistic
                  valueStyle={{ color: "#cf1322" }}
                  value={glucose[glucose.length - 1].value}
                  suffix="mg/dl"
                />
              ) : (
                <Statistic
                  value={glucose[glucose.length - 1].value}
                  suffix="mg/dl"
                />
              )}
            </Card>
          </Col>
        )}
      </Row>
      <Row>
        <div id="glucosediv" style={{ width: "100%", height: "500px" }}></div>
      </Row>
    </Content>
  );
};

export default Glucose;
