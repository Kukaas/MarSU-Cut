import { Layout, Row, Col, Typography } from "antd";
import {
  FacebookFilled,
  InstagramFilled,
  TwitterOutlined,
  EnvironmentFilled,
  PhoneFilled,
  MailFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Footer } = Layout;

const ResponsiveFooter = () => {
  return (
    <Footer className="bg-gray-200 text-black p-8 dark:bg-slate-900 dark:text-white">
      <div className="flex-1 mb-4 text-center sm:text-left ">
        <Link
          to="/"
          className="font-bold hover:text-current text-3xl text-center sm:text-left"
        >
          <span className="px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            MarSU
          </span>{" "}
          Cut
        </Link>
      </div>
      <Row
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        className="mb-8 dark:text-white"
      >
        <Col className="gutter-row p-2" xs={24} sm={12} md={12} lg={6}>
          <div className="text-center sm:text-left">
            <Typography.Title level={4} className="dark:text-white">
              About Us
            </Typography.Title>
            <p>We are a team of talented designers making the best design</p>
          </div>
        </Col>
        <Col
          className="gutter-row p-2 cursor-pointer"
          xs={24}
          sm={12}
          md={12}
          lg={6}
        >
          <div className="text-center sm:text-left ">
            <Typography.Title level={4} className="dark:text-white">
              Contact Us
            </Typography.Title>
            <a
              href="https://maps.app.goo.gl/v2Xs3dUa335hUNRc7"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="hover:text-blue-500 hover:underline">
                <EnvironmentFilled className="text-green-500 mr-1" /> Tanza,
                Boac, Marinduqe, Philiphines
              </p>
            </a>
            <p
              className="hover:text-blue-500 hover:underline"
              onClick={() => (window.location.href = "sms:+6390382322343")}
            >
              <PhoneFilled className="text-blue-500 mr-1" /> +63 9038 232 2343
            </p>
            <p
              className="hover:text-blue-500 hover:underline cursor-pointer"
              onClick={() =>
                window.open(
                  "https://mail.google.com/mail/?view=cm&fs=1&to=msc.garments@gmail.com",
                  "_blank"
                )
              }
            >
              <MailFilled className="text-red-500 mr-1" />{" "}
              msc.garments@gmail.com
            </p>
          </div>
        </Col>
        <Col className="gutter-row p-2" xs={24} sm={12} md={24} lg={6}>
          <div className="text-center sm:text-left">
            <Typography.Title level={4} className="dark:text-white">
              Business Hours
            </Typography.Title>
            <p>Monday - Thursday:</p>
            <p>7:30:00 AM - 11:30 AM : Measurements</p>
            <p>12:30 PM - 4:30 PM : Claiming</p>
            <p>Friday: No Transactions</p>
            <p>Sunday: Closed</p>
          </div>
        </Col>
        <Col className="gutter-row p-2" xs={24} sm={12} md={24} lg={6}>
          <div className="text-center sm:text-left">
            <Typography.Title level={4} className="dark:text-white">
              Social Media
            </Typography.Title>
            <div className="flex justify-center sm:justify-start">
              <FacebookFilled className="mx-2 text-xl text-blue-600" />
              <InstagramFilled className="mx-2 text-xl text-pink-500" />
              <TwitterOutlined className="mx-2 text-xl text-blue-400" />
            </div>
          </div>
        </Col>
      </Row>
      <hr className="my-4 border-gray-400 " />
      <div className="text-center">
        <p className="text-gray-600 dark:text-white">
          &copy; {new Date().getFullYear()} Stitch Perfect. All Rights Reserved.
        </p>
      </div>
    </Footer>
  );
};

export default ResponsiveFooter;
