<template>
    <p
        v-if="typeof titleImg === 'object'"
        ref="titleKatex"
        :class="[styleTitle, 'font-Muli']"
        data-test="titleTask"
    >
        {{ titleImg[0] }}
        <span class="inline-flex items-baseline">
            <img
                v-for="(url, idxName) in constructNameIMG"
                :key="idxName"
                class="self-center w-6 h-6"
                :src="require(`@/assets/img/Mapas/backgrounds/${themeSelected}/${url}.svg`)"
                alt="Imagen del enunciado"
            >
        </span>
        {{ titleImg[1] }}
    </p>
    <p
        v-else
        ref="titleKatex"
        :class="[styleTitle, 'font-Muli katex']"
        data-test="titleTask"
    >
        {{ titleImg }}
    </p>
</template>

<script setup>
import {
    defineComponent,
    ref,
    onMounted,
    watchEffect,
    computed
} from 'vue';
// import katex from 'katex';
import renderMathInElement from 'katex/dist/contrib/auto-render.js';

defineComponent({
    name: 'TitleTask'
});

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    styleTitle: {
        type: String,
        default: 'w-full text-center text-lg lg:text-xl font-semibold my-4 flex justify-center items-center'
    },
    urlImg: {
        type: Array,
        default: () => ['']
    },
    themeSelected: {
        type: String,
        default: 'forests'
    }
});

const options = {
    delimiters: [
        { left: '[Kstart]', right: '[Kend]', display: false }
    ],
    minRuleThickness: 0.06
};

const titleImg = computed(() => {
    let spliceTitle;
    if (props.title.includes('@')) {
        spliceTitle = props.title.split('@');
    } else {
        spliceTitle = props.title;
    }
    return spliceTitle;
});

const constructNameIMG = computed(() => props.urlImg.map(name => {
    const arrayName = name.split('-');
    return `${arrayName[0]}_${props.themeSelected}-${arrayName[1]}`;
}));

const titleKatex = ref(null);

onMounted(() => {
    titleKatex.value.focus();
});

watchEffect(() => {
    if (titleKatex.value) {
        renderMathInElement(titleKatex.value, options);
    }
});
</script>

<style scoped>
.font-Muli {
    font-family: 'Muli', sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
}
</style>
