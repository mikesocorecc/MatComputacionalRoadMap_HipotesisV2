import {
    render, screen, fireEvent, waitFor
} from '@testing-library/vue';
import '@testing-library/jest-dom';
import { event } from '@/events';
import FeedbackTask from '@/components/Feedback/FeedbackTask';
import BoxZoneFeedback from '@/components/Feedback/BoxZoneFeedback';
import Data from '@/assets/map.json';

test('should load FeedbackTask', () => {
    render(FeedbackTask, {
        props: {
            isCorrect: false,
            showFeedbackResult: true,
            dataTask: Data[0],
            backgroundApp: '#D3ED9C'
        }
    });
    expect(screen.getByTestId('feedback-task')).toBeInTheDocument();
});

test('should emit event for closed FeedbackTask', async () => {
    const { emitted } = render(FeedbackTask, {
        props: {
            isCorrect: false,
            showFeedbackResult: true,
            dataTask: Data[0],
            backgroundApp: '#D3ED9C'
        }
    });

    const closedBtn = screen.getByText('X');
    expect(closedBtn).toBeInTheDocument();
    await fireEvent.click(closedBtn);
    expect(emitted().click).toBeTruthy();
});

test('should see commands when listening to the folders event', async () => {
    const folders = [
        {
            nameId: 'Comandos',
            folderItems: []
        }
    ];
    render(FeedbackTask, {
        props: {
            isCorrect: false,
            showFeedbackResult: true,
            dataTask: Data[0],
            backgroundApp: '#D3ED9C'
        }
    });
    render(BoxZoneFeedback, {
        props: {
            numFolders: 0,
            folders,
            maxComandos: 32
        }
    });

    expect(screen.queryByText('Comandos')).toBeInTheDocument();
    event.emit('folders', folders);
});

test('should see only the command box if available functions is: 0', () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in Data[0]) {
        if (key === 'functionsAvailable') {
            Data[0][key] = 0;
        }
    }
    const folders = [
        {
            nameId: 'Comandos',
            folderItems: []
        }
    ];
    render(BoxZoneFeedback, {
        props: {
            numFolders: Data[0].functionsAvailable,
            folders,
            maxComandos: 32
        }
    });
    expect(screen.queryByText('Comandos')).toBeInTheDocument();
    expect(screen.queryByText('Función 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Función 2')).not.toBeInTheDocument();
    expect(screen.getByText('32')).toBeInTheDocument();
});

test('should see only the command box and function 1 if available functions is: 1', () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in Data[0]) {
        if (key === 'functionsAvailable') {
            Data[0][key] = 1;
        }
    }
    const folders = [
        {
            nameId: 'Comandos',
            folderItems: []
        },
        {
            nameId: 'Función 1',
            folderItems: []
        }
    ];
    render(BoxZoneFeedback, {
        props: {
            numFolders: Data[0].functionsAvailable,
            folders,
            maxComandos: 20,
            maxFunction1: 12
        }
    });
    expect(screen.queryByText('Comandos')).toBeInTheDocument();
    expect(screen.queryByText('Función 1')).toBeInTheDocument();
    expect(screen.queryByText('Función 2')).not.toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
});

test('should see only the command box, function 1 and function 2 if available functions is: 2', () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in Data[0]) {
        if (key === 'functionsAvailable') {
            Data[0][key] = 2;
        }
    }
    const folders = [
        {
            nameId: 'Comandos',
            folderItems: []
        },
        {
            nameId: 'Función 1',
            folderItems: []
        },
        {
            nameId: 'Función 2',
            folderItems: []
        }
    ];
    render(BoxZoneFeedback, {
        props: {
            numFolders: Data[0].functionsAvailable,
            folders,
            maxComandos: 12,
            maxFunction1: 12,
            maxFunction2: 12
        }
    });
    expect(screen.queryByText('Comandos')).toBeInTheDocument();
    expect(screen.queryByText('Función 1')).toBeInTheDocument();
    expect(screen.queryByText('Función 2')).toBeInTheDocument();
});
