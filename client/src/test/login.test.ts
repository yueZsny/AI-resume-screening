/**
 * 测试脚本：测试登录和 Token 刷新功能
 * 运行方式：cd client && npx tsx src/test/login.test.ts
 */

import axios from "axios";

const BASE_URL = "http://localhost:3000";

// 测试邮箱和密码
const TEST_EMAIL = "2408224899a@gmail.com";
const TEST_PASSWORD = "123456";

async function testLogin() {
  console.log("=== 测试登录 ===\n");

  try {
    const res = await axios.post(`${BASE_URL}/v1/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    console.log("✅ 登录成功！");
    console.log("返回数据:", JSON.stringify(res.data, null, 2));

    return res.data;
  } catch (err: any) {
    if (err.response) {
      console.log("❌ 登录失败:");
      console.log("  状态码:", err.response.status);
      console.log("  错误信息:", err.response.data.message);
    } else {
      console.log("❌ 请求失败:", err.message);
    }
    return null;
  }
}

async function testRegister() {
  console.log("\n=== 测试注册 ===\n");

  const randomEmail = `test${Date.now()}@example.com`;

  try {
    const res = await axios.post(`${BASE_URL}/v1/register`, {
      username: "testuser",
      email: randomEmail,
      password: TEST_PASSWORD,
    });

    console.log("✅ 注册成功！");
    console.log("返回数据:", JSON.stringify(res.data, null, 2));
    return res.data;
  } catch (err: any) {
    if (err.response) {
      console.log("❌ 注册失败:");
      console.log("  状态码:", err.response.status);
      console.log("  错误信息:", err.response.data.message);
    } else {
      console.log("❌ 请求失败:", err.message);
    }
    return null;
  }
}

async function testRefreshToken(refreshToken: string) {
  console.log("\n=== 测试刷新 Token ===\n");

  try {
    const res = await axios.post(`${BASE_URL}/v1/refresh`, {
      refreshToken,
    });

    console.log("✅ Token 刷新成功！");
    console.log("返回数据:", JSON.stringify(res.data, null, 2));
    return res.data;
  } catch (err: any) {
    if (err.response) {
      console.log("❌ Token 刷新失败:");
      console.log("  状态码:", err.response.status);
      console.log("  错误信息:", err.response.data.message);
    } else {
      console.log("❌ 请求失败:", err.message);
    }
    return null;
  }
}

async function runTests() {
  console.log("🧪 开始测试...\n");
  console.log("基础 URL:", BASE_URL);

  // 1. 先尝试注册（如果用户已存在会返回错误，不影响后续测试）
  await testRegister();

  // 2. 登录
  const loginRes = await testLogin();

  if (loginRes?.data?.token) {
    const loginData = loginRes.data;
    
    // 3. 测试刷新 Token
    if (loginData.refreshToken) {
      await testRefreshToken(loginData.refreshToken);
    } else {
      console.log("\n⚠️ 登录返回中没有 refreshToken，跳过刷新测试");
    }
  } else {
    console.log("\n⚠️ 登录失败，无法进行后续测试");
  }

  console.log("\n=== 测试完成 ===");
}

runTests();
