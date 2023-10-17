import katexDirective from './directives/katex-directive';
import KatexElement from './components/KatexElement.vue';

const plugin = {
    install(app, options) {
        const globalOptions = (options && options.globalOptions) || {};
        const vKatex = katexDirective(globalOptions);
        app.directive(vKatex.name, vKatex.directive);
        app.component(KatexElement.name, KatexElement);

        app.config.globalProperties.$katexOptions = globalOptions;
    }
};

export default plugin;
