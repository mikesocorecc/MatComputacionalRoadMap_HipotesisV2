import { render, screen, fireEvent } from '@testing-library/vue';
import '@testing-library/jest-dom';
import BtnActionTask from '@/components/SidePanel/components/BtnActionTask';

test('should render button.', () => {
    render(BtnActionTask, {
        props: {
            nameAction: 'U',
            configBtn: {
                name: 'U',
                direction: 'rotate-0',
                img: 'U.svg',
                styleClass: ['w-full h-full rounded-xl bg-black flex justify-center items-center cursor-pointer']
            },
            disabledBtn: false
        }
    });

    const arrowUpBtn = screen.getByTestId('U');
    expect(arrowUpBtn).toBeInTheDocument();
});

test('pressing the button emits an event.', async () => {
    const { emitted } = render(BtnActionTask, {
        props: {
            nameAction: 'U',
            configBtn: {
                name: 'U',
                direction: 'rotate-0',
                img: 'U.svg',
                styleClass: ['w-full h-full rounded-xl bg-black flex justify-center items-center cursor-pointer']
            },
            disabledBtn: false
        }
    });

    const arrowUpBtn = screen.getByTestId('U');
    expect(arrowUpBtn).toBeInTheDocument();
    await fireEvent.click(arrowUpBtn);
    expect(emitted().click).toBeTruthy();
});
