import {
    render, screen, fireEvent, waitFor
} from '@testing-library/vue';
import '@testing-library/jest-dom';
import { event } from '@/events';
import SidePanel from '@/components/SidePanel/SidePanel';
import Data from '@/assets/map.json';

test('should render Side Panel and all its elements should be on screen.', () => {
    render(SidePanel, {
        props: {
            dataTask: Data[0]
        }
    });

    const responderBtn = screen.getByRole('button', { name: 'Responder' });
    expect(responderBtn).toBeInTheDocument();
    const siguienteBtn = screen.queryByText('Siguiente');
    expect(siguienteBtn).not.toBeInTheDocument();
    const showFeedbackBtn = screen.queryByText('Ver respuesta');
    expect(showFeedbackBtn).not.toBeInTheDocument();
    const openClosedBoxPanel = screen.getByTestId('chevron-btn');
    expect(openClosedBoxPanel).toBeInTheDocument();
    const statementTextBtn = screen.getByAltText('seeStatement');
    expect(statementTextBtn).toBeInTheDocument();
    const arrowUpBtn = screen.getByAltText('U');
    expect(arrowUpBtn).toBeInTheDocument();
    const arrowLeftBtn = screen.getByAltText('L');
    expect(arrowLeftBtn).toBeInTheDocument();
    const arrowRightBtn = screen.getByAltText('R');
    expect(arrowRightBtn).toBeInTheDocument();
    const zoneActionsBtn = screen.getByTestId('btn-zone');
    expect(zoneActionsBtn).toBeInTheDocument();

    expect(screen.getByTestId('panel-box').style.display).toBe('none');
});

test('should see the boxes when you click on your button', async () => {
    render(SidePanel, {
        props: {
            dataTask: Data[0]
        }
    });
    const openClosedBoxPanel = screen.getByTestId('chevron-btn');
    expect(screen.getByTestId('panel-box').style.display).toBe('none');
    await fireEvent.click(openClosedBoxPanel);
    expect(screen.getByTestId('panel-box')).toBeVisible();
});

test('should be able to see the statement panel', async () => {
    render(SidePanel, {
        props: {
            dataTask: Data[0]
        }
    });
    const statementTextBtn = screen.getByTestId('seeStatement');
    await fireEvent.click(statementTextBtn);
    expect(screen.getByAltText('closed button')).toBeInTheDocument();
});

test('should see only the command box if available functions is: 0', () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in Data[0]) {
        if (key === 'functionsAvailable') {
            Data[0][key] = 0;
        }
    }
    render(SidePanel, {
        props: {
            dataTask: Data[0]
        }
    });
    expect(screen.getByText('Comandos')).toBeInTheDocument();
    expect(screen.queryByText('Función 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Función 2')).not.toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
});

test('should see only the command box and function 1 if available functions is: 1', () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in Data[0]) {
        if (key === 'functionsAvailable') {
            Data[0][key] = 1;
        }
    }
    render(SidePanel, {
        props: {
            dataTask: Data[0]
        }
    });
    expect(screen.getByText('Comandos')).toBeInTheDocument();
    expect(screen.queryByText('Función 1')).toBeInTheDocument();
    expect(screen.queryByText('Función 2')).not.toBeInTheDocument();
});

test('should see only the command box, function 1 and function 2 if available functions is: 2', () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in Data[0]) {
        if (key === 'functionsAvailable') {
            Data[0][key] = 2;
        }
    }
    render(SidePanel, {
        props: {
            dataTask: Data[0]
        }
    });
    expect(screen.getByText('Comandos')).toBeInTheDocument();
    expect(screen.queryByText('Función 1')).toBeInTheDocument();
    expect(screen.queryByText('Función 2')).toBeInTheDocument();
});

test('should disable the buttons if you press the test button', async () => {
    render(SidePanel, {
        props: {
            dataTask: Data[0]
        }
    });

    const button = screen.getByTestId('test-task');
    await fireEvent.click(button);
    const anyButtonPanel = screen.getByTestId('Responder');
    expect(anyButtonPanel).toBeDisabled();
});

test('should add buttons and see the boxes', async () => {
    render(SidePanel, {
        props: {
            dataTask: Data[0]
        }
    });
    const button = screen.getByAltText('U');
    await fireEvent.click(button);
    expect(screen.getByAltText('U-delBtn')).toBeInTheDocument();
    expect(screen.getByTestId('panel-box')).toBeVisible();
});

test('should see the following button if the task is wrong', async () => {
    render(SidePanel, {
        props: {
            dataTask: Data[0]
        }
    });
    const button = screen.getByTestId('Responder');
    event.emit('feedback', false);
    await fireEvent.click(button);
    const siguienteBtn = screen.queryByText('Siguiente');
    expect(siguienteBtn).toBeInTheDocument();
    const showResponseBtn = screen.queryByText('Ver respuesta');
    expect(showResponseBtn).toBeInTheDocument();
});

test('the buttons should be enabled after the test is finished.', async () => {
    render(SidePanel, {
        props: {
            dataTask: Data[0]
        }
    });
    const button = screen.getByTestId('test-task');
    await fireEvent.click(button);
    const anyButtonPanel = screen.getByTestId('Responder');
    expect(anyButtonPanel).toBeDisabled();
    await waitFor(() => event.emit('EndMovement'));
    expect(anyButtonPanel).not.toBeDisabled();
});
