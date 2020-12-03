import React, {
  useMemo,
  useState,
  Fragment,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import DynamicEngine, {
  componentsType,
} from '@/components/DynamicEngine/index';
import TargetBox from '../TargetBox/index';
import { Tabs } from 'antd';
import classnames from 'classnames';
import { dooringContext } from '@/layout';

import {
  PieChartOutlined,
  PlayCircleOutlined,
  HighlightOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
} from '@ant-design/icons';

import HeaderComponent from '../Header/index';
import styles from './index.less';
import './index.less';

import templateH5 from '@/components/BasicShop/BasicComponents/template';
import schemaH5 from '@/components/BasicShop/schema';
import Calibration from '@/components/Calibration/index';
import SourceBox from '../SourceBox/index';

const { TabPane } = Tabs;

const ContainerComponent = (props: {
  history?: any;
  location?: any;
  pstate?: any;
  cstate?: any;
  dispatch?: any;
}) => {
  const [scaleNum, setScale] = useState(1);

  const context = useContext(dooringContext);

  const [collapsed, setCollapsed] = useState(false);

  const CpIcon = {
    base: <HighlightOutlined />, // 基础类型
    media: <PlayCircleOutlined />, // 视频
    visible: <PieChartOutlined />, // 可视化
  };

  const handleCollapsedChange = useMemo(() => {
    return (collapsed: boolean) => {
      setCollapsed(collapsed);
    };
  }, []);

  const template = useMemo(() => {
    if (context.theme === 'h5') {
      return templateH5;
    }
  }, [context.theme]);

  // 指定画布的id
  const canvasId = '😡';

  const allType = useMemo(() => {
    let arr: string[] = [];
    template?.forEach(v => {
      arr.push(v.type);
    });
    return arr;
  }, [template]);

  const generateHeader = useCallback(
    (type: componentsType, text: string = '') => {
      return (
        <div>
          {CpIcon[type]} {text}
        </div>
      );
    },
    [CpIcon],
  );

  const tabsRender = useMemo(() => {
    if (collapsed) {
      return (
        <Fragment>
          <TabPane tab={generateHeader('base')} key="1"></TabPane>
          <TabPane tab={generateHeader('media')} key="2"></TabPane>
          <TabPane tab={generateHeader('visible')} key="3"></TabPane>
        </Fragment>
      );
    } else {
      return (
        <>
          <TabPane tab={generateHeader('base')} key="1">
            <span className={styles.ctitle}>基础组件</span>

            <div className={styles.flexBox}>
              {template.map((val, i) => {
                return (
                  <TargetBox item={val} key={i}>
                    <DynamicEngine
                      {...val}
                      config={schemaH5[val.type].config}
                      isTpl={true}
                      componentsType="base"
                    />
                  </TargetBox>
                );
              })}
            </div>
          </TabPane>
          <TabPane tab={generateHeader('media')} key="2">
            <span className={styles.ctitle}>视频组件</span>
          </TabPane>

          <TabPane tab={generateHeader('visible')} key="3">
            <span className={styles.ctitle}>可视化组件</span>
          </TabPane>
        </>
      );
    }
  }, []);

  const [dragState, setDragState] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [diffmove, setDiffmove] = useState<{
    start: { x: number; y: number };
    move: boolean;
  }>({
    start: {
      x: 0,
      y: 0,
    },
    move: false,
  });
  const tickRef = useRef<HTMLDivElement>(null);
  const onMouseDownFn = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // 这种方法可以判断点击的地方是tickRef自身而非其子元素
    if (e.target === tickRef.current) {
      setDiffmove({
        start: {
          x: e.clientX,
          y: e.clientY,
        },
        move: true,
      });
    }
  }, []);
  const onMouseUpFn = useCallback(() => {
    setDiffmove({
      start: { x: 0, y: 0 },
      move: false,
    });
  }, []);
  const onMouseMoveFn = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (diffmove.move) {
        let diffx: number;
        let diffy: number;
        const newX = e.clientX;
        const newY = e.clientY;
        diffx = newX - diffmove.start.x;
        diffy = newY - diffmove.start.y;
        setDiffmove({
          start: {
            x: newX,
            y: newY,
          },
          move: true,
        });
        // useState 不会自动合并更新对象。你可以用函数式的 setState 结合展开运算符来达到合并更新对象的效果
        setDragState(prevState => {
          return {
            x: prevState.x + diffx,
            y: prevState.y + diffy,
          };
        });
      }
    },
    [diffmove.move, diffmove.start.x, diffmove.start.y],
  );
  const onWheelFn = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY < 0) {
      setDragState(prev => ({
        x: prev.x,
        y: prev.y + 40,
      }));
    } else {
      setDragState(prev => ({
        x: prev.x,
        y: prev.y - 40,
      }));
    }
  }, []);

  const [isDropping, setIsDropping] = useState<boolean>(false);

  useEffect(() => {
    if (diffmove.move && tickRef.current) {
      tickRef.current.style.cursor = 'move';
    } else {
      tickRef.current.style.cursor = 'default';
    }
  }, [diffmove.move]);

  return (
    <div className={styles.containerWrapper}>
      <HeaderComponent />

      <div className={styles.container}>
        {/* 左侧 */}
        <div
          className={classnames({
            [styles.collapsed]: collapsed,
            [styles.leftArea]: true,
          })}
        >
          <div className={styles.componentList}>
            <Tabs
              tabPosition={'left'}
              defaultActiveKey="1"
              onTabClick={() => handleCollapsedChange(false)}
              className="editorTabclass"
            >
              {tabsRender}
            </Tabs>
          </div>

          <div
            className={styles.collapsedIcon}
            onClick={() => handleCollapsedChange(!collapsed)}
          >
            {collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
          </div>
        </div>
        {/* 右侧 */}

        <div
          className={`${styles.tickMark} 😬`}
          id="😬"
          ref={tickRef}
          onMouseDown={onMouseDownFn}
          onMouseUp={onMouseUpFn}
          onMouseMove={onMouseMoveFn}
          onMouseLeave={onMouseUpFn}
          onWheel={onWheelFn}
        >
          <div className={styles.tickMarkTop}>
            <Calibration
              direction="up"
              id="calibrationUp"
              multiple={scaleNum}
            />
          </div>
          <div className={styles.tickMarkLeft}>
            <Calibration
              direction="right"
              id="calibrationRight"
              multiple={scaleNum}
            />
          </div>
          <SourceBox
            dragState={dragState}
            setDragState={setDragState}
            scaleNum={scaleNum}
            canvasId={canvasId}
            allType={allType}
            setIsDropping={setIsDropping}
            isDropping={isDropping}
          />
        </div>
      </div>
    </div>
  );
};

export default ContainerComponent;
