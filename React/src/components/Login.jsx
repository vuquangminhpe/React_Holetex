import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUser } from "../slices/userSlice";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    setError("");
    setSuccess("");
    try {
      const response = await axios.get(
        `http://localhost:3001/users?username=${username}`
      );
      const decodedToken = jwtDecode(credentialResponse.credential);
      const dataMail = decodedToken.email.split("@");
      const pattern = /^[a-zA-Z]{6,8}he\d{6}$/;
      console.log(dataMail[1], pattern.test(dataMail[0]), dataMail[0]);
      if (dataMail[1] === "fpt.edu.vn" && pattern.test(dataMail[0])) {
        const user = response.data[0];
        console.log(user, dataMail);
        if (user.email === decodedToken.email) {
          dispatch(setUser(user));
          navigate("/");
        } else {
          setError("Từ K19 trở đi hãy đang nhập bằng mã ");
        }
      } else {
        setError("Hãy đăng nhập bằng Email fpt.edu.vn !!!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axios.get(
        `http://localhost:3001/users?username=${username}`
      );
      console.log(response);
      if (response.data.length > 0) {
        const user = response.data[0];
        if (user.password === password) {
          dispatch(setUser(user));
          navigate("/");
        } else {
          setError("Sai mật khẩu");
        }
      } else {
        setError("Tài khoản không tồn tại");
      }
    } catch (error) {
      setError("Lỗi đăng nhập, hãy thử lại sau");
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-800 text-white py-2 px-4">
        <div className="flex items-center">
          <img
            src="data:image/png;base64,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"
            className="w-8 h-8 rounded-full mr-2"
          />
          <span>Tổ Chức Giáo Dục FPT</span>
        </div>
      </div>
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập Đại học FPT
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 text-red-600 text-center">{error}</div>
            )}
            {success && (
              <div className="mb-4 text-green-600 text-center">{success}</div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tài khoản
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Tài khoản (Username)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Mật khẩu (được nhà trường cung cấp, không phải mật khẩu email)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Login
                </button>
              </div>
              <div className="w-full">
                <GoogleLogin className="ml-3" onSuccess={handleLoginSuccess} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
