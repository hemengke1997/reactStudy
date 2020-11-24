/*
 * @Author: hemengke
 * @Date: 2020-11-24 09:02:30
 * @LastEditTime: 2020-11-24 16:09:49
 * @LastEditors: hemengke
 * @Description: 按需加载的组件 
 */

import React, { memo, useContext, useMemo } from 'react'
import { dynamic } from 'umi'
import Loading from '../LoadingCp'

import { dooringContext, dooringContextType } from '@/layout'

// dynamic的用法
// export default dynamic({
//   loader: async function() {
//     // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去
//     const { default: HugeA } = await import(/* webpackChunkName: "external_A" */ './HugeA');
//     return HugeA;
//   },
// });

//  | 联合类型  只有联合类型存在的情况下，才需要类型保护。
export type componentsType = 'media' | 'base' | 'visible';

const DynamicFc = (type: string, componentsType: componentsType, context: dooringContextType) => {
  return dynamic({
    loader: async function () {
      let Components: FC
      console.log(type,'type')
      console.log(componentsType,'componentsType')
      console.log(context,'context')
      const prefix = context === 'pc' ? 'Pc' : ''
      if (componentsType === 'base') {
        const { default: Graph } = await import(`@/components/Basic${prefix}/BasicComponents/${type}`)
        console.log(Graph, 'Graph')
      } else if (componentsType === 'media') {
        const { default: Graph } = await import(`@/components/Basic${prefix}/MediaComponents/${type}`)

      } else {
        const { default: Graph } = await import(`@/components/Basic${prefix}/VisibleComponents/${type}`)
      }
      Components = Graph
      return (props: DynamicType) => {
        const { config, isTpl } = props
        return <Components {...config} isTpl={isTpl}></Components>
      }

    },
    loading: () => (
      <div>
        <Loading />
        <span>按需加载组件loading...</span>
      </div>
    )
  })
}

type DynamicType = {
  isTpl: boolean,
  config: { [key: string]: any },
  type: string,
  componentsType: componentsType,
  category: string
}

const DynamicEngine = memo((props: DynamicType) => {
  const { config, type, componentsType } = props
  console.log(props,'props')
  const context = useContext(dooringContext)
  const Dynamic = useMemo(() => {
    return DynamicFc(type, componentsType, context.theme)
  }, [config, context.theme])
  return <Dynamic {...props}></Dynamic>

  // return DynamicFc(type, componentsType, context.theme)
})

export default DynamicEngine