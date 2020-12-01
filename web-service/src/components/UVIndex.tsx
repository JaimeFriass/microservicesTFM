import React, { useState, useEffect } from "react";
import app from "../firebaseConfig";
import { Card, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const GetUVIndexSnapshot = (userId: string) => {
  const [UVIndex, setUVIndex] = useState<any>();

  useEffect(() => {
    const unsubscribe = app
      .firestore()
      .collection("users")
      .doc("000001")
      .collection("uvindex")
      .orderBy("timestamp", "asc")
      .limit(20)
      .onSnapshot(
        (querySnapshot) => {
          const doc = querySnapshot.docs[querySnapshot.docs.length - 1];

          if (doc) {
            let direction = true;
            if (UVIndex) {
              direction = doc.data().index > UVIndex.index;
            }
            const newUVIndex = {
              index: doc.data().uvindex,
              id: doc.id,
              timestamp: doc.data().timestamp,
              direction: direction,
            };

            console.log("newUVIndex", newUVIndex);

            setUVIndex(newUVIndex);
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

  return UVIndex;
};

const UVIndex: React.FC = () => {
  const UVIndex = GetUVIndexSnapshot("000001");
  return (
    <>
      {UVIndex && (
        <>
          <Card>
            {UVIndex.direction ? (
              <Statistic
                title="Índice rayos UV"
                value={UVIndex.index}
                valueStyle={{ color: "#cf1322" }}
                prefix={<ArrowUpOutlined />}
              />
            ) : (
              <Statistic
                title="Índice rayos UV"
                value={UVIndex.index}
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

export default UVIndex;
