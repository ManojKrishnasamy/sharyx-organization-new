import PerfectScrollbar from "react-perfect-scrollbar";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toggleSidebar } from "../../store/themeConfigSlice";
import AnimateHeight from "react-animate-height";
import { IRootState } from "../../store";
import { useState, useEffect } from "react";
import IconCaretsDown from "../Icon/IconCaretsDown";
import IconCaretDown from "../Icon/IconCaretDown";
import IconMenuDashboard from "../Icon/Menu/IconMenuDashboard";
import IconMinus from "../Icon/IconMinus";
import IconMenuChat from "../Icon/Menu/IconMenuChat";
import IconMenuMailbox from "../Icon/Menu/IconMenuMailbox";
import IconMenuTodo from "../Icon/Menu/IconMenuTodo";
import IconMenuNotes from "../Icon/Menu/IconMenuNotes";
import IconMenuScrumboard from "../Icon/Menu/IconMenuScrumboard";
import IconMenuContacts from "../Icon/Menu/IconMenuContacts";
import IconMenuInvoice from "../Icon/Menu/IconMenuInvoice";
import IconMenuCalendar from "../Icon/Menu/IconMenuCalendar";
import IconMenuComponents from "../Icon/Menu/IconMenuComponents";
import IconMenuElements from "../Icon/Menu/IconMenuElements";
import IconMenuCharts from "../Icon/Menu/IconMenuCharts";
import IconMenuWidgets from "../Icon/Menu/IconMenuWidgets";
import IconMenuFontIcons from "../Icon/Menu/IconMenuFontIcons";
import IconMenuDragAndDrop from "../Icon/Menu/IconMenuDragAndDrop";
import IconMenuTables from "../Icon/Menu/IconMenuTables";
import IconMenuDatatables from "../Icon/Menu/IconMenuDatatables";
import IconMenuForms from "../Icon/Menu/IconMenuForms";
import IconMenuUsers from "../Icon/Menu/IconMenuUsers";
import IconMenuPages from "../Icon/Menu/IconMenuPages";
import IconMenuAuthentication from "../Icon/Menu/IconMenuAuthentication";
import IconMenuDocumentation from "../Icon/Menu/IconMenuDocumentation";
import IconSettings from "../Icon/IconSettings";
import { CommonService } from "../../service/commonservice.page";
import { CommonHelper } from "../../helper/helper";
import IconStar from "../Icon/IconStar";
import IconInfoCircle from "../Icon/IconInfoCircle";
import IconInfoHexagon from "../Icon/IconInfoHexagon";
import IconInfoTriangle from "../Icon/IconInfoTriangle";
import IconCircleCheck from "../Icon/IconCircleCheck";
import IconHelpCircle from "../Icon/icon-help-circle";
import IconPlayCircle from "../Icon/IconPlayCircle";
import IconUsersGroup from "../Icon/IconUsersGroup";
import IconUsers from "../Icon/IconUsers";
import IconGlobe from "../Icon/IconGlobe";
import IconAt from "../Icon/IconAt";
import IconMapPin from "../Icon/IconMapPin";
import IconAward from "../Icon/IconAward";
import IconDesktop from "../Icon/IconDesktop";
import IconEmployeeApps from "../Icon/Menu/icon-employee-apps";
import IconUser from "../Icon/IconUser";
import IconWheel from "../Icon/IconWheel";
import IconSafari from "../Icon/IconSafari";
import logo from "../../../public/assets/images/LoginLogoDark.png";
import darkLogo from "../../../public/assets/images/loginLogo.png";

const Sidebar = () => {
  const [currentMenu, setCurrentMenu] = useState<string>("");
  const [errorSubMenu, setErrorSubMenu] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const semidark = useSelector(
    (state: IRootState) => state.themeConfig.semidark
  );
  const darkmode = useSelector(
    (state: IRootState) => state.themeConfig.isDarkMode
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue: string) => {
      return oldValue === value ? "" : value;
    });
  };
  const navigate = useNavigate();

  const [platformSettings, setPlatformSettings] = useState<any>({});

  useEffect(() => {
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    );
    if (selector) {
      selector.classList.add("active");
      const ul: any = selector.closest("ul.sub-menu");
      if (ul) {
        let ele: any =
          ul.closest("li.menu").querySelectorAll(".nav-link") || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

 

  


  return (
    <div className={semidark ? "dark" : ""}>
      <nav
        className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${
          semidark ? "text-white-dark" : ""
        }`}
      >
        <div className="bg-white dark:bg-black h-full">
          <div className="flex justify-between items-center px-4 py-3">
            <div></div>
            <NavLink to="/" className="main-logo flex items-center shrink-0">
              <img
                className="w-[120px] ml-[5px] flex-none"
                src={darkmode ? darkLogo : logo}
                alt="logo"
              />
              {/* <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{t('VRISTO')}</span> */}
            </NavLink>

            <button
              type="button"
              className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconCaretsDown className="m-auto rotate-90" />
            </button>
          </div>
          <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
            <ul className="relative font-semibold space-y-0.5 p-4 py-0">

             <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                <IconMinus className="w-4 h-5 flex-none hidden" />
                <span>{t("USER AND PAGES")}</span>
              </h2>

              <li className="menu nav-item">
                <NavLink to="/UserRolePage" className="nav-link group">
                  <div className="flex items-center">
                    <IconUser className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                      {t("UserRole")}
                    </span>
                  </div>
                </NavLink>
              </li>

              <li className="menu nav-item">
                <NavLink to="/UserPage" className="nav-link group">
                  <div className="flex items-center">
                    <IconUser className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                      {t("User")}
                    </span>
                  </div>
                </NavLink>
              </li>
<h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                <IconMinus className="w-4 h-5 flex-none hidden" />
                <span>{t("SYSTEM SETTINGS")}</span>
              </h2>          

             <li className="menu nav-item">
                <NavLink to="/agentlist" className="nav-link group">
                  <div className="flex items-center">
                    <IconUser className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                      {t("Agent Config")}
                    </span>
                  </div>
                </NavLink>
              </li>
              <li className="menu nav-item">
                <NavLink to="/language" className="nav-link group">
                  <div className="flex items-center">
                    <IconUser className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                      {t("Language")}
                    </span>
                  </div>
                </NavLink>
              </li>
              <li className="menu nav-item">
                                <button type="button" className="nav-link group w-full text-left flex items-center" onClick={() => setSettingsOpen((open) => !open)}>
                                    <IconSettings className="group-hover:!text-primary shrink-0" />
                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">Settings</span>
                                    <IconCaretDown className={`ml-auto transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {settingsOpen && (
                                    <ul className="sub-menu  py-2 space-y-1 list-none">
                                        <li>
                                            <NavLink to="/AIprovider" className="block !px-2 py-1 hover:text-primary nav-link">
                                                AI Provider
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/AIsubprovider" className="block !px-2 py-1 hover:text-primary nav-link">
                                                AI Sub Provider
                                            </NavLink>
                                        </li>
                                        </ul>
                                )}
                            </li>

                            <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                <IconMinus className="w-4 h-5 flex-none hidden" />
                <span>{t("WEB CALL")}</span>
              </h2>  
               <li className="menu nav-item">
                <NavLink to="/webcallservice" className="nav-link group">
                  <div className="flex items-center">
                    <IconUser className="group-hover:!text-primary shrink-0" />
                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                      {t("Web Connect")}
                    </span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
