import React, { useEffect, useRef } from "react";
import { GraphNode, NodeType } from "@/types";
import { ExternalLink } from "lucide-react";
import { Handle, NodeProps, Position } from "react-flow-renderer";

import { getNodeDimensions } from "@/lib/node-dimensions";

// 定义本地图片数组
const sourceImages = [
  "/images/律动.png",
  "/images/深潮.png",
  "/images/Frame 1597881946.png",
  "/images/Frame 1597881951.png",
  "/images/Frame 1597881954.png",
  "/images/Frame 1597881947.png",
  "/images/Frame 1597881957.png",
  "/images/Frame 1597881952.png",
  "/images/Frame 1597881955.png",
  "/images/Frame 1597881949.png",
  "/images/Frame 1597881953.png",
];

// 随机选择一张图片的函数，确保不重复
const usedImages = new Set<string>();

const getRandomImage = () => {
  // 如果所有图片都已使用，重置集合
  if (usedImages.size >= sourceImages.length) {
    usedImages.clear();
  }

  // 找到一个未使用的图片
  let randomIndex;
  let selectedImage;

  do {
    randomIndex = Math.floor(Math.random() * sourceImages.length);
    selectedImage = sourceImages[randomIndex];
  } while (usedImages.has(selectedImage));

  // 标记为已使用
  usedImages.add(selectedImage);
  return selectedImage;
};

// 添加一个时间格式化函数
const formatRelativeTime = (dateString?: string | number): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // 获取月份（需要+1因为月份从0开始）
  const month = String(date.getMonth() + 1).padStart(2, "0");

  // 获取日期
  const day = String(date.getDate()).padStart(2, "0");

  // 获取年份
  const year = date.getFullYear();

  // 返回格式化的日期字符串：MM/DD YYYY
  return `${month}/${day} ${year}`;
};

