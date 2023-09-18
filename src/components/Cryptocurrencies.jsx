import React, { useEffect, useState } from "react";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Col, Row, Statistic, Input, Divider } from "antd";
import { useGetCryptosQuery } from "../services/cryptoApi";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const Cryptocurrencies = ({ simplified }) => {
  const count = simplified ? 10 : 100;
  const {
    data: allCryptos,
    isFetching,
    isSuccess,
  } = useGetCryptosQuery(count);
  const [cryptos, setCryptos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setCryptos(allCryptos?.data?.coins);
    }
    if (search.length > 0) {
      const filteredData = allCryptos?.data?.coins.filter((item) =>
        item.name.toLowerCase().includes(search)
      );
      setCryptos(filteredData);
    }
  }, [count, search, isSuccess, allCryptos?.data?.coins]);

  if (isFetching)
    return (
      <div className="home-container flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    <>
      {!simplified && <Divider orientation="left">Cryptocurrencies</Divider>}
      <Row>
        {!simplified && (
          <Col className="search-crypto" xxl={10} xl={12} lg={14} sm={24}>
            <Input
              placeholder="Search Cryptocurrency"
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
          </Col>
        )}
      </Row>
      <Row className="mt-9" gutter={[8, 40]}>
        {cryptos?.map((crypto) => {
          return (
            <Col
              key={crypto.uuid}
              xxl={6}
              xl={8}
              xs={24}
              sm={12}
              md={12}
              lg={8}
            >
              <Link key={crypto.uuid} to={`/crypto/${crypto.uuid}`}>
                <Card
                  className="card-container crypto-card hover:brightness-110"
                  hoverable={true}
                  bordered
                >
                  <Avatar
                    className="crypto-logo"
                    size={50}
                    src={crypto.iconUrl}
                  />
              
                  <div className="flex justify-center items-center">
                    <div className="flex items-start gap-1 flex-col">
                      <h5 className="text-lg font-medium text-gray-300 ">
                        {crypto.symbol}
                      </h5>
                      <h5 className="text-xs font-regular text-white">
                        {crypto.name}
                      </h5>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 stat-cont">
                    <Statistic
                      title="Coin Price (USD)"
                      value={parseFloat(crypto.price).toFixed(4)}
                    />
                    <div className="stat">
                      <Statistic
                        value={crypto.change}
                        precision={2}
                        valueStyle={{
                          color: crypto.change >= 0 ? "#00C287" : "#E72D04",
                        }}
                        prefix={
                          crypto.change >= 0 ? (
                            <ArrowUpOutlined />
                          ) : (
                            <ArrowDownOutlined />
                          )
                        }
                        suffix="%"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <ResponsiveContainer width="95%" height={150}>
                      <LineChart
                        data={crypto.sparkline.map((x) => ({ value: x }))}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorUv"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#934ACa" />
                            <stop offset="50%" stopColor="#7517CE" />
                            <stop offset="100%" stopColor="#E323FF" />
                          </linearGradient>
                          <linearGradient
                            id="colorUv2"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#4DFFDF" />
                            <stop offset="50%" stopColor="#4EFFDF" />
                            <stop offset="100%" stopColor="#4DA1FF" />
                          </linearGradient>
                        </defs>
                        <YAxis
                          domain={["dataMin", "dataMax"]}
                          tick={false}
                          hide
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={
                            crypto.change >= 0
                              ? "url(#colorUv2)"
                              : "url(#colorUv)"
                          }
                          strokeWidth={2.5}
                          fill="#8884d8"
                          dot={false}
                          domain={["dataMin", "dataMax"]}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Link>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default Cryptocurrencies;