import React, { useState, useEffect } from "react";
import app from "../firebaseConfig";
import { Card, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const GetAirQualitySnapshot = (userId: string) => {
  const [airQuality, setAirQuality] = useState<any>();

  useEffect(() => {
    const unsubscribe = app
      .firestore()
      .collection("users")
      .doc("000001")
      .collection("airquality")
      .orderBy("timestamp", "asc")
      .limit(10)
      .onSnapshot(
        (querySnapshot) => {
          console.log("useeffect");
          const doc = querySnapshot.docs[querySnapshot.docs.length - 1];

          if (doc) {
            let direction = true;
            if (airQuality) {
              direction = doc.data().index > airQuality.index;
            }
            const newAirQuality = {
              index: doc.data().airquality,
              id: doc.id,
              timestamp: doc.data().timestamp,
              direction: direction,
            };

            console.log("newAirQuality", newAirQuality);

            setAirQuality(newAirQuality);
          }
        },
        (e: any) => {
          console.error(e);
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

  return airQuality;
};

const AirQuality: React.FC = () => {
  const airQuality = GetAirQualitySnapshot("000001");
  return (
    <>
      {airQuality && (
        <>
          <Card>
            {airQuality.direction ? (
              <Statistic
                title="Calidad del aire"
                value={airQuality.index}
                valueStyle={{ color: "#cf1322" }}
                prefix={<ArrowUpOutlined />}
              />
            ) : (
              <Statistic
                title="Calidad del aire"
                value={airQuality.index}
                valueStyle={{ color: "#3f8600" }}
                prefix={<ArrowDownOutlined />}
              />
            )}
          </Card>
        </>
      )}
    </>
  );
};

export default AirQuality;
