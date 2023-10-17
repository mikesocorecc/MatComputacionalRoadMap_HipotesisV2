<template>
    <div
        class="w-full h-full flex flex-col justify-center items-center"
    >
        <div
            v-for="(folder, index) in folders"
            :key="index"
            class="w-[200px] xl:w-[220px] h-full flex justify-center items-center my-2"
            :class="{
                'h-2/6': numFolders > 2,
                'h-2/4': numFolders === 2
            }"
        >
            <div
                class="w-full h-full flex justify-center items-center rounded-[15px] overflow-hidden relative"
                :style="
                    `border: 3px solid ${colorBorder};
                    background-color: ${index === folders.length - 1 ? COLOR_BOX_SELECT : COLOR_BOX_DEFAULT};`
                "
            >
                <draggable
                    v-model="folder.folderItems"
                    :group="folder.nameId"
                    :item-key="`${folder.nameId}-id`"
                    class="w-[170px] xl:w-[195px] h-full flex flex-wrap justify-start content-start"
                    :disabled="true"
                    @start="dragging = true"
                    @end="dragging = false"
                >
                    <template #header>
                        <div
                            class="w-full h-[24px] font-bold flex justify-center items-center my-1"
                        >
                            <template v-if="folder.nameId === 'commands' || folder.nameId === 'Comandos'">
                                <span class="text-sm">Comandos</span>
                                <span
                                    class="w-5 h-5 rounded-full text-xs flex justify-center items-center absolute top-2 right-2 text-white"
                                    :style="`background-color: ${index === folders.length - 1 ? COLOR_BOX_SELECT_UP : COLOR_BOX_DEFAULT_UP};`"
                                >
                                    {{ maxComandos - folder.folderItems.length }}
                                </span>
                            </template>
                            <template v-else-if="folder.nameId === 'function1' || folder.nameId === 'Función 1'">
                                <span class="text-sm">Función1 (F1)</span>
                                <span
                                    class="w-5 h-5 rounded-full text-xs flex justify-center items-center absolute top-2 right-2 text-white"
                                    :style="`background-color: ${index === folders.length - 1 ? COLOR_BOX_SELECT_UP : COLOR_BOX_DEFAULT_UP};`"
                                >
                                    {{ maxFunction1 - folder.folderItems.length }}
                                </span>
                            </template>
                            <template v-else-if="folder.nameId === 'function2' || folder.nameId === 'Función 2'">
                                <span class="text-sm">Función 2 (F2)</span>
                                <span
                                    class="w-5 h-5 rounded-full text-xs flex justify-center items-center absolute top-2 right-2 text-white"
                                    :style="`background-color: ${index === folders.length - 1 ? COLOR_BOX_SELECT_UP : COLOR_BOX_DEFAULT_UP};`"
                                >
                                    {{ maxFunction2 - folder.folderItems.length }}
                                </span>
                            </template>
                        </div>
                    </template>
                    <template #item="{ element }">
                        <BtnActionTask
                            name-action="delBtn"
                            :config-btn="element"
                            :disabled="true"
                            :theme-selected="themeSelected"
                        />
                    </template>
                </draggable>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    defineComponent,
    ref
} from 'vue';
import Draggable from 'vuedraggable';
import BtnActionTask from '@/components/SidePanel/components/BtnActionTask';

defineComponent({
    name: 'BoxZone'
});

defineProps({
    colorBorder: {
        type: String,
        default: '#AEB7BD'
    },
    numFolders: {
        type: Number,
        required: true
    },
    folders: {
        type: Array,
        required: true
    },
    maxComandos: {
        type: Number,
        default: 12
    },
    maxFunction1: {
        type: Number,
        default: 12
    },
    maxFunction2: {
        type: Number,
        default: 12
    },
    themeSelected: {
        type: String,
        default: 'forests'
    }
});

const COLOR_BOX_SELECT = ref('#FFF1BE');
const COLOR_BOX_DEFAULT = ref('#EFF3FB');
const COLOR_BOX_SELECT_UP = ref('#FFAA01');
const COLOR_BOX_DEFAULT_UP = ref('#6A7680');
const dragging = ref(false);

</script>

<style scoped></style>
