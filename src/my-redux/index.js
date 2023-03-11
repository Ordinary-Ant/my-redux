// 创建一个Store，需要传入一个reducer
export default function createStore(reducer) {
  // 公共状态
  const state = {};

  // 公共事件池
  const listeners = [];

  // 用于获取公共状态
  const getState = () => {
    return state;
  };

  // 往公共事件池中添加事件
  const subscribe = (listener) => {
    if (typeof listener != "function") throw "listener 必须是一个函数";
    if (!listeners.includes(listener)) listeners.push(fnc);

    // 将本次添加的事件从公共事件池中移除
    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  };

  // 触发reducer更新
  const dispatch = (action) => {
    if (typeof action != "object") throw "action 必须是一个对象";
    if (typeof action.type == "undefined") throw "action 中必须存在type属性";

    // 执行reducer获取到最新的state
    state = reducer(state, action);

    // 顺序执行公共事件池中的事件
    listeners.forEach((listener) => listener());
  };

  // 生成随机字符串
  const randomString = () =>
    Math.random().toString(36).substring(7).split("").join(".");

  // 当store被创建出来后需要自动执行一次dispatch，用于给公共状态赋初始值
  dispatch({
    type: "@@redux/INIT" + randomString(),
  });

  return {
    getState,
    dispatch,
    subscribe,
  };
}
