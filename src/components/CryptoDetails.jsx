import {
  Avatar,
  Card,
  Divider,
  Row,
  Typography,
  Col,
  Statistic,
  Table,
  Select,
} from "antd";
import millify from "millify";
import { useParams } from "react-router-dom";
import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from "../services/cryptoApi";
import HTMLReactParser from "html-react-parser";
import {
  MoneyCollectOutlined,
  DollarCircleOutlined,
  FundOutlined,
  ExclamationCircleOutlined,
  TrophyOutlined,
  NumberOutlined,
  ThunderboltOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import LineChart from "./LineChart";
import Loader from "./Loader";

const { Title } = Typography;
const CryptoDetails = () => {
  const { coinId } = useParams();
  const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
  const [timePeriod, setTimePeriod] = useState("24h");
  const { data: coinHistory } = useGetCryptoHistoryQuery({ coinId, timePeriod });

  const coinDetails = data?.data?.coin;


  if (isFetching)
    return (
      <div className="home-container flex justify-center items-center">
        <Loader />
      </div>


    );



  const stats = [
    {
      title: "Price to USD",
      value: `$ ${coinDetails?.price && millify(coinDetails?.price)}`,
      icon: <DollarCircleOutlined />,
    },
    { title: "Rank", value: coinDetails?.rank, icon: <NumberOutlined /> },
    {
      title: "24h Volume",
      value: `$ ${coinDetails?.["24hVolume"] && millify(coinDetails?.["24hVolume"])
        }`,
      icon: <ThunderboltOutlined />,
    },
    {
      title: "Market Cap",
      value: `$ ${coinDetails?.marketCap && millify(coinDetails?.marketCap)}`,
      icon: <DollarCircleOutlined />,
    },
    {
      title: "All-time-high(daily avg.)",
      value: `$ ${coinDetails?.allTimeHigh?.price &&
        millify(coinDetails?.allTimeHigh?.price)
        }`,
      icon: <TrophyOutlined />,
    },
  ];

  const genericStats = [
    {
      title: "Number Of Markets",
      value: coinDetails?.numberOfMarkets,
      icon: <FundOutlined />,
    },
    {
      title: "Number Of Exchanges",
      value: coinDetails?.numberOfExchanges,
      icon: <MoneyCollectOutlined />,
    },
    {
      title: "BTC Price",
      value:
        coinDetails?.btcPrice && parseFloat(coinDetails?.btcPrice).toFixed(2),
      icon: <ExclamationCircleOutlined />,
    },
    {
      title: "Total Supply",
      value: `$ ${coinDetails?.supply?.total && millify(coinDetails?.supply?.total)
        }`,
      icon: <ExclamationCircleOutlined />,
    },
    {
      title: "Circulating Supply",
      value: `$ ${coinDetails?.supply?.circulating &&
        millify(coinDetails?.supply?.circulating)
        }`,
      icon: <ExclamationCircleOutlined />,
    },
  ];

  const columns = [
    {
      title: "Social",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Handle",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Link",
      dataIndex: "url",
      key: "url",
      // responsive: ["lg"],
      render: (text) => (
        <a href={text} target="_blank" className="break-all" rel="noreferrer">
          {text}
        </a>
      ),
    },
  ];



  return (
    <>
      <Row>
        <div className="flex justify-between items-center gap-2">
          <Title level={3} style={{ marginBottom: "0" }} className="coin-name">
            {coinDetails?.name} ({data?.data?.coin.symbol}){" "}
            <Avatar size="large" src={coinDetails?.iconUrl} />
          </Title>
          <div className="stat">
            <Statistic
              value={coinDetails?.change}
              precision={2}
              valueStyle={{
                color: coinDetails?.change >= 0 ? "#00C287" : "#E72D04",
              }}
              prefix={
                coinDetails?.change >= 0 ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
              suffix="%"
            />
          </div>
        </div>
       

        <Col span={24}>
          <Select
            defaultValue={"24h"}
            style={{ width: 120 }}
            placeholder="Select Timeperiod"
            onChange={(value) => setTimePeriod(value)}
            options={[
              {
                value: "3h",
                label: "3h",
              },
              {
                value: "24h",
                label: "24h",
              },
              {
                value: "7d",
                label: "7d",
              },
              {
                value: "30d",
                label: "30d",
              },
              {
                value: "3m",
                label: "3m",
              },
              {
                value: "1y",
                label: "1y",
              },


            ]}

          />
         
        <LineChart coinHistory={coinHistory} currentPrice={millify(coinDetails?.price)} coinName={coinDetails?.name} />
      </Col>

      <Divider orientation="left">
        {coinDetails?.name} live statistics in US Dollars (USD)
      </Divider>
      <Col span={24}>
        <Card
          className="card-container"
          title={`${coinDetails?.name} Value Statistics`}
        >
          <Row gutter={8}>
            {stats.map(({ icon, title, value }, index) => (
              <Col key={index} lg={8} xl={6} xxl={4} sm={12}>
                <Col>
                  <Statistic title={(icon, title)} value={value}></Statistic>
                </Col>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>

      <Col span={24}>
        <Card
          className="card-container mt-6"
          title={`${coinDetails?.name} Generic Statistics`}
        >
          <Row gutter={8}>
            {genericStats.map(({ icon, title, value }, index) => (
              <Col lg={8} xl={6} xxl={4} sm={12} key={index}>
                <Col>
                  <Statistic title={(icon, title)} value={value}></Statistic>
                </Col>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>

      <Divider orientation="left">What is {coinDetails?.name}?</Divider>
      <Col span={24} className="text-gray-100 parsed">
        {HTMLReactParser(coinDetails?.description)}

      </Col>
      <Divider orientation="left">{coinDetails?.name} Links</Divider>
      <Table
        pagination={false}
        columns={columns}
        dataSource={coinDetails?.links}
        rowKey="url"
      />
    </Row>
    </>
  );
};

export default CryptoDetails;
//htmlparser