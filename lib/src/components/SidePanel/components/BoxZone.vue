<template>
    <div
        class="w-full h-full flex flex-col justify-start items-center pt-3 px-3"
    >
        <div
            v-for="(folder, index) in folders"
            :key="index"
            class="w-full h-full flex justify-center items-center mb-2"
            :class="{
                'h-1/3': numFolders > 2,
                'h-2/4': numFolders === 2
            }"
        >
            <div
                :data-testid="folder.nameId"
                class="w-full h-full flex justify-center items-center rounded-[15px] overflow-hidden relative"
                :style="`background-color: ${COLOR_BOX_DEFAULT}`"
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
                            class="w-full h-[24px] flex justify-center items-center my-1"
                        >
                            <template v-if="folder.nameId === 'Comandos'">
                                <span class="text-sm">{{ folder.nameId }}</span>
                                <span
                                    class="w-5 h-5 rounded-full text-xs flex justify-center items-center absolute top-2 right-2 p-0.5 text-white"
                                    :style="`background-color: ${COLOR_BOX_DEFAULT_UP}`"
                                >
                                    {{ maxComandos - folder.folderItems.length }}
                                </span>
                            </template>
                            <template v-else-if="folder.nameId === 'Función 1'">
                                <span class="text-sm">{{ folder.nameId }} (F1)</span>
                                <span
                                    class="w-5 h-5 rounded-full text-xs flex justify-center items-center absolute top-2 right-2 p-0.5 text-white"
                                    :style="`background-color: ${COLOR_BOX_DEFAULT_UP}`"
                                >
                                    {{ maxFunction1 - folder.folderItems.length }}
                                </span>
                            </template>
                            <template v-else-if="folder.nameId === 'Función 2'">
                                <span class="text-sm">{{ folder.nameId }} (F2)</span>
                                <span
                                    class="w-5 h-5 rounded-full text-xs flex justify-center items-center absolute top-2 right-2 p-0.5 text-white"
                                    :style="`background-color: ${COLOR_BOX_DEFAULT_UP}`"
                                >
                                    {{ maxFunction2 - folder.folderItems.length }}
                                </span>
                            </template>
                        </div>
                    </template>
                    <template #item="{ element }">
                        <BtnActionTask
                            name-action="delBtn"
                            :type-task="typeTask"
                            :box-name="folder.nameId"
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
    ref,
    reactive
} from 'vue';
import { event } from '@/events';
import Draggable from 'vuedraggable';
import BtnActionTask from '@/components/SidePanel/components/BtnActionTask';

defineComponent({
    name: 'BoxZone'
});

const props = defineProps({
    typeTask: {
        type: String,
        required: true
    },
    solutionTask: {
        type: Object,
        required: true
    },
    numFolders: {
        type: Number,
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
    disabledBtn: {
        type: Boolean,
        default: false
    },
    themeSelected: {
        type: String,
        default: 'forests'
    }
});

const ID_FOLDER_SELECTED = ref(props.typeTask !== 'descomposicion' ? 0 : 1);
const COLOR_BOX_DEFAULT = ref('#EFF3FB');
const COLOR_BOX_DEFAULT_UP = ref('#6A7680');
const dragging = ref(false);
const feedbackActive = ref(false);
const folders = reactive([
    {
        nameId: 'Comandos',
        folderItems: [...props.solutionTask.commands]
    }
]);

if (props.numFolders === 1 || props.numFolders === 2) {
    folders.push({
        nameId: 'Función 1',
        folderItems: [...props.solutionTask.function1]
    });
}

if (props.numFolders === 2) {
    folders.push({
        nameId: 'Función 2',
        folderItems: [...props.solutionTask.function2]
    });
}

const updateIndex = () => {
    // eslint-disable-next-line no-param-reassign,no-return-assign,no-shadow
    folders[ID_FOLDER_SELECTED.value].folderItems.forEach((item, idxItem) => item.id = idxItem);
};

const addActionInBox = btnAction => {
    const item = {
        name: btnAction.configBtn.name,
        direction: btnAction.configBtn.direction,
        img: btnAction.configBtn.img,
        styleClass: ['w-6 h-6 xl:w-7 xl:h-7 rounded-md bg-black flex justify-center items-center cursor-pointer m-0.5']
    };
    if (folders[ID_FOLDER_SELECTED.value].nameId === 'Comandos') {
        if (folders[ID_FOLDER_SELECTED.value].folderItems.length < props.maxComandos) {
            folders[ID_FOLDER_SELECTED.value].folderItems.push(item);
            updateIndex();
        }
    }
    if (folders[ID_FOLDER_SELECTED.value].nameId === 'Función 1') {
        if (folders[ID_FOLDER_SELECTED.value].folderItems.length < props.maxFunction1) {
            folders[ID_FOLDER_SELECTED.value].folderItems.push(item);
            updateIndex();
        }
    }
    if (folders[ID_FOLDER_SELECTED.value].nameId === 'Función 2') {
        if (folders[ID_FOLDER_SELECTED.value].folderItems.length < props.maxFunction2) {
            folders[ID_FOLDER_SELECTED.value].folderItems.push(item);
            updateIndex();
        }
    }
};

const delActionInBox = btnAction => {
    setTimeout(() => {
        folders[ID_FOLDER_SELECTED.value].folderItems.splice(btnAction.configBtn.id, 1);
        updateIndex();
    }, 100);
};

const testTask = () => {
    event.emit('test-task', folders);
};

const playTask = () => {
    event.emit('Responder', folders);
};

const clearBox = () => {
    folders[ID_FOLDER_SELECTED.value].folderItems = [];
};

event.on('btn-action', btnAction => {
    if (!props.disabledBtn) {
        if (btnAction.action === 'addBtn') {
            addActionInBox(btnAction);
        }
        if (btnAction.action === 'delBtn') {
            delActionInBox(btnAction);
        }
        if (btnAction.action === 'test-task') {
            testTask();
        }
        if (btnAction.action === 'clear-box') {
            clearBox();
        }
        if (btnAction.action === 'Responder') {
            playTask();
        }
    }
});

event.on('feedback', () => {
    feedbackActive.value = true;
    event.emit('folders', folders);
});

event.on('endTime', () => {
    playTask();
});
</script>

<style scoped></style>
