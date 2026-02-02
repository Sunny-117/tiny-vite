<template>
  <div style="margin-top: 30px;">
    <h2>学生页面</h2>
    <TableComp :tableData="students" :tableColumns="columns"/>
  </div>
</template>
<script lang="ts" setup>
import TableComp from '@/components/TableComp.vue';
import { Student, Column } from '@/types';

const students = [
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: ++i,
    name: `学生${i}`,
    birthday: '1999-01-01',
    grade: '一年级',
    score: Math.floor(Math.random() * 100),
  })),
] as Student[];

const columns = [
  {
    prop: 'id',
    label: 'ID',
  },
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'birthday',
    label: '生日',
  },
  {
    prop: 'grade',
    label: '年级',
  },
  {
    prop: 'score',
    label: '分数',
  },
] as Column[];

</script>