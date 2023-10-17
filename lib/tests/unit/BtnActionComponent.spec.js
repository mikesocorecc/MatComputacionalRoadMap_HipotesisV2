import {
    render, screen, waitFor
} from '@testing-library/vue';
import '@testing-library/jest-dom';
import { event } from '@/events';
import BtnActionComponent from '@/components/SidePanel/components/BtnActionComponent';

test('the button should be active even if there is feedback', async () => {
    render(BtnActionComponent, {
        props: {
            nameAction: 'Continuar',
            configBtn: {
                name: 'Continuar',
                direction: 'rotate-0',
                img: '',
                styleClass: ['flex justify-center items-center rounded-lg bg-mentor-orange cursor-pointer py-2 px-6 text-2xl text-white']
            },
            idxBtn: 0
        }
    });
    await waitFor(() => event.emit('feedback'));
    const button = screen.getByTestId('Continuar');
    expect(button).toBeDisabled();
});
