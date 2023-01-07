import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  Descriptions,
  Avatar,
  Popover,
} from "@arco-design/web-react";
import {
  IconHome,
  IconCalendar,
  IconExclamation,
  IconPlus,
} from "@arco-design/web-react/icon";
import {
  addFriend,
  deleteFriend,
  getFriend,
  getHistoryMsg,
  saveMessages,
  showFriend,
} from "../../service";
import { io } from "socket.io-client";
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

const collapsedWidth = 60;
const normalWidth = 220;
export default function Chat() {
  const { state } = useLocation();

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
  const socket = useRef<any>();
  const [messages, setMessages] = useState<any>([]);
  const [contentTitle, setContentTitle] = useState<any>({
    friend: "",
    friendName: "聊天",
    owner: "",
    id: 0,
  });
  useEffect(() => {
    //请求获取好友列表
    let getFriendList = async () => {
      firend.current = await getFriend(state.user.qq);

      if (Array.isArray(firend.current.message)) {
        setFriendList(firend.current.message);
        setIsEmpty(false);
      }
    };
    getFriendList();
  }, []);
  const friendInfo = useRef<any>();
  //在线用户
  const [curList, setCurList] = useState<any>([]);
  useEffect(() => {
    //建立 socket 连接
    socket.current = io("ws://localhost:3007");

    socket.current.on("messageResponse", async (data: any) => {
      setMessages((state: any) => [...state, data]);
    });
    socket.current.on("message", (msg: any) => {});
  }, []);
  useEffect(() => {
    //判断气泡位置
  }, [messages]);
  //添加好友
  const [isAddFriend, setIsAddFriend] = useState(false);
  const AddRes = useRef<any>();
  const FormItem = Form.Item;
  const [form] = Form.useForm();
  function onOk(e: any) {
    form.validate().then(async (res) => {
      AddRes.current = await addFriend({
        qq: state.user.qq,
        qqName: state.user.nickname,
        friendNumber: res.qq,
      });

      if (AddRes.current.message == "该用户未注册！") {
        Message.error("该用户未注册!");
      } else if (AddRes.current.message == "添加好友成功") {
        Message.success("添加好友成功!");
        setIsAddFriend(false);
        firend.current = await getFriend(state.user.qq);

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

    if (deleteRes.current.message == "删除好友成功") {
      Message.success("删除好友成功!");
      firend.current = await getFriend(state.user.qq);

      if (Array.isArray(firend.current.message)) {
        setFriendList(firend.current.message);
      } else if (firend.current.message == "该用户没有好友~") {
        setFriendList(firend.current.message);
        setIsEmpty(true);
      }
    }
  }
  const data = [
    {
      label: "用户名",
      value: state.user.nickname,
    },
    {
      label: "qq",
      value: state.user.qq,
    },
    {
      label: "年龄",
      value: state.user.age,
    },
    {
      label: "电话号码",
      value: state.user.telephone,
    },
  ];
  //个人信息查看
  function info() {
    Modal.info({
      title: "个人信息",
      content: (
        <Descriptions
          column={1}
          // title="User Info"
          data={data}
          labelStyle={{ paddingRight: 100 }}
        />
      ),
    });
  }

  //和好友通话
  const historyMsg = useRef<any>();
  async function handleChat(chatInfo: any) {
    setContentTitle(chatInfo);
    //读取历史消息
    friendInfo.current = await showFriend(chatInfo.friendName);
    const friendQQ = friendInfo.current.message.qq;
    const obj = {
      from: state.user.qq,
      to: friendQQ,
    };
    historyMsg.current = await getHistoryMsg(obj);
    const history = historyMsg.current.message;

    if (history !== "") {
      const finalHistory = history.map((item: any) => {
        return {
          fromName: item.fromName,
          isSystem: false,
          msg: item.message,
          toName: item.toName,
        };
      });
      setMessages(finalHistory);
    }
  }

  const message = useRef<HTMLTextAreaElement | null>(null);

  async function handleSendMessage() {
    const value = message.current?.value;

    socket.current.emit("message", {
      id: state.user.qq,
      name: state.user.nickname,
      toName: contentTitle.friendName,
      msg: value,
    });

    //发送请求,存储历史消息
    //先获取qq号
    friendInfo.current = await showFriend(contentTitle.friendName);
    const friendQQ = friendInfo.current.message.qq;
    const obj = {
      qq: state.user.qq,
      toQQ: friendQQ,
      message: value,
      fromName: state.user.nickname,
      toName: contentTitle.friendName,
    };
    await saveMessages(obj);
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
              <span onClick={info}>{state.user.nickname} </span>
              <IconPlus
                style={{ marginLeft: 50 }}
                onClick={() => {
                  setIsAddFriend(true);
                }}
              />
            </MenuItem>{" "}
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
                  <IconCalendar /> 在线用户
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
          <div className="content-title">{contentTitle.friendName}</div>
          <div className="chat-content">
            {messages.map((item: any, index: number) => {
              return item.fromName == state.user.nickname ? (
                <div
                  key={index}
                  className="message"
                  style={{ float: "right", clear: "both" }}
                >
                  {" "}
                  <div className="msg-content">{item.msg}</div>
                  <Avatar style={{ backgroundColor: "#81a9f0" }}>
                    {item.fromName}
                  </Avatar>
                </div>
              ) : (
                <div
                  key={index}
                  className="message"
                  style={{ float: "left", clear: "both" }}
                >
                  <Avatar style={{ backgroundColor: "#81a9f0" }}>
                    {item.fromName}
                  </Avatar>
                  <div className="msg-content">{item.msg}</div>
                </div>
              );
            })}
          </div>
          <div className="chat-ipt">
            <textarea ref={message}></textarea>
            <button onClick={handleSendMessage}>发 送</button>
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
