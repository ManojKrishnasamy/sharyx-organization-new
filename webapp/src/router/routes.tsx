import { lazy } from 'react';
import LockScreen from '../pages/Auth/LockScreen';
import UserPage from '../pages/Admin/UserPage';
import NewLogin from '../pages/Auth/NewLogin';
import UserRolePage from '../pages/Admin/UserRole';
import RegisterCover from '../pages/Auth/RegisterCover';
import AgentListPage from '../pages/Agent/AgentList.page';
import AIProvider from '../pages/Admin/AIprovider';
import AISubProvider from '../pages/Admin/AIsubprovider';
import AddOrEditSubProvider from '../pages/Admin/AddorEditSubProvider.page';
// import WebConnectPage from '../pages/WebCall/Webcallconnection.page';
import VoiceCall from '../pages/WebCall/VoiceCall';
import AddOrEditAgentPage from '../pages/Agent/AddOrEditAgent.page';
import Language from '../pages/Language/Language';
import SystemSettings from '../pages/Auth/SystemSettings';

const Index = lazy(() => import('../pages/Index'));

const routes = [
    // dashboard
    // {
    //     path: '/',
    //     element: <LoginCover />,
    //     layout: 'blank',
    // },
    {
        path: '/',
        element: <NewLogin />,
        layout: 'blank',
    },
    {
        path: '/lockscreen',
        element: <LockScreen />,
        layout: 'blank',
    },
    {
        path: '/home',
        element: <Index />,
        layout: 'default',
    },
    // {
    //     path: '/RasiList',
    //     element: <Rasi />,
    //     layout: 'default',
    // },
    // {
    //     path: '/NakshatramList',
    //     element: <Nakshatram />,
    //     layout: 'default',
    // },
    {
        path: '/UserPage',
        element: <UserPage />,
        layout: 'default',
    },
     {
        path: '/UserRolePage',
        element: <UserRolePage />,
        layout: 'default',
    },
    
    {
        path: '/auth/cover-login',
        element: <NewLogin />,
        layout: 'blank',
    },
    {
        path: '/auth/cover-register',
        element: <RegisterCover />,
        layout: 'blank',
    },
    {
        path: '/agentlist',
        element: <AgentListPage />,
        layout: 'default',
    },
     {
        path: '/AIprovider',
        element: <AIProvider />,
        layout: 'default',
    },
    {
        path: '/AIsubprovider',
        element: <AISubProvider />,
        layout: 'default',
    },
    {
        path: '/language',
        element: <Language />,
        layout: 'default',
    },
    {
        path: '/addoreditsubprovider/:id',
        element: <AddOrEditSubProvider/>,
        layout: 'default',
    },
    {
        path: '/AddOrEditAgentPage/',
        element: <AddOrEditAgentPage/>,
        layout: 'default',
    },
    {
        path: '/AddOrEditAgentPage/:id?',
        element: <AddOrEditAgentPage/>,
        layout: 'default',
    },
    {
        path: '/webcallservice',
        element: <VoiceCall/>,
        layout: 'default'
    },
     {
        path: '/SystemSettings',
        element: <SystemSettings/>,
        layout: 'default',
    },
    

];

export { routes };
