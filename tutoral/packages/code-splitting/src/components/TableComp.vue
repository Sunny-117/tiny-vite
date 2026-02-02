<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column v-for="(item, index) in tableColumns"
      :key="index"
      :prop="item.prop"
      :label="item.label" 
    />
  </el-table>
</template>

<script setup lang="ts">
import { ElTable,ElTableColumn } from 'element-plus';
import { Student,User,Column } from '@/types';
import { PropType } from 'vue';

defineProps({
  tableData: {
    type: Array as PropType<Student[]|User[]>,
    required: true,
  },
  tableColumns: {
    type: Array as PropType<Column[]>,
    required: true,
  },
});
</script>