import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { getTemperatures } from "../firebaseConfig";
import { Layout, Row, Col, Statistic, Card } from "antd";
import React, { useEffect, useState } from "react";
import app from "../firebaseConfig";
import { HeartOutlined } from "@ant-design/icons";

am4core.useTheme(am4themes_animated);

const { Header, Footer, Sider, Content } = Layout;

const GetTemperaturesSnapshot = (userId: string) => {
  const [heartbeats, setHeartbeats] = useState<any[]>();
  const upper_range = 60;
  const lower_range = 90;

  useEffect(() => {
    app
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("heartbeat")
      .orderBy("timestamp", "asc")
      .limit(25)
      .onSnapshot((querySnapshot) => {
        const newHeartbeats: any[] = querySnapshot.docs.map((doc: any) => ({
          value: doc.data().heartbeat,
          date: doc.data().timestamp.toDate(),
          key: doc.id,
          alert:
            doc.data().heartbeat > upper_range ||
            doc.data().heartbeat < lower_range,
        }));

        setHeartbeats(newHeartbeats);
      });
  }, []);

  return heartbeats;
};

const Heartbeat: React.FC = () => {
  const heartbeats = GetTemperaturesSnapshot("000001");
  const [loaded, setLoaded] = useState<boolean>(false);
  const [chart, setChart] = useState<any>();

  const initChart = (temperatures: any[]) => {
    let chart = am4core.create("heartbeatdiv", am4charts.XYChart);

    chart.paddingRight = 20;

    chart.data = temperatures;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.title.text = "Hora";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip!.disabled = true;
    valueAxis.renderer.minWidth = 35;
    valueAxis.title.text = "BPM";

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";

    series.tooltipText = "{valueY.value} BPM";
    chart.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    setChart(chart);
  };

  useEffect(() => {
    if (heartbeats && !loaded) {
      initChart(heartbeats);
      setLoaded(true);
    }
  }, [heartbeats]);

  useEffect(() => {
    getTemperatures("000001")
      .then((docs: any) => {})
      .catch((e) => {
        console.error(e);
      });

    return function clean() {
      let newChart = chart;
      if (newChart) newChart.dispose();
    };
  }, []);
  return (
    <Content>
      <Row align="middle" justify="center">
        <Col xs={6} sm={12} md={12}>
          <h1>
            <HeartOutlined /> Pulso cardíaco
          </h1>
        </Col>

        {heartbeats && (
          <Col xs={12} sm={6} md={6} lg={6} xl={4}>
            <Card>
              {heartbeats[heartbeats.length - 1].alert ? (
                <Statistic
                  value={heartbeats[heartbeats.length - 1].value}
                  suffix="bpm"
                />
              ) : (
                <Statistic
                  valueStyle={{ color: "#cf1322" }}
                  value={heartbeats[heartbeats.length - 1].value}
                  suffix="bpm"
                />
              )}
            </Card>
          </Col>
        )}
      </Row>
      <Row>
        <div id="heartbeatdiv" style={{ width: "100%", height: "500px" }}></div>
      </Row>
    </Content>
  );
};

export default Heartbeat;
