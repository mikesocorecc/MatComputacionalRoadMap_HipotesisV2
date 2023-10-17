<template>
    <div
        id="instruction"
        class="w-full h-full absolute flex z-30 top-0 left-0 rounded-[30px]"
    >
        <BtnActionComponent
            v-if="!initialPanel"
            name-action="statement-text"
            :config-btn="statementText"
            @btn-action="clickBtn"
        />
        <div
            class="w-7/12 flex flex-col p-4 font-monserrat"
        >
            <div
                class="w-full h-1/6 flex justify-start items-start pt-4 px-4"
            >
                <div class="w-11 h-11 bg-[#804DD7] rounded-full flex justify-center items-center shadow-md shadow-[#804DD7]">
                    <img
                        style="height: 3.75rem; max-width: inherit !important;"
                        :src="require('@/assets/img/Instructions/AvatarLvl.svg')"
                        alt="Avatar del enunciado"
                    >
                </div>
                <div class="pl-3 flex flex-col">
                    <h4
                        class="font-title"
                    >
                        {{ title }}
                    </h4>
                    <h6 class="font-subtitle">
                        Resolución
                    </h6>
                </div>
            </div>
            <div class="w-full border-b-2 border-solid border-[#804DD7] mx-4" />
            <!-- Cajón de texto para el enunciado -->
            <div class="w-full h-4/6 flex flex-col justify-start items-start px-4">
                <h6 class="font-instruction py-5">
                    Enunciado
                </h6>
                <TitleTask
                    :title="fixText"
                    :url-img="dataStatement.urlImageItem"
                    :theme-selected="themeSelected"
                    style-title="w-11/12 text-base"
                />
            </div>
            <div
                v-if="initialPanel"
                class="w-full h-1/6 flex justify-start items-end px-4"
            >
                <BtnActionComponent
                    name-action="Iniciar"
                    :config-btn="statementText"
                    @btn-action="clickBtn"
                />
            </div>
        </div>
        <div
            class="w-5/12 h-full flex flex-col justify-center items-center"
        >
            <img
                class="w-96"
                :src="require(`@/assets/img/Instructions/generico${levelTask}.svg`)"
                alt="Imagen del enunciado"
            >
        </div>
    </div>
</template>

<script setup>
import { computed, defineComponent } from 'vue';
import BtnActionComponent from '@/components/SidePanel/components/BtnActionComponent';
import TitleTask from '@/components/TitleTask';

defineComponent({
    name: 'StatementPanel'
});

const emit = defineEmits(['showStatementInfo']);

const props = defineProps({
    initialPanel: {
        type: Boolean,
        default: false
    },
    levelTask: {
        type: String,
        default: 'ELITE'
    },
    title: {
        type: String,
        required: true
    },
    dataStatement: {
        type: Object,
        required: true
    },
    themeSelected: {
        type: String,
        default: 'forests'
    }
});

const colorsFix = {
    azul: 'turquesa',
    rojo: 'rosa'
};

const fixText = computed(() => {
    const { title } = props.dataStatement;
    const needFixText = {
        key: undefined,
        index: 0
    };
    Object.keys(colorsFix).forEach((key, index) => {
        if (title.includes(key)) {
            needFixText.key = key;
            needFixText.index = index;
        }
    });
    return needFixText.key ? title.replace(needFixText.key, colorsFix[needFixText.key]) : title;
});

const statementText = props.initialPanel ? {
    name: 'Iniciar',
    direction: 'rotate-0',
    img: '',
    styleClass: ['flex justify-center items-center rounded-full bg-black cursor-pointer py-3 px-14 text-white font-btn']
} : {
    name: 'statement-text',
    direction: 'rotate-0',
    img: 'closed.svg',
    styleClass: ['w-9 h-9 absolute top-5 right-5 flex justify-center items-center rounded-full bg-pro-red cursor-pointer z-10']
};

function clickBtn(value) {
    emit('showStatementInfo', value);
}
</script>

<style scoped>
#instruction {
    background-image: url('@/assets/img/Instructions/Background.svg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
}

.font-title {
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
}

.font-subtitle {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
}

.font-instruction {
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
}

.font-btn {
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
}
</style>
