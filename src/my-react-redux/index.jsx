import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { bindActionCreators } from "redux";

// 上下文容器
const Context = createContext();

// 上下文注入组件
function Provider(props) {
  const { store, children } = props;
  if (!store || typeof store != "object") throw "必须传入store";
  return (
    <Context.Provider value={{ store }}>
      {children && children}
    </Context.Provider>
  );
}

// 链接redux与组件
function connect(mapStateToProps, mapDispatchToProps) {
  // 默认值处理
  !mapStateToProps && (mapStateToProps = () => ({}));
  !mapDispatchToProps && (mapDispatchToProps = (dispatch) => ({ dispatch }));

  // 让组件链接redux中的state与action
  return function curry(Component) {
    return function RealComponent(props) {
      const { store } = useContext(Context);
      const { getState, dispatch, subscribe } = store;

      const [, updateState] = useState();
      useEffect(() => {
        const unsubscribe = subscribe(() => {
          updateState(+new Date());
        });
        return () => {
          unsubscribe();
        };
      }, []);

      const state = getState();
      const nextState = useMemo(() => mapStateToProps(state), [state]);

      const dispatchs = {};
      if (typeof mapDispatchToProps == "function") {
        dispatchs = mapDispatchToProps(dispatch);
      } else if (typeof mapDispatchToProps == "object") {
        dispatchs = bindActionCreators(mapDispatchToProps, dispatch);
      }

      // 返回被链接完成后的组件
      return <Component {...props} {...nextState} {...dispatchs} />;
    };
  };
}
