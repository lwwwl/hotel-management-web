interface ChatStatsProps {
  stats: {
    activeChats: number;
    resolvedToday: number;
  };
}

export default function ChatStats({ stats }: ChatStatsProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.activeChats}</div>
          <div className="text-gray-600">活跃会话</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.resolvedToday}</div>
          <div className="text-gray-600">今日解决</div>
        </div>
      </div>
    </div>
  );
} 