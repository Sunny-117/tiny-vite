<template>
  <div style="margin-top: 30px;">
    <h2>用户页面</h2>
    <TableComp :tableData="users" :tableColumns="columns"/>
  </div>
</template>
<script lang="ts" setup>
import TableComp from '@/components/TableComp.vue';
import { User, Column } from '@/types';

const users = [
  ...Array.from({ length: 5 }).map((_, i) => ({
    id: ++i,
    name: `用户${i}`,
    role: `角色${i}`,
    level: `等级${i}`,
    tel: `1388888888${i}`
  })),
] as User[];

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
    prop: 'tel',
    label: '电话',
  },
  {
    prop: 'role',
    label: '角色',
  },
  {
    prop: 'level',
    label: '等级',
  }
] as Column[];

</script>