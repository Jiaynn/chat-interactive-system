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

const deleteBoard = (obj: number) => {
  return instance.delete(`/board/dissolve?boardId=${obj}`);
};

const addNewPage = (obj: FormData) => {
  return instance.put(`/board/page`, obj);
};

const switchMode = (obj: FormData) => {
  return instance.put(`/board/switchMode`, obj);
};

export {
  login,
  register,
  getFriend,
  addFriend,
  deleteFriend,
  deleteBoard,
  addNewPage,
  switchMode,
};
