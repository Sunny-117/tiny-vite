import * as echarts from 'echarts/core';
import { CanvasRenderer } from "echarts/renderers";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";

echarts.use([
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

export default echarts