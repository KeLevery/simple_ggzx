<script setup lang='ts'>

//接受父组件传递过来的参数
defineProps({
    prefix:{
        type:String,
        default:'#icon-'
    },
    //提供使用的图标名字
    name:String,
    // 接受父组件传递的颜色
    color:{
        type:String,
        default:' '
    },
    //接受父组件传递过来的宽度
    width:{
        type:String,
        default:' '
    },
    // 接受父组件传递过来的高度
    height:{
        type:String,
        default:' '
    }
})
</script>
<template>
    <svg :style="{width,height}">
        <use :xlink:href="prefix+name" :fill="color"></use>
    </svg>
</template>