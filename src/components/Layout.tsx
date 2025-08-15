import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 font-[system-ui] flex flex-col">
      {/* Top Navigation */}
      <div className="bg-gray-800 text-white">
        <div className="px-6 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-lg font-semibold">客服工作台</h1>
            <nav className="flex space-x-4">
              <Link 
                to="/chat" 
                className={`px-3 py-1 rounded text-sm ${isActive('/chat') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                会话管理
              </Link>
              <Link 
                to="/task" 
                className={`px-3 py-1 rounded text-sm ${isActive('/task') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                工单系统
              </Link>
            </nav>
          </div>
          <div className="text-sm">
            客服: 张三 | <a href="#" className="hover:underline">退出</a>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout; 