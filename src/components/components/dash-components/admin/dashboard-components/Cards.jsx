import { Col } from "antd";
import { useState } from "react";
import CardLoading from "./CardLoading";
import { DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./CustomCard";

const Cards = () => {
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 2000);
  return (
    <div className="w-full flex">
      <Col xs={24} sm={12} md={12} lg={6}>
        {loading ? (
          <CardLoading />
        ) : (
          <Card className="w-full p-4">
            <CardContent>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Total Revenue</CardTitle>
                  <DollarSign />
                </div>
              </CardHeader>
              <CardContent className="mt-4">
                <div>
                  <span className="text-3xl font-bold">$45,231.89</span>
                  <CardDescription className="text-green-500 mt-2 text-sm">
                    +20.1% from last month
                  </CardDescription>
                </div>
              </CardContent>
            </CardContent>
          </Card>
        )}
      </Col>
      <Col xs={24} sm={12} md={12} lg={6}>
        {loading ? (
          <CardLoading />
        ) : (
          <Card className="w-full p-4 xs:mt-4">
            <CardContent>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Total Revenue</CardTitle>
                  <DollarSign />
                </div>
              </CardHeader>
              <CardContent className="mt-4">
                <div>
                  <span className="text-3xl font-bold">$45,231.89</span>
                  <CardDescription className="text-green-500 mt-2 text-sm">
                    +20.1% from last month
                  </CardDescription>
                </div>
              </CardContent>
            </CardContent>
          </Card>
        )}
      </Col>
      <Col xs={24} sm={12} md={12} lg={6}>
        {loading ? (
          <CardLoading />
        ) : (
          <Card className="w-full p-4">
            <CardContent>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Total Revenue</CardTitle>
                  <DollarSign />
                </div>
              </CardHeader>
              <CardContent className="mt-4">
                <div>
                  <span className="text-3xl font-bold">$45,231.89</span>
                  <CardDescription className="text-green-500 mt-2 text-sm">
                    +20.1% from last month
                  </CardDescription>
                </div>
              </CardContent>
            </CardContent>
          </Card>
        )}
      </Col>
      <Col xs={24} sm={12} md={12} lg={6}>
        {loading ? (
          <CardLoading />
        ) : (
          <Card className="w-full p-4">
            <CardContent>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Total Revenue</CardTitle>
                  <DollarSign />
                </div>
              </CardHeader>
              <CardContent className="mt-4">
                <div>
                  <span className="text-3xl font-bold">$45,231.89</span>
                  <CardDescription className="text-green-500 mt-2 text-sm">
                    +20.1% from last month
                  </CardDescription>
                </div>
              </CardContent>
            </CardContent>
          </Card>
        )}
      </Col>
    </div>
  );
};

export default Cards;
