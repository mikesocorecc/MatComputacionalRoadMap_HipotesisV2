<template>
    <!-- Zona de botones para interacción con la tarea(acciones) -->
    <div
        class="w-full h-auto flex flex-col justify-center items-center bg-[#FFF1BE] rounded-[15px] my-3 relative pb-2 mr-3"
    >
        <BtnActionComponent
            name-action="statement-text"
            :config-btn="statementTextInfo"
            @btn-action="clickBtn"
        />
        <div
            class="w-full flex justify-center items-center mt-5 gap-1"
        >
            <BtnActionTask
                name-action="addBtn"
                :config-btn="configCommandBtn[1]"
                :disabled-btn="disabledBtn"
            />
            <BtnActionTask
                name-action="addBtn"
                :config-btn="configCommandBtn[0]"
                :disabled-btn="disabledBtn"
            />
            <BtnActionTask
                name-action="addBtn"
                :config-btn="configCommandBtn[2]"
                :disabled-btn="disabledBtn"
            />
        </div>
        <span class="w-10/12 my-2 border-b-2 border-solid border-white" />
        <div
            v-show="numActions.length <= 4"
            class="w-full flex flex-wrap justify-center items-center gap-1"
        >
            <BtnActionTask
                v-for="(btn, index) in numActions"
                :key="index"
                name-action="addBtn"
                :theme-selected="themeSelected"
                :config-btn="configActionsBtn.filter(config => config.name === btn)[0]"
                :disabled-btn="disabledBtn"
            />
        </div>
        <span
            v-show="functionBtnLoad === 1 || functionBtnLoad === 2"
            class="w-10/12 my-2 border-b-2 border-solid border-white"
        />
        <!-- Zona de botones para interacción con la tarea(memorias) -->
        <div
            v-show="functionBtnLoad === 1 || functionBtnLoad === 2"
            class="w-full flex justify-center items-center gap-1"
        >
            <BtnActionTask
                v-show="functionBtnLoad === 1 || functionBtnLoad === 2"
                name-action="addBtn"
                :config-btn="configFunctionsBtn[0]"
                :disabled-btn="disabledBtn"
            />
            <BtnActionTask
                v-show="functionBtnLoad === 2"
                class="ml-2"
                name-action="addBtn"
                :config-btn="configFunctionsBtn[1]"
                :disabled-btn="disabledBtn"
            />
        </div>
    </div>
</template>

<script setup>
import { defineComponent } from 'vue';
import BtnActionTask from '@/components/SidePanel/components/BtnActionTask';
import BtnActionComponent from '@/components/SidePanel/components/BtnActionComponent';

defineComponent({
    name: 'BtnZone'
});

const props = defineProps({
    functionBtnLoad: {
        type: Number,
        required: true
    },
    numActions: {
        type: Array,
        default: () => ([])
    },
    disabledBtn: {
        type: Boolean,
        default: false
    },
    themeSelected: {
        type: String,
        default: 'forests'
    }
});

const emit = defineEmits(['show-statement']);

const statementTextInfo = {
    name: 'statement-text',
    direction: 'rotate-0',
    img: 'seeStatement.svg',
    styleClass: ['w-5 h-5 flex justify-center items-center rounded-full cursor-pointer absolute top-1 right-1']
};

const configCommandBtn = [
    {
        name: 'U',
        direction: 'rotate-0',
        img: 'U.svg',
        styleClass: ['w-9 h-9 xl:w-11 xl:h-11 rounded-xl bg-black flex justify-center items-center cursor-pointer']
    },
    {
        name: 'L',
        direction: 'rotate-0',
        img: 'L.svg',
        styleClass: ['w-9 h-9 xl:w-11 xl:h-11 rounded-xl bg-black flex justify-center items-center cursor-pointer']
    },
    {
        name: 'R',
        direction: 'rotate-0',
        img: 'R.svg',
        styleClass: ['w-9 h-9 xl:w-11 xl:h-11 rounded-xl bg-black flex justify-center items-center cursor-pointer']
    }
];

const configActionsBtn = [
    {
        name: 'B',
        direction: 'rotate-0',
        img: `scene_${props.themeSelected}-B.svg`,
        styleClass: ['w-9 h-9 xl:w-11 xl:h-11 rounded-xl bg-black flex justify-center items-center cursor-pointer']
    },
    {
        name: 'Y',
        direction: 'rotate-0',
        img: `scene_${props.themeSelected}-Y.svg`,
        styleClass: ['w-9 h-9 xl:w-11 xl:h-11 rounded-xl bg-black flex justify-center items-center cursor-pointer']
    },
    {
        name: 'O',
        direction: 'rotate-0',
        img: `scene_${props.themeSelected}-O.svg`,
        styleClass: ['w-9 h-9 xl:w-11 xl:h-11 rounded-xl bg-black flex justify-center items-center cursor-pointer']
    },
    {
        name: 'C',
        direction: 'rotate-0',
        img: `scene_${props.themeSelected}-C.svg`,
        styleClass: ['w-9 h-9 xl:w-11 xl:h-11 rounded-xl bg-black flex justify-center items-center cursor-pointer']
    }
];

const configFunctionsBtn = [
    {
        name: 'F1',
        direction: 'rotate-0',
        img: 'F1.svg',
        styleClass: ['w-9 h-9 xl:w-11 xl:h-11 rounded-xl bg-black flex justify-center items-center cursor-pointer']
    },
    {
        name: 'F2',
        direction: 'rotate-0',
        img: 'F2.svg',
        styleClass: ['w-9 h-9 xl:w-11 xl:h-11 rounded-xl bg-black flex justify-center items-center cursor-pointer']
    }
];

function clickBtn(value) {
    emit('show-statement', value);
}
</script>

<style scoped></style>
