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

  const handleLoginSuccess = (credentialResponse) => {
    const decodedToken = jwtDecode(credentialResponse.credential);
    console.log(decodedToken);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axios.get(
        `http://localhost:3001/users?username=${username}`
      );
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
            src="/path-to-fpt-logo.png"
            alt="FPT Education"
            className="h-8 mr-2"
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
                <p className="text-center">Google Login</p>
                <GoogleLogin onSuccess={handleLoginSuccess} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
