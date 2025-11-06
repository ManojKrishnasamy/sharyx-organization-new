import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconEye from '../../components/Icon/IconEye';
import IconUser from '../../components/Icon/IconUser';
import IconUsers from '../../components/Icon/IconUsers';
import { CommonHelper } from '../../helper/helper';
import { CommonService } from '../../service/commonservice.page';

const bgImage = '/assets/images/Desktop.svg';
const logoImg = '/assets/images/imglogo.svg';


const RegisterCover = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Register'));
    });
    
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        organizationName: '',
        workspaceName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // 🔹 Validation helper
const validateRegisterForm = (userData: any, agreeTerms: boolean) => {
  // Organization Name
  if (!userData.organizationName.trim()) {
    return { valid: false, message: "Please enter Organization Name" };
  }

  // Workspace Name
  if (!userData.workspaceName.trim()) {
    return { valid: false, message: "Please enter Workspace Name" };
  }

  // Username
  if (!userData.username.trim()) {
    return { valid: false, message: "Please enter Username" };
  }

  // Email Address
  if (!userData.email.trim()) {
    return { valid: false, message: "Please enter Email Address" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email.trim())) {
    return { valid: false, message: "Please enter a valid Email Address" };
  }

  // Password
  if (!userData.password.trim()) {
    return { valid: false, message: "Please enter Password" };
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  if (!passwordRegex.test(userData.password)) {
    return { 
      valid: false, 
      message: "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character"
    };
  }

  if (!userData.confirmPassword.trim()) {
    return { valid: false, message: "Please enter Confirm Password" };
  }

  if (userData.password !== userData.confirmPassword) {
    return { valid: false, message: "Passwords do not match" };
  }
  if (!agreeTerms) {
    return { valid: false, message: "Please agree to the Terms and Conditions" };
  }

  return { valid: true };
};


 const submitForm = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {

    if (!userData.organizationName.trim()) {
      CommonHelper.ErrorToaster("Please enter organization name");
      return;
    }

    if (!userData.workspaceName.trim()) {
      CommonHelper.ErrorToaster("Please enter workspace name");
      return;
    }

    if (!userData.username.trim()) {
      CommonHelper.ErrorToaster("Please enter username");
      return;
    }

    if (!userData.email.trim()) {
      CommonHelper.ErrorToaster("Please enter email");
      return;
    }

    if (!userData.password) {
      CommonHelper.ErrorToaster("Please enter password");
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      CommonHelper.ErrorToaster("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      CommonHelper.ErrorToaster("Please agree to the terms and conditions");
      return;
    }

    CommonHelper.Showspinner();

    const payload = {
      company_name: userData.organizationName.trim(),
      workspace_name: userData.workspaceName.trim(),
      user_name: userData.username.trim(),
      email: userData.email.trim(),
      password: userData.password,
    };

    const res: any = await CommonService.CommonPost(payload, "/v1/Auth/signup");

    if (res?.Type === "S") {
      CommonHelper.SuccessToaster(res?.Message || "Registration successful! Please login.");
      setSuccessMessage("Registration successful! Please login.");

      setTimeout(() => {
        navigate("/auth/cover-login");
      }, 2000);
    } else {
      CommonHelper.ErrorToaster(res?.Message || "Registration failed. Please try again.");
    }
  } catch (err: any) {
    console.error("submitForm error:", err);
    CommonHelper.ErrorToaster("An unexpected error occurred during registration");
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
            {/* Left Column - Illustration/Details */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-end py-12 pr-2">
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

            {/* Right Column - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-start py-8">
                <div className="w-full max-w-md">
                    {/* Signup Card */}
                    <div className="bg-white rounded-xl shadow-2xl p-9">
                        {/* Tabs */}
                        <div className="flex mb-6">
                            <Link 
                                to="/auth/cover-login" 
                                className="flex-1 text-center text-gray-500 hover:text-gray-700 pb-2 transition-colors"
                            >
                                Login
                            </Link>
                            <button className="flex-1 text-center font-semibold text-gray-800 border-b-2 border-gray-800 pb-2">
                                Register
                            </button>
                        </div>

                        {/* Signup Form */}
                        <form className="space-y-4" onSubmit={submitForm}>
                            {/* First Row - Organization & Workspace */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Organization Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Organization Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IconUser className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Organization name"
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                            value={userData.organizationName}
                                            
                                            onChange={(e) => setUserData({ ...userData, organizationName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Workspace Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Workspace Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IconUsers className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Workspace name"
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                            value={userData.workspaceName}
                                            onChange={(e) => setUserData({ ...userData, workspaceName: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Second Row - Username & Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Username Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IconUser className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                            value={userData.username}
                                            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IconMail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                            value={userData.email}
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Third Row - Password & Confirm Password */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IconLockDots className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
                                            className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                            value={userData.password}
                                            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <IconEye className="h-5 w-5 text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IconLockDots className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm password"
                                            className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                            value={userData.confirmPassword}
                                            onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            <IconEye className="h-5 w-5 text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start pt-2">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                />
                                <label className="ml-2 text-sm text-gray-700">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                                        Terms and Conditions
                                    </Link>
                                    {' '}and{' '}
                                    <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            {/* Signup Button */}
                            {successMessage && (
                            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md text-center">
                                {successMessage}
                            </div>
                        )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl mt-4"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Creating Account...
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        {/* OR Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-3 text-sm text-gray-500">OR</span>
                            </div>
                        </div>

                        {/* Social Signup */}
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Register with Google
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="mt-6 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/auth/cover-login" className="text-blue-600 hover:text-blue-500 font-semibold">
                                Login
                            </Link>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 text-center text-xs text-gray-500">
                            <p>© 2025 Sharyx. All rights reserved.</p>
                            <p className="mt-1">
                                For more information {' '}
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

export default RegisterCover;