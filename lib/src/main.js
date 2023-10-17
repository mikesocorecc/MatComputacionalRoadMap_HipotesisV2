import { createApp } from 'vue';
import App from './App.vue';
// import VueKatex from './plugins/vue-katex/plugin';
import './assets/style/tailwind.css';
import './assets/style/katex.css';

const app = createApp(App);

// app.use(VueKatex, {
//     globalOptions: {
//         'throw-on-error': true
//     }
// });

app.mount('#Actividad_Warp');
