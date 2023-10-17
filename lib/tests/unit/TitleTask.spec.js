import { shallowMount } from '@vue/test-utils';
import TitleTask from '@/components/TitleTask.vue';

describe('TitleTask.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(TitleTask, {
            propsData: {
                title: ''
            }
        });
    });

    test('check if load the component', () => {
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find('does-not-exist').exists()).toBe(false);
        expect(wrapper.isVisible()).toBe(true);
    });

    test('check if load title', async () => {
        await wrapper.setProps({
            title: 'Estoy probando la carga!'
        });
        expect(wrapper.text()).toEqual('Estoy probando la carga!');
    });

    test('check if render katex', async () => {
        await wrapper.setProps({
            title: '[Kstart]\fracc{1}{2}[Kend]'
        });
        expect(wrapper.get('[data-test="titleTask"]').exists()).toBe(true);
    });
});
