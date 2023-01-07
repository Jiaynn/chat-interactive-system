import { instance } from "./service";
//登录
const login = (obj: any) => {
  return instance.post("/api/login", obj, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
const register = (obj: any) => {
  //注册
  return instance.post("/api/reguser", obj, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
const getFriend = (obj: any) => {
  //获取好友列表
  return instance.get(`/friend/show?qq=${obj}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
const addFriend = (obj: any) => {
  //添加好友
  return instance.post(`/friend/add`, obj, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

const deleteFriend = (obj: any) => {
  //删除好友
  return instance.get(`/friend/delete?qq=${obj.qq}&friend=${obj.friend}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

//存储消息
const saveMessages = (obj: any) => {
  return instance.post(`/message/save`, obj, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

//查询好友信息
const showFriend = (obj: any) => {
  return instance.get(`/friend/showFriend?nickname=${obj}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

//读取历史消息
const getHistoryMsg = (obj: any) => {
  return instance.get(`/message/getHistoryMsg?from=${obj.from}&to=${obj.to}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
export {
  login,
  register,
  getFriend,
  addFriend,
  deleteFriend,
  saveMessages,
  showFriend,
  getHistoryMsg,
};
