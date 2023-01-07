import React, { useEffect, useRef, useState } from "react";
import "./index.css";

import { useLocation, useNavigate } from "react-router-dom";

const Sider = Layout.Sider;
const Header = Layout.Header;
const Footer = Layout.Footer;
const Content = Layout.Content;
import {
  Empty,
  Layout,
  Menu,
  Message,
  Modal,
  Form,
  Input,
} from "@arco-design/web-react";
import {
  IconHome,
  IconCalendar,
  IconExclamation,
  IconPlus,
} from "@arco-design/web-react/icon";
import { addFriend, deleteFriend, getFriend } from "../../service";
import { io } from "socket.io-client";
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

const collapsedWidth = 60;
const normalWidth = 220;
export default function Chat() {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log("state", state);
  const socket = io("ws://127.0.0.1:3007");
  socket.on("connect", () => {
    console.log(socket.connected);
  });
  const [collapsed, setCollapsed] = useState(false);
  const [siderWidth, setSiderWidth] = useState(normalWidth);

  const onCollapse = (collapsed: any) => {
    setCollapsed(collapsed);
    setSiderWidth(collapsed ? collapsedWidth : normalWidth);
  };

  const handleMoving = (
    _: any,
    {
      width,
    }: {
      width: any;
    }
  ) => {
    if (width > collapsedWidth) {
      setSiderWidth(width);
      setCollapsed(!(width > collapsedWidth + 20));
    } else {
      setSiderWidth(collapsedWidth);
      setCollapsed(true);
    }
  };
  const [friendList, setFriendList] = useState<any[]>([]);
  const firend = useRef<any>();
  const [isEmpty, setIsEmpty] = useState(true);
  useEffect(() => {
    //请求获取好友列表
    let getFriendList = async () => {
      firend.current = await getFriend(state.user.qq);
      console.log("好友", firend.current.message);

      if (Array.isArray(firend.current.message)) {
        setFriendList(firend.current.message);
        setIsEmpty(false);
      }
    };
    getFriendList();
  }, []);
  //添加好友
  const [isAddFriend, setIsAddFriend] = useState(false);
  const AddRes = useRef<any>();
  const FormItem = Form.Item;
  const [form] = Form.useForm();
  function onOk(e: any) {
    form.validate().then(async (res) => {
      console.log(res);
      AddRes.current = await addFriend({
        qq: state.user.qq,
        friendNumber: res.qq,
      });
      if (AddRes.current.message == "该用户未注册！") {
        Message.error("该用户未注册!");
      } else if (AddRes.current.message == "添加好友成功") {
        Message.success("添加好友成功!");
        setIsAddFriend(false);
        firend.current = await getFriend(state.user.qq);
        console.log(firend.current.message);
        if (Array.isArray(firend.current.message)) {
          setFriendList(firend.current.message);
          setIsEmpty(false);
        }
      }
    });
  }
  const formItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };

  //删除好友
  const deleteRes = useRef<any>();
  async function handleDelete(obj: any) {
    deleteRes.current = await deleteFriend({
      qq: obj.owner,
      friend: obj.friend,
    });
    console.log(deleteRes.current);
    if (deleteRes.current.message == "删除好友成功") {
      Message.success("删除好友成功!");
      firend.current = await getFriend(state.user.qq);
      console.log(firend.current.message);
      if (Array.isArray(firend.current.message)) {
        setFriendList(firend.current.message);
      } else if (firend.current.message == "该用户没有好友~") {
        setFriendList(firend.current.message);
        setIsEmpty(true);
      }
    }
  }
  const [contentTitle, setContentTitle] = useState("聊天");
  //和好友通话
  function handleChat(chatInfo: any) {
    console.log(chatInfo);
    setContentTitle(chatInfo.friendName);
  }
  return (
    <div className="container">
      <div className="title">在线互动聊天系统</div>
      <Layout className="byte-layout-collapse-demo">
        <Sider
          collapsible
          theme="dark"
          onCollapse={onCollapse}
          collapsed={collapsed}
          width={siderWidth}
          resizeBoxProps={{
            directions: ["right"],
            onMoving: handleMoving,
          }}
        >
          <div className="logo" />
          <Menu theme="dark" autoOpen style={{ width: "100%" }}>
            <MenuItem key="1">
              <IconHome />
              {state.user.nickname}
            </MenuItem>
            <SubMenu
              key="friend"
              title={
                <span>
                  <IconCalendar /> 好友列表
                </span>
              }
            >
              {isEmpty ? (
                <Empty
                  style={isEmpty ? { display: "block" } : { display: "none" }}
                  icon={
                    <div
                      style={{
                        background: "#81a9f0",
                        display: "inline-flex",
                        borderRadius: "50%",
                        width: 37,
                        height: 37,
                        fontSize: 25,
                        alignItems: "center",
                        color: "white",
                        justifyContent: "center",
                      }}
                      onClick={() => {
                        setIsAddFriend(true);
                      }}
                    >
                      <IconPlus />
                    </div>
                  }
                  description="还没有好友，快去添加好友吧"
                />
              ) : (
                <div>
                  {friendList.map((item) => (
                    <div className="firend" key={item.id}>
                      {" "}
                      <MenuItem key={item.id} onClick={() => handleChat(item)}>
                        {item.friendName}{" "}
                        <button
                          className="deleteBtn"
                          onClick={() => handleDelete(item)}
                        >
                          删除
                        </button>
                      </MenuItem>
                    </div>
                  ))}
                </div>
              )}
              ;
            </SubMenu>
            <SubMenu
              key="group"
              title={
                <span>
                  <IconCalendar /> 群聊
                </span>
              }
            >
              <Empty
                style={isEmpty ? { display: "block" } : { display: "none" }}
                icon={
                  <div
                    style={{
                      background: "#81a9f0",
                      display: "inline-flex",
                      borderRadius: "50%",
                      width: 37,
                      height: 37,
                      fontSize: 25,
                      alignItems: "center",
                      color: "white",
                      justifyContent: "center",
                    }}
                  >
                    <IconPlus />
                  </div>
                }
                description="还没有群聊，快去创建群聊吧"
              />
            </SubMenu>
          </Menu>
        </Sider>
        <Content
          style={{
            background: "rgb(240,255,255)",
            height: "100%",
          }}
          className="chat"
        >
          <div className="content-title">{contentTitle}</div>
          <div className="chat-content"></div>
          <div className="chat-ipt">
            <textarea></textarea>
            <button>发 送</button>
          </div>
        </Content>
      </Layout>
      <Modal
        title="添加好友"
        visible={isAddFriend}
        onOk={(e) => onOk(e)}
        onCancel={() => setIsAddFriend(false)}
      >
        <Form
          {...formItemLayout}
          form={form}
          labelCol={{
            style: { flexBasis: 90 },
          }}
          wrapperCol={{
            style: { flexBasis: "calc(100% - 90px)" },
          }}
        >
          <FormItem label="QQ" field="qq" rules={[{ required: true }]}>
            <Input placeholder="请输入要添加好友的qq号" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}
