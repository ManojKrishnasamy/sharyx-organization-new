import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconEye from '../../components/Icon/IconEye';
import { CommonHelper } from '../../helper/helper';
import { jwtDecode } from 'jwt-decode';
import { CommonService } from '../../service/commonservice.page';

const bgImage = '/assets/images/Desktop.svg';
const logoImg = '/assets/images/imgtemp.svg';
const logosharyx = '/assets/images/roundlogo.svg'

const LoginCover = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Login'));
    });
    
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        if (!userData.email.trim()) {
            CommonHelper.ErrorToaster('Please enter email');
            setIsLoading(false);
            return;
        }
        
        if (!userData.password) {
            CommonHelper.ErrorToaster('Please enter password');
            setIsLoading(false);
            return;
        }

        try {
            CommonHelper.Showspinner();
            let res = await CommonService.CommonPost(userData, '/v1/Auth/Login');
            
            if (res.Type == 'S') {
                CommonHelper.SuccessToaster('Login Successfully');
                let LocalData: any = {};
                LocalData = jwtDecode(res?.result?.api_token ?? '');
                const data = { ...LocalData, ...res?.result };
                CommonHelper.SetLocalStorage(CommonHelper.UserStorageName, data, true);
                
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', userData.email);
                }
                
                navigate('/UserPage');
            } else {
                CommonHelper.ErrorToaster(res.Message || 'Login failed');
            }
        } catch (error) {
            CommonHelper.ErrorToaster('An error occurred during login');
        } finally {
            CommonHelper.Hidespinner();
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        >
            {/* Left Column - Logo */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-end py-12">
                <div className="text-center">
                    <img
                      src={logoImg}
                      alt="Sharyx Logo"
                      className="mx-auto h-auto max-w-full"
                      onError={(e) => {
                          // Fallback if image fails to load
                          console.log('Image failed to load:', logoImg);
                      }}
                    />
                </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-start py-8 pl-2">
                <div className="w-full max-w-md">
                    {/* Mobile Header with Logo */}
                    <div className="lg:hidden text-center">
                        <img
                          src={logosharyx}
                          alt="Sharyx Logo"
                          className="mx-auto w-32 h-auto mb-4"
                        />
                    </div>

                    {/* Login Card */}
                    <div className="bg-white rounded-xl shadow-2xl p-16">
                        {/* Tabs */}
                        <div className="flex mb-6">
                            <button className="flex-1 text-center font-semibold text-gray-800 border-b-2 border-gray-800 pb-2">
                                Login
                            </button>
                            <Link 
                                to="/auth/cover-register" 
                                className="flex-1 text-center text-gray-500 hover:text-gray-700 pb-2 transition-colors"
                            >
                                Register
                            </Link>
                        </div>

                        {/* Login Form */}
                        <form className="space-y-6" onSubmit={submitForm}>
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter your email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IconMail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter your password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IconLockDots className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        value={userData.password}
                                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <IconEye className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <IconEye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Remember me</span>
                                </label>
                                <Link
                                    to="/auth/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                                >
                                    Forget Password?
                                </Link>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Signing in...
                                    </div>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </form>
                        {/* Signup Link */}
                        <div className="mt-6 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/auth/cover-register" className="text-blue-600 hover:text-blue-500 font-semibold">
                                Register
                            </Link>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center text-xs text-gray-500">
                            <p>© 2025 Sharyx. All rights reserved.</p>
                            <p className="mt-1">
                                For more information, {' '}
                                <a href="https://sharyx.com/" className="text-blue-600 hover:text-blue-500 underline">
                                    https://sharyx.com/
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginCover;