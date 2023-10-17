import {
    render, screen, fireEvent, waitForElementToBeRemoved, waitFor
} from '@testing-library/vue';
import '@testing-library/jest-dom';
import BoxZone from '@/components/SidePanel/components/BoxZone';
import BtnZone from '@/components/SidePanel/components/BtnZone';
import { event } from '@/events';

test('should the command box must be selected.', () => {
    render(BoxZone, {
        props: {
            numFolders: 0,
            maxComandos: 12,
            maxFunction1: 12,
            maxFunction2: 12,
            disabledBtn: false
        }
    });
    expect(screen.getByTestId('Comandos').style.border).toBe('2px solid #ffcc0d');
});

test('should the command box must be selected and after clicking select function 1', async () => {
    render(BoxZone, {
        props: {
            numFolders: 1,
            maxComandos: 12,
            maxFunction1: 12,
            maxFunction2: 12,
            disabledBtn: false
        }
    });
    const areaBoxComandos = screen.getByTestId('Comandos');
    expect(areaBoxComandos.style.border).toBe('2px solid #ffcc0d');
    const areaBoxFunction1 = screen.getByTestId('Función 1');
    await fireEvent.click(areaBoxFunction1);
    expect(areaBoxFunction1.style.border).toBe('2px solid #ffcc0d');
    expect(areaBoxComandos.style.border).toBe('2px solid #aeb7bd');
});

test('should the command box must be selected and after clicking select function 2', async () => {
    render(BoxZone, {
        props: {
            numFolders: 2,
            maxComandos: 12,
            maxFunction1: 12,
            maxFunction2: 12,
            disabledBtn: false
        }
    });
    const areaBoxComandos = screen.getByTestId('Comandos');
    expect(areaBoxComandos.style.border).toBe('2px solid #ffcc0d');
    const areaBoxFunction2 = screen.getByTestId('Función 2');
    await fireEvent.click(areaBoxFunction2);
    expect(areaBoxFunction2.style.border).toBe('2px solid #ffcc0d');
    expect(areaBoxComandos.style.border).toBe('2px solid #aeb7bd');
});

test('adding command box actions', async () => {
    render(BoxZone, {
        props: {
            numFolders: 0,
            maxComandos: 12,
            maxFunction1: 12,
            maxFunction2: 12,
            disabledBtn: false
        }
    });
    render(BtnZone, {
        props: {
            functionBtnLoad: 0,
            numActions: ['B'],
            disabledBtn: false
        }
    });
    const areaBoxComandos = screen.getByTestId('Comandos');
    expect(areaBoxComandos.style.border).toBe('2px solid #ffcc0d');
    expect(screen.queryByTestId('delBtn')).not.toBeInTheDocument();
    const buttonAdd = screen.getByAltText('U');
    await fireEvent.click(buttonAdd);
    expect(screen.queryByTestId('delBtn')).toBeInTheDocument();
});

test('delete command box actions', async () => {
    render(BoxZone, {
        props: {
            numFolders: 0,
            maxComandos: 12,
            maxFunction1: 12,
            maxFunction2: 12,
            disabledBtn: false
        }
    });
    render(BtnZone, {
        props: {
            functionBtnLoad: 0,
            numActions: ['B'],
            disabledBtn: false
        }
    });
    const areaBoxComandos = screen.getByTestId('Comandos');
    expect(areaBoxComandos.style.border).toBe('2px solid #ffcc0d');
    const buttonAdd = screen.getByAltText('U');
    await fireEvent.click(buttonAdd);
    expect(screen.queryByTestId('delBtn')).toBeInTheDocument();
    const buttonDel = screen.getByAltText('U-delBtn');
    await fireEvent.click(buttonDel);
    await waitForElementToBeRemoved(buttonDel);
    expect(buttonDel).not.toBeInTheDocument();
});

test('should be emptied the box by clicking on the delete button', async () => {
    render(BoxZone, {
        props: {
            numFolders: 0,
            maxComandos: 12,
            maxFunction1: 12,
            maxFunction2: 12,
            disabledBtn: false
        }
    });
    render(BtnZone, {
        props: {
            functionBtnLoad: 0,
            numActions: ['B'],
            disabledBtn: false
        }
    });
    const areaBoxComandos = screen.getByTestId('Comandos');
    expect(areaBoxComandos.style.border).toBe('2px solid #ffcc0d');
    const buttonAddUp = screen.getByAltText('U');
    const buttonAddLeft = screen.getByAltText('L');
    await fireEvent.click(buttonAddUp);
    await fireEvent.click(buttonAddLeft);
    expect(screen.getByAltText('U-delBtn')).toBeInTheDocument();
    expect(screen.getByAltText('L-delBtn')).toBeInTheDocument();
    event.emit('btn-action', { action: 'clear-box' });
    const buttonDel = screen.getByAltText('L-delBtn');
    await waitForElementToBeRemoved(buttonDel);
    expect(buttonDel).not.toBeInTheDocument();
});

test('the green border should be marked if correct', async () => {
    render(BoxZone, {
        props: {
            numFolders: 0,
            maxComandos: 12,
            maxFunction1: 12,
            maxFunction2: 12,
            disabledBtn: false
        }
    });
    expect(screen.getByTestId('Comandos').style.border).toBe('2px solid #ffcc0d');
    await waitFor(() => event.emit('feedback', true));
    expect(screen.getByTestId('Comandos').style.border).toBe('2px solid #52e1c9');
});

test('it should emit Respond if it listens to endTime', async () => {
    render(BoxZone, {
        props: {
            numFolders: 0,
            maxComandos: 12,
            maxFunction1: 12,
            maxFunction2: 12,
            disabledBtn: false
        }
    });
    render(BtnZone, {
        props: {
            functionBtnLoad: 0,
            numActions: ['B'],
            disabledBtn: false
        }
    });
    const buttonAddUp = screen.getByAltText('U');
    await fireEvent.click(buttonAddUp);
    const buttonDel = screen.getByTestId('delBtn');
    expect(buttonDel).toBeInTheDocument();
    await waitFor(() => event.emit('endTime'));
});
