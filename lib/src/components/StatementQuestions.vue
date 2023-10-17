<template>
    <button
        v-for="(value, idx) in questionsFormat"
        :key="idx"
        class="w-full flex justify-center items-center text-sm mb-2 border-l border-y border-solid rounded-l-[15px] cursor-pointer shadow-md shadow-gray-300 text-left"
        :class="colorQuestionSelected(idx)"
        :disabled="feedback"
        @click.prevent="selectQuestion(idx)"
        @keydown.enter.prevent="selectQuestion(idx)"
    >
        <span class="w-1/12 flex justify-start items-center">
            <span class="w-6 h-6 rounded-full font-bold uppercase flex justify-center items-center">{{ indexQuestions[idx] }}</span>
        </span>
        <span class="w-11/12 text-xs pl-1 pr-3 py-1">{{ value[0] }}</span>
    </button>
</template>

<script setup>
import { defineComponent, ref } from 'vue';
import { shuffle } from 'lodash';
import { event } from '@/events';

defineComponent({
    name: 'StatementQuestions'
});

const props = defineProps({
    questions: {
        type: Object,
        default: () => ({})
    },
    showOrder: {
        type: Boolean,
        default: true
    }
});

let questionsFormat = [];
props.questions.forEach(question => {
    Object.keys(question).forEach(key => {
        if (key !== 'isCorrect') {
            questionsFormat.push([question[key], question.isCorrect]);
        }
    });
});
questionsFormat = shuffle(questionsFormat);

const indexQuestions = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const questionSelected = ref('');

const selectQuestion = idx => {
    if (idx === questionSelected.value) {
        questionSelected.value = '';
    } else {
        questionSelected.value = idx;
    }
};

const isCorrect = ref(false);
const feedback = ref(false);

const colorQuestionSelected = idx => {
    // Caso para cuando el usuario no a marcado ninguna respuesta.
    if (questionSelected.value === '' && feedback.value) {
        return questionsFormat[idx][1] ? 'correct' : 'incorrect';
    }
    // Caso en que la respuesta del usuario es incorrecta y marcamos la correcta.
    if (feedback.value && !isCorrect.value && questionsFormat[idx][1]) {
        return 'correct';
    }
    // Caso en que la respuesta del usuario es correcta.
    if (feedback.value && isCorrect.value && idx === questionSelected.value) {
        return 'correct';
    }
    // Caso en que la respuesta del usuario es incorrecta y marcamos incorrecta.
    if (feedback.value && !isCorrect.value && idx === questionSelected.value) {
        return 'incorrect';
    }
    // Caso en la que el usuario está interactuando y se marca su opción.
    if (idx === questionSelected.value) {
        return 'selected';
    }
    return 'default';
};

event.on('Responder', () => {
    feedback.value = true;
    if (questionSelected.value === '') {
        event.emit('feedback', false);
        isCorrect.value = false;
    } else if (questionsFormat[questionSelected.value][1] === true) {
        event.emit('feedback', true);
        isCorrect.value = true;
    } else {
        event.emit('feedback', false);
        isCorrect.value = false;
    }
});
</script>

<style scoped>
::-webkit-scrollbar {
    display: none;
}
.correct {
    background-color: #C6EFE7;
    border-color: #C6EFE7;
}
.incorrect {
    background-color: #F9BBBC;
    border-color: #F9BBBC;
}
.selected {
    background-color: #FFF1BE;
    border-color: #FFF1BE;
}
.default {
    background-color: #FFFFFF;
    border-color: #FFFFFF;
}
</style>
