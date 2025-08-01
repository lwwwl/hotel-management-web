import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import { taskApi } from '../api/taskApi';
import { TaskListRequest, TaskColumnRequest, TaskListItemBO, TaskListColumnBO } from '../api/types';

export function useTasks(filters: { department: string; priority: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Record<string, Task[]>>({
    'pending': [],
    'in_progress': [],
    'review': [],
    'completed': []
  });
  
  // 存储每个列的分页信息
  const [pagination, setPagination] = useState<Record<string, { lastId: number | null; lastCreateTime: number | null }>>({
    'pending': { lastId: null, lastCreateTime: null },
    'in_progress': { lastId: null, lastCreateTime: null },
    'review': { lastId: null, lastCreateTime: null },
    'completed': { lastId: null, lastCreateTime: null }
  });
  
  // 是否还有更多数据
  const [hasMore, setHasMore] = useState<Record<string, boolean>>({
    'pending': true,
    'in_progress': true,
    'review': true,
    'completed': true
  });
  
  // 存储每个列的总任务数
  const [columnCounts, setColumnCounts] = useState<Record<string, number>>({
    'pending': 0,
    'in_progress': 0,
    'review': 0,
    'completed': 0
  });

  // 将后端返回的数据转换为前端使用的Task类型
  const convertToTask = (item: TaskListItemBO): Task => ({
    taskId: item.taskId,
    roomName: item.roomName,
    title: item.title,
    description: item.description,
    deptName: item.deptName,
    priority: item.priority as 'low' | 'medium' | 'high' | 'urgent',
    priorityDisplayName: item.priorityDisplayName,
    status: item.taskStatus as 'pending' | 'in_progress' | 'review' | 'completed',
    statusDisplayName: item.taskStatusDisplayName,
    createdAt: item.createTime,
    roomId: item.roomId,
    deptId: item.deptId,
    guestId: item.guestId,
    guestName: item.guestName
  });

  // 根据状态码获取状态名称
  const getStatusName = (statusCode: string): 'pending' | 'in_progress' | 'review' | 'completed' => {
    return statusCode as 'pending' | 'in_progress' | 'review' | 'completed';
  };

  // 获取任务列表
  const fetchTasks = useCallback(async (statusList: string[] = ['pending', 'in_progress', 'review', 'completed']) => {
    setLoading(true);
    try {
      // 获取当前的分页状态
      const currentPagination = pagination;
      
      const columnRequests: TaskColumnRequest[] = statusList.map(status => ({
        taskStatus: status,
        lastTaskId: currentPagination[status].lastId,
        lastTaskCreateTime: currentPagination[status].lastCreateTime
      }));

      const request: TaskListRequest = {
        requireTaskColumnList: columnRequests,
        departmentId: filters.department ? Number(filters.department) : null,
        priority: filters.priority || null
      };

      const response = await taskApi.getTaskList(request);

      if (response.statusCode === 200) {
        const newTasks = { ...tasks };
        const newPagination = { ...pagination };
        const newHasMore = { ...hasMore };
        const newColumnCounts = { ...columnCounts };

        response.data.forEach((column: TaskListColumnBO) => {
          const statusName = getStatusName(column.taskStatus);
          
          // 更新总任务数
          newColumnCounts[statusName] = column.taskCount;
          
          // 如果是第一次加载或者刷新，则覆盖原数据
          if (!currentPagination[statusName].lastId) {
            newTasks[statusName] = column.tasks.map(convertToTask);
          } else {
            // 否则追加数据
            newTasks[statusName] = [...newTasks[statusName], ...column.tasks.map(convertToTask)];
          }

          // 更新分页信息
          if (column.tasks.length > 0) {
            const lastTask = column.tasks[column.tasks.length - 1];
            newPagination[statusName] = {
              lastId: lastTask.taskId,
              lastCreateTime: lastTask.createTime
            };
            newHasMore[statusName] = column.tasks.length === 20; // 假设后端每页返回20条数据
          } else {
            newHasMore[statusName] = false;
          }
        });

        setTasks(newTasks);
        setPagination(newPagination);
        setHasMore(newHasMore);
        setColumnCounts(newColumnCounts);
      }
    } catch (error) {
      console.error('获取任务列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination, tasks, hasMore, columnCounts]);

  // 首次加载和筛选条件变化时获取所有列的数据
  useEffect(() => {
    // 重置分页信息
    const resetPagination: Record<string, { lastId: number | null; lastCreateTime: number | null }> = {
      'pending': { lastId: null, lastCreateTime: null },
      'in_progress': { lastId: null, lastCreateTime: null },
      'review': { lastId: null, lastCreateTime: null },
      'completed': { lastId: null, lastCreateTime: null }
    };
    
    setPagination(resetPagination);
  }, [filters]);

  // 监听分页变化，当分页被重置时获取数据
  useEffect(() => {
    // 检查是否所有分页都被重置（用于判断是否是刷新操作）
    const isAllReset = Object.values(pagination).every(p => p.lastId === null && p.lastCreateTime === null);
    
    if (isAllReset) {
      // 使用重置后的分页信息获取数据
      const fetchWithResetPagination = async () => {
        setLoading(true);
        try {
          const columnRequests: TaskColumnRequest[] = ['pending', 'in_progress', 'review', 'completed'].map(status => ({
            taskStatus: status,
            lastTaskId: null, // 重置为null
            lastTaskCreateTime: null // 重置为null
          }));

          const request: TaskListRequest = {
            requireTaskColumnList: columnRequests,
            departmentId: filters.department ? Number(filters.department) : null,
            priority: filters.priority || null
          };

          const response = await taskApi.getTaskList(request);

          if (response.statusCode === 200) {
            const newTasks: Record<string, Task[]> = {
              'pending': [],
              'in_progress': [],
              'review': [],
              'completed': []
            };
            const newPagination = { ...pagination };
            const newHasMore: Record<string, boolean> = {
              'pending': true,
              'in_progress': true,
              'review': true,
              'completed': true
            };
            const newColumnCounts: Record<string, number> = {
              'pending': 0,
              'in_progress': 0,
              'review': 0,
              'completed': 0
            };

            response.data.forEach((column: TaskListColumnBO) => {
              const statusName = getStatusName(column.taskStatus);
              
              // 更新总任务数
              newColumnCounts[statusName] = column.taskCount;
              
              // 覆盖原数据（因为是筛选后的第一页）
              newTasks[statusName] = column.tasks.map(convertToTask);

              // 更新分页信息
              if (column.tasks.length > 0) {
                const lastTask = column.tasks[column.tasks.length - 1];
                newPagination[statusName] = {
                  lastId: lastTask.taskId,
                  lastCreateTime: lastTask.createTime
                };
                newHasMore[statusName] = column.tasks.length === 20;
              } else {
                newHasMore[statusName] = false;
              }
            });

            setTasks(newTasks);
            setPagination(newPagination);
            setHasMore(newHasMore);
            setColumnCounts(newColumnCounts);
          }
        } catch (error) {
          console.error('获取任务列表失败:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchWithResetPagination();
    }
  }, [pagination, filters]);

  // 加载更多任务
  const loadMore = async (status: string) => {
    if (!hasMore[status] || loading) return;
    await fetchTasks([status]);
  };

  // 手动刷新所有任务列表 - 只重置分页，不立即获取数据
  const refreshTasks = useCallback(() => {
    // 只重置分页信息，让 useEffect 监听分页变化后自动获取数据
    setPagination({
      'pending': { lastId: null, lastCreateTime: null },
      'in_progress': { lastId: null, lastCreateTime: null },
      'review': { lastId: null, lastCreateTime: null },
      'completed': { lastId: null, lastCreateTime: null }
    });
  }, []);

  const getColumnTasks = (status: Task['status']) => {
    return tasks[status] || [];
  };

  const getColumnCount = (status: Task['status']) => {
    // 返回后端返回的总任务数，而不是当前加载的任务数
    return columnCounts[status] || 0;
  };

  const updateTaskStatus = async (task: Task, newStatus: Task['status']) => {
    try {
      // 调用更改状态API
      await taskApi.changeTaskStatus({
        id: task.taskId,
        status: newStatus
      });

      // 更新本地状态
      const updatedTasks = { ...tasks };
      const updatedCounts = { ...columnCounts };
      
      // 从原状态中移除
      updatedTasks[task.status] = updatedTasks[task.status].filter(t => t.taskId !== task.taskId);
      // 更新计数
      updatedCounts[task.status] = Math.max(0, updatedCounts[task.status] - 1);
      
      // 添加到新状态
      updatedTasks[newStatus] = [
        ...updatedTasks[newStatus], 
        { ...task, status: newStatus }
      ];
      // 更新计数
      updatedCounts[newStatus] = updatedCounts[newStatus] + 1;
      
      setTasks(updatedTasks);
      setColumnCounts(updatedCounts);
    } catch (error) {
      console.error('更新任务状态失败:', error);
    }
  };

  const createNewTask = async (newTask: Omit<Task, 'id' | 'status' | 'createdAt'>) => {
    try {
      const response = await taskApi.createTask({
        roomId: newTask.roomId,
        title: newTask.title,
        description: newTask.description,
        deptId: newTask.deptId,
        priority: newTask.priority
      });

      if (response.statusCode === 200) {
        // 重置分页信息，让 useEffect 自动获取最新数据
        setPagination({
          'pending': { lastId: null, lastCreateTime: null },
          'in_progress': { lastId: null, lastCreateTime: null },
          'review': { lastId: null, lastCreateTime: null },
          'completed': { lastId: null, lastCreateTime: null }
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('创建任务失败:', error);
      return false;
    }
  };
  
  return { 
    tasks,
    loading,
    hasMore,
    getColumnTasks, 
    getColumnCount, 
    updateTaskStatus,
    createNewTask,
    loadMore,
    refreshTasks
  };
} 