export const NodeRenderer = ({ id, data }: NodeProps<GraphNode>) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const isMainEvent = id === "main-event";

  // 因为改成"不使用 size"，这里用 CSS class 或者内联样式给节点固定一个宽高
  // 比如："新闻事件" 200×100，其他节点 120×40。你可以根据 data.type 做区分。
  const { width, height } = getNodeDimensions(data.type);

  // 处理 citations 数组，最多显示3个
  const citations = data.citations || [];
  const displayCitations = citations.slice(0, 3);
  const hasMoreCitations = citations.length > 3;

  // 使用 useEffect 动态调整节点高度
  useEffect(() => {
    if (nodeRef.current) {
      // 获取节点内容的实际高度
      const contentHeight = nodeRef.current.scrollHeight;

      // 设置节点容器的高度
      nodeRef.current.style.height = `${contentHeight}px`;

      // 通知 React Flow 节点尺寸已更改
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 0);
    }
  }, [data.label]); // 当标签内容变化时重新计算

  // =========== 1. 强制在 四个 边缘中点 放置一个“无 id”的 Handle，用作 edge 默认的目标 or 源 =============
  //    - 因为我们会在 GraphContainer 中动态决定每条边到底挂上下左右哪一个，
  //      所以这里先渲染出四个"候选 Handle"，分别用 id: `${id}-h-top/right/bottom/left`
  //    - "type" 取决于你想让它当 source 还是 target；这里先不指定 type=id/id，
  //      我们把"上下左右"都渲染成既可 "source" 又可 "target" 的版本。
  //    在 React Flow 中，Handle 组件可以同时声明为 source 或 target，所以下面每个都写两次：
  //      <Handle type="target" position={Position.XXX} id={`${id}-h-xxx`} />
  //      <Handle type="source" position={Position.XXX} id={`${id}-h-xxx`} />
  //
  //  实际上，如果一条边只需要 "sourceHandle" 或 "targetHandle" 其中之一自动匹配，
  //  也可以只渲染一个 type，另一侧让 React Flow 自动默认。但为了灵活起见，这里四个都做成“无差别可用”：
  const candidateHandles = (
    <>
      {/* 上边缘中点 */}
      <Handle
        type="source"
        position={Position.Top}
        id={`${id}-h-top`}
        style={{
          left: "50%",
          transform: "translate(-50%, 50%)",
          background: "transparent",
          width: 8,
          height: 8,
          opacity: 0,
          border: "none",
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id={`${id}-h-top`}
        style={{
          top: "-1px",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "transparent",
          width: 8,
          height: 8,
          opacity: 0,
          border: "none",
        }}
      />

      {/* 右边缘中点 - 同样修改 */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-h-right`}
        style={{
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "transparent",
          width: 8,
          height: 8,
          opacity: 0,
          border: "none",
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id={`${id}-h-right`}
        style={{
          right: "-1px",
          top: "50%",
          transform: "translate(50%, -50%)",
          background: "transparent",
          width: 8,
          height: 8,
          opacity: 0,
          border: "none",
        }}
      />

      {/* 下边缘中点 - 同样修改 */}
      <Handle
        type="source"
        position={Position.Bottom}
        id={`${id}-h-bottom`}
        style={{
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "transparent",
          width: 8,
          height: 8,
          opacity: 0,
          border: "none",
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id={`${id}-h-bottom`}
        style={{
          bottom: "-1px",
          left: "50%",
          transform: "translate(-50%, 50%)",
          background: "transparent",
          width: 8,
          height: 8,
          opacity: 0,
          border: "none",
        }}
      />

      {/* 左边缘中点 - 同样修改 */}
      <Handle
        type="source"
        position={Position.Left}
        id={`${id}-h-left`}
        style={{
          top: "50%",
          transform: "translate(50%, -50%)",
          background: "transparent",
          width: 8,
          height: 8,
          opacity: 0,
          border: "none",
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-h-left`}
        style={{
          left: "-1px",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "transparent",
          width: 8,
          height: 8,
          opacity: 0,
          border: "none",
        }}
      />
    </>
  );

  // =========== 2. 渲染节点主体的 CSS 样式（pos:relative + 固定宽高） ===========
  const containerStyle: React.CSSProperties = {
    maxWidth: `${width}px`,
    maxHeight: `${height}px`,
    position: "relative", // 使得上面所有百分比定位的 Handle 都能基于此容器
    backgroundColor: "#17181A",
    borderRadius: "8px",
    padding: "6px 8px",
    fontSize: "12px",
    fontWeight: 300,
    overflow: "visible", // 允许 Handle 挂在边缘之外
    // opacity: data.opacity,
    lineHeight: "16px",
    letterSpacing: 0,
  };

  let typeWidthStyle: React.CSSProperties = {};
  let innerContent: React.ReactNode = null;
  switch (data.type) {
    // case NodeType.PERSON:
    // typeWidthStyle = {
    //   width: "auto",
    //   height: "30px",
    //   padding: "10px",
    //   borderRadius: "10px",
    //   color: "white",
    // };
    // innerContent = (
    //   <div className="flex h-full items-center">
    //     <span>{data.label}</span>
    //   </div>
    // );
    // break;

    // case NodeType.GROUP:
    //   typeWidthStyle = {
    //     borderRadius: "10px",
    //     padding: "10px",
    //   };
    //   innerContent = (
    //     <div className="flex h-full w-full flex-col items-center justify-center gap-2">
    //       {data.img ? (
    //         <img
    //           src={data.img}
    //           alt={data.label}
    //           className="h-6 w-6 object-contain"
    //         />
    //       ) : (
    //         <div className="flex items-center justify-center">
    //           <Users className="h-6 w-6 rounded-full bg-white text-blue-400" />
    //         </div>
    //       )}
    //       <span className="truncate text-center">{data.label}</span>
    //     </div>
    //   );
    //   break;

    case NodeType.EVENT:
      if (isMainEvent) {
        // 主事件节点使用嵌套 div 实现渐变边框
        typeWidthStyle = {
          padding: "0", // 移除内边距
          background: "transparent", // 背景透明
          borderRadius: "12px",
          width: "200px",
        };

        innerContent = (
          <div
            style={{
              position: "relative",
              padding: "1.5px", // 为渐变边框留出空间
              borderRadius: "12px",
              background:
                "linear-gradient(84.79deg, #4423FE -28.13%, #5B3EFF 46.23%, #A190FF 127.01%)",
              width: "100%",
              height: "100%",
            }}
          >
            <div
              style={{
                background: "#17181A", // 使用与外层容器相同的背景色
                borderRadius: "10.5px", // 略小于外层，确保边框可见
                padding: "12px",
                width: "100%",
                height: "100%",
              }}
            >
              <div className="flex flex-col gap-2">
                <span>{data.label}</span>
                <div className="flex justify-between">
                  <div className="flex space-x-1">
                    {displayCitations.length > 0 ? (
                      // 显示外部链接图标
                      displayCitations.map((citation, idx) => (
                        <a
                          key={idx}
                          href={citation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:opacity-80"
                        >
                          {idx === displayCitations.length - 1 ? (
                            <ExternalLink className="h-4 w-4 text-white" />
                          ) : (
                            <img
                              src={getRandomImage()}
                              alt="Source"
                              className="h-4 w-4 rounded-full object-cover"
                            />
                          )}
                        </a>
                      ))
                    ) : (
                      // 如果没有引用，显示一个默认图标
                      // <LinkIcon className="h-4 w-4 rounded-full text-white transparent" />
                      <div></div>
                    )}
                    {/* 如果有更多引用，显示一个更多图标 */}
                    {/* {hasMoreCitations && (
                      <div className="flex items-center">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </div>
                    )} */}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatRelativeTime(data.time)}
                  </div>
                </div>
                {data.tags && data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {data.tags.map((tag) => (
                      <div
                        key={tag}
                        className="rounded-md bg-[rgb(34,39,55)] p-[5px] text-[10px] text-[RGB(68,104,205)]"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      } else {
        // 非主事件节点
        typeWidthStyle = {
          borderRadius: "12px",
          padding: "12px",
          width: "200px",
        };

        innerContent = (
          <div className="flex flex-col gap-2">
            <span className="font-light text-white">{data.label}</span>
            <div className="flex justify-between">
              <div className="flex space-x-1">
                {displayCitations.length > 0 ? (
                  // 显示外部链接图标
                  displayCitations.map((citation, idx) => (
                    <a
                      key={idx}
                      href={citation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80"
                    >
                      {idx === displayCitations.length - 1 ? (
                        <ExternalLink className="h-4 w-4 text-white" />
                      ) : (
                        <img
                          src={getRandomImage()}
                          alt="Source"
                          className="h-4 w-4 rounded-full object-cover"
                        />
                      )}
                    </a>
                  ))
                ) : (
                  // 如果没有引用，显示一个默认图标
                  // <LinkIcon className="h-4 w-4 rounded-full bg-white text-gray-400" />
                  <div></div>
                )}
                {/* 如果有更多引用，显示一个更多图标 */}
                {/* {hasMoreCitations && (
                  <div className="flex items-center">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </div>
                )} */}
              </div>
              <div className="text-[14px] leading-4 font-light text-[rgba(255,255,255,0.3)]">
                {formatRelativeTime(data.time)}
              </div>
            </div>
            {/* {data.tags && data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <div
                    key={tag}
                    className="rounded-md bg-[rgb(34,39,55)] p-[5px] text-[10px] text-[RGB(68,104,205)]"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )} */}
          </div>
        );
      }
      break;

    // case NodeType.ASSETS:
    //   typeWidthStyle = {
    //     width: "auto",
    //     height: "30px",
    //     padding: "6px",
    //     paddingRight: "12px",
    //     borderRadius: "100px",
    //   };
    //   innerContent = (
    //     <div className="flex h-full items-center gap-1.5">
    //       {data.img ? (
    //         <img
    //           src={data.img}
    //           alt={data.label}
    //           className="rounded-full object-cover"
    //         />
    //       ) : (
    //         <BadgeDollarSign className="h-6 w-6 rounded-full bg-white text-blue-400" />
    //       )}
    //       <span className="text-[14px]">{data.label}</span>
    //       {/* <span
    //         className={`text-sm ${data.changePercent < 0 ? "text-[#FF3838]" : "text-[#0FE871]"}`}
    //       >
    //         {data.changePercent >= 0 ? "+" : ""}
    //         {data.changePercent}%
    //       </span> */}
    //     </div>
    //   );
    //   break;

    default:
      typeWidthStyle = {
        width: "auto",
        minWidth: "30px", // 设置最小宽度
        maxWidth: "200px",
        height: "40px",
        padding: "12px",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
      };
      innerContent = (
        <div className="flex items-start gap-2">
          {/* <img
            src={getRandomImage()}
            alt={data.label}
            className="h-4 w-4 flex-shrink-0 rounded-full object-cover"
          /> */}
          <div className="flex-1 items-center">{data.label}</div>
        </div>
      );
      break;
  }

  return (
    <div style={{ ...containerStyle, ...typeWidthStyle }}>
      {innerContent}
      {candidateHandles}
    </div>
  );
};

export default NodeRenderer;
