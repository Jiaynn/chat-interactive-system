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
  const getData = useRef<any>(null);
  const [showErr, setShowErr] = useState(false);
  const handleRegist = async (value: any) => {
    console.log(value);
    delete value.confirmPwd;
    console.log(value);

    getData.current = await register(value);
    console.log(getData.current);

    if (getData.current.message === "注册成功") {
      navigate("/login");
    } else if (getData.current.message.includes("QQ号被占用")) {
      Message.error(`QQ号被占用,请更换其他的QQ号!`);
    }
  };
  useEffect(() => {
    setShowErr(false);
  }, []);

  return (
    <div className={style["container"]}>
      <div className={style["title"]}>在线互动聊天系统</div>
      <div className={style["login-wrapper"]}>
        <div className={style["header"]}>Register</div>
        <div className={style["form-wrapper"]}>
          <Form
            form={form}
            autoComplete="off"
            style={{ width: 600 }}
            validateMessages={{
              string: {
                length: `长度必须是 #{length}位`,
                match: `不匹配正则 #{pattern}`,
              },
              number: {
                min: `最小值为 #{min}`,
                max: `最大值为 #{max}`,
                length: `长度必须是 #{length}位`,
              },
            }}
            onSubmit={(value: any) => handleRegist(value)}
          >
            <FormItem
              label="QQ号"
              field="qq"
              rules={[
                {
                  required: true,
                  type: "string",
                  length: 10,
                },
              ]}
              validateTrigger="onBlur"
            >
              <Input placeholder="请输入10位的qq号码" />
            </FormItem>

            <FormItem
              label="昵称"
              field="nickname"
              rules={[{ required: true, type: "string" }]}
              validateTrigger="onBlur"
            >
              <Input placeholder="请输入昵称" />
            </FormItem>
            <FormItem
              label="密码"
              field="password"
              rules={[{ required: true, type: "string" }]}
              validateTrigger="onBlur"
            >
              <Input placeholder="请输入密码" />
            </FormItem>
            <FormItem
              label="确认密码"
              field="confirmPwd"
              rules={[{ required: true, type: "string" }]}
              validateTrigger="onBlur"
            >
              <Input placeholder="请输入再次密码" />
            </FormItem>
            <FormItem
              label="年龄"
              field="age"
              rules={[{ required: true, type: "number", min: 0, max: 99 }]}
              validateTrigger="onBlur"
            >
              <InputNumber placeholder="请输入年龄" />
            </FormItem>
            <FormItem
              label="电话号码"
              field="telephone"
              rules={[{ required: true, type: "string", length: 11 }]}
              validateTrigger="onBlur"
            >
              <Input placeholder="请输入电话号码" />
            </FormItem>
            <FormItem wrapperCol={{ offset: 9 }}>
              <Button
                type="primary"
                style={{ marginRight: 40, width: 80 }}
                htmlType="submit"
              >
                注册
              </Button>

              <Button
                style={{ marginRight: 24, width: 80 }}
                onClick={() => {
                  form.resetFields();
                }}
              >
                重置
              </Button>
            </FormItem>
          </Form>
        </div>
        <div className={style["msg"]}>
          已有帐号？
          <Link to={"/login"}>登录</Link>
        </div>
      </div>
    </div>
  );
}
