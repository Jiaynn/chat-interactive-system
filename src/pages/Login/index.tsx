import { login } from "../../service";
import { FC, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "./index.module.css";
import { Message } from "@arco-design/web-react";

const Login: FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const userNameRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (userNameRef.current && pwdRef.current) {
      userNameRef.current.value = state ? state.username : null;
      pwdRef.current.value = state ? state.password : null;
    }
  }, []);
  const getLoginData = useRef<any>(null);
  const [showErr, setShowErr] = useState(false);
  const handleLogin = async () => {
    const obj = {
      qq: userNameRef.current!.value,
      password: pwdRef.current!.value,
    };

    getLoginData.current = await login(obj);
    console.log(getLoginData.current);

    if (getLoginData.current.message === "登录成功") {
      localStorage.setItem("token", JSON.stringify(getLoginData.current.token));
      navigate("/chat");
    } else {
      Message.error("登录失败，密码错误，请重试！");
    }
  };
  return (
    <div className={style["container"]}>
      <div className={style["title"]}>在线互动聊天系统</div>
      <div className={style["login-wrapper"]}>
        <div className={style["header"]}>Login</div>
        <div className={style["form-wrapper"]}>
          <input
            type="text"
            name="username"
            placeholder="请输入QQ号"
            className={style["input-item"]}
            ref={userNameRef}
          />
          <form action="">
            <input
              type="password"
              name="password"
              placeholder="请输入密码"
              className={style["input-item"]}
              ref={pwdRef}
            />
          </form>

          <div className={style["btn"]} onClick={handleLogin}>
            Login
          </div>
        </div>
        <div className={style["msg"]}>
          Don't have account?
          <Link to={"/register"}>Sign up</Link>
        </div>
        {getLoginData.current && (
          <div
            className={style["error"]}
            style={showErr ? { display: "block" } : { display: "none" }}
          >
            {getLoginData.current.msg}
          </div>
        )}
      </div>
    </div>
  );
};
export default Login;
