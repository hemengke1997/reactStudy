// umijs约定src/app.tsx为运行时配置
import undoable, { StateWithHistory } from 'redux-undo';
import { Reducer, AnyAction } from 'redux';
const createHistory = require('history').createBrowserHistory;

// 通过 src/app.tsx 文件配置 dva 创建时的参数。
import { message } from 'antd';
export const dva = {
  config: {
    history: createHistory(),
    onError(e: Error) {
      message.error(e.message, 3);
    },
    onReducer: (reducer: Reducer<any, AnyAction>) => {
      // dva官方文档推荐配置
      let undoReducer = undoable(reducer);
      return function(state: StateWithHistory, action: AnyAction) {
        let newState = undoReducer(state, action);
        let router = newState.present.router
          ? newState.present.router
          : newState.present.routing;
        return { ...newState, router };
      };
    },
  },
};
