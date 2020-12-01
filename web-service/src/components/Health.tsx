import React, { useState, useEffect } from "react";
import app from "../firebaseConfig";
import { Card, Statistic } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckOutlined,
} from "@ant-design/icons";

const GetHealthSnapshot = (userId: string) => {
  const [health, setHealth] = useState<any>();

  useEffect(() => {
    const unsubscribe = app
      .firestore()
      .collection("users")
      .doc("000001")
      .collection("composer")
      .orderBy("timestamp", "asc")
      .limit(1)
      .onSnapshot(
        (querySnapshot) => {
          const doc = querySnapshot.docs[querySnapshot.docs.length - 1];

          if (doc) {
            const newHealth = {
              composer: doc.data().composer,
              id: doc.id,
              timestamp: doc.data().timestamp,
            };

            setHealth(newHealth);
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

  return health;
};

const Health: React.FC = () => {
  const health = GetHealthSnapshot("000001");
  return (
    <>
      {health && (
        <>
          <Card>
            {health.composer == 100 ? (
              <Statistic
                title="Nivel de salud"
                value={health.composer + "%"}
                valueStyle={{ color: "#cf1322" }}
                prefix={<CheckOutlined />}
              />
            ) : health.composer > 74 ? (
              <Statistic
                title="Nivel de salud"
                value={health.composer + "%"}
                valueStyle={{ color: "#3f8600" }}
              />
            ) : health.composer > 49 ? (
              <Statistic
                title="Nivel de salud"
                value={health.composer + "%"}
                valueStyle={{ color: "#3f8600" }}
              />
            ) : (
              <Statistic
                title="Nivel de salud"
                value={health.composer + "%"}
                valueStyle={{ color: "#3f8600" }}
              />
            )}
          </Card>
        </>
      )}
    </>
  );
};

export default Health;
