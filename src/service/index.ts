import { instance, instance1 } from "./service";

const login = (obj: any) => {
  return instance.post("/api/login", obj, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
const register = (obj: any) => {
  return instance.post("/api/reguser", obj, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

//获取好友列表
const getFriend = (obj: any) => {
  return instance.get(`/friend/show?qq=${obj}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
//添加好友
const addFriend = (obj: any) => {
  return instance.post(`/friend/add`, obj, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
//删除好友
const deleteFriend = (obj: any) => {
  return instance.get(`/friend/delete?qq=${obj.qq}&friend=${obj.friend}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
const judgeBoardId = (obj: number) => {
  console.log(obj);

  return instance1.get(`/board/validate?boardId=${obj}`);
};
const exitBoard = (obj: any) => {
  return instance1.delete(
    `/board/exit?boardId=${obj.boardId}&userName=${obj.curUser}`
  );
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
  judgeBoardId,
  exitBoard,
  deleteBoard,
  addNewPage,
  switchMode,
};
