import { register } from "../../service";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./index.module.css";
import {
  Form,
  Input,
  Button,
  Message,
  InputNumber,
} from "@arco-design/web-react";
const FormItem = Form.Item;
export default function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const userNameRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);
  const getData = useRef<any>(null);
  const [showErr, setShowErr] = useState(false);
  const handleRegist = async () => {
    const username = userNameRef.current!.value;
    const password = pwdRef.current!.value;

    let formData = new FormData();
    formData.append("name", username);
    formData.append("pwd", password);

    getData.current = await register(formData);

    if (getData.current.msg === "注册成功") {
      navigate("/login", { state: { username, password } });
    } else if (getData.current.includes("注册失败")) {
      setShowErr(true);
      setTimeout(() => {
        setShowErr(false);
      }, 2000);
    }
  };
  useEffect(() => {
    setShowErr(false);
  }, []);
  return (
    <div className={style["container"]}>
      <div>在线互动聊天系统</div>
      <div className={style["login-wrapper"]}>
        <div className={style["header"]}>注册</div>
        <div className={style["form-wrapper"]}>
          <Form form={form} autoComplete="off" style={{ width: 600 }}>
            <FormItem
              label="QQ号"
              field="name"
              required
              rules={[
                {
                  validator(value, cb) {
                    if (value !== "hahaha") {
                      return cb("必须填写hahaha");
                    }
                    return cb();
                  },
                },
              ]}
            >
              <Input placeholder="请输入8位的QQ号" />
            </FormItem>
            <FormItem
              label="昵称"
              field="age"
              rules={[{ required: true, type: "number", min: 0, max: 99 }]}
            >
              <InputNumber placeholder="请输入昵称" />
            </FormItem>
            <FormItem
              label="昵称"
              field="age"
              rules={[{ required: true, type: "number", min: 0, max: 99 }]}
            >
              <InputNumber placeholder="请输入昵称" />
            </FormItem>
            <FormItem
              label="密码"
              field="age"
              rules={[{ required: true, type: "number", min: 0, max: 99 }]}
            >
              <InputNumber placeholder="请输入密码" />
            </FormItem>
            <FormItem
              label="确认密码"
              field="age"
              rules={[{ required: true, type: "number", min: 0, max: 99 }]}
            >
              <InputNumber placeholder="请输入再次密码" />
            </FormItem>
            <FormItem
              label="年龄"
              field="age"
              rules={[{ required: true, type: "number", min: 0, max: 99 }]}
            >
              <InputNumber placeholder="请输入年龄" />
            </FormItem>
            <FormItem
              label="电话号码"
              field="age"
              rules={[{ required: true, type: "number", min: 0, max: 99 }]}
            >
              <InputNumber placeholder="请输入电话号码" />
            </FormItem>
            <FormItem wrapperCol={{ offset: 5 }}>
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    await form.validate();
                    Message.success("校验通过");
                  } catch (e) {
                    Message.error("校验失败");
                  }
                }}
                style={{ marginRight: 24 }}
              >
                Validate Form
              </Button>
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    await form.validate(["name"]);
                    Message.success("Username 校验通过");
                  } catch (e) {
                    Message.error("Username 校验失败");
                  }
                }}
                style={{ marginRight: 24 }}
              >
                Validate Username
              </Button>
              <Button
                style={{ marginRight: 24 }}
                onClick={() => {
                  form.resetFields();
                }}
              >
                Reset
              </Button>
            </FormItem>
          </Form>
        </div>

        <div className={style["msg"]}>
          已有帐号？
          <Link to={"/login"}>登录</Link>
        </div>
        <div
          className={style["error"]}
          style={showErr ? { display: "block" } : { display: "none" }}
        >
          {getData.current}
        </div>
      </div>
    </div>
  );
}
