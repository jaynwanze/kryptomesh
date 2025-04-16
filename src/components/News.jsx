import React, { useState } from 'react';
import { Select, Typography, Row, Col, Avatar, Card } from 'antd';
import moment from 'moment';

import { useGetCryptosQuery } from '../services/cryptoApi';
import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';
import Loader from './Loader';

const demoImage =
  'https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News';

const { Text, Title } = Typography;
const { Option } = Select;

const News = ({ simplified }) => {
  const [newsCategory, setNewsCategory] = useState('Cryptocurrency');

  const { data: cryptosData } = useGetCryptosQuery(100);

  const { data: cryptoNews, isFetching, error } = useGetCryptoNewsQuery({
    query: newsCategory,
    limit: simplified ? 6 : 12,
  });

  if (isFetching) return <Loader />;
  if (error) return <p>Unable to fetch news.</p>;
  if (!cryptoNews?.data?.length) return <p>No news found.</p>;

  return (
    <Row gutter={[24, 24]}>
      {!simplified && (
        <Col span={24}>
          <Select
            showSearch
            className="select-news"
            placeholder="Select a Crypto"
            optionFilterProp="children"
            onChange={(value) => setNewsCategory(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="Cryptocurrency">Cryptocurrency</Option>
            {cryptosData?.data?.coins?.map((coin) => (
              <Option key={coin.name} value={coin.name}>
                {coin.name}
              </Option>
            ))}
          </Select>
        </Col>
      )}

      {cryptoNews.data.map((news, i) => (
        <Col xs={24} sm={12} lg={8} key={i}>
          <Card hoverable className="news-card">
            <a href={news.link} target="_blank" rel="noreferrer">
              <div className="news-image-container">
                <Title className="news-title" level={4}>
                  {news.title}
                </Title>
                <img
                  src={news.photo_url || news.thumbnail_url || demoImage}
                  alt="news thumbnail"
                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                />
              </div>

              <p>
                {news.snippet.length > 100
                  ? `${news.snippet.substring(0, 100)}…`
                  : news.snippet}
              </p>

              <div className="provider-container">
                <div>
                  <Avatar
                    src={news.source_logo_url || demoImage}
                    alt="source logo"
                  />
                  <Text className="provider-name">{news.source_name}</Text>
                </div>
                <Text>
                  {moment(news.published_datetime_utc).fromNow()}
                </Text>
              </div>
            </a>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default News;
