import { useTranslation } from "react-i18next";
const Footer = () => {
    const { t } = useTranslation();
    return <div className="dark:text-white-dark text-center ltr:sm:text-left rtl:sm:text-right p-6 pt-0 mt-auto">© {new Date().getFullYear()}. {t('Sharyx Connect All rights reserved')}.</div>;
};

export default Footer;
