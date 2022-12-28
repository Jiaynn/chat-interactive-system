import React from "react";
import "./index.css";
import { Layout } from "@arco-design/web-react";
import { useNavigate } from "react-router-dom";
const Sider = Layout.Sider;
const Header = Layout.Header;
const Footer = Layout.Footer;
const Content = Layout.Content;

export default function Chat() {
  const navigate = useNavigate();
  function handleLoginOut() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <div className="container">
      <div className="title">在线互动聊天系统</div>

      <Layout className="wrapper">
        <Header className="header">
          <span>用户：李佳燕</span>
          <span onClick={handleLoginOut}>退出登录</span>
        </Header>
        <Layout>
          <Content className="chat">
            <div className="chat-content"></div>
            <div className="chat-ipt">
              <textarea></textarea>
              <button>发 送</button>
            </div>
          </Content>
          <Sider className="friend-container">
            <div className="firend-title">好友列表</div>
            
            <ul></ul>
          </Sider>
        </Layout>
      </Layout>
    </div>
  );
}
