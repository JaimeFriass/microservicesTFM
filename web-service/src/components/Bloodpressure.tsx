import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { getTemperatures } from "../firebaseConfig";
import { Layout, Row, Col, Statistic, Card } from "antd";
import React, { useEffect, useState } from "react";
import app from "../firebaseConfig";
import {
  HeartOutlined,
  DotChartOutlined,
  ExpandAltOutlined,
} from "@ant-design/icons";

am4core.useTheme(am4themes_animated);

const { Header, Footer, Sider, Content } = Layout;

const GetBloodpressureSnapshot = (userId: string) => {
  const [bloodpressure, setGlucose] = useState<any[]>();

  const upper_range = 90;
  const lower_range = 60;

  useEffect(() => {
    app
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("bloodpressure")
      .orderBy("timestamp", "asc")
      .limit(25)
      .onSnapshot(
        (querySnapshot) => {
          const newBloodpressure: any[] = querySnapshot.docs.map(
            (doc: any) => ({
              value: doc.data().bloodpressure,
              date: doc.data().timestamp.toDate(),
              key: doc.id,
              alert:
                doc.data().bloodpressure > upper_range ||
                doc.data().bloodpressure < lower_range,
            })
          );

          console.log("NEWBLOOD", newBloodpressure);
          setGlucose(newBloodpressure);
        },
        (e: any) => {
          console.error(e);
        }
      );
  }, []);

  return bloodpressure;
};

const Bloodpressure: React.FC = () => {
  const bloodpressure = GetBloodpressureSnapshot("000001");
  const [loaded, setLoaded] = useState<boolean>(false);
  const [chart, setChart] = useState<any>();

  const initChart = (temperatures: any[]) => {
    let chart = am4core.create("bloodpressurediv", am4charts.XYChart);

    chart.paddingRight = 20;

    chart.data = temperatures;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.title.text = "Hora";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip!.disabled = true;
    valueAxis.renderer.minWidth = 35;
    valueAxis.title.text = "mmHg";

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";

    series.tooltipText = "{valueY.value} mmHg";
    chart.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    setChart(chart);
  };

  useEffect(() => {
    if (bloodpressure && !loaded) {
      initChart(bloodpressure);
      setLoaded(true);
    }
  }, [bloodpressure]);

  return (
    <Content>
      <Row align="middle" justify="center">
        <Col xs={6} sm={12} md={12}>
          <h1>
            <ExpandAltOutlined /> Presión sanguínea
          </h1>
        </Col>

        {bloodpressure && bloodpressure.length != 0 && (
          <Col xs={12} sm={6} md={6} lg={6} xl={4}>
            <Card>
              {bloodpressure[bloodpressure.length - 1].alert! ? (
                <Statistic
                  valueStyle={{ color: "#cf1322" }}
                  value={bloodpressure[bloodpressure.length - 1].value}
                  suffix="mmHg"
                />
              ) : (
                <Statistic
                  value={bloodpressure[bloodpressure.length - 1].value}
                  suffix="mmHg"
                />
              )}
            </Card>
          </Col>
        )}
      </Row>
      <Row>
        <div
          id="bloodpressurediv"
          style={{ width: "100%", height: "500px" }}
        ></div>
      </Row>
    </Content>
  );
};

export default Bloodpressure;